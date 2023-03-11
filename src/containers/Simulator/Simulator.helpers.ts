import * as ROT from 'rot-js';
import { Color } from 'rot-js/lib/color';

export const colors: {[id: string]: Color} = {
  'void': [20,8,25], // document.body.style.backgroundColor,
  'wall': [0,0,0],
  'floor': [35,19,22]
}

export interface ICoords {
  x: number;
  y: number;
}

export type MapTile = number;

export type Map = {[x: number]: {[y: number]: MapTile}}

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

export const getEntitiesOnMap = (mapCoords: ICoords, map: Map) => {
  const { x, y } = mapCoords;
  const what = map[x][y];
  switch (what) {
    case 1:
      if (getAdjacent(mapCoords, map).includes(0)) {
        return 2;
      }
      return what;
    default:
      return what;
  }
}

const simplexNoise = new ROT.Noise.Simplex();

const getNoise = (x: number, y: number) => {
  return (simplexNoise.get(x / 6, y / 6) + simplexNoise.get(x / 20, y / 20)) / 2
}

export const getDrawingInfo = (what: number, mapCoords: ICoords) => {
  let ch = ' ';
  let foregroundColor = [0,0,0] as Color;
  let backgroundColor = [0,0,0] as Color;
  let r = 128;
  let g = 128;
  let b = 128;
  const {x, y} = mapCoords;

  let noise = getNoise(x, y);

  switch (what) {
    case 0:
      ch = '·';
      let shade = getNoise(x + 999, y + 222);
      r = 60;
      g = 60;
      b = 60;
      
      let foliage = getNoise(x + 2153, y);
      if (foliage > 0.1) {
        r = 128 + shade * 50;
        g = 180 + shade * 50;
        b = 0;
      }

      if (foliage > 0.5) {
        ch = '"';
      } else if (foliage > 0.1) {
        ch = '\'';
      }

      foregroundColor = [r,g,b];

      [r,g,b] = colors.floor.map(x => x += noise * 10);
      backgroundColor = colors.floor.map(x => x += noise * 10) as Color;
      break;
    case 1:
      let stuff = getNoise(x + 3693, y);
      if (stuff > 0.7) {
        ch = '*';
      } else if (stuff > 0.6) {
        ch = '%';
      } else if (stuff > 0.1) {
        ch = '.'
      }
      foregroundColor = colors.void.map(x => x += 10 + noise * 10) as Color;
      /*
      backgroundColor = `rgba(${r},${g},${b})`;
      */
      backgroundColor = colors.void;
      break;
    case 2:
      ch = '#';

      // ch = '·';
      let baseBrightness = 80;
      let amp = 20;
      r = baseBrightness + noise * amp;
      g = baseBrightness + noise * amp;
      b = baseBrightness + noise * amp;
      foregroundColor = [r,g,b];
      //backgroundColor = '#000';
      baseBrightness = 60;
      r = baseBrightness + noise * amp;
      g = baseBrightness + noise * amp;
      b = baseBrightness + noise * amp;
      backgroundColor = [r,g,b];
      //backgroundColor = '#000';
      break;
  }

  return {
    ch,
    foregroundColor,
    backgroundColor
  }
}