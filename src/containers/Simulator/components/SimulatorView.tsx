import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ROT from 'rot-js';
import { Color } from 'rot-js/lib/color';
import { COLORS, getDrawingInfo, getTileData, Vector2 } from '../Simulator.helpers';
import { getPersistentEntities, getMapData, getSeenTiles, getVisibleTiles, getGameMode, setDisplay } from '../Simulator.reducer';


const DEFAULT_DISPLAY_SETTINGS = {
  width: 35,
  height: 25,
  fontSize: 24,
  // fontFamily: 'Inconsolata',
  fontFamily: 'Space Mono',
  forceSquareRatio: true
};

export function SimulatorView(props: {children?: any, cursorCoords: Vector2, drawnPath: Vector2[], playerCoords: Vector2, onScroll: (coords: Vector2) => void, onSetDisplay: (display: ROT.Display) => void}) {

  const { cursorCoords, drawnPath, onSetDisplay, onScroll, playerCoords } = props;

  const gameWindowRef = useRef(null as HTMLDivElement | null);
  const mapData = useSelector(getMapData);
  const gameEntities = useSelector(getPersistentEntities);

  const currentGameMode = useSelector(getGameMode);
  const seenTiles = useSelector(getSeenTiles);
  const visibleTiles = useSelector(getVisibleTiles);

  const [scroll, setScroll] = useState({x: 0, y: 0} as Vector2); 

  const getFullscreenDisplay = useCallback(() => {
    return {
      width: Math.floor(window.innerWidth / DEFAULT_DISPLAY_SETTINGS.fontSize),
      height: Math.floor((window.innerHeight - 56) / DEFAULT_DISPLAY_SETTINGS.fontSize)
    };
  }, []);

  const defaultDisplay = new ROT.Display({
    ...DEFAULT_DISPLAY_SETTINGS,
    ...getFullscreenDisplay()
  });

  const [ displaySettings, setDisplaySettings ] = useState(defaultDisplay);
  const [ element, setElement ] = useState(null as HTMLElement | null);

  useEffect(() => {
    const container = displaySettings.getContainer();
    if (displaySettings && container) {
      setElement(container);
      onSetDisplay?.(displaySettings);  
    }
  }, [displaySettings, onSetDisplay]);

  useEffect(() => {
    let _element = element;
    let container = gameWindowRef.current;
    let child: Node;
    if (gameWindowRef.current && _element) {
      child = gameWindowRef.current.appendChild(_element);
    }
    return () => { if (container?.contains(child)) { container?.removeChild(child); } }
  }, [gameWindowRef, element]);


  const drawMapOnDisplay = useCallback((displayCoords: Vector2, mapCoords: Vector2) => {
    if (!mapData) { return; }
    const tileData = getTileData(mapCoords, mapData);
    let { ch, foregroundColor, backgroundColor } = getDrawingInfo(tileData, mapCoords, mapData);
    
    if (!!tileData && !visibleTiles?.find(tile => tile.x === mapCoords.x && tile.y === mapCoords.y)) {
      if (seenTiles?.find(tile => tile.x === mapCoords.x && tile.y === mapCoords.y)) {
        const fogOfWar: Color = COLORS.void;
        foregroundColor = ROT.Color.interpolate(foregroundColor, fogOfWar);
        backgroundColor = ROT.Color.interpolate(backgroundColor, COLORS.void);  
      } else {
        foregroundColor = COLORS.void;
        backgroundColor = COLORS.void;
      }
    }

    const entities = gameEntities.ids.map(id => gameEntities.entities[id]);
    entities.forEach(entity => {
      if (entity?.position.x === mapCoords.x && entity?.position.y === mapCoords.y) {
        ch = entity.ch;
      }
    });

    displaySettings.draw(displayCoords.x, displayCoords.y, ch, ROT.Color.toRGB(foregroundColor), ROT.Color.toRGB(backgroundColor));

    return { x: displayCoords.x, y: displayCoords.y, ch, foregroundColor, backgroundColor };
  }, [displaySettings, mapData, visibleTiles, seenTiles, gameEntities]);


  const drawCursor = useCallback((displayCoords: Vector2, mapCoords: Vector2) => {
    let cursorBrightness = 190 + Math.sin(Date.now() / 200) * 65;
    
    if (seenTiles?.find(tile => tile.x === mapCoords.x && tile.y === mapCoords.y)) {
      if (cursorCoords.x === displayCoords.x && cursorCoords.y === displayCoords.y) {
        displaySettings.drawOver(displayCoords.x, displayCoords.y, '', '', ROT.Color.toRGB([cursorBrightness, cursorBrightness, cursorBrightness]));
      }
    }

    if (drawnPath) {
      const currentPathIndex = drawnPath.findIndex(p => p.x === mapCoords.x && p.y === mapCoords.y);
      if (currentPathIndex !== -1) {
        cursorBrightness = 220 + Math.sin(Date.now() / 200 + currentPathIndex * 100) * 35;
        displaySettings.drawOver(displayCoords.x, displayCoords.y, '', ROT.Color.toRGB([cursorBrightness, cursorBrightness, cursorBrightness]), '');
      }
    }
  }, [cursorCoords, displaySettings, drawnPath, seenTiles]);


  useEffect(() => { onScroll?.(scroll) }, [ onScroll, scroll ]);

  const draw = useCallback(() => {
    const options = displaySettings.getOptions();
    displaySettings.clear();

    const bufferZone = {x: 12, y: 9};

    const idealScroll = {
      x: Math.max(Math.min(scroll.x, playerCoords.x - bufferZone.x), playerCoords.x - options.width + bufferZone.x),
      y: Math.max(Math.min(scroll.y, playerCoords.y - bufferZone.y), playerCoords.y - options.height + bufferZone.y),
    };
    if (idealScroll.x !== scroll.x || idealScroll.y !== scroll.y) {
      setScroll(idealScroll);
    }

    for (let x = 0; x < options.width; x++) {
      for (let y = 0; y < options.height; y++) {
        const displayCoords = {x, y};
        const mapCoords = {x: x + idealScroll.x, y: y + idealScroll.y};
        
        switch (currentGameMode) {
          default:
            drawMapOnDisplay(displayCoords, mapCoords);
    
            drawCursor(displayCoords, mapCoords);
            
            if (playerCoords.x === mapCoords.x && playerCoords.y === mapCoords.y) {
              displaySettings.drawOver(displayCoords.x, displayCoords.y, '@', '#FFF', '');
            }
            break;
        }
      }
    }

    // display.drawText(0, 0, `${playerCoords.x},${playerCoords.y}`);
    // display.drawText(0, 1, `${idealScroll.x},${idealScroll.y}`);
  }, [drawCursor, drawMapOnDisplay, playerCoords, currentGameMode, displaySettings, scroll]);


  useEffect(() => {
    let _element = element;
    let container = gameWindowRef.current;
    let child: Node;
    if (gameWindowRef.current && _element) {
      child = gameWindowRef.current.appendChild(_element);
    }
    return () => { if (container && child && container.contains(child)) { container.removeChild(child); } }
  }, [gameWindowRef, element]);


  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const startDrawing = () => {
      draw();
      timeout = setInterval(() => {
        draw();
      }, 1000 / 30);
    }
    startDrawing();

    return () => {
      clearInterval(timeout);
    }
  }, [draw]);
  

  useEffect(() => {
    function handleResize(e: UIEvent) {
      // console.log(e);
      setDisplaySettings(new ROT.Display({
        ...DEFAULT_DISPLAY_SETTINGS,
        ...getFullscreenDisplay()
      }));
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);


  if (!element) {
    return <></>;
  }
  
  return (
    <div className='mx-auto' style={{width: 'fit-content', height: 0}} ref={gameWindowRef}></div>
  );
};