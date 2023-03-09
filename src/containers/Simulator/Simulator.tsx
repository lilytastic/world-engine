import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as ROT from 'rot-js';
import { getRandomArrayItem } from '../Languages/helpers/logic.helpers';
import { getDrawingInfo, getEntitiesOnMap, ICoords } from './Simulator.helpers';

export function Simulator(props: {children?: any}) {

  const gameWindowRef = useRef(null as HTMLDivElement | null);
  const mapData: {[x: number]: {[y: number]: number}} = useMemo(() => ({}), []);

  const defaultDisplay = new ROT.Display({width: 90, height: 40, fontFamily: 'Inconsolata'});

  const [ display ] = useState(defaultDisplay);
  const [ element ] = useState(display.getContainer());
  const [ keysPressed, setKeysPressed ] = useState({} as {[key: string]: boolean});

  const [ playerCoords, setPlayerCoords ] = useState({x: 0, y: 0} as ICoords);
  const [ cursorCoords, setCursorCoords ] = useState({x: 0, y: 0} as ICoords);

  
  const drawMapOnDisplay = useCallback((displayCoords: ICoords, mapCoords: ICoords) => {
    let { ch, foregroundColor, backgroundColor } = getDrawingInfo(getEntitiesOnMap(mapCoords, mapData), mapCoords);
    
    display.draw(displayCoords.x, displayCoords.y, ch, foregroundColor, backgroundColor);
  }, [display, mapData]);


  useEffect(() => {
    const {width, height} = display.getOptions();
    const map = new ROT.Map.Digger(width, height);
    map.create((x, y, what) => {
      if (!mapData[x]) { mapData[x] = {}; }
      mapData[x][y] = what;
    });
    const startingRoom = getRandomArrayItem(map.getRooms());
    setPlayerCoords({x: startingRoom.getCenter()[0], y: startingRoom.getCenter()[1]});
  }, [display, drawMapOnDisplay, mapData]);


  useEffect(() => {
    Object.keys(mapData).forEach(((_x, x) => {
      Object.keys(mapData[x]).forEach((_y, y) => {
        const displayCoords = {x, y};
        const mapCoords = {x, y};
        drawMapOnDisplay(displayCoords, mapCoords);
        if (playerCoords.x === x && playerCoords.y === y) {
          display.drawOver(x, y, '@', '#FFF', '');
        }
      })
    }));
  });

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
    // console.log(cursorCoords);
  }, [cursorCoords]);

  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      const displayContainer = display.getContainer();
      const displayOptions = display.getOptions();
      if (e.target === displayContainer && displayContainer) {
        const canvas = displayContainer.getBoundingClientRect();
        const left = (e.clientX - canvas.left);
        const top = (e.clientY - canvas.top);
        const x = Math.floor((left / canvas.width) * displayOptions.width);
        const y = Math.floor((top / canvas.height) * displayOptions.height);
        if (cursorCoords.x !== x || cursorCoords.y !== y) {
          setCursorCoords({ x, y });
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [display, cursorCoords]);

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
