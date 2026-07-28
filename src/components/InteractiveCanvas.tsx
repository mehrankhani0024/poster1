import React, { useRef, useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  RotateCcw, 
  Maximize, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Trash2, 
  RotateCw, 
  Image as ImageIcon,
  Check,
  Sparkles,
  Sliders,
  Palette,
  Download,
  ZoomIn
} from 'lucide-react';
import { AppSettings, PrintPage, UploadedImage, PhotoSlot } from '../types';
import { getPaperDimensions, calculateGridDimensions } from '../utils/constants';
import { translations } from '../translations';

interface InteractiveCanvasProps {
  settings: AppSettings;
  pages: PrintPage[];
  currentPageIndex: number;
  onSelectPageIndex: (index: number) => void;
  onAddPage: () => void;
  onDeletePage: (index: number) => void;
  onDuplicatePage: (index: number) => void;
  uploadedImages: UploadedImage[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: PhotoSlot) => void;
  onAssignImageToSlot: (slotId: string, imageId: string) => void;
  onUpdateSlot: (slotId: string, updated: Partial<PhotoSlot>) => void;
  onExportPng?: () => void;
  isExportingPng?: boolean;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  settings,
  pages,
  currentPageIndex,
  onSelectPageIndex,
  onAddPage,
  onDeletePage,
  onDuplicatePage,
  uploadedImages,
  selectedSlotId,
  onSelectSlot,
  onAssignImageToSlot,
  onUpdateSlot,
  onExportPng,
  isExportingPng,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomScale, setZoomScale] = useState<number>(0.85);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [startPanPos, setStartPanPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState<number | null>(null);

  const t = translations[settings.lang];
  const currentPage = pages[currentPageIndex] || pages[0];
  const paperDim = getPaperDimensions(settings);
  const { cols, rows } = calculateGridDimensions(settings);

  // Map image ID to UploadedImage object for quick lookup
  const imageMap = new Map<string, UploadedImage>();
  uploadedImages.forEach((img) => imageMap.set(img.id, img));

  // Reset zoom & pan to fit container nicely on screen
  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const containerW = containerRef.current.clientWidth - 80;
    const containerH = containerRef.current.clientHeight - 120;

    const paperAspect = paperDim.widthMM / paperDim.heightMM;
    const containerAspect = containerW / containerH;

    let targetZoom = 0.85;
    if (paperAspect > containerAspect) {
      targetZoom = Math.min(1.5, containerW / (paperDim.widthMM * 2));
    } else {
      targetZoom = Math.min(1.5, containerH / (paperDim.heightMM * 2));
    }

    setZoomScale(Math.max(0.3, Math.min(2.0, targetZoom)));
    setPanOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    handleFitToScreen();
  }, [settings.paperSize, settings.orientation]);

  // Mouse wheel zoom over canvas or overall screen
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey || (e.target as HTMLElement).id === 'canvas-viewport-bg') {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      setZoomScale((prev) => Math.max(0.3, Math.min(2.5, prev + delta)));
    }
  };

  // Touch Pinch gesture zoom for mobile/touch screens
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDistance(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistance !== null) {
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const factor = newDist / touchDistance;
      setTouchDistance(newDist);

      if (selectedSlotId) {
        const activeSlot = currentPage.slots.find((s) => s.id === selectedSlotId);
        if (activeSlot) {
          const newZoom = Math.max(0.5, Math.min(5.0, (activeSlot.zoom || 1.0) * factor));
          onUpdateSlot(activeSlot.id, { zoom: newZoom });
        }
      } else {
        setZoomScale((prev) => Math.max(0.3, Math.min(2.5, prev * factor)));
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchDistance(null);
  };

  // Pan canvas drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && (e.target as HTMLElement).id === 'canvas-viewport-bg')) {
      setIsPanning(true);
      setStartPanPos({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPanPos.x,
      y: e.clientY - startPanPos.y,
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Calculate paper display size in pixels based on mm and scale
  const mmToPxRatio = 2.8 * zoomScale;
  const paperWidthPx = paperDim.widthMM * mmToPxRatio;
  const paperHeightPx = paperDim.heightMM * mmToPxRatio;

  // Grid inner metrics
  const marginPx = settings.marginMM * mmToPxRatio;
  const gapPx = settings.gapMM * mmToPxRatio;

  const availableWidthPx = paperWidthPx - 2 * marginPx - (cols - 1) * gapPx;
  const availableHeightPx = paperHeightPx - 2 * marginPx - (rows - 1) * gapPx;

  const slotWidthPx = Math.max(20, availableWidthPx / cols);
  const slotHeightPx = Math.max(20, availableHeightPx / rows);
  const safeMarginPx = (settings.safeMarginMM || 3) * mmToPxRatio;

  return (
    <div className="flex-1 flex flex-col bg-slate-200/70 relative overflow-hidden select-none">
      {/* Top Floating View Toolbar */}
      <div className="no-print absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-md flex items-center gap-2 text-slate-700 text-xs">
        <button
          onClick={() => setZoomScale((prev) => Math.max(0.3, prev - 0.1))}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
          title={t.zoomOut}
          id="btn-zoom-out"
        >
          <Minus className="w-4 h-4" />
        </button>

        <span className="font-bold min-w-[45px] text-center text-slate-800">
          {Math.round(zoomScale * 100)}%
        </span>

        <button
          onClick={() => setZoomScale((prev) => Math.min(2.5, prev + 0.1))}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600"
          title={t.zoomIn}
          id="btn-zoom-in"
        >
          <Plus className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-slate-300 mx-0.5" />

        <button
          onClick={handleFitToScreen}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-600 flex items-center gap-1"
          title={t.fitToScreen}
          id="btn-fit-screen"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        id="canvas-viewport-bg"
        className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing flex items-center justify-center p-8"
      >
        {/* Optional Millimeter Rulers */}
        {settings.showRulers && (
          <>
            {/* Top Ruler */}
            <div
              className="no-print absolute top-0 left-12 right-0 h-6 bg-slate-100 border-b border-slate-300 flex items-end overflow-hidden pointer-events-none z-20 opacity-80"
              style={{
                backgroundImage: 'linear-gradient(to right, #94a3b8 1px, transparent 1px)',
                backgroundSize: `${10 * mmToPxRatio}px 100%`,
              }}
            >
              <div className="text-[9px] text-slate-500 font-mono pl-1 pb-0.5">0 mm</div>
            </div>

            {/* Left Ruler */}
            <div
              className="no-print absolute top-6 left-0 bottom-12 w-6 bg-slate-100 border-r border-slate-300 flex flex-col pointer-events-none z-20 opacity-80"
              style={{
                backgroundImage: 'linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
                backgroundSize: `100% ${10 * mmToPxRatio}px`,
              }}
            >
              <div className="text-[9px] text-slate-500 font-mono pt-1 pl-0.5">0</div>
            </div>
          </>
        )}

        {/* Printable Sheet Canvas Wrapper */}
        <div
          className="transition-transform duration-75 ease-out relative shadow-2xl rounded-sm bg-white border border-slate-300 print:shadow-none print:border-none print:m-0"
          style={{
            width: `${paperWidthPx}px`,
            height: `${paperHeightPx}px`,
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
          }}
          id="active-print-sheet"
        >
          {/* Paper Dimension Watermark Label */}
          <div className="no-print absolute -top-6 right-0 text-[10px] font-bold text-slate-500">
            {settings.paperSize} ({paperDim.widthMM} × {paperDim.heightMM} mm)
          </div>

          {/* Render Slots Grid */}
          <div
            className="w-full h-full relative"
            style={{ padding: `${marginPx}px` }}
          >
            {currentPage &&
              currentPage.slots.map((slot, index) => {
                const colIndex = index % cols;
                const rowIndex = Math.floor(index / cols);

                if (rowIndex >= rows) return null; // Overflow slot protection

                const slotX = marginPx + colIndex * (slotWidthPx + gapPx);
                const slotY = marginPx + rowIndex * (slotHeightPx + gapPx);

                const isSelected = selectedSlotId === slot.id;
                const assignedImage = slot.imageId ? imageMap.get(slot.imageId) : null;

                return (
                  <div
                    key={slot.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectSlot(slot);
                    }}
                    onWheel={(e) => {
                      // Scroll mouse wheel directly over slot to adjust photo inner zoom!
                      e.stopPropagation();
                      const delta = e.deltaY > 0 ? -0.05 : 0.05;
                      const currentZoom = slot.zoom || 1.0;
                      onUpdateSlot(slot.id, { zoom: Math.max(0.5, Math.min(5.0, currentZoom + delta)) });
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const droppedImgId = e.dataTransfer.getData('text/plain');
                      if (droppedImgId) {
                        onAssignImageToSlot(slot.id, droppedImgId);
                      }
                    }}
                    style={{
                      position: 'absolute',
                      left: `${slotX}px`,
                      top: `${slotY}px`,
                      width: `${slotWidthPx}px`,
                      height: `${slotHeightPx}px`,
                      backgroundColor: slot.bgColor || settings.defaultBgColor || '#ffffff',
                    }}
                    className={`group cursor-pointer overflow-hidden border transition-all ${
                      isSelected
                        ? 'ring-4 ring-indigo-500/80 border-indigo-600 z-20'
                        : 'border-slate-300 hover:border-indigo-400 z-10'
                    }`}
                  >
                    {/* Safe Margin Boundary Line (3mm) */}
                    {settings.showSafeMargin && (
                      <div
                        className="absolute pointer-events-none border border-dashed border-emerald-500/60 z-20"
                        style={{
                          left: `${safeMarginPx}px`,
                          top: `${safeMarginPx}px`,
                          right: `${safeMarginPx}px`,
                          bottom: `${safeMarginPx}px`,
                        }}
                      />
                    )}

                    {/* Corner Crop Marks Visual Lines */}
                    {settings.showCropMarks && (
                      <>
                        <div className="absolute -top-2 -left-2 w-3 h-3 border-r border-b border-slate-900 pointer-events-none z-30" />
                        <div className="absolute -top-2 -right-2 w-3 h-3 border-l border-b border-slate-900 pointer-events-none z-30" />
                        <div className="absolute -bottom-2 -left-2 w-3 h-3 border-r border-t border-slate-900 pointer-events-none z-30" />
                        <div className="absolute -bottom-2 -right-2 w-3 h-3 border-l border-t border-slate-900 pointer-events-none z-30" />
                      </>
                    )}

                    {/* Image Rendering with Zero Aspect Distortion */}
                    {assignedImage ? (
                      <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                        <img
                          src={assignedImage.dataUrl}
                          alt={assignedImage.name}
                          style={{
                            maxWidth: 'none',
                            maxHeight: 'none',
                            width: slot.fitMode === 'cover' ? '100%' : 'auto',
                            height: slot.fitMode === 'cover' ? '100%' : 'auto',
                            objectFit: slot.fitMode === 'cover' ? 'cover' : 'contain',
                            transform: `rotate(${slot.rotation}deg) scale(${slot.zoom}) translate(${slot.offsetX}%, ${slot.offsetY}%)`,
                            transition: 'transform 0.15s ease-out',
                          }}
                          className="pointer-events-none select-none max-w-full max-h-full"
                        />

                        {/* Quick Slot Overlay Toolbar on Hover */}
                        <div className="no-print absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1 z-30">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newRot = ((slot.rotation + 90) % 360) as any;
                              onUpdateSlot(slot.id, { rotation: newRot });
                            }}
                            className="p-1.5 bg-white text-slate-800 rounded-lg shadow-sm hover:bg-slate-100 transition-transform hover:scale-105"
                            title={t.rotate90}
                          >
                            <RotateCw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const newFit = slot.fitMode === 'cover' ? 'contain' : 'cover';
                              onUpdateSlot(slot.id, { fitMode: newFit });
                            }}
                            className="p-1.5 bg-white text-slate-800 rounded-lg shadow-sm hover:bg-slate-100 transition-transform hover:scale-105 text-[10px] font-bold"
                            title="تغییر حالت پر کردن / جاگیری"
                          >
                            {slot.fitMode === 'cover' ? 'Cover' : 'Fit'}
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectSlot(slot);
                            }}
                            className="p-1.5 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-transform hover:scale-105"
                            title={t.settings}
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Empty Slot State */
                      <div className="w-full h-full flex flex-col items-center justify-center p-2 text-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                        <ImageIcon className="w-6 h-6 mb-1 opacity-60" />
                        <span className="text-[10px] font-semibold leading-tight max-w-[120px]">
                          {t.emptySlotText}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Bottom Multi-Page Navigation & PNG Export Bar */}
      <div className="no-print bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 sm:px-4 py-2 flex items-center justify-between gap-1.5 sm:gap-4 shrink-0 z-30 w-full overflow-x-auto no-scrollbar">
        {/* Page Switcher */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => onSelectPageIndex(Math.max(0, currentPageIndex - 1))}
            disabled={currentPageIndex === 0}
            className="p-1 sm:p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all shrink-0"
            id="btn-prev-page"
          >
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <span className="text-[11px] sm:text-xs font-bold text-slate-800 px-1 sm:px-2 min-w-[70px] sm:min-w-[100px] text-center whitespace-nowrap">
            {t.pageIndicator
              .replace('{current}', (currentPageIndex + 1).toString())
              .replace('{total}', pages.length.toString())}
          </span>

          <button
            onClick={() => onSelectPageIndex(Math.min(pages.length - 1, currentPageIndex + 1))}
            disabled={currentPageIndex >= pages.length - 1}
            className="p-1 sm:p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-all shrink-0"
            id="btn-next-page"
          >
            <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Page Thumbnails List */}
        <div className="hidden md:flex items-center gap-1.5 overflow-x-auto max-w-xs md:max-w-md py-0.5 shrink-0">
          {pages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => onSelectPageIndex(idx)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                currentPageIndex === idx
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Action Buttons: Download PNG, Duplicate, Delete, Add Page */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          {onExportPng && (
            <button
              onClick={onExportPng}
              disabled={isExportingPng}
              className="px-2.5 sm:px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-bold rounded-lg flex items-center gap-1 sm:gap-1.5 shadow-xs transition-all disabled:opacity-50 shrink-0"
              title={t.exportPng}
            >
              {isExportingPng ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">{t.exportPng}</span>
              <span className="sm:hidden">PNG</span>
            </button>
          )}

          <button
            onClick={() => onDuplicatePage(currentPageIndex)}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1 shrink-0"
            title={t.duplicatePage}
            id="btn-duplicate-page"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{t.duplicatePage}</span>
          </button>

          {pages.length > 1 && (
            <button
              onClick={() => onDeletePage(currentPageIndex)}
              className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold shrink-0"
              title={t.deletePage}
              id="btn-delete-page"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={onAddPage}
            className="px-2.5 sm:px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] sm:text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-all shrink-0"
            id="btn-add-page"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t.addPage}</span>
            <span className="sm:hidden">جدید</span>
          </button>
        </div>
      </div>
    </div>
  );
};
