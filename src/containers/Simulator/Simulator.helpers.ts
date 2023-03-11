import * as ROT from 'rot-js';
import { Color } from 'rot-js/lib/color';
import { IGameEntity } from './Simulator.reducer';

const DEFAULT_TURN_DELAY = 150;

export const DEFAULT_ENTITY: IGameEntity = {
  id: 0,
  ch: '?'
}

export interface ITurn {
  onAct: () => Promise<TypedTurnAction>;
}

export type TypedTurnAction = Move | Interact;
export type EntityId = number;

export interface ITurnAction<T extends string> {
  type: T;
  target: ICoords | EntityId;
}
export interface Move extends ITurnAction<'movement'> {
  target: ICoords;
}
export interface Interact extends ITurnAction<'inspect'> {
  target: ICoords | EntityId;
}

export const COLORS: {[id: string]: Color} = {
  'void': [20,8,25], // document.body.style.backgroundColor,
  'wall': [0,0,0],
  'floor': [35,19,22]
}

export interface ICoords {
  x: number;
  y: number;
}

export interface ITileData {
  canLightPass: boolean;
  canEntitiesPass: boolean;
  what: number;
};

export type Map = {[x: number]: {[y: number]: ITileData}};

export const getAdjacent = (coords: ICoords, map: Map, ) => {
  const {x, y} = coords;
  return [
    map[x - 1]?.[y - 1],
    map[x - 1]?.[y + 1],
    map[x - 1]?.[y],
    map[x]?.[y - 1],
    map[x]?.[y + 1],
    map[x + 1]?.[y - 1],
    map[x + 1]?.[y + 1],
    map[x + 1]?.[y]
  ];
}

export const getTileData = (mapCoords: ICoords, map: Map) => {
  const { x, y } = mapCoords;
  return map[x]?.[y];
}

const simplexNoise = new ROT.Noise.Simplex();

const getNoise = (x: number, y: number) => {
  return (simplexNoise.get(x / 6, y / 6) + simplexNoise.get(x / 20, y / 20)) / 2
}

export interface IDrawingInfo {
  ch: string;
  foregroundColor: Color;
  backgroundColor: Color;
}


export const getDrawingInfo = (tileData: ITileData, mapCoords: ICoords, map: Map): IDrawingInfo => {
  let drawingInfo: IDrawingInfo = {
    ch: ' ',
    foregroundColor: [0,0,0],
    backgroundColor: [0,0,0]
  }
  const {x, y} = mapCoords;

  let noise = getNoise(x, y);

  if (tileData.canEntitiesPass) {
    drawingInfo = getFloorDrawingInfo();

    let shade = getNoise(x + 999, y + 222);    
    let foliage = getNoise(x + 2153, y);
    if (foliage > 0.1) {
      drawingInfo.ch = '\'';
      drawingInfo.foregroundColor = [
        128 + shade * 50,
        180 + shade * 50,
        0
      ];
    }
    if (foliage > 0.5) {
      drawingInfo.ch = '"';
    }

    drawingInfo.foregroundColor = drawingInfo.foregroundColor.map(x => x += noise * 10) as Color;
    drawingInfo.backgroundColor = drawingInfo.backgroundColor.map(x => x += noise * 10) as Color;
  } else if (!!getAdjacent(mapCoords, map).find(tile => tile?.canLightPass)) {
    drawingInfo.ch = '#';

    // ch = '·';
    let baseBrightness = 80;
    let amp = 20;
    drawingInfo.foregroundColor = [
      baseBrightness + noise * amp,
      baseBrightness + noise * amp,
      baseBrightness + noise * amp
    ];

    //backgroundColor = '#000';
    baseBrightness = 60;
    drawingInfo.backgroundColor = [
      baseBrightness + noise * amp,
      baseBrightness + noise * amp,
      baseBrightness + noise * amp
    ];
  } else {
    let stuff = getNoise(x + 3693, y);
    if (stuff > 0.7) {
      drawingInfo.ch = '*';
    } else if (stuff > 0.6) {
      drawingInfo.ch = '%';
    } else if (stuff > 0.1) {
      drawingInfo.ch = '.'
    }
    drawingInfo.foregroundColor = COLORS.void.map(x => x += 10 + noise * 10) as Color;
    /*
    backgroundColor = `rgba(${r},${g},${b})`;
    */
    drawingInfo.backgroundColor = COLORS.void;
  }
  return drawingInfo;
}

const getFloorDrawingInfo = (): IDrawingInfo => {
  return {
    ch: '·',
    foregroundColor: [60, 60, 60],
    backgroundColor: [35, 19, 22]
  }
}
