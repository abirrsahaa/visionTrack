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
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Better canvas dimensions - higher resolution for better quality
  const canvasWidth = 1920;
  const canvasHeight = 1080;
  const gridCols = Math.floor(canvasWidth / pixelSize);
  const gridRows = Math.floor(canvasHeight / pixelSize);

  // Load all domain images
  useEffect(() => {
    const loadAllImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      const loadPromises: Promise<void>[] = [];

      domains.forEach((domain) => {
        domain.images.forEach((img, idx) => {
          const loadPromise = new Promise<void>((resolve, reject) => {
            const image = new window.Image();
            image.crossOrigin = "anonymous";
            image.onload = () => {
              imageMap.set(`${domain.id}_${idx}`, image);
              resolve();
            };
            image.onerror = () => {
              console.warn(`Failed to load image for ${domain.name}`);
              resolve(); // Continue even if image fails
            };
            image.src = img.imageUrl;
          });
          loadPromises.push(loadPromise);
        });
      });

      await Promise.all(loadPromises);
      setLoadedImages(imageMap);
      setIsLoading(false);
    };

    if (domains.length > 0) {
      loadAllImages();
    }
  }, [domains]);

  // Render pixelated board with progressive colorization
  useEffect(() => {
    if (!canvasRef.current || isLoading || loadedImages.size === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear canvas with subtle gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
    gradient.addColorStop(0, "#f8f9fa");
    gradient.addColorStop(1, "#e9ecef");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Calculate layout based on board type
    const layout = calculateLayout(board.boardType, domains, canvasWidth, canvasHeight);

    // Calculate completion percentages per domain
    const totalPixelsPerDomain = board.totalPixels / domains.length;
    const domainCompletions = new Map<string, number>();
    
    board.layoutMetadata.domains.forEach((domainData) => {
      const completionRate = Math.min(
        domainData.pixels.length / totalPixelsPerDomain,
        1
      );
      domainCompletions.set(domainData.domainId, completionRate);
    });

    // Draw all domain images with progressive colorization
    layout.forEach((item, index) => {
      const domain = domains.find((d) => d.id === item.domainId);
      if (!domain || domain.images.length === 0) return;

      const completionRate = domainCompletions.get(domain.id) || 0;

      // For weekly boards, use single image per domain (fits strip better)
      if (board.boardType === "weekly" || domain.images.length === 1) {
        const key = `${domain.id}_0`;
        const domainImage = loadedImages.get(key);
        if (domainImage) {
          drawProgressivelyColoredImage(
            ctx,
            domainImage,
            item.x,
            item.y,
            item.width,
            item.height,
            completionRate,
            pixelSize,
            true // use cover for better fitting
          );
        } else {
          // Fallback placeholder with domain color
          const gradient = ctx.createLinearGradient(item.x, item.y, item.x + item.width, item.y + item.height);
          gradient.addColorStop(0, domain.colorHex + "30");
          gradient.addColorStop(1, domain.colorHex + "10");
          ctx.fillStyle = gradient;
          ctx.fillRect(item.x, item.y, item.width, item.height);
          
          // Add domain name text
          ctx.save();
          ctx.fillStyle = domain.colorHex + "80";
          ctx.font = `bold ${item.height / 8}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            domain.name,
            item.x + item.width / 2,
            item.y + item.height / 2
          );
          ctx.restore();
        }
      } else {
        // For monthly/annual: Handle multiple images per domain
        const imageCount = Math.min(domain.images.length, 4);
        const subCols = Math.ceil(Math.sqrt(imageCount));
        const subRows = Math.ceil(imageCount / subCols);
        const subWidth = item.width / subCols;
        const subHeight = item.height / subRows;

        domain.images.slice(0, imageCount).forEach((img, imgIdx) => {
          const subCol = imgIdx % subCols;
          const subRow = Math.floor(imgIdx / subCols);
          const subX = item.x + subCol * subWidth;
          const subY = item.y + subRow * subHeight;

          const key = `${domain.id}_${img.sortOrder - 1}`;
          const domainImage = loadedImages.get(key);
          if (domainImage) {
            drawProgressivelyColoredImage(
              ctx,
              domainImage,
              subX,
              subY,
              subWidth,
              subHeight,
              completionRate,
              pixelSize,
              true
            );
          }
        });
      }
    });

    // Draw subtle pixelated grid overlay
    drawPixelatedGrid(ctx, gridCols, gridRows, pixelSize, canvasWidth, canvasHeight);
  }, [board, domains, isLoading, loadedImages, pixelSize, canvasWidth, canvasHeight, gridCols, gridRows]);

  const completionPercentage = board.totalPixels > 0
    ? Math.round((board.coloredPixels / board.totalPixels) * 100)
    : 0;

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden shadow-lg border border-gray-200">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-10">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading domain images...</p>
          </div>
        </div>
      ) : null}
      
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain"
        style={{ imageRendering: "high-quality" as any }}
      />
      
      {/* Enhanced Progress Overlay */}
      <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md px-5 py-3 rounded-xl shadow-xl border border-gray-200/50">
        <div className="flex items-center justify-between gap-4 mb-2">
          <p className="text-sm font-semibold text-gray-900">Overall Progress</p>
          <span className="text-lg font-bold text-gray-900">{completionPercentage}%</span>
        </div>
        <div className="w-64 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {board.coloredPixels.toLocaleString()} / {board.totalPixels.toLocaleString()} pixels
        </p>
      </div>

      {/* Enhanced Domain Labels Overlay */}
      {domains.length > 0 && (
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          {domains.map((domain) => {
            const domainData = board.layoutMetadata.domains.find((d) => d.domainId === domain.id);
            const domainCompletion = domainData
              ? domainData.pixels.length / (board.totalPixels / domains.length)
              : 0;
            const domainPercentage = Math.round(domainCompletion * 100);

            return (
              <div
                key={domain.id}
                className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-gray-200/50 min-w-[160px] transition-all hover:shadow-xl hover:scale-105"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm border-2 border-white"
                    style={{ backgroundColor: domain.colorHex }}
                  />
                  <p className="font-semibold text-gray-900 text-sm">{domain.name}</p>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${domainPercentage}%`,
                      backgroundColor: domain.colorHex,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1.5 font-medium">{domainPercentage}% colored</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Draw image with progressive colorization (X% colored, rest grayscale)
// Improved to handle aspect ratio and fitting better
function drawProgressivelyColoredImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  completionRate: number, // 0.0 to 1.0
  pixelSize: number,
  useCover: boolean = false // Use cover mode for better image fitting
) {
  ctx.save();

  // Create a temporary canvas for processing
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) {
    ctx.restore();
    return;
  }

  // Draw image with proper aspect ratio (cover mode)
  if (useCover) {
    const imgAspect = image.width / image.height;
    const rectAspect = width / height;
    
    let drawWidth = width;
    let drawHeight = height;
    let drawX = 0;
    let drawY = 0;

    if (imgAspect > rectAspect) {
      // Image is wider - fit to height, crop width
      drawHeight = height;
      drawWidth = height * imgAspect;
      drawX = (width - drawWidth) / 2;
    } else {
      // Image is taller - fit to width, crop height
      drawWidth = width;
      drawHeight = width / imgAspect;
      drawY = (height - drawHeight) / 2;
    }

    tempCtx.drawImage(image, drawX, drawY, drawWidth, drawHeight);
  } else {
    tempCtx.drawImage(image, 0, 0, width, height);
  }

  // Step 1: Get the full color image data
  const colorImageData = tempCtx.getImageData(0, 0, width, height);

  // Step 2: Create grayscale version
  const grayImageData = tempCtx.createImageData(width, height);
  const colorData = colorImageData.data;
  const grayData = grayImageData.data;

  for (let i = 0; i < colorData.length; i += 4) {
    const gray = Math.round(
      colorData[i] * 0.299 + colorData[i + 1] * 0.587 + colorData[i + 2] * 0.114
    );
    grayData[i] = gray; // R
    grayData[i + 1] = gray; // G
    grayData[i + 2] = gray; // B
    grayData[i + 3] = colorData[i + 3]; // A
  }

  // Step 3: Calculate grid for pixelated effect
  const gridCols = Math.floor(width / pixelSize);
  const gridRows = Math.floor(height / pixelSize);
  const totalGridPixels = gridCols * gridRows;
  const coloredPixels = Math.floor(totalGridPixels * completionRate);

  // Step 4: Create result image data (start with grayscale)
  const resultImageData = ctx.createImageData(width, height);
  const resultData = resultImageData.data;

  // Start with grayscale data
  for (let i = 0; i < grayData.length; i++) {
    resultData[i] = grayData[i];
  }

  // Step 5: Apply colored pixels progressively in grid pattern (top to bottom, left to right)
  let pixelsColored = 0;
  for (let gridY = 0; gridY < gridRows && pixelsColored < coloredPixels; gridY++) {
    for (let gridX = 0; gridX < gridCols && pixelsColored < coloredPixels; gridX++) {
      const pixelStartX = gridX * pixelSize;
      const pixelStartY = gridY * pixelSize;

      // Color all pixels in this grid cell
      for (let py = 0; py < pixelSize && pixelStartY + py < height; py++) {
        for (let px = 0; px < pixelSize && pixelStartX + px < width; px++) {
          const pixelX = pixelStartX + px;
          const pixelY = pixelStartY + py;
          const idx = (pixelY * width + pixelX) * 4;

          // Copy colored pixel data
          resultData[idx] = colorData[idx]; // R
          resultData[idx + 1] = colorData[idx + 1]; // G
          resultData[idx + 2] = colorData[idx + 2]; // B
          // Alpha stays the same
        }
      }

      pixelsColored++;
    }
  }

  // Step 6: Draw the result (grayscale + colored portion) on main canvas
  ctx.putImageData(resultImageData, x, y);

  ctx.restore();
}

// Calculate layout based on board type - improved spacing
function calculateLayout(
  boardType: string,
  domains: Domain[],
  width: number,
  height: number
): Array<{ domainId: string; x: number; y: number; width: number; height: number }> {
  const domainCount = domains.length;
  const layout: Array<{ domainId: string; x: number; y: number; width: number; height: number }> = [];

  if (boardType === "weekly") {
    // Weekly: Horizontal strips (vertical stacking) - NO gaps for seamless strips
    if (domainCount === 4) {
      const stripHeight = height / 4;
      domains.forEach((domain, index) => {
        layout.push({
          domainId: domain.id,
          x: 0,
          y: index * stripHeight,
          width: width,
          height: stripHeight,
        });
      });
    } else if (domainCount === 3) {
      const stripHeight = height / 3;
      domains.forEach((domain, index) => {
        layout.push({
          domainId: domain.id,
          x: 0,
          y: index * stripHeight,
          width: width,
          height: stripHeight,
        });
      });
    }
  } else if (boardType === "monthly") {
    // Monthly: Diagonal mosaic with slight gaps
    if (domainCount === 4) {
      const gap = width * 0.02; // 2% gap
      layout.push({
        domainId: domains[0].id,
        x: 0,
        y: 0,
        width: width * 0.6,
        height: height * 0.6,
      }); // Top-left larger
      layout.push({
        domainId: domains[1].id,
        x: width * 0.4 - gap,
        y: 0,
        width: width * 0.6 + gap,
        height: height * 0.4,
      }); // Top-right
      layout.push({
        domainId: domains[2].id,
        x: 0,
        y: height * 0.4 - gap,
        width: width * 0.4,
        height: height * 0.6 + gap,
      }); // Bottom-left
      layout.push({
        domainId: domains[3].id,
        x: width * 0.4 - gap,
        y: height * 0.4 - gap,
        width: width * 0.6 + gap,
        height: height * 0.6 + gap,
      }); // Bottom-right larger
    }
  } else if (boardType === "quarterly" || boardType === "annual" || boardType === "main") {
    // Main/Annual: Clean 2x2 grid with subtle gaps
    if (domainCount === 4) {
      const gap = width * 0.01; // 1% subtle gap
      const cellWidth = (width - gap) / 2;
      const cellHeight = (height - gap) / 2;
      domains.forEach((domain, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        layout.push({
          domainId: domain.id,
          x: col * (cellWidth + gap),
          y: row * (cellHeight + gap),
          width: cellWidth,
          height: cellHeight,
        });
      });
    }
  } else {
    // Default: simple grid
    const cols = Math.ceil(Math.sqrt(domainCount));
    const rows = Math.ceil(domainCount / cols);
    const cellWidth = width / cols;
    const cellHeight = height / rows;
    domains.forEach((domain, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      layout.push({
        domainId: domain.id,
        x: col * cellWidth,
        y: row * cellHeight,
        width: cellWidth,
        height: cellHeight,
      });
    });
  }

  return layout;
}

// Draw pixelated grid overlay - more subtle
function drawPixelatedGrid(
  ctx: CanvasRenderingContext2D,
  gridCols: number,
  gridRows: number,
  pixelSize: number,
  width: number,
  height: number
) {
  ctx.save();
  ctx.strokeStyle = "rgba(0, 0, 0, 0.06)"; // More subtle
  ctx.lineWidth = 0.5;

  // Draw grid lines every 10 pixels for better visibility
  for (let x = 0; x <= gridCols; x += 10) {
    ctx.beginPath();
    ctx.moveTo(x * pixelSize, 0);
    ctx.lineTo(x * pixelSize, height);
    ctx.stroke();
  }

  for (let y = 0; y <= gridRows; y += 10) {
    ctx.beginPath();
    ctx.moveTo(0, y * pixelSize);
    ctx.lineTo(width, y * pixelSize);
    ctx.stroke();
  }

  ctx.restore();
}
