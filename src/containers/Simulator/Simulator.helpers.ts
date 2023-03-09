import * as ROT from 'rot-js';

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

export const getDrawingInfo = (what: number, mapCoords: ICoords) => {
  let ch = ' ';
  let foregroundColor = colors.void;
  let backgroundColor = colors.void;
  let r = 128;
  let g = 128;
  let b = 128;
  const {x, y} = mapCoords;
  let noise = (simplexNoise.get(x / 6, y / 6) + simplexNoise.get(x / 20, y / 20)) / 2;
  switch (what) {
    case 0:
      backgroundColor = colors.floor;
      break;
    case 1:
      backgroundColor = colors.void
      break;
    case 2:
      ch = '#';
      let amp = 20;
      r += noise * amp;
      g += noise * amp;
      b += noise * amp;
      foregroundColor = `rgba(${r - 30},${g - 30},${b - 30})`;
      backgroundColor = `rgba(${r},${g},${b})`;
      break;
  }

  return {
    ch,
    foregroundColor,
    backgroundColor
  }
}