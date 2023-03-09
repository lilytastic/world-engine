import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as ROT from 'rot-js';
import { getDrawingInfo, getEntitiesOnMap, ICoords } from './Simulator.helpers';

export function Simulator(props: {children?: any}) {

  const gameWindowRef = useRef(null as HTMLDivElement | null);
  const mapData: {[x: number]: {[y: number]: number}} = useMemo(() => ({}), []);
  const [ display ] = useState(new ROT.Display({width: 69, height: 32}));
  const [ element ] = useState(display.getContainer());
  const [ keysPressed, setKeysPressed ] = useState({} as {[key: string]: boolean});

  
  const drawMapOnDisplay = useCallback((displayCoords: ICoords, mapCoords: ICoords) => {
    let { ch, foregroundColor, backgroundColor } = getDrawingInfo(getEntitiesOnMap(mapCoords, mapData), mapCoords);
    
    display.draw(displayCoords.x, displayCoords.y, ch, foregroundColor, backgroundColor);
  }, [display, mapData]);


  useEffect(() => {
    display.setOptions({
      fontFamily: 'Inconsolata'
    });

    const {width, height} = display.getOptions();
    const map = new ROT.Map.Digger(width, height);
    map.create((x, y, what) => {
      if (!mapData[x]) { mapData[x] = {}; }
      mapData[x][y] = what;
    });

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
