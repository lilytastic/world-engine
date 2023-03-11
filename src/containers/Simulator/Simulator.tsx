import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ROT from 'rot-js';
import { Color } from 'rot-js/lib/color';
import Scheduler from 'rot-js/lib/scheduler/scheduler';
import { getRandomArrayItem } from '../Languages/helpers/logic.helpers';
import { colors, getDrawingInfo, getTileData, ICoords, ITurn, Map } from './Simulator.helpers';
import { getMapData, setMap } from './Simulator.reducer';

export function Simulator(props: {children?: any}) {

  const gameWindowRef = useRef(null as HTMLDivElement | null);
  const mapData: Map = useSelector(getMapData);

  const dispatch = useDispatch();

  const defaultDisplay = new ROT.Display({
    width: 45,
    height: 35,
    fontSize: 18,
    // fontFamily: 'Inconsolata',
    fontFamily: 'Space Mono',
    forceSquareRatio: true
  });

  const [ display ] = useState(defaultDisplay);
  const [ element ] = useState(display.getContainer());
  const [ keysPressed, setKeysPressed ] = useState({} as {[key: string]: boolean});

  const [ playerCoords, setPlayerCoords ] = useState({x: 0, y: 0} as ICoords);
  const [ cursorCoords, setCursorCoords ] = useState({x: 0, y: 0} as ICoords);
  const [ path, setPath ] = useState([] as ICoords[]);
  const [ currentPath, setCurrentPath ] = useState([] as ICoords[]);
  const [ seenTiles, setSeenTiles ] = useState([] as ICoords[]);
  const [ visibleTiles, setVisibleTiles ] = useState([] as ICoords[]);

  const [isMouseButtonDown, setIsMouseButtonDown] = useState(false);


  async function mainLoop(scheduler: Scheduler<ITurn>) {
    while (1) {
      let turnData: ITurn = scheduler.next();
      if (!turnData) { break; }
      await turnData.onAct();
    }
  }

  const drawMapOnDisplay = useCallback((displayCoords: ICoords, mapCoords: ICoords) => {
    const tileData = getTileData(mapCoords, mapData);
    let { ch, foregroundColor, backgroundColor } = getDrawingInfo(tileData, mapCoords, mapData);
    
    if (!!tileData && !visibleTiles.find(tile => tile.x === displayCoords.x && tile.y === displayCoords.y)) {
      if (seenTiles.find(tile => tile.x === displayCoords.x && tile.y === displayCoords.y)) {
        const fogOfWar: Color = colors.void;
        foregroundColor = ROT.Color.interpolate(foregroundColor, fogOfWar);
        backgroundColor = ROT.Color.interpolate(backgroundColor, colors.void);  
      } else {
        foregroundColor = colors.void;
        backgroundColor = colors.void;
      }
    }
    display.draw(displayCoords.x, displayCoords.y, ch, ROT.Color.toRGB(foregroundColor), ROT.Color.toRGB(backgroundColor));

    return { x: displayCoords.x, y: displayCoords.y, ch, foregroundColor, backgroundColor };
  }, [display, mapData, visibleTiles, seenTiles]);

  
  useEffect(() => {
    const shadowCasting = new ROT.FOV.PreciseShadowcasting((x, y) => getTileData({x, y}, mapData)?.canLightPass, {  });
    const tiles: ICoords[] = [];
    shadowCasting.compute(playerCoords.x, playerCoords.y, 10, (x, y, r, visibility) => { tiles.push({x, y}); });
    setVisibleTiles(tiles);
    const newlySeenTiles = tiles.filter(_ => !seenTiles.find(tile => tile.x === _.x && tile.y === _.y));
    if (newlySeenTiles.length > 0) {
      setSeenTiles([...seenTiles, ...newlySeenTiles]);
    }
  }, [playerCoords, mapData, seenTiles]);


  const drawCursor = useCallback((displayCoords: ICoords) => {
    const { x, y } = displayCoords;
    let cursorBrightness = 190 + Math.sin(Date.now() / 200) * 65;
    
    if (seenTiles.find(tile => tile.x === cursorCoords.x && tile.y === cursorCoords.y)) {
      if (cursorCoords.x === x && cursorCoords.y === y) {
        display.drawOver(x, y, '', '', ROT.Color.toRGB([cursorBrightness, cursorBrightness, cursorBrightness]));
      }
    }
    
    if (currentPath.length > 0 && !isMouseButtonDown) {
      const currentPathIndex = currentPath.findIndex(p => p.x === x && p.y === y);
      if (currentPathIndex !== -1) {
        cursorBrightness = 220 + Math.sin(Date.now() / 200 + currentPathIndex * 100) * 35;
        display.drawOver(x, y, '', ROT.Color.toRGB([cursorBrightness, cursorBrightness, cursorBrightness]), '');
      }
    } else if (isMouseButtonDown) {
      const pathIndex = path.findIndex(p => p.x === x && p.y === y);
      if (pathIndex !== -1) {
        cursorBrightness = 190 + Math.sin(Date.now() / 200 + pathIndex * 100) * 65;
        display.drawOver(x, y, '', ROT.Color.toRGB([cursorBrightness, cursorBrightness, cursorBrightness]), '');
      }
    }
  }, [currentPath, isMouseButtonDown, cursorCoords, display, path, seenTiles]);


  useEffect(() => {
    if (!isMouseButtonDown) { return; }
    const astar = new ROT.Path.AStar(cursorCoords.x, cursorCoords.y, (x, y) => getTileData({x, y}, mapData)?.canLightPass);
    const path: ICoords[] = [];
    astar.compute(playerCoords.x, playerCoords.y, (x, y) => { if (getTileData({x, y}, mapData)?.canLightPass && (playerCoords.x !== x || playerCoords.y !== y)) { path.push({x, y}); } })
    setPath(path);
  }, [playerCoords, cursorCoords, display, mapData, isMouseButtonDown]);


  const draw = useCallback(() => {
    Object.keys(mapData).forEach(((_x, x) => {
      Object.keys(mapData[x]).forEach((_y, y) => {
        const displayCoords = {x, y};
        const mapCoords = {x, y};
        
        drawMapOnDisplay(displayCoords, mapCoords);

        drawCursor(displayCoords);

        if (playerCoords.x === x && playerCoords.y === y) {
          display.drawOver(x, y, '@', '#FFF', '');
        }
      })
    }));
  }, [drawCursor, display, drawMapOnDisplay, mapData, playerCoords]);

  const createMap = useCallback(() => {
    const map = new ROT.Map.Digger(45, 35);
    const _mapData: Map = {};
    map.create((x, y, what) => {
      if (!_mapData[x]) { _mapData[x] = {}; }
      _mapData[x][y] = {
        what,
        canLightPass: what === 0,
        canEntitiesPass: what === 0
      };
    });
    // console.log(_mapData);
    dispatch(setMap(_mapData));
    setVisibleTiles([]);
    setSeenTiles([]);
    const startingRoom = getRandomArrayItem(map.getRooms());
    setPlayerCoords({x: startingRoom.getCenter()[0], y: startingRoom.getCenter()[1]});
  }, [dispatch]);

  useEffect(() => {
    createMap();
  }, [createMap]);


  const process = useCallback(() => {
    if (currentPath.length > 0) {
      setPlayerCoords(currentPath[0]);
      // const destination = currentPath[currentPath.length - 1];
      // const astar = new ROT.Path.AStar(destination.x, destination.y, (x, y) => mapData[x]?.[y] === 0);
      setCurrentPath(currentPath.slice(1));
    } else {
      let moveTo = {...playerCoords};
      if (keysPressed['VK_W'] || keysPressed['VK_UP']) {
        moveTo.y -= 1;
      }
      if (keysPressed['VK_D'] || keysPressed['VK_RIGHT']) {
        moveTo.x += 1;
      }
      if (keysPressed['VK_S'] || keysPressed['VK_DOWN']) {
        moveTo.y += 1;
      }
      if (keysPressed['VK_A'] || keysPressed['VK_LEFT']) {
        moveTo.x -= 1;
      }
      if (getTileData(moveTo, mapData)?.canEntitiesPass && (moveTo.x !== playerCoords.x || moveTo.y !== playerCoords.y)) {
        setPlayerCoords(moveTo);
      }
    }
  }, [currentPath, keysPressed, playerCoords, mapData]);


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
    let timeout: NodeJS.Timeout;
    let time = Date.now();
    const startProcessing = () => {
      timeout = setTimeout(() => {
        process();
        time = Date.now();
        startProcessing();
      }, 100);
    }
    startProcessing();

    return () => {
      clearInterval(timeout);
    }
  }, [process, keysPressed]);


  useEffect(() => {
    let timeout: NodeJS.Timeout;
    let time = Date.now();
    const startDrawing = () => {
      draw();
      timeout = setTimeout(() => {
        // console.log(Date.now() - time);
        time = Date.now();
        startDrawing();
      }, 50);
    }
    startDrawing();

    return () => {
      clearInterval(timeout);
    }
  }, [draw]);


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
      } else if (cursorCoords.x !== -1 || cursorCoords.y !== -1) {
        setCursorCoords({ x: -1, y: -1 });
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
  

  useEffect(() => {
    function handleMouseUp(e: MouseEvent) {
      setCurrentPath(path);
      setIsMouseButtonDown(false);
    }
    function handleMouseDown(e: MouseEvent) {
      setIsMouseButtonDown(true);
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [cursorCoords, path]);


  if (!element) {
    return <></>;
  }

  return (
    <div className="view py-3">
      <div className='mx-auto' style={{width: 'fit-content'}} ref={gameWindowRef}></div>
    </div>
  );
}
