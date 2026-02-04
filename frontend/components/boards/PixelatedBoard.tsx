"use client";

import { useEffect, useRef, useState } from "react";
import type { VisionBoard, Domain } from "@/lib/types";

interface PixelatedBoardProps {
  board: VisionBoard;
  domains: Domain[];
  pixelSize?: number;
  showCheckpoints?: boolean;
}

export function PixelatedBoard({
  board,
  domains,
  pixelSize = 10,
  showCheckpoints = false,
}: PixelatedBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Static resources refs (survive re-renders without causing them)
  const grayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const colorCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const compCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const indicesRef = useRef<Uint32Array | null>(null);
  const gridInfoRef = useRef<{ cols: number; rows: number; total: number }>({ cols: 0, rows: 0, total: 0 });
  const initializedRef = useRef(false);

  // Dynamic state refs (for animation loop to read)
  const boardStatsRef = useRef({ coloredPixels: 0, totalPixels: 0 });

  // State for synchronization
  const [generationId, setGenerationId] = useState(0);

  // State for image loading
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Animation Refs
  const animationRef = useRef<number>();
  const [debugPhase, setDebugPhase] = useState<string>('init');

  // Canvas Dimensions
  const canvasWidth = 1920;
  const canvasHeight = 1080;

  // Sync board stats to ref for animation loop
  useEffect(() => {
    boardStatsRef.current = {
      coloredPixels: board.coloredPixels,
      totalPixels: board.totalPixels
    };
  }, [board.coloredPixels, board.totalPixels]);

  // 1. Efficient Image Loading
  // Only reload if image URLs change
  const imagesKey = JSON.stringify(domains.map(d => d.images.map(i => i.imageUrl)));

  useEffect(() => {
    let isMounted = true;
    const loadAllImages = async () => {
      // Don't set loading if we already have images and just updating props?
      // Actually we do need to wait if URLs changed.
      setIsLoading(true);

      const imageMap = new Map<string, HTMLImageElement>();
      const loadPromises: Promise<void>[] = [];

      domains.forEach((domain) => {
        domain.images.forEach((img, idx) => {
          const loadPromise = new Promise<void>((resolve) => {
            const image = new window.Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
              if (isMounted) imageMap.set(`${domain.id}_${idx}`, image);
              resolve();
            };
            image.onerror = () => {
              console.warn(`Failed to load image for ${domain.name}`);
              resolve();
            };
            image.src = img.imageUrl;
          });
          loadPromises.push(loadPromise);
        });
      });

      await Promise.all(loadPromises);
      if (isMounted) {
        setLoadedImages(imageMap);
        setIsLoading(false);
      }
    };

    if (domains.length > 0) loadAllImages();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagesKey]); // Only reload when URLs change

  // 2. Static Layer Generation (Expensive Part)
  // Re-run only when layout (domains/boardType) or images or pixelSize change.
  // NOT when board progress changes.
  useEffect(() => {
    if (isLoading || loadedImages.size === 0) return;

    // Initialize Offscreen Canvases
    const grayCanvas = document.createElement("canvas");
    grayCanvas.width = canvasWidth;
    grayCanvas.height = canvasHeight;
    const grayCtx = grayCanvas.getContext("2d");

    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = canvasWidth;
    colorCanvas.height = canvasHeight;
    const colorCtx = colorCanvas.getContext("2d");

    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvasWidth;
    maskCanvas.height = canvasHeight;

    const compCanvas = document.createElement('canvas');
    compCanvas.width = canvasWidth;
    compCanvas.height = canvasHeight;

    if (!grayCtx || !colorCtx) return;

    // Compose Board
    const layout = calculateLayout(board.boardType, domains, canvasWidth, canvasHeight);

    layout.forEach((item) => {
      const domain = domains.find((d) => d.id === item.domainId);
      if (!domain) return;

      if (board.boardType === "weekly" || domain.images.length === 1) {
        const img = loadedImages.get(`${domain.id}_0`);
        if (img) {
          drawImageToContext(colorCtx, img, item.x, item.y, item.width, item.height);
          drawImageToContext(grayCtx, img, item.x, item.y, item.width, item.height, true);
        } else {
          drawPlaceholder(colorCtx, item, domain.colorHex, domain.name, false);
          drawPlaceholder(grayCtx, item, domain.colorHex, domain.name, true);
        }
      } else {
        const imageCount = Math.min(domain.images.length, 4);
        const subCols = Math.ceil(Math.sqrt(imageCount));
        const subColsCalc = subCols > 0 ? subCols : 1;
        const subRows = Math.ceil(imageCount / subColsCalc);
        const subWidth = item.width / subColsCalc;
        const subHeight = item.height / subRows;

        domain.images.slice(0, imageCount).forEach((imgObj, imgIdx) => {
          const subCol = imgIdx % subColsCalc;
          const subRow = Math.floor(imgIdx / subColsCalc);
          const subX = item.x + subCol * subWidth;
          const subY = item.y + subRow * subHeight;

          const img = loadedImages.get(`${domain.id}_${imgObj.sortOrder - 1}`);
          if (img) {
            drawImageToContext(colorCtx, img, subX, subY, subWidth, subHeight);
            drawImageToContext(grayCtx, img, subX, subY, subWidth, subHeight, true);
          }
        });
      }
    });

    drawPixelatedGrid(grayCtx, canvasWidth, canvasHeight, pixelSize, "rgba(255,255,255,0.05)");
    drawPixelatedGrid(colorCtx, canvasWidth, canvasHeight, pixelSize, "rgba(255,255,255,0.1)");

    // Store in refs
    grayCanvasRef.current = grayCanvas;
    colorCanvasRef.current = colorCanvas;
    maskCanvasRef.current = maskCanvas;
    compCanvasRef.current = compCanvas;

    // Generate Indices
    const gridCols = Math.ceil(canvasWidth / pixelSize);
    const gridRows = Math.ceil(canvasHeight / pixelSize);
    const totalGridPixels = gridCols * gridRows;
    gridInfoRef.current = { cols: gridCols, rows: gridRows, total: totalGridPixels };

    const indices = new Uint32Array(totalGridPixels);
    for (let i = 0; i < totalGridPixels; i++) indices[i] = i;
    for (let i = totalGridPixels - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = indices[i];
      indices[i] = indices[j];
      indices[j] = temp;
    }
    indicesRef.current = indices;
    initializedRef.current = true;
    setGenerationId((prev) => prev + 1);

  }, [isLoading, loadedImages, board.boardType, domains, pixelSize, imagesKey]);

  // 3. Animation Loop
  // Depend only on initializedRef and static configs
  useEffect(() => {
    if (!canvasRef.current || !initializedRef.current) return;

    // We poll 'initializedRef' via effect dependency on loadedImages/etc triggering parent re-render?
    // No, separate effect.
    // Actually, we can just depend on [loadedImages, ...] for this start up too?
    // Or simpler: The loop effect should have no dependencies that change often.
  }, []);

  // Combined Logic:
  // We need an effect that starts the loop when everything is ready.
  useEffect(() => {
    if (!canvasRef.current || isLoading || !initializedRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Grab refs
    const grayCanvas = grayCanvasRef.current!;
    const colorCanvas = colorCanvasRef.current!;
    const maskCanvas = maskCanvasRef.current!;
    const compCanvas = compCanvasRef.current!;
    const indices = indicesRef.current!;
    const { cols: gridCols, total: totalGridPixels } = gridInfoRef.current;

    // Animation Variables
    let currentPhase: 'filling' | 'holding' | 'blinking' | 'resetting' = 'filling';
    let visiblePixels = 0;
    let holdStartTime = 0;
    let blinkStartTime = 0;
    let lastRenderedCount = 0;

    const FILL_SPEED = 500;
    const HOLD_DURATION = 3000;
    const BLINK_DURATION = 400;

    const maskCtx = maskCanvas.getContext('2d')!;
    const compCtx = compCanvas.getContext('2d')!;

    // Helper for composition
    const drawMaskedColorLayer = () => {
      compCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      compCtx.drawImage(maskCanvas, 0, 0);
      compCtx.globalCompositeOperation = 'source-in';
      compCtx.drawImage(colorCanvas, 0, 0);
      compCtx.globalCompositeOperation = 'source-over';
      ctx.drawImage(compCanvas, 0, 0);
    };

    const persistentMaskLoop = (timestamp: number) => {
      // Read latest target from ref
      const { coloredPixels, totalPixels } = boardStatsRef.current;
      const overallCompletionRate = totalPixels > 0 ? (coloredPixels / totalPixels) : 0;
      const targetPixelCount = Math.floor(totalGridPixels * overallCompletionRate);

      // A. State Updates
      if (currentPhase === 'filling') {
        // Dynamic speed based on distance
        const dist = targetPixelCount - visiblePixels;
        const speed = Math.max(FILL_SPEED, Math.ceil(dist / 60)); // finish quickly if far behind

        visiblePixels += speed;

        if (visiblePixels >= targetPixelCount) {
          visiblePixels = targetPixelCount;
          // Only enter holding phase if we actually reached the *full* target
          currentPhase = 'holding';
          holdStartTime = timestamp;
        }
      } else if (currentPhase === 'holding') {
        // If target increased while holding, go back to filling
        if (targetPixelCount > visiblePixels) {
          currentPhase = 'filling';
        } else if (timestamp - holdStartTime > HOLD_DURATION) {
          currentPhase = 'blinking';
          blinkStartTime = timestamp;
        }
      } else if (currentPhase === 'blinking') {
        if (timestamp - blinkStartTime > BLINK_DURATION) {
          currentPhase = 'resetting';
        }
      } else if (currentPhase === 'resetting') {
        currentPhase = 'filling';
        visiblePixels = 0;
        lastRenderedCount = 0;
        maskCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      }

      setDebugPhase(currentPhase);

      // B. Update Mask
      if (currentPhase === 'filling' && visiblePixels > lastRenderedCount) {
        maskCtx.fillStyle = '#000000';
        maskCtx.beginPath();
        for (let i = lastRenderedCount; i < visiblePixels; i++) {
          if (i >= totalGridPixels) break;
          const idx = indices[i];
          const x = (idx % gridCols) * pixelSize;
          const y = Math.floor(idx / gridCols) * pixelSize;
          maskCtx.rect(x, y, pixelSize, pixelSize);
        }
        maskCtx.fill();
        lastRenderedCount = visiblePixels;
      }

      // C. Composition
      ctx.drawImage(grayCanvas, 0, 0);

      ctx.save();
      if (currentPhase === 'blinking') {
        ctx.globalAlpha = 0.9 + Math.random() * 0.1;
        ctx.drawImage(colorCanvas, 0, 0);
        if (timestamp - blinkStartTime < 50) {
          ctx.fillStyle = 'white';
          ctx.globalAlpha = 0.3;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
      }
      ctx.restore();

      if (currentPhase !== 'blinking') {
        drawMaskedColorLayer();
      }

      animationRef.current = requestAnimationFrame(persistentMaskLoop);
    };

    animationRef.current = requestAnimationFrame(persistentMaskLoop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isLoading, generationId, pixelSize]); // Restart loop if loading state or static assets change

  // Calculations for UI Overlay
  const completionPercentage = board.totalPixels > 0
    ? Math.round((board.coloredPixels / board.totalPixels) * 100)
    : 0;

  return (
    <div className="relative w-full h-full bg-background-tertiary rounded-xl overflow-hidden shadow-2xl border border-white/5 group">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/90 backdrop-blur-sm z-20">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple border-r-transparent"></div>
            <p className="mt-4 text-xs font-mono text-purple-400 animate-pulse">INITIALIZING VISION...</p>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ imageRendering: "pixelated" }}
      />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] text-purple-300 font-mono tracking-widest uppercase mb-1">
              Overall Progress
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white tracking-tighter shadow-black drop-shadow-lg">
                {completionPercentage}%
              </span>
              <span className="text-xs text-gray-400 font-mono mb-1">
                CURRENT MANIFESTATION
              </span>
            </div>

            <div className="w-64 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-orange-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className={`px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 backdrop-blur text-[10px] font-mono text-purple-300 transition-opacity duration-300 ${debugPhase === 'blinking' ? 'opacity-100' : 'opacity-0'}`}>
              FUTURE GLIMPSE ACTIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helpers
function drawImageToContext(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  grayscale: boolean = false
) {
  ctx.save();
  const imgAspect = image.width / image.height;
  const rectAspect = width / height;
  let drawWidth = width;
  let drawHeight = height;
  let drawX = 0;
  let drawY = 0;

  if (imgAspect > rectAspect) {
    drawHeight = height;
    drawWidth = height * imgAspect;
    drawX = (width - drawWidth) / 2;
  } else {
    drawWidth = width;
    drawHeight = width / imgAspect;
    drawY = (height - drawHeight) / 2;
  }

  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  ctx.drawImage(image, x + drawX, y + drawY, drawWidth, drawHeight);

  if (grayscale) {
    ctx.globalCompositeOperation = "saturation";
    ctx.fillStyle = "hsl(0,0%,50%)";
    ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = "source-over";

    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(x, y, width, height);
  }

  ctx.restore();
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, item: any, color: string, text: string, grayscale: boolean) {
  ctx.fillStyle = grayscale ? '#222' : color;
  ctx.fillRect(item.x, item.y, item.width, item.height);

  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.moveTo(item.x, item.y);
  ctx.lineTo(item.x + item.width, item.y + item.height);
  ctx.stroke();
}

function calculateLayout(type: string, domains: Domain[], w: number, h: number) {
  const domainCount = domains.length;
  const layout: Array<{ domainId: string; x: number; y: number; width: number; height: number }> = [];

  if (type === "weekly" || true) {
    if (domainCount === 4) {
      const halfW = w / 2;
      const halfH = h / 2;
      layout.push({ domainId: domains[0].id, x: 0, y: 0, width: halfW, height: halfH });
      layout.push({ domainId: domains[1].id, x: halfW, y: 0, width: halfW, height: halfH });
      layout.push({ domainId: domains[2].id, x: 0, y: halfH, width: halfW, height: halfH });
      layout.push({ domainId: domains[3].id, x: halfW, y: halfH, width: halfW, height: halfH });
    } else {
      const stripHeight = h / domains.length;
      domains.forEach((d, i) => {
        layout.push({ domainId: d.id, x: 0, y: i * stripHeight, width: w, height: stripHeight });
      });
    }
  }
  return layout;
}

function drawPixelatedGrid(ctx: CanvasRenderingContext2D, w: number, h: number, size: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  for (let x = 0; x <= w; x += size * 2) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
  for (let y = 0; y <= h; y += size * 2) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();
}
