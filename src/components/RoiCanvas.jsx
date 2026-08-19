import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Line, Circle } from 'react-konva';
import useImage from 'use-image';

const RoiCanvas = ({ imageUrl, onSave, initialPoints = [] }) => {
  const [image] = useImage(imageUrl || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80', 'anonymous');
  const [points, setPoints] = useState(initialPoints);
  const [isFinished, setIsFinished] = useState(initialPoints.length >= 3);
  const [containerSize, setContainerSize] = useState({ width: 600, height: 400 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: 400
      });
    }
  }, []);

  const handleStageClick = (e) => {
    if (isFinished) return;
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    setPoints([...points, point.x, point.y]);
  };

  const handlePointDrag = (index, e) => {
    const newPoints = [...points];
    newPoints[index * 2] = e.target.x();
    newPoints[index * 2 + 1] = e.target.y();
    setPoints(newPoints);
  };

  const handleFinish = () => {
    if (points.length >= 6) { // at least 3 points
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setPoints([]);
    setIsFinished(false);
  };

  const handleSaveClick = () => {
    if (onSave) {
      const pairedPoints = [];
      for (let i = 0; i < points.length; i += 2) {
        pairedPoints.push([Math.round(points[i]), Math.round(points[i + 1])]);
      }
      onSave({
        points: pairedPoints,
        frame_width: containerSize.width,
        frame_height: containerSize.height
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '400px', background: '#0f172a', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}
      >
        <Stage 
          width={containerSize.width} 
          height={containerSize.height} 
          onClick={handleStageClick}
        >
          <Layer>
            {image && (
              <KonvaImage 
                image={image} 
                width={containerSize.width} 
                height={containerSize.height} 
                opacity={0.8}
              />
            )}
            
            {points.length > 0 && (
              <Line
                points={isFinished ? [...points, points[0], points[1]] : points}
                stroke="#10b981"
                strokeWidth={3}
                fill={isFinished ? 'rgba(16, 185, 129, 0.3)' : 'transparent'}
                closed={isFinished}
              />
            )}

            {points.map((p, i) => {
              if (i % 2 !== 0) return null;
              const idx = i / 2;
              return (
                <Circle
                  key={point- + idx}
                  x={points[i]}
                  y={points[i + 1]}
                  radius={6}
                  fill="white"
                  stroke="#10b981"
                  strokeWidth={2}
                  draggable={isFinished}
                  onDragMove={(e) => handlePointDrag(idx, e)}
                  onMouseEnter={(e) => {
                    const container = e.target.getStage().container();
                    container.style.cursor = isFinished ? 'move' : 'pointer';
                  }}
                  onMouseLeave={(e) => {
                    const container = e.target.getStage().container();
                    container.style.cursor = 'default';
                  }}
                />
              );
            })}
          </Layer>
        </Stage>
        
        {!isFinished && points.length > 0 && (
          <div style={{ position: 'absolute', top: 16, left: 16, background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 12px', borderRadius: '4px', fontSize: '0.875rem' }}>
            Click to add points. At least 3 points required.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {!isFinished ? (
          <button 
            type="button" 
            onClick={handleFinish} 
            disabled={points.length < 6}
            style={{ padding: '8px 16px', background: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '6px', cursor: points.length < 6 ? 'not-allowed' : 'pointer', opacity: points.length < 6 ? 0.5 : 1 }}
          >
            Finish Polygon
          </button>
        ) : (
          <button 
            type="button" 
            onClick={handleReset}
            style={{ padding: '8px 16px', background: '#f8fafc', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '6px', cursor: 'pointer' }}
          >
            Redraw Region
          </button>
        )}
        <button 
          type="button" 
          onClick={handleSaveClick}
          disabled={!isFinished}
          style={{ padding: '8px 16px', background: 'var(--success)', color: 'white', border: 'none', borderRadius: '6px', cursor: !isFinished ? 'not-allowed' : 'pointer', opacity: !isFinished ? 0.5 : 1 }}
        >
          Save Region of Interest
        </button>
      </div>
    </div>
  );
};

export default RoiCanvas;
