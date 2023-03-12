import * as ROT from 'rot-js';
import { Color } from 'rot-js/lib/color';
import Digger from 'rot-js/lib/map/digger';
import { IGameEntity } from './Simulator.reducer';

const DEFAULT_MAP = 'default_map';

export const DEFAULT_ENTITY: IGameEntity = {
  id: 0,
  ch: '?',
  position: { x: 0, y: 0, map: DEFAULT_MAP }
}

export interface ITurn {
  onAct: () => Promise<TypedTurnAction>;
}

export type TypedTurnAction = Move | Interact;
export type EntityId = number;

export interface ITurnAction<T extends string> {
  type: T;
  target: Vector2 | EntityId;
}
export interface Move extends ITurnAction<'movement'> {
  target: Vector2;
}
export interface Interact extends ITurnAction<'inspect'> {
  target: Vector2 | EntityId;
}

export const COLORS: {[id: string]: Color} = {
  'void': [20,8,25], // document.body.style.backgroundColor,
  'wall': [0,0,0],
  'floor': [35,19,22]
}

export const getCursorCoordsOnDisplay = (e: MouseEvent, display: ROT.Display): Vector2 | null => {
  const displayContainer = display.getContainer();
  const displayOptions = display.getOptions();
  if (e.target === displayContainer && displayContainer) {
    const canvas = displayContainer.getBoundingClientRect();
    const left = (e.clientX - canvas.left);
    const top = (e.clientY - canvas.top);
    const x = Math.floor((left / canvas.width) * displayOptions.width);
    const y = Math.floor((top / canvas.height) * displayOptions.height);
    return { x, y };
  }
  return null;
}

export type Vector2 = {
  x: number;
  y: number;
}

export interface ITileData {
  canLightPass: boolean;
  canEntitiesPass: boolean;
  what: number;
};

export type Map = {[coords: string]: ITileData};
export const getFromMap = (coords: Vector2, map: Map) => {
  return map[`${coords.x},${coords.y}`];
}

export const getAdjacent = (coords: Vector2, map: Map, ) => {
  const arr: ITileData[] = [];
  ROT.DIRS[8].forEach((dir) => {
    arr.push(getFromMap({x: coords.x + dir[0], y: coords.y + dir[1]}, map));
  });
  return arr;
}

export const getTileData = (mapCoords: Vector2, map: Map) => {
  return getFromMap(mapCoords, map);
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


export const getDrawingInfo = (tileData: ITileData, mapCoords: Vector2, map: Map): IDrawingInfo => {

  let drawingInfo: IDrawingInfo = {
    ch: ' ',
    foregroundColor: COLORS.void,
    backgroundColor: COLORS.void
  }
  const {x, y} = mapCoords;

  let noise = getNoise(x, y);

  if (tileData?.canEntitiesPass) {
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

export const generateMap = (generator: Digger): Map => {
  const _mapData: Map = {};
  generator.create((x, y, what) => {
    _mapData[`${x},${y}`] = {
      what,
      canLightPass: what === 0,
      canEntitiesPass: what === 0
    };
  });
  return _mapData;
}
