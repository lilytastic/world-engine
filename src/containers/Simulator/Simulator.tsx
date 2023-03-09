import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

export function Simulator(props: {children?: any}) {

  const gameWindowRef = useRef(null as HTMLDivElement | null);
  const mapData: {[x: number]: {[y: number]: number}} = useMemo(() => ({}), []);
  const [ display ] = useState(new ROT.Display({width: 69, height: 32}));
  const [ element ] = useState(display.getContainer());
  const [ keysPressed, setKeysPressed ] = useState({} as {[key: string]: boolean});

  const getDrawingInfo = (what: number) => {
    let ch = ' ';
    let foregroundColor = colors.void;
    let backgroundColor = colors.void;
    switch (what) {
      case 0:
        backgroundColor = colors.floor;
        break;
      case 1:
        backgroundColor = colors.void
        break;
      case 2:
        backgroundColor = colors.wall
        break;
    }

    return {
      ch,
      foregroundColor,
      backgroundColor
    }
  }

  const getAdjacent = (map: any, coords: ICoords) => {
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

  const getEntitiesOnMap = useCallback((mapCoords: ICoords) => {
    const { x, y } = mapCoords;
    const what = mapData[x][y];
    switch (what) {
      case 1:
        if (getAdjacent(mapData, mapCoords).includes(0)) {
          return 2;
        }
        return what;
      default:
        return what;
    }
  }, [mapData]);

  const drawMapOnDisplay = useCallback((displayCoords: ICoords, mapCoords: ICoords) => {
    let { ch, foregroundColor, backgroundColor } = getDrawingInfo(getEntitiesOnMap(mapCoords));
    
    display.draw(displayCoords.x, displayCoords.y, ch, foregroundColor, backgroundColor);
  }, [display, getEntitiesOnMap]);


  useEffect(() => {
    const {width, height} = display.getOptions();
    const map = new ROT.Map.Digger(width, height);
    map.create((x, y, what) => {
      if (!mapData[x]) { mapData[x] = {}; }
      mapData[x][y] = what;
    });

    // console.log(map.getRooms());
    // console.log(map.getCorridors());

    Object.keys(mapData).forEach(((_x, x) => {
      Object.keys(mapData[x]).forEach((_y, y) => {
        const displayCoords = {x, y};
        const mapCoords = {x, y};
        drawMapOnDisplay(displayCoords, mapCoords);
      })
    }));

  }, [display, drawMapOnDisplay, mapData]);
  

  useEffect(() => {
    let _element = element;
    let container = gameWindowRef.current;
    let child: Node;
    if (gameWindowRef.current && _element) {
      child = gameWindowRef.current.appendChild(_element);
    }
    return () => { container?.removeChild(child); }
  }, [gameWindowRef, element]);


  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const _name: string = Object.keys(ROT.KEYS)
        .find(key => {
          // @ts-ignore;
          return ROT.KEYS[key] === e.keyCode && key.indexOf("VK_") === 0;
        }) ?? '';

      if (_name && !keysPressed[_name]) {
        keysPressed[_name] = true;
        setKeysPressed({...keysPressed});
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      const _name: string = Object.keys(ROT.KEYS)
        .find(key => {
          // @ts-ignore;
          return ROT.KEYS[key] === e.keyCode && key.indexOf("VK_") === 0;
        }) ?? '';

      if (_name && keysPressed[_name]) {
        keysPressed[_name] = false;
        setKeysPressed({...keysPressed});
      }
    }

    // console.log(keysPressed);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    }
  }, [keysPressed]);


  if (!element) {
    return <></>;
  }

  return (
    <div className="view py-3">
      <div className='mx-auto' style={{width: 'fit-content'}} ref={gameWindowRef}></div>
    </div>
  );
}
