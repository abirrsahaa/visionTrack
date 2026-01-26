"use client";

import { useEffect, useRef, useState, memo } from "react";
import type { VisionBoard, Domain } from "@/lib/types";

interface PixelatedBoardProps {
  board: VisionBoard;
  domains: Domain[];
  pixelSize?: number;
  showCheckpoints?: boolean;
}

export const PixelatedBoard = memo(function PixelatedBoard({
  board,
  domains,
  pixelSize = 10,
  showCheckpoints = false,
}: PixelatedBoardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // State for image loading
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Animation Refs
  const animationRef = useRef<number>();
  const [debugPhase, setDebugPhase] = useState<string>('init');

  // Canvas Dimensions
  const canvasWidth = 1920;
  const canvasHeight = 1080;

  // Load Images Logic
  useEffect(() => {
    let isMounted = true;
    const loadAllImages = async () => {
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
  }, [domains]);

  // Main Canvas & Animation Logic
  useEffect(() => {
    if (!canvasRef.current || isLoading || loadedImages.size === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // --- 1. Prepare Layers (Offscreen Canvases) ---
    // Layer 1: Grayscale Base (The "faded" reality)
    const grayCanvas = document.createElement("canvas");
    grayCanvas.width = canvasWidth;
    grayCanvas.height = canvasHeight;
    const grayCtx = grayCanvas.getContext("2d");

    // Layer 2: Full Color Target (The "Vision")
    const colorCanvas = document.createElement("canvas");
    colorCanvas.width = canvasWidth;
    colorCanvas.height = canvasHeight;
    const colorCtx = colorCanvas.getContext("2d");

    if (!grayCtx || !colorCtx) return;

    // --- 2. Compose the Board Layout on Layers ---
    const layout = calculateLayout(board.boardType, domains, canvasWidth, canvasHeight);

    // Draw the static board content onto Color and Gray layers
    // We do this ONCE to save performance
    layout.forEach((item) => {
      const domain = domains.find((d) => d.id === item.domainId);
      if (!domain) return;

      // Determine which image(s) to draw
      // For simplicity reusing the weekly/monthly logic from before but customized for layers
      // Using "cover" logic manually similar to previous implementation

      if (board.boardType === "weekly" || domain.images.length === 1) {
        const img = loadedImages.get(`${domain.id}_0`);
        if (img) {
          drawImageToContext(colorCtx, img, item.x, item.y, item.width, item.height);
          drawImageToContext(grayCtx, img, item.x, item.y, item.width, item.height, true); // grayscale
        } else {
          // Fallback placeholder
          drawPlaceholder(colorCtx, item, domain.colorHex, domain.name, false);
          drawPlaceholder(grayCtx, item, domain.colorHex, domain.name, true);
        }
      } else {
        // Multi-image layout
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

    // Draw Pixel Grid Lines on both (optional, maybe just on final canvas)
    drawPixelatedGrid(grayCtx, canvasWidth, canvasHeight, pixelSize, "rgba(255,255,255,0.05)");
    drawPixelatedGrid(colorCtx, canvasWidth, canvasHeight, pixelSize, "rgba(255,255,255,0.1)");


    // --- 3. Animation State Setup ---
    const gridCols = Math.ceil(canvasWidth / pixelSize);
    const gridRows = Math.ceil(canvasHeight / pixelSize);
    const totalGridPixels = gridCols * gridRows;

    // Generate Shuffled Grid Indices for "Random" Filling
    const indices = new Uint32Array(totalGridPixels);
    for (let i = 0; i < totalGridPixels; i++) indices[i] = i;
    // Fisher-Yates Shuffle
    for (let i = totalGridPixels - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = indices[i];
      indices[i] = indices[j];
      indices[j] = temp;
    }

    // Animation Config
    const overallCompletionRate = board.totalPixels > 0 ? (board.coloredPixels / board.totalPixels) : 0;
    const targetPixelCount = Math.floor(totalGridPixels * overallCompletionRate);

    // Animation Variables
    let currentPhase: 'filling' | 'holding' | 'blinking' | 'resetting' = 'filling';
    let visiblePixels = 0;
    let holdStartTime = 0;
    let blinkStartTime = 0;

    // Mask Canvas (Offscreen) - This determines what parts of Color Layer are visible
    // We only need 1 channel (alpha), but standard canvas is RGBA.
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvasWidth;
    maskCanvas.height = canvasHeight;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    ctx.imageSmoothingEnabled = false;

    // --- 4. The Animation Loop ---
    const renderLoop = (timestamp: number) => {
      // Clear Main Canvas
      // Draw Grayscale Base Layer first (always visible underneath)
      ctx.drawImage(grayCanvas, 0, 0);

      // Update State Logic
      if (currentPhase === 'filling') {
        visiblePixels += FILL_SPEED;
        if (visiblePixels >= targetPixelCount) {
          visiblePixels = targetPixelCount;
          currentPhase = 'holding';
          holdStartTime = timestamp;
        }
      }
      else if (currentPhase === 'holding') {
        if (timestamp - holdStartTime > HOLD_DURATION) {
          currentPhase = 'blinking';
          blinkStartTime = timestamp;
        }
      }
      else if (currentPhase === 'blinking') {
        if (timestamp - blinkStartTime > BLINK_DURATION) {
          currentPhase = 'resetting';
          visiblePixels = 0; // Reset
        }
      }
      else if (currentPhase === 'resetting') {
        // Instant restart or smooth restart? Let's do instant loop
        currentPhase = 'filling';
      }

      setDebugPhase(currentPhase); // For debug overlay

      // Draw Mask
      // Determine how many pixels to show on the mask
      // If blinking, show ALL pixels (Future Glimpse!)
      const pixelsDrawingCount = currentPhase === 'blinking' ? totalGridPixels : visiblePixels;

      // Optimizing Mask Update:
      // Instead of redrawing the whole mask every frame, we could just ADD to it.
      // But for the 'blinking' to 'resetting' transition, we need to clear it.

      // Strategy: 
      // 1. If phase switched to 'filling' (from reset), clear mask.
      // 2. Add new pixels since last frame.

      // However, standard immediate mode style:
      // Let's rely on the fact that we can just iterate indices up to pixelsDrawingCount.
      // Note: Iterating 2 million items in JS every frame is slow.
      // Optimization: Draw chunks on the mask canvas and keep it persistent?
      // YES.

      // PERSISTENT MASK STRATEGY:
      // We only modify `maskCtx` when `visiblePixels` increases.
      // When 'blinking', we overlay a full fill without modifying the underlying 'progress mask' (or we use a temp override).
      // Actually, let's just use `maskCtx` for the "Progress" and handle blink separately.

      // Update Mask Canvas (Progressive Fill)
      // We track `lastRenderedPixelCount` in a closure variable outside valid for the loop?
      // Let's refactor loop vars slightly.
    };

    // Efficient Loop State
    let lastRenderedCount = 0;

    const persistentMaskLoop = (timestamp: number) => {
      // A. State Updates
      if (currentPhase === 'filling') {
        visiblePixels += Math.ceil(totalGridPixels / 120); // Finish in ~2 seconds (at 60fps)
        if (visiblePixels >= targetPixelCount) {
          visiblePixels = targetPixelCount;
          currentPhase = 'holding';
          holdStartTime = timestamp;
        }
      } else if (currentPhase === 'holding') {
        if (timestamp - holdStartTime > HOLD_DURATION) {
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
        maskCtx.clearRect(0, 0, canvasWidth, canvasHeight); // Clear mask
      }

      // B. Update Mask (Incremental)
      if (currentPhase === 'filling' && visiblePixels > lastRenderedCount) {
        maskCtx.fillStyle = '#000000'; // Color doesn't matter for masking, fully opaque
        // Draw new pixels
        // Batch drawing is faster (beginPath / rect / fill)
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
      // 1. Draw Gray Background
      ctx.drawImage(grayCanvas, 0, 0);

      // 2. Prepare to Draw Color Layer masked by Mask Layer
      ctx.save();

      // If blinking, we ignore the mask and just show FULL color (maybe with some opacity flicker?)
      if (currentPhase === 'blinking') {
        // Future Glimpse Mode!
        ctx.globalAlpha = 0.9 + Math.random() * 0.1; // Slight flicker
        ctx.drawImage(colorCanvas, 0, 0);

        // Add a "Pure White" flash overlay at the start of blink?
        if (timestamp - blinkStartTime < 50) {
          ctx.fillStyle = 'white';
          ctx.globalAlpha = 0.3;
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        }
      } else {
        // Standard Progress Mode
        // We need to apply the mask.
        // Canvas logic: destination-in keeps destination where source overlaps.
        // But we want to draw Color *masked by* Mask.
        // Easiest: Draw Mask first (opaque), then draw Color with 'source-in'?
        // No, that replaces the canvas content.
        // We need an intermediate buffer for the masked color layer if we want to composit over gray.

        // Option: 
        // 1. Create a temp layer.
        // 2. Draw Color Layer.
        // 3. Draw Mask Layer with 'destination-in' (keeps color only where mask is).
        // 4. Draw temp layer onto Main Context.

        // BUT creating a 1920x1080 canvas every frame is DEATH for Perf.
        // Solution: Using 'clip' from the mask? Path based clipping is slow for millions of rects.

        // Optimized Composition:
        // Main Ctx already has Gray.
        // We want to draw Color on top, but restricted to Mask pixels.
        // Since Mask is just black pixels on transparency...
        // We can assume pixels align?

        // Efficient way without limited layers:
        // 1. Draw Gray on Main.
        // 2. Draw Color on Main.
        // 3. Draw "Inverse Mask" to erase Color revealing Gray?? Hard.

        // Back to Temp Canvas (re-used):
        // We need ONE persistent temp canvas.
        // See 'compositionCanvas' below.
      }
      ctx.restore();

      if (currentPhase !== 'blinking') {
        drawMaskedColorLayer();
      }

      // Debug/Overlay info
      // (Handled by React UI overlay, not canvas)

      animationRef.current = requestAnimationFrame(persistentMaskLoop);
    };

    // Temp Composition Canvas (Created once)
    const compCanvas = document.createElement('canvas');
    compCanvas.width = canvasWidth;
    compCanvas.height = canvasHeight;
    const compCtx = compCanvas.getContext('2d');

    const drawMaskedColorLayer = () => {
      if (!compCtx) return;
      // Clear temp
      compCtx.clearRect(0, 0, canvasWidth, canvasHeight);

      // 1. Draw the Mask (The shape we want)
      compCtx.drawImage(maskCanvas, 0, 0);

      // 2. Draw the Color Image source-in (ONLY keep color where mask exists)
      compCtx.globalCompositeOperation = 'source-in';
      compCtx.drawImage(colorCanvas, 0, 0);

      // 3. Reset Composite
      compCtx.globalCompositeOperation = 'source-over';

      // 4. Draw result onto Main Canvas (on top of Gray)
      ctx.drawImage(compCanvas, 0, 0);
    };

    // Start Loop
    animationRef.current = requestAnimationFrame(persistentMaskLoop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };

  }, [board, domains, isLoading, loadedImages, pixelSize]);

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
        style={{ imageRendering: "pixelated" }} // Crisp pixels
      />

      {/* Cinematic Overlay - On Hover or Always? Let's make it clean. */}
      {/* VIGNETTE */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />

      {/* Enhanced Progress Overlay */}
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

            {/* Pixel Bar */}
            <div className="w-64 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 via-orange-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Future Blink Indicator */}
          <div className="flex flex-col items-end">
            <div className={`px-2 py-0.5 rounded border border-purple-500/30 bg-purple-500/10 backdrop-blur text-[10px] font-mono text-purple-300 transition-opacity duration-300 ${debugPhase === 'blinking' ? 'opacity-100' : 'opacity-0'}`}>
              FUTURE GLIMPSE ACTIVE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

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

  // Aspect Ratio "Cover" Logic
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

  // Clip to region
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  ctx.drawImage(image, x + drawX, y + drawY, drawWidth, drawHeight);

  if (grayscale) {
    // Apply grayscale filter on top? 
    // Context filter property is easiest but sometimes slow.
    // Or manual pixel manip.
    // Let's use 'saturation' composite for older browsers or filter for modern.
    // Standard approach: get data and desaturate.
    // Optimized: draw with filter.
    ctx.globalCompositeOperation = "saturation";
    ctx.fillStyle = "hsl(0,0%,50%)";
    ctx.fillRect(x, y, width, height);
    ctx.globalCompositeOperation = "source-over";

    // Darken gray layer slightly for drama
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(x, y, width, height);
  }

  ctx.restore();
}

function drawPlaceholder(ctx: CanvasRenderingContext2D, item: any, color: string, text: string, grayscale: boolean) {
  ctx.fillStyle = grayscale ? '#222' : color;
  ctx.fillRect(item.x, item.y, item.width, item.height);

  // Grid pattern
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.beginPath();
  ctx.moveTo(item.x, item.y);
  ctx.lineTo(item.x + item.width, item.y + item.height);
  ctx.stroke();
}

function calculateLayout(type: string, domains: Domain[], w: number, h: number) {
  // Reuse existing layout logic simplified or just return array
  const domainCount = domains.length;
  const layout: Array<{ domainId: string; x: number; y: number; width: number; height: number }> = [];

  if (type === "weekly" || true) { // Force clean layout for now
    if (domainCount === 4) {
      // 2x2 Grid is usually more aesthetic than strips for a "Picture" look
      // User asked for "Vision Board" - usually a collage.
      const halfW = w / 2;
      const halfH = h / 2;
      layout.push({ domainId: domains[0].id, x: 0, y: 0, width: halfW, height: halfH });
      layout.push({ domainId: domains[1].id, x: halfW, y: 0, width: halfW, height: halfH });
      layout.push({ domainId: domains[2].id, x: 0, y: halfH, width: halfW, height: halfH });
      layout.push({ domainId: domains[3].id, x: halfW, y: halfH, width: halfW, height: halfH });
    } else {
      // Fallback Vertical Strips
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
  for (let x = 0; x <= w; x += size * 2) { ctx.moveTo(x, 0); ctx.lineTo(x, h); } // Less dense grid
  for (let y = 0; y <= h; y += size * 2) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
  ctx.stroke();
}
