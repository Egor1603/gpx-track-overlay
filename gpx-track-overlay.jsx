import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0e0e0e;
    --paper: #f5f2eb;
    --paper2: #ede9df;
    --accent: #c84b1f;
    --accent2: #1a6b4a;
    --border: #c8c3b5;
    --muted: #7a7569;
    --track: #c84b1f;
    --mono: 'Space Mono', monospace;
    --sans: 'DM Sans', sans-serif;
  }

  body { background: var(--paper); color: var(--ink); font-family: var(--sans); }

  .app {
    min-height: 100vh;
    display: grid;
    grid-template-rows: auto 1fr auto;
    grid-template-columns: 380px 1fr;
    grid-template-areas:
      "header header"
      "sidebar main"
      "footer footer";
  }

  .header {
    grid-area: header;
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--paper);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--mono);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
  }

  .header-tag {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.08em;
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 2px;
  }

  .sidebar {
    grid-area: sidebar;
    border-right: 1px solid var(--border);
    overflow-y: auto;
    background: var(--paper);
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .section {
    border-bottom: 1px solid var(--border);
    padding: 1.25rem 1.5rem;
  }

  .section-label {
    font-family: var(--mono);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .section-label::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: var(--accent);
    border-radius: 50%;
  }

  .upload-zone {
    border: 1.5px dashed var(--border);
    border-radius: 4px;
    padding: 1.5rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    background: var(--paper2);
    position: relative;
  }

  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: #fdf6f1; }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }

  .upload-icon {
    width: 32px;
    height: 32px;
    margin: 0 auto 0.5rem;
    color: var(--muted);
  }

  .upload-text { font-size: 13px; color: var(--muted); line-height: 1.5; }
  .upload-text strong { color: var(--ink); font-weight: 500; }

  .file-loaded {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    background: #f0f7f3;
    border: 1px solid #9ecdb6;
    border-radius: 4px;
    font-size: 13px;
  }

  .file-loaded-icon { width: 18px; height: 18px; color: var(--accent2); flex-shrink: 0; }
  .file-loaded-name { font-family: var(--mono); font-size: 11px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .file-clear { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 16px; padding: 0; line-height: 1; }

  .param-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
    border-bottom: 1px solid var(--paper2);
  }
  .param-row:last-child { border-bottom: none; }

  .param-label { font-size: 13px; color: var(--ink); }
  .param-value {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--accent);
    background: #fdf0eb;
    padding: 2px 8px;
    border-radius: 2px;
    border: 1px solid #f0c4b0;
  }

  .param-input {
    font-family: var(--mono);
    font-size: 12px;
    width: 80px;
    padding: 3px 8px;
    border: 1px solid var(--border);
    border-radius: 2px;
    background: white;
    color: var(--ink);
  }
  .param-input:focus { outline: none; border-color: var(--accent); }

  .slider-wrap { display: flex; gap: 8px; align-items: center; }
  .slider {
    -webkit-appearance: none;
    width: 100px;
    height: 3px;
    background: var(--border);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--accent);
    cursor: pointer;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 0.6rem 1rem;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition: all 0.15s;
  }

  .btn-primary {
    background: var(--accent);
    color: white;
    width: 100%;
  }
  .btn-primary:hover:not(:disabled) { background: #a83a12; }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }

  .btn-secondary {
    background: transparent;
    color: var(--ink);
    border: 1px solid var(--border);
    width: 100%;
  }
  .btn-secondary:hover { background: var(--paper2); }

  .btn-green {
    background: var(--accent2);
    color: white;
    width: 100%;
  }
  .btn-green:hover { background: #145a3c; }

  .info-box {
    background: var(--paper2);
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-size: 12px;
    color: var(--muted);
    line-height: 1.6;
  }
  .info-box a { color: var(--accent2); }

  .terraink-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #f0f7f3;
    border: 1px solid #9ecdb6;
    border-radius: 4px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--accent2);
    text-decoration: none;
    word-break: break-all;
    margin-top: 0.5rem;
    line-height: 1.5;
  }
  .terraink-link:hover { background: #e2f2ea; }

  .main {
    grid-area: main;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .map-container {
    flex: 1;
    position: relative;
    overflow: hidden;
  }

  .canvas-map {
    width: 100%;
    height: 100%;
    background: #e8e4d8;
    display: block;
  }

  .map-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    color: var(--muted);
    font-family: var(--mono);
    font-size: 13px;
    pointer-events: none;
  }

  .map-overlay-icon { width: 48px; height: 48px; opacity: 0.3; }

  .map-stats {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .stat-badge {
    background: rgba(245,242,235,0.92);
    border: 1px solid var(--border);
    border-radius: 3px;
    padding: 4px 10px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink);
    backdrop-filter: blur(4px);
  }
  .stat-badge span { color: var(--accent); font-weight: 700; }

  .preview-label {
    position: absolute;
    top: 1rem;
    left: 1rem;
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    background: rgba(245,242,235,0.85);
    border: 1px solid var(--border);
    padding: 3px 8px;
    border-radius: 2px;
  }

  .status-bar {
    grid-area: footer;
    border-top: 1px solid var(--border);
    height: 32px;
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
    gap: 1.5rem;
    background: var(--paper2);
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted);
  }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--muted);
    flex-shrink: 0;
  }
  .status-dot.active { background: var(--accent2); }
  .status-dot.warn { background: var(--accent); }

  .progress-bar {
    height: 3px;
    background: var(--paper2);
    border-radius: 2px;
    overflow: hidden;
    margin-top: 8px;
  }

  .progress-fill {
    height: 100%;
    background: var(--accent);
    border-radius: 2px;
    transition: width 0.3s;
  }

  .toast {
    position: fixed;
    bottom: 2.5rem;
    right: 2rem;
    background: var(--ink);
    color: white;
    font-family: var(--mono);
    font-size: 12px;
    padding: 10px 16px;
    border-radius: 4px;
    z-index: 100;
    max-width: 280px;
    line-height: 1.5;
    animation: slideUp 0.2s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .north-arrow {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    width: 36px;
    height: 36px;
    background: rgba(245,242,235,0.9);
    border: 1px solid var(--border);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 700;
    color: var(--ink);
  }

  .step-indicator {
    display: flex;
    gap: 4px;
    margin-bottom: 0.75rem;
  }

  .step { width: 20px; height: 3px; border-radius: 2px; background: var(--border); }
  .step.done { background: var(--accent2); }
  .step.active { background: var(--accent); }
`;

// ─── GPX PARSER ─────────────────────────────────────────────────────────────

function parseGPX(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "text/xml");

  const trkpts = doc.querySelectorAll("trkpt");
  const points = [];

  trkpts.forEach(pt => {
    const lat = parseFloat(pt.getAttribute("lat"));
    const lon = parseFloat(pt.getAttribute("lon"));
    const ele = pt.querySelector("ele");
    if (!isNaN(lat) && !isNaN(lon)) {
      points.push({ lat, lon, ele: ele ? parseFloat(ele.textContent) : 0 });
    }
  });

  if (points.length === 0) throw new Error("No track points found in GPX file");

  const lats = points.map(p => p.lat);
  const lons = points.map(p => p.lon);

  const bbox = {
    minLat: Math.min(...lats), maxLat: Math.max(...lats),
    minLon: Math.min(...lons), maxLon: Math.max(...lons),
  };

  const centerLat = (bbox.minLat + bbox.maxLat) / 2;
  const centerLon = (bbox.minLon + bbox.maxLon) / 2;

  // Haversine distance in meters
  function haversine(p1, p2) {
    const R = 6371000;
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLon = (p2.lon - p1.lon) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(p1.lat*Math.PI/180) * Math.cos(p2.lat*Math.PI/180) * Math.sin(dLon/2)**2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  let totalDist = 0;
  for (let i = 1; i < points.length; i++) totalDist += haversine(points[i-1], points[i]);

  return { points, bbox, centerLat, centerLon, totalDist };
}

// ─── PROJECTION ──────────────────────────────────────────────────────────────

function latLonToMeters(lat, lon) {
  const R = 6378137;
  const x = lon * Math.PI / 180 * R;
  const y = Math.log(Math.tan(Math.PI / 4 + lat * Math.PI / 360)) * R;
  return { x, y };
}

// ─── STL GENERATOR ───────────────────────────────────────────────────────────

function generateSTL(gpxData, config) {
  const { points, bbox } = gpxData;
  const { trackWidthMm, trackHeightMm, baseMm, paddingPct } = config;

  // Project all points
  const projCenter = latLonToMeters(gpxData.centerLat, gpxData.centerLon);
  const projected = points.map(p => {
    const m = latLonToMeters(p.lat, p.lon);
    return { x: m.x - projCenter.x, y: m.y - projCenter.y };
  });

  // Bounding box in meters
  const xs = projected.map(p => p.x);
  const ys = projected.map(p => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);

  const pad = paddingPct / 100;
  const bboxW = (maxX - minX) * (1 + 2 * pad);
  const bboxH = (maxY - minY) * (1 + 2 * pad);

  // Fit to A4 (190x277 mm printable area)
  const A4_W = 190, A4_H = 277;
  const scaleX = A4_W / bboxW;
  const scaleY = A4_H / bboxH;
  const scale = Math.min(scaleX, scaleY); // mm per meter
  const mmPerKm = scale * 1000;
  const mapScale = Math.round(1 / scale * 1000) / 1000; // 1:X

  const modelW = bboxW * scale;
  const modelH = bboxH * scale;

  // Convert to mm coordinates
  const toMM = p => ({
    x: (p.x - minX + (maxX - minX) * pad) * scale,
    y: (p.y - minY + (maxY - minY) * pad) * scale,
  });

  const mmPoints = projected.map(toMM);

  // Build STL triangles
  const triangles = [];

  function addTri(v0, v1, v2) {
    const e1 = [v1[0]-v0[0], v1[1]-v0[1], v1[2]-v0[2]];
    const e2 = [v2[0]-v0[0], v2[1]-v0[1], v2[2]-v0[2]];
    const n = [
      e1[1]*e2[2] - e1[2]*e2[1],
      e1[2]*e2[0] - e1[0]*e2[2],
      e1[0]*e2[1] - e1[1]*e2[0],
    ];
    const len = Math.sqrt(n[0]**2 + n[1]**2 + n[2]**2) || 1;
    triangles.push({ n: n.map(v => v/len), verts: [v0, v1, v2] });
  }

  // Base plate
  const bx = modelW, by = modelH, bz = baseMm;
  // Bottom face
  addTri([0,0,0], [bx,0,0], [bx,by,0]);
  addTri([0,0,0], [bx,by,0], [0,by,0]);
  // Top face
  addTri([0,0,bz], [bx,by,bz], [bx,0,bz]);
  addTri([0,0,bz], [0,by,bz], [bx,by,bz]);
  // Sides
  addTri([0,0,0], [bx,0,0], [bx,0,bz]);
  addTri([0,0,0], [bx,0,bz], [0,0,bz]);
  addTri([bx,0,0], [bx,by,0], [bx,by,bz]);
  addTri([bx,0,0], [bx,by,bz], [bx,0,bz]);
  addTri([bx,by,0], [0,by,0], [0,by,bz]);
  addTri([bx,by,0], [0,by,bz], [bx,by,bz]);
  addTri([0,by,0], [0,0,0], [0,0,bz]);
  addTri([0,by,0], [0,0,bz], [0,by,bz]);

  // Track as extruded segments
  const hw = trackWidthMm / 2;
  const th = baseMm + trackHeightMm;

  for (let i = 0; i < mmPoints.length - 1; i++) {
    const p0 = mmPoints[i], p1 = mmPoints[i+1];
    const dx = p1.x - p0.x, dy = p1.y - p0.y;
    const len2 = Math.sqrt(dx*dx + dy*dy);
    if (len2 < 0.01) continue;
    const nx = -dy/len2 * hw, ny = dx/len2 * hw;

    const A = [p0.x - nx, p0.y - ny, bz];
    const B = [p0.x + nx, p0.y + ny, bz];
    const C = [p1.x + nx, p1.y + ny, bz];
    const D = [p1.x - nx, p1.y - ny, bz];
    const At = [p0.x - nx, p0.y - ny, th];
    const Bt = [p0.x + nx, p0.y + ny, th];
    const Ct = [p1.x + nx, p1.y + ny, th];
    const Dt = [p1.x - nx, p1.y - ny, th];

    // Top
    addTri(At, Bt, Ct); addTri(At, Ct, Dt);
    // Sides
    addTri(A, D, Dt); addTri(A, Dt, At);
    addTri(B, Bt, Ct); addTri(B, Ct, C);
    // Caps at start/end
    if (i === 0) { addTri(A, At, Bt); addTri(A, Bt, B); }
    if (i === mmPoints.length - 2) { addTri(D, Ct, Dt); addTri(D, C, Ct); }
  }

  // Write binary STL
  const headerSize = 80;
  const triCount = triangles.length;
  const buffer = new ArrayBuffer(headerSize + 4 + triCount * 50);
  const view = new DataView(buffer);

  // Header
  const enc = new TextEncoder();
  const header = enc.encode("GPX Track Overlay - generated by gpx-track-overlay");
  new Uint8Array(buffer, 0, 80).set(header.slice(0, 80));

  view.setUint32(80, triCount, true);

  let offset = 84;
  for (const tri of triangles) {
    const { n, verts } = tri;
    view.setFloat32(offset, n[0], true); offset += 4;
    view.setFloat32(offset, n[1], true); offset += 4;
    view.setFloat32(offset, n[2], true); offset += 4;
    for (const v of verts) {
      view.setFloat32(offset, v[0], true); offset += 4;
      view.setFloat32(offset, v[1], true); offset += 4;
      view.setFloat32(offset, v[2], true); offset += 4;
    }
    view.setUint16(offset, 0, true); offset += 2;
  }

  return {
    buffer,
    triCount,
    modelW: modelW.toFixed(1),
    modelH: modelH.toFixed(1),
    mapScale: Math.round(mapScale),
    mmPerKm: mmPerKm.toFixed(1),
    scale,
  };
}

// ─── MAP CANVAS PREVIEW ──────────────────────────────────────────────────────

function MapPreview({ gpxData, config }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!gpxData || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width, H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Background — topographic feel
    ctx.fillStyle = "#e8e4d8";
    ctx.fillRect(0, 0, W, H);

    // Grid lines
    ctx.strokeStyle = "#d5d1c5";
    ctx.lineWidth = 0.5;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const { points, bbox } = gpxData;
    const pad = (config.paddingPct / 100);

    const rangeX = (bbox.maxLon - bbox.minLon) * (1 + 2 * pad);
    const rangeY = (bbox.maxLat - bbox.minLat) * (1 + 2 * pad);

    const toCanvas = (lat, lon) => ({
      x: ((lon - bbox.minLon + (bbox.maxLon - bbox.minLon) * pad) / rangeX) * W,
      y: H - ((lat - bbox.minLat + (bbox.maxLat - bbox.minLat) * pad) / rangeY) * H,
    });

    // Track shadow
    ctx.strokeStyle = "rgba(200,75,31,0.2)";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    points.forEach((p, i) => {
      const { x, y } = toCanvas(p.lat, p.lon);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Track
    ctx.strokeStyle = "#c84b1f";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    points.forEach((p, i) => {
      const { x, y } = toCanvas(p.lat, p.lon);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Start/end markers
    if (points.length > 0) {
      const start = toCanvas(points[0].lat, points[0].lon);
      const end = toCanvas(points[points.length-1].lat, points[points.length-1].lon);

      ctx.fillStyle = "#1a6b4a";
      ctx.beginPath(); ctx.arc(start.x, start.y, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(start.x, start.y, 2.5, 0, Math.PI*2); ctx.fill();

      ctx.fillStyle = "#c84b1f";
      ctx.beginPath(); ctx.arc(end.x, end.y, 5, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = "white"; ctx.beginPath(); ctx.arc(end.x, end.y, 2.5, 0, Math.PI*2); ctx.fill();
    }

    // A4 frame
    const a4W = W * 0.9, a4H = H * 0.9;
    const a4X = (W - a4W) / 2, a4Y = (H - a4H) / 2;
    ctx.strokeStyle = "#888375";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(a4X, a4Y, a4W, a4H);
    ctx.setLineDash([]);
    ctx.fillStyle = "#888375";
    ctx.font = "10px 'Space Mono', monospace";
    ctx.fillText("A4", a4X + 6, a4Y + 14);

  }, [gpxData, config]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={520}
      className="canvas-map"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

// ─── TERRAINK LINK BUILDER ───────────────────────────────────────────────────

function buildTerrainkURL(gpxData, scale) {
  if (!gpxData) return null;
  const { bbox, centerLat, centerLon } = gpxData;

  // Approximate zoom level from scale
  const zoom = Math.round(Math.log2(156543.03392 * Math.cos(centerLat * Math.PI / 180) / (scale * 0.0254 * 96))) ;
  const clampedZoom = Math.min(17, Math.max(10, zoom));

  // terraink.app uses lat/lng/zoom params
  const url = `https://terraink.app/?lat=${centerLat.toFixed(6)}&lng=${centerLon.toFixed(6)}&zoom=${clampedZoom}&format=A4&orientation=portrait&style=outdoor`;
  return url;
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

export default function App() {
  const [gpxData, setGpxData] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(null);
  const [status, setStatus] = useState("Готов — загрузите GPX-файл для начала работы");
  const [stlResult, setStlResult] = useState(null);

  const [config, setConfig] = useState({
    paddingPct: 10,
    trackWidthMm: 1.2,
    trackHeightMm: 5,
    baseMm: 1.5,
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleFile = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith(".gpx")) {
      showToast("Пожалуйста, загрузите файл .gpx");
      return;
    }
    try {
      const text = await file.text();
      const data = parseGPX(text);
      setGpxData(data);
      setFileName(file.name);
      setStlResult(null);
      setStatus(`Трек загружен — ${data.points.length} точек, ${(data.totalDist/1000).toFixed(2)} км`);
    } catch(e) {
      showToast("Ошибка чтения GPX: " + e.message);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleFileInput = (e) => handleFile(e.target.files[0]);

  const generateAndDownload = async () => {
    if (!gpxData) return;
    setGenerating(true);
    setProgress(10);
    setStatus("Проецирование координат…");

    try {
      await new Promise(r => setTimeout(r, 120));
      setProgress(35);
      setStatus("Вычисление масштаба для A4…");

      await new Promise(r => setTimeout(r, 120));
      setProgress(60);
      setStatus("Построение 3D-геометрии…");

      const result = generateSTL(gpxData, config);
      setProgress(85);
      setStatus("Запись бинарного STL…");

      await new Promise(r => setTimeout(r, 100));
      setProgress(100);
      setStlResult(result);

      // Trigger download
      const blob = new Blob([result.buffer], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = (fileName || "track").replace(".gpx", "") + "_3d.stl";
      a.click();
      URL.revokeObjectURL(url);

      setStatus(`STL готов — ${result.modelW}×${result.modelH}мм, масштаб 1:${result.mapScale.toLocaleString()}, ${result.triCount} треугольников`);
      showToast("STL успешно скачан");
    } catch (e) {
      showToast("Ошибка: " + e.message);
      setStatus("Генерация не удалась — " + e.message);
    } finally {
      setGenerating(false);
      setTimeout(() => setProgress(0), 800);
    }
  };

  const terrainkURL = stlResult ? buildTerrainkURL(gpxData, stlResult.scale) : (gpxData ? buildTerrainkURL(gpxData, 0.001) : null);

  const step = !gpxData ? 0 : !stlResult ? 1 : 2;

  return (
    <>
      <style>{STYLES}</style>

      <div className="app">
        {/* HEADER */}
        <header className="header">
          <div className="logo">
            <svg className="logo-icon" viewBox="0 0 28 28" fill="none">
              <rect x="2" y="2" width="24" height="24" rx="2" fill="#c84b1f" opacity="0.12"/>
              <path d="M6 18 Q10 8 14 12 Q18 16 22 6" stroke="#c84b1f" strokeWidth="2" strokeLinecap="round" fill="none"/>
              <rect x="4" y="20" width="20" height="2" rx="1" fill="#c84b1f" opacity="0.4"/>
            </svg>
            GPX Track Overlay
          </div>
          <div className="header-tag">GPX → STL → 3D-печать</div>
        </header>

        {/* SIDEBAR */}
        <aside className="sidebar">

          {/* Step indicator */}
          <div className="section" style={{paddingBottom: "0.75rem"}}>
            <div className="step-indicator">
              {[0,1,2].map(i => (
                <div key={i} className={`step ${i < step ? "done" : i === step ? "active" : ""}`}/>
              ))}
            </div>
            <div style={{fontSize: "12px", color: "var(--muted)", fontFamily: "var(--mono)"}}>
              {step === 0 && "Шаг 1 из 3 — Загрузите GPX"}
              {step === 1 && "Шаг 2 из 3 — Настройте и сгенерируйте"}
              {step === 2 && "Шаг 3 из 3 — Получите карту на terraink"}
            </div>
          </div>

          {/* Upload */}
          <div className="section">
            <div className="section-label">GPX-файл</div>
            {!gpxData ? (
              <div
                className={`upload-zone ${dragging ? "drag" : ""}`}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
              >
                <input type="file" accept=".gpx" onChange={handleFileInput} />
                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 16V8m0 0-3 3m3-3 3 3M6 20h12a2 2 0 0 0 2-2V9.5a2 2 0 0 0-.586-1.414l-4.5-4.5A2 2 0 0 0 13.5 3H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>
                </svg>
                <div className="upload-text">
                  <strong>Перетащите GPX сюда</strong><br/>или нажмите для выбора
                </div>
              </div>
            ) : (
              <div className="file-loaded">
                <svg className="file-loaded-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                </svg>
                <span className="file-loaded-name">{fileName}</span>
                <button className="file-clear" onClick={() => { setGpxData(null); setFileName(null); setStlResult(null); }}>×</button>
              </div>
            )}
          </div>

          {/* Track info */}
          {gpxData && (
            <div className="section">
              <div className="section-label">Информация о треке</div>
              <div className="param-row">
                <span className="param-label">Точек</span>
                <span className="param-value">{gpxData.points.length.toLocaleString()}</span>
              </div>
              <div className="param-row">
                <span className="param-label">Дистанция</span>
                <span className="param-value">{(gpxData.totalDist/1000).toFixed(2)} км</span>
              </div>
              <div className="param-row">
                <span className="param-label">Центр</span>
                <span className="param-value" style={{fontSize: "10px"}}>
                  {gpxData.centerLat.toFixed(4)}°, {gpxData.centerLon.toFixed(4)}°
                </span>
              </div>
            </div>
          )}

          {/* Config */}
          <div className="section">
            <div className="section-label">Параметры модели</div>
            <div className="param-row">
              <span className="param-label">Отступ карты</span>
              <div className="slider-wrap">
                <input type="range" className="slider" min="5" max="25" step="1"
                  value={config.paddingPct}
                  onChange={e => setConfig(c => ({...c, paddingPct: +e.target.value}))}
                />
                <span style={{fontFamily: "var(--mono)", fontSize: "12px", minWidth: 28}}>{config.paddingPct}%</span>
              </div>
            </div>
            <div className="param-row">
              <span className="param-label">Ширина трека</span>
              <div className="slider-wrap">
                <input type="range" className="slider" min="0.6" max="3" step="0.2"
                  value={config.trackWidthMm}
                  onChange={e => setConfig(c => ({...c, trackWidthMm: +e.target.value}))}
                />
                <span style={{fontFamily: "var(--mono)", fontSize: "12px", minWidth: 40}}>{config.trackWidthMm.toFixed(1)}мм</span>
              </div>
            </div>
            <div className="param-row">
              <span className="param-label">Высота трека</span>
              <div className="slider-wrap">
                <input type="range" className="slider" min="2" max="10" step="0.5"
                  value={config.trackHeightMm}
                  onChange={e => setConfig(c => ({...c, trackHeightMm: +e.target.value}))}
                />
                <span style={{fontFamily: "var(--mono)", fontSize: "12px", minWidth: 40}}>{config.trackHeightMm.toFixed(1)}мм</span>
              </div>
            </div>
            <div className="param-row">
              <span className="param-label">Толщина подложки</span>
              <div className="slider-wrap">
                <input type="range" className="slider" min="1" max="3" step="0.5"
                  value={config.baseMm}
                  onChange={e => setConfig(c => ({...c, baseMm: +e.target.value}))}
                />
                <span style={{fontFamily: "var(--mono)", fontSize: "12px", minWidth: 40}}>{config.baseMm.toFixed(1)}мм</span>
              </div>
            </div>
          </div>

          {/* STL result info */}
          {stlResult && (
            <div className="section">
              <div className="section-label">Результат STL</div>
              <div className="param-row">
                <span className="param-label">Размер (Ш×В)</span>
                <span className="param-value">{stlResult.modelW}×{stlResult.modelH}мм</span>
              </div>
              <div className="param-row">
                <span className="param-label">Масштаб карты</span>
                <span className="param-value">1:{stlResult.mapScale.toLocaleString()}</span>
              </div>
              <div className="param-row">
                <span className="param-label">Треугольников</span>
                <span className="param-value">{stlResult.triCount.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Generate */}
          <div className="section">
            <button className="btn btn-primary" onClick={generateAndDownload} disabled={!gpxData || generating}>
              {generating ? (
                <>Генерация…</>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M19 12l-7 7-7-7"/>
                  </svg>
                  Сгенерировать и скачать STL
                </>
              )}
            </button>
            {generating && (
              <div className="progress-bar" style={{marginTop: 8}}>
                <div className="progress-fill" style={{width: `${progress}%`}}/>
              </div>
            )}
          </div>

          {/* terraink integration */}
          <div className="section">
            <div className="section-label">Карта с Terraink.app</div>
            <div className="info-box">
              После скачивания STL откройте эту ссылку на terraink.app — она загрузит точно такую же область для печати на A4.
            </div>
            {terrainkURL && (
              <a
                className="terraink-link"
                href={terrainkURL}
                target="_blank"
                rel="noreferrer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{flexShrink:0}}>
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6m0 0v6m0-6L10 14"/>
                </svg>
                {terrainkURL}
              </a>
            )}
            {!terrainkURL && (
              <div style={{fontSize: "12px", color: "var(--muted)", marginTop: "0.5rem", fontFamily: "var(--mono)"}}>
                Сначала сгенерируйте STL для получения ссылки
              </div>
            )}
          </div>

        </aside>

        {/* MAIN MAP AREA */}
        <main className="main">
          <div className="map-container">
            {gpxData ? (
              <>
                <MapPreview gpxData={gpxData} config={config} />
                <div className="preview-label">Предпросмотр трека</div>
                <div className="north-arrow">N↑</div>
                {stlResult && (
                  <div className="map-stats">
                    <div className="stat-badge">Масштаб <span>1:{stlResult.mapScale.toLocaleString()}</span></div>
                    <div className="stat-badge">Модель <span>{stlResult.modelW}×{stlResult.modelH}мм</span></div>
                    <div className="stat-badge">Высота трека <span>{config.trackHeightMm}мм</span></div>
                  </div>
                )}
              </>
            ) : (
              <div className="map-overlay">
                <svg className="map-overlay-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="6" y="6" width="36" height="36" rx="3"/>
                  <path d="M14 32 Q20 16 24 22 Q28 28 34 14"/>
                  <circle cx="14" cy="32" r="2" fill="currentColor"/>
                  <circle cx="34" cy="14" r="2" fill="currentColor"/>
                </svg>
                <span>Загрузите GPX-файл для предпросмотра трека</span>
              </div>
            )}
          </div>
        </main>

        {/* STATUS BAR */}
        <footer className="status-bar">
          <div className={`status-dot ${gpxData ? (stlResult ? "done" : "active") : ""}`}
               style={stlResult ? {background: "#1a6b4a"} : {}}/>
          <span>{status}</span>
          {stlResult && (
            <>
              <span style={{marginLeft: "auto"}}>
                {(gpxData.totalDist/1000).toFixed(2)}км трек → {stlResult.modelW}×{stlResult.modelH}мм модель
              </span>
            </>
          )}
        </footer>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
