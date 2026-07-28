import jsPDF from 'jspdf';
import JSZip from 'jszip';
import { AppSettings, PrintPage, UploadedImage, PhotoSlot } from '../types';
import { getPaperDimensions, calculateGridDimensions } from './constants';

// Helper to convert mm to pixels at a given DPI (Default 300 DPI for high print quality)
export function mmToPixels(mm: number, dpi = 300): number {
  return Math.round((mm * dpi) / 25.4);
}

// Load an HTMLImageElement asynchronously from dataUrl
export function loadImageAsync(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Renders a full print page onto an offscreen HTML Canvas at specified DPI
 */
export async function renderPageToCanvas(
  page: PrintPage,
  settings: AppSettings,
  uploadedImages: UploadedImage[],
  dpi = 300
): Promise<HTMLCanvasElement> {
  const paper = getPaperDimensions(settings);
  const canvasWidth = mmToPixels(paper.widthMM, dpi);
  const canvasHeight = mmToPixels(paper.heightMM, dpi);

  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context could not be created');
  }

  // High quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill page background (white)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Pre-load all required image elements
  const imageMap = new Map<string, HTMLImageElement>();
  for (const imgObj of uploadedImages) {
    try {
      const imgEl = await loadImageAsync(imgObj.dataUrl);
      imageMap.set(imgObj.id, imgEl);
    } catch (e) {
      console.warn('Failed to load image for rendering', imgObj.id, e);
    }
  }

  const { cols, rows } = calculateGridDimensions(settings);
  const marginPx = mmToPixels(settings.marginMM, dpi);
  const gapPx = mmToPixels(settings.gapMM, dpi);

  const availableWidthPx = canvasWidth - 2 * marginPx - (cols - 1) * gapPx;
  const availableHeightPx = canvasHeight - 2 * marginPx - (rows - 1) * gapPx;

  const slotWidthPx = Math.max(10, availableWidthPx / cols);
  const slotHeightPx = Math.max(10, availableHeightPx / rows);

  // Safe margin inset (e.g., 3mm)
  const safeMarginPx = mmToPixels(settings.safeMarginMM || 3, dpi);

  // Draw each slot
  page.slots.forEach((slot, index) => {
    const colIndex = index % cols;
    const rowIndex = Math.floor(index / cols);

    if (rowIndex >= rows) return; // ignore extra slots

    const slotX = marginPx + colIndex * (slotWidthPx + gapPx);
    const slotY = marginPx + rowIndex * (slotHeightPx + gapPx);

    ctx.save();

    // Clip to slot rectangle
    ctx.beginPath();
    ctx.rect(slotX, slotY, slotWidthPx, slotHeightPx);
    ctx.clip();

    // Fill slot background color
    ctx.fillStyle = slot.bgColor || settings.defaultBgColor || '#ffffff';
    ctx.fillRect(slotX, slotY, slotWidthPx, slotHeightPx);

    // Draw image if assigned
    if (slot.imageId && imageMap.has(slot.imageId)) {
      const imgEl = imageMap.get(slot.imageId)!;
      const rotation = slot.rotation || 0;
      const zoom = slot.zoom || 1.0;
      const offsetX = slot.offsetX || 0;
      const offsetY = slot.offsetY || 0;
      const fitMode = slot.fitMode || settings.defaultFitMode || 'contain';

      // Effective image size based on rotation (0, 90, 180, 270)
      const isRotated90 = rotation === 90 || rotation === 270;
      const effectiveImgW = isRotated90 ? imgEl.height : imgEl.width;
      const effectiveImgH = isRotated90 ? imgEl.width : imgEl.height;

      // Scale factor to preserve aspect ratio without stretching!
      let scale = 1.0;
      if (fitMode === 'cover') {
        scale = Math.max(slotWidthPx / effectiveImgW, slotHeightPx / effectiveImgH) * zoom;
      } else {
        // contain
        scale = Math.min(slotWidthPx / effectiveImgW, slotHeightPx / effectiveImgH) * zoom;
      }

      const drawW = imgEl.width * scale;
      const drawH = imgEl.height * scale;

      // Center point inside slot with offset shift
      const centerX = slotX + slotWidthPx / 2 + (offsetX / 100) * slotWidthPx;
      const centerY = slotY + slotHeightPx / 2 + (offsetY / 100) * slotHeightPx;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(imgEl, -drawW / 2, -drawH / 2, drawW, drawH);
      ctx.restore();
    } else {
      // Empty slot subtle border outline inside canvas
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = Math.max(1, mmToPixels(0.3, dpi));
      ctx.setLineDash([mmToPixels(2, dpi), mmToPixels(2, dpi)]);
      ctx.strokeRect(slotX + 1, slotY + 1, slotWidthPx - 2, slotHeightPx - 2);
      ctx.setLineDash([]);
    }

    ctx.restore();

    // Draw Safe Margin Line if enabled
    if (settings.showSafeMargin) {
      ctx.save();
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)'; // Green dashed line
      ctx.lineWidth = Math.max(1, mmToPixels(0.2, dpi));
      ctx.setLineDash([mmToPixels(1.5, dpi), mmToPixels(1.5, dpi)]);
      ctx.strokeRect(
        slotX + safeMarginPx,
        slotY + safeMarginPx,
        slotWidthPx - 2 * safeMarginPx,
        slotHeightPx - 2 * safeMarginPx
      );
      ctx.restore();
    }

    // Draw Crop Marks (Cut Lines) around each slot corner
    if (settings.showCropMarks) {
      ctx.save();
      ctx.strokeStyle = '#0f172a'; // Dark tick line
      ctx.lineWidth = Math.max(1, mmToPixels(0.25, dpi));
      const markLength = mmToPixels(4, dpi); // 4mm crop tick
      const markGap = mmToPixels(1, dpi);   // 1mm gap from corner

      // Top-Left corner
      // Horizontal mark
      ctx.beginPath();
      ctx.moveTo(slotX - markLength - markGap, slotY);
      ctx.lineTo(slotX - markGap, slotY);
      ctx.stroke();
      // Vertical mark
      ctx.beginPath();
      ctx.moveTo(slotX, slotY - markLength - markGap);
      ctx.lineTo(slotX, slotY - markGap);
      ctx.stroke();

      // Top-Right corner
      ctx.beginPath();
      ctx.moveTo(slotX + slotWidthPx + markGap, slotY);
      ctx.lineTo(slotX + slotWidthPx + markGap + markLength, slotY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(slotX + slotWidthPx, slotY - markLength - markGap);
      ctx.lineTo(slotX + slotWidthPx, slotY - markGap);
      ctx.stroke();

      // Bottom-Left corner
      ctx.beginPath();
      ctx.moveTo(slotX - markLength - markGap, slotY + slotHeightPx);
      ctx.lineTo(slotX - markGap, slotY + slotHeightPx);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(slotX, slotY + slotHeightPx + markGap);
      ctx.lineTo(slotX, slotY + slotHeightPx + markGap + markLength);
      ctx.stroke();

      // Bottom-Right corner
      ctx.beginPath();
      ctx.moveTo(slotX + slotWidthPx + markGap, slotY + slotHeightPx);
      ctx.lineTo(slotX + slotWidthPx + markGap + markLength, slotY + slotHeightPx);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(slotX + slotWidthPx, slotY + slotHeightPx + markGap);
      ctx.lineTo(slotX + slotWidthPx, slotY + slotHeightPx + markGap + markLength);
      ctx.stroke();

      ctx.restore();
    }
  });

  return canvas;
}

/**
 * Export a single page as high-res PNG download
 */
export async function exportCurrentPageToPNG(
  page: PrintPage,
  settings: AppSettings,
  uploadedImages: UploadedImage[],
  fileName = 'PrintSheet_Page.png',
  dpi = 300
): Promise<void> {
  const canvas = await renderPageToCanvas(page, settings, uploadedImages, dpi);
  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  link.click();
}

/**
 * Export a single page as PNG / JPEG blob or data URL
 */
export async function exportPageToDataUrl(
  page: PrintPage,
  settings: AppSettings,
  uploadedImages: UploadedImage[],
  mimeType: 'image/png' | 'image/jpeg' = 'image/png',
  dpi = 300
): Promise<string> {
  const canvas = await renderPageToCanvas(page, settings, uploadedImages, dpi);
  return canvas.toDataURL(mimeType, mimeType === 'image/jpeg' ? 0.95 : undefined);
}

/**
 * Export all pages as a multi-page PDF using jsPDF
 */
export async function exportAllPagesToPDF(
  pages: PrintPage[],
  settings: AppSettings,
  uploadedImages: UploadedImage[],
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const paper = getPaperDimensions(settings);
  const pdfOrientation = paper.widthMM > paper.heightMM ? 'landscape' : 'portrait';

  // Initialize jsPDF with exact paper dimensions in MM
  const pdf = new jsPDF({
    orientation: pdfOrientation,
    unit: 'mm',
    format: [paper.widthMM, paper.heightMM],
  });

  for (let i = 0; i < pages.length; i++) {
    if (onProgress) {
      onProgress(i + 1, pages.length);
    }

    if (i > 0) {
      pdf.addPage([paper.widthMM, paper.heightMM], pdfOrientation);
    }

    // Render page at 300 DPI
    const canvas = await renderPageToCanvas(pages[i], settings, uploadedImages, 300);
    const imgDataUrl = canvas.toDataURL('image/jpeg', 0.95);

    pdf.addImage(imgDataUrl, 'JPEG', 0, 0, paper.widthMM, paper.heightMM, undefined, 'FAST');
  }

  return pdf.output('blob');
}

/**
 * Export all pages in a ZIP archive using JSZip
 */
export async function exportAllPagesToZIP(
  pages: PrintPage[],
  settings: AppSettings,
  uploadedImages: UploadedImage[],
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('PrintSheets');

  for (let i = 0; i < pages.length; i++) {
    if (onProgress) {
      onProgress(i + 1, pages.length);
    }

    const canvas = await renderPageToCanvas(pages[i], settings, uploadedImages, 300);
    const dataUrl = canvas.toDataURL('image/png');
    // Remove base64 header
    const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

    const fileName = `Sheet_${(i + 1).toString().padStart(2, '0')}_${settings.paperSize}_${settings.orientation}.png`;
    folder?.file(fileName, base64Data, { base64: true });
  }

  return zip.generateAsync({ type: 'blob' });
}

/**
 * Utility to sample average border edge color of an image (for auto background matching)
 */
export function sampleImageEdgeColor(dataUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 50;
      canvas.height = 50;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve('#ffffff');
      }
      ctx.drawImage(img, 0, 0, 50, 50);
      const imgData = ctx.getImageData(0, 0, 50, 50).data;

      let r = 0, g = 0, b = 0, count = 0;
      // Sample top and bottom edge pixels
      for (let x = 0; x < 50; x++) {
        // Top edge
        let i = (0 * 50 + x) * 4;
        r += imgData[i]; g += imgData[i + 1]; b += imgData[i + 2]; count++;
        // Bottom edge
        i = (49 * 50 + x) * 4;
        r += imgData[i]; g += imgData[i + 1]; b += imgData[i + 2]; count++;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
      resolve(hex);
    };
    img.onerror = () => resolve('#ffffff');
    img.src = dataUrl;
  });
}
