import { useEffect, useRef, useState } from 'react';
import { defaultEffect, effects } from './effects';
import { createRenderer, type Renderer } from './renderer';

export function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const topImgRef = useRef<HTMLImageElement>(null);
  const bottomImgRef = useRef<HTMLImageElement>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const [effectLabel, setEffectLabel] = useState(defaultEffect.label);

  useEffect(() => {
    const renderer = createRenderer(
      canvasRef.current as HTMLCanvasElement,
      bottomImgRef.current?.src as string,
      topImgRef.current?.src as string,
      defaultEffect
    );
    rendererRef.current = renderer;
    return () => {
      renderer.destroy();
      rendererRef.current = null;
    };
  }, []);

  function handleEffectChange(label: string) {
    const effect = effects.find((e) => e.label === label);
    if (!effect) return;
    setEffectLabel(label);
    rendererRef.current?.setEffect(effect);
  }

  return (
    <>
      <canvas id="game" ref={canvasRef}></canvas>

      <img
        src="src/assets/toplayer.png"
        id="topLayerImg"
        ref={topImgRef}
        style={{ display: 'none' }}
        alt="Top Layer"
      />
      <img
        src="src/assets/bottomlayer.jpg"
        id="bottomLayerImg"
        ref={bottomImgRef}
        style={{ display: 'none' }}
        alt="Bottom Layer"
      />

      <div id="debug">
        <label>
          Effect:{' '}
          <select
            value={effectLabel}
            onChange={(event) => handleEffectChange(event.target.value)}
          >
            {effects.map((effect) => (
              <option key={effect.label} value={effect.label}>
                {effect.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </>
  );
}
