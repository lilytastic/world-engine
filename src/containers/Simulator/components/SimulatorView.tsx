import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import * as ROT from 'rot-js';
import { Color } from 'rot-js/lib/color';
import { COLORS, getDrawingInfo, getTileData, Vector2, Map } from '../Simulator.helpers';
import { getMapData, getSeenTiles, getVisibleTiles } from '../Simulator.reducer';

export function SimulatorView(props: {children?: any, cursorCoords: Vector2, drawnPath: Vector2[], playerCoords: Vector2, onSetDisplay: (display: ROT.Display) => void}) {

  const { cursorCoords, drawnPath, onSetDisplay, playerCoords } = props;

  const gameWindowRef = useRef(null as HTMLDivElement | null);
  const mapData: Map = useSelector(getMapData);

  const seenTiles = useSelector(getSeenTiles);
  const visibleTiles = useSelector(getVisibleTiles);

  const defaultDisplay = new ROT.Display({
    width: 45,
    height: 35,
    fontSize: 18,
    // fontFamily: 'Inconsolata',
    fontFamily: 'Space Mono',
    forceSquareRatio: true
  });

  const [ display, setDisplay ] = useState(defaultDisplay);
  const [ element, setElement ] = useState(null as HTMLElement | null);

  useEffect(() => {
    const container = display.getContainer()
    if (display && container) {
      setElement(container);
      onSetDisplay?.(display);  
    }
  }, [display, onSetDisplay]);

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
    const tileData = getTileData(mapCoords, mapData);
    let { ch, foregroundColor, backgroundColor } = getDrawingInfo(tileData, mapCoords, mapData);
    
    if (!!tileData && !visibleTiles.find(tile => tile.x === displayCoords.x && tile.y === displayCoords.y)) {
      if (seenTiles.find(tile => tile.x === displayCoords.x && tile.y === displayCoords.y)) {
        const fogOfWar: Color = COLORS.void;
        foregroundColor = ROT.Color.interpolate(foregroundColor, fogOfWar);
        backgroundColor = ROT.Color.interpolate(backgroundColor, COLORS.void);  
      } else {
        foregroundColor = COLORS.void;
        backgroundColor = COLORS.void;
      }
    }
    display.draw(displayCoords.x, displayCoords.y, ch, ROT.Color.toRGB(foregroundColor), ROT.Color.toRGB(backgroundColor));

    return { x: displayCoords.x, y: displayCoords.y, ch, foregroundColor, backgroundColor };
  }, [display, mapData, visibleTiles, seenTiles]);


  const drawCursor = useCallback((displayCoords: Vector2) => {
    const { x, y } = displayCoords;
    let cursorBrightness = 190 + Math.sin(Date.now() / 200) * 65;
    
    if (seenTiles.find(tile => tile.x === cursorCoords.x && tile.y === cursorCoords.y)) {
      if (cursorCoords.x === x && cursorCoords.y === y) {
        display.drawOver(x, y, '', '', ROT.Color.toRGB([cursorBrightness, cursorBrightness, cursorBrightness]));
      }
    }

    if (drawnPath) {
      const currentPathIndex = drawnPath.findIndex(p => p.x === x && p.y === y);
      if (currentPathIndex !== -1) {
        cursorBrightness = 220 + Math.sin(Date.now() / 200 + currentPathIndex * 100) * 35;
        display.drawOver(x, y, '', ROT.Color.toRGB([cursorBrightness, cursorBrightness, cursorBrightness]), '');
      }
    }
  }, [cursorCoords, display, drawnPath, seenTiles]);


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
  }, [drawCursor, drawMapOnDisplay, mapData, playerCoords]);


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
      timeout = setTimeout(() => {
        startDrawing();
      }, 50);
    }
    startDrawing();

    return () => {
      clearInterval(timeout);
    }
  }, [draw]);


  if (!element) {
    return <></>;
  }
  
  return (
    <div className='mx-auto' style={{width: 'fit-content'}} ref={gameWindowRef}></div>
  );
};