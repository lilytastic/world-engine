import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ROT from 'rot-js';
import Scheduler from 'rot-js/lib/scheduler/scheduler';
import { buildMap, getCursorCoordsOnDisplay, getTileData, Vector2, ITurn, useEffectOnce } from './Simulator.helpers';
import { addMap, getCurrentMap, getMapData, getSeenTiles, setSeenTiles, setVisibleTiles } from './Simulator.reducer';
import { SimulatorView } from './components/SimulatorView';

export function Simulator(props: {children?: any}) {

  const mapData = useSelector(getMapData);
  const seenTiles = useSelector(getSeenTiles);

  const dispatch = useDispatch();

  const currentMap = useSelector(getCurrentMap);

  const [ keysPressed, setKeysPressed ] = useState({} as {[key: string]: boolean});

  const [ playerCoords, setPlayerCoords ] = useState({x: 0, y: 0} as Vector2);
  const [ cursorCoords, setCursorCoords ] = useState({x: 0, y: 0} as Vector2);
  const [ path, setPath ] = useState([] as Vector2[]);
  const [ currentPath, setCurrentPath ] = useState([] as Vector2[]);
  const [ display, setDisplay ] = useState(null as ROT.Display | null);
  const [ scheduler, setScheduler ] = useState(null as Scheduler | null);
  const [scroll, setScroll] = useState({x: 0, y: 0} as Vector2); 

  const [isMouseButtonDown, setIsMouseButtonDown] = useState(false);


  const init = useCallback(() => {
    const map = buildMap();
    setScheduler(new ROT.Scheduler.Speed());
    if (!currentMap) {
      dispatch(addMap(map));
      setPlayerCoords(map.entrance);
    }
  }, [dispatch, currentMap]);

  useEffectOnce(() => {
    init();
  });


  const mainLoop = async (scheduler: Scheduler) => {
    while (1) {
      let turnData: ITurn = scheduler.next();
      if (!turnData) { break; }
      await turnData.onAct();  
    }
  }

  
  useEffect(() => {
    if (!mapData) { return; }
    const shadowCasting = new ROT.FOV.PreciseShadowcasting((x, y) => getTileData({x, y}, mapData)?.canLightPass, {  });
    const tiles: Vector2[] = [];
    shadowCasting.compute(playerCoords.x, playerCoords.y, 10, (x, y, r, visibility) => { tiles.push({x, y}); });
    dispatch(setVisibleTiles(tiles));
    const newlySeenTiles = tiles.filter(_ => !seenTiles?.find(tile => tile.x === _.x && tile.y === _.y));
    if (newlySeenTiles.length > 0 && seenTiles) {
      dispatch(setSeenTiles([...seenTiles, ...newlySeenTiles]));
    }
  }, [playerCoords, mapData, seenTiles, dispatch]);


  const process = useCallback(() => {
    if (!mapData) { return; }
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
    let timeout: NodeJS.Timeout;
    const startProcessing = () => {
      timeout = setInterval(() => {
        process();
      }, 100);
    }
    startProcessing();

    return () => {
      clearInterval(timeout);
    }
  }, [process, keysPressed]);



  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      if (!display) { return; }
      let coords = getCursorCoordsOnDisplay(e, display);
      if (coords === null) {
        coords = {x: -1, y: -1};
      }
      if (cursorCoords.x !== coords.x || cursorCoords.y !== coords.y) {
        setCursorCoords(coords);
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


  useEffect(() => {
    if (!mapData) { return; }
    const mapCoords = {x: cursorCoords.x + scroll.x, y: cursorCoords.y + scroll.y};
    if (!isMouseButtonDown || !seenTiles?.find(tile => tile.x === mapCoords.x && tile.y === mapCoords.y)) {
      setPath([]);
      return;
    }
    const astar = new ROT.Path.AStar(
      mapCoords.x,
      mapCoords.y,
      (x, y) => getTileData({x, y}, mapData)?.canEntitiesPass && !!seenTiles?.find(tile => tile.x === x && tile.y === y),
      { topology: 8 }
    );
    const path: Vector2[] = [];
    astar.compute(
      playerCoords.x,
      playerCoords.y,
      (x, y) => {
        if ((playerCoords.x !== x || playerCoords.y !== y) && getTileData({x, y}, mapData)?.canEntitiesPass) {
          path.push({x, y});
        }
      }
    )
    setPath(path);
  }, [playerCoords, cursorCoords, mapData, seenTiles, isMouseButtonDown, scroll]);

  return (
    <SimulatorView
      cursorCoords={cursorCoords}
      playerCoords={playerCoords}
      drawnPath={isMouseButtonDown ? path : currentPath}
      onSetDisplay={display => setDisplay(display)}
      onScroll={scroll => setScroll(scroll)}
    />
  );
}
