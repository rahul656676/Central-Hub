import React, { useRef, useState, useEffect, useCallback } from 'react';

const RoiCanvas = ({ onSave }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const [pts, setPts] = useState([]);
  const [finished, setFinished] = useState(false);
  const [dragging, setDragging] = useState(null); // index of point being dragged
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 380 });
  const imgLoaded = useRef(false);

  const IMG_URL = 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';

  // Default pentagon centered on canvas
  const makeDefaultPentagon = useCallback((w, h) => {
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.3;
    return Array.from({ length: 5 }, (_, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
      return { x: Math.round(cx + r * Math.cos(angle)), y: Math.round(cy + r * Math.sin(angle)) };
    });
  }, []);

  // Draw everything onto canvas
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background image
    if (imgRef.current && imgLoaded.current) {
      ctx.drawImage(imgRef.current, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (pts.length === 0) return;

    // Draw filled polygon if finished
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    if (finished) ctx.closePath();

    if (finished) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.fill();
    }
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw closing line preview when not finished
    if (!finished && pts.length >= 2) {
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
      ctx.lineTo(pts[0].x, pts[0].y);
      ctx.strokeStyle = 'rgba(16,185,129,0.4)';
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw vertex circles
    pts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
      ctx.fillStyle = i === 0 ? '#f59e0b' : 'white';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [pts, finished]);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imgLoaded.current = true; imgRef.current = img; draw(); };
    img.src = IMG_URL;
    imgRef.current = img;
  }, []);

  // Resize canvas to container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0].contentRect.width;
      const h = 380;
      setCanvasSize({ w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Set default pentagon after first resize
  useEffect(() => {
    if (pts.length === 0 && canvasSize.w > 0) {
      const defaultPts = makeDefaultPentagon(canvasSize.w, canvasSize.h);
      setPts(defaultPts);
      setFinished(true);
    }
  }, [canvasSize]);

  // Redraw whenever state changes
  useEffect(() => { draw(); }, [draw]);

  // Update canvas dimensions
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasSize.w;
      canvas.height = canvasSize.h;
      draw();
    }
  }, [canvasSize, draw]);

  // Notify parent whenever pts change and polygon is finished
  useEffect(() => {
    if (finished && pts.length >= 3 && onSave) {
      onSave({
        points: pts.map(p => [p.x, p.y]),
        frame_width: canvasSize.w,
        frame_height: canvasSize.h
      });
    }
  }, [pts, finished]);

  // --- Helpers ---
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const nearPoint = (pos) => {
    for (let i = 0; i < pts.length; i++) {
      const dx = pts[i].x - pos.x, dy = pts[i].y - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 12) return i;
    }
    return null;
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    const pos = getPos(e);

    // If finished — check if near a point for drag
    if (finished) {
      const idx = nearPoint(pos);
      if (idx !== null) setDragging(idx);
      return;
    }

    // Not finished — add point; close if near first point
    if (pts.length >= 3) {
      const dx = pts[0].x - pos.x, dy = pts[0].y - pos.y;
      if (Math.sqrt(dx * dx + dy * dy) < 12) {
        setFinished(true);
        return;
      }
    }
    setPts(prev => [...prev, pos]);
  };

  const handleMouseMove = (e) => {
    if (dragging === null) return;
    e.preventDefault();
    const pos = getPos(e);
    setPts(prev => prev.map((p, i) => i === dragging ? pos : p));
  };

  const handleMouseUp = () => setDragging(null);

  const handleReset = () => {
    setPts([]);
    setFinished(false);
  };

  const handleFinish = () => {
    if (pts.length >= 3) setFinished(true);
  };

  const cursorStyle = finished ? (dragging !== null ? 'grabbing' : 'grab') : 'crosshair';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
      {/* Instruction banner */}
      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '8px 12px', fontSize: '0.8rem', color: '#166534' }}>
        {finished
          ? '✅ ROI locked. Drag white dots to adjust the region. Click "Redraw" to start over.'
          : pts.length === 0
            ? '👆 Click on the image to start drawing. Yellow dot = first point.'
            : `📍 ${pts.length} point(s) added. Click near the yellow dot to close, or click "Finish".`
        }
      </div>

      {/* Canvas */}
      <div ref={containerRef} style={{ width: '100%', borderRadius: '8px', overflow: 'hidden', border: '2px solid #10b981' }}>
        <canvas
          ref={canvasRef}
          width={canvasSize.w}
          height={canvasSize.h}
          style={{ display: 'block', cursor: cursorStyle, userSelect: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {!finished ? (
          <button
            type="button"
            onClick={handleFinish}
            disabled={pts.length < 3}
            style={{ padding: '8px 16px', background: pts.length < 3 ? '#9ca3af' : '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: pts.length < 3 ? 'not-allowed' : 'pointer', fontWeight: 500 }}
          >
            ✅ Finish Polygon ({pts.length} pts)
          </button>
        ) : (
          <button
            type="button"
            onClick={handleReset}
            style={{ padding: '8px 16px', background: '#f1f5f9', color: '#374151', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}
          >
            🔄 Redraw Region
          </button>
        )}
      </div>
    </div>
  );
};

export default RoiCanvas;
