import React, { useEffect, useRef, useState } from 'react';
import * as ROT from 'rot-js';

export function Simulator(props: {children?: any}) {

  const ref = useRef(null as HTMLDivElement | null);
  const [ display ] = useState(new ROT.Display({width: 20, height: 5}));
  const [ element ] = useState(display.getContainer());
  
  useEffect(() => {
    let _element = element;
    let container = ref.current;
    let child: Node;
    if (ref.current && _element) {
      child = ref.current.appendChild(_element);
    }
    return () => { container?.removeChild(child); }
  }, [ref, element]);

  if (!element) {
    return <></>;
  }

  return (
    <div className="view py-3" ref={ref}>
      
    </div>
  );
}
