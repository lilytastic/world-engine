import * as ROT from 'rot-js';
import { getRandomArrayItem } from '../Languages/helpers/logic.helpers';

export const colors = {
  'void': '#212529', // document.body.style.backgroundColor,
  'wall': '#999',
  'floor': '#000'
}

export interface ICoords {
  x: number;
  y: number;
}

export const getAdjacent = (map: any, coords: ICoords) => {
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

export const getEntitiesOnMap = (mapCoords: ICoords, map: any) => {
  const { x, y } = mapCoords;
  const what = map[x][y];
  switch (what) {
    case 1:
      if (getAdjacent(map, mapCoords).includes(0)) {
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
  let foregroundColor = colors.void;
  let backgroundColor = colors.void;
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

      if (foliage > 0.6) {
        ch = '"';
      } else if (foliage > 0.3) {
        ch = '\'';
      } else if (foliage > 0.1) {
        ch = '`';
      }

      foregroundColor = `rgba(${r},${g},${b})`;

      r = 25 + noise * 10;
      g = 25 + noise * 10;
      b = 25 + noise * 10;
      backgroundColor = `rgba(${r},${g},${b})`;
      break;
    case 1:
      let stuff = getNoise(x + 3693, y);
      if (stuff > 0.7) {
        ch = '%';
      } else if (stuff > 0.6) {
        ch = '*';
      } else if (stuff > 0.1) {
        ch = '.'
      }
      /*
      r = 15 + noise * 10;
      g = 15 + noise * 10;
      b = 15 + noise * 10;
      foregroundColor = `rgba(${r + 20},${g + 20},${b + 20})`;
      backgroundColor = `rgba(${r},${g},${b})`;
      */
      backgroundColor = `rgba(0,0,0)`;
      break;
    case 2:
      //ch = '#';
      ch = '·';
      let amp = 20;
      r = 32 + noise * amp;
      g = 32 + noise * amp;
      b = 32 + noise * amp;
      foregroundColor = `rgba(${r},${g},${b})`;
      //backgroundColor = '#000';
      r = 0 + noise * amp;
      g = 0 + noise * amp;
      b = 0 + noise * amp;
      backgroundColor = `rgba(${r},${g},${b})`;
      backgroundColor = '#000';
      break;
  }

  return {
    ch,
    foregroundColor,
    backgroundColor
  }
}