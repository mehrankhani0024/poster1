import React, { useState, useEffect } from 'react';
import { AppSettings, PrintPage, PhotoSlot, UploadedImage } from './types';
import { calculateGridDimensions, getPaperDimensions } from './utils/constants';
import { exportAllPagesToPDF, exportAllPagesToZIP, exportCurrentPageToPNG, renderPageToCanvas, sampleImageEdgeColor } from './utils/exportUtils';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { InteractiveCanvas } from './components/InteractiveCanvas';
import { translations } from './translations';

export default function App() {
  // Application Settings State (Defaults: 0mm margin, 0mm gap, 'cover' fit mode)
  const [settings, setSettings] = useState<AppSettings>({
    paperSize: 'A3',
    customPaperWidthMM: 297,
    customPaperHeightMM: 420,
    orientation: 'landscape',
    layoutPreset: '4_A5_ON_A3',
    targetPhotoPreset: 'A5',
    customPhotoWidthMM: 148,
    customPhotoHeightMM: 210,
    gridCols: 2,
    gridRows: 2,
    gapMM: 0,
    marginMM: 0,
    showCropMarks: false,
    showSafeMargin: true,
    safeMarginMM: 3,
    showRulers: true,
    defaultFitMode: 'cover',
    defaultBgColor: '#ffffff',
    lang: 'fa',
  });

  // Uploaded Images
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  // Print Pages State
  const [pages, setPages] = useState<PrintPage[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  // UI State
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Generate initial page slots when settings or grid changes
  const createFreshPage = (pageNum: number): PrintPage => {
    const { cols, rows } = calculateGridDimensions(settings);
    const totalSlots = cols * rows;

    const slots: PhotoSlot[] = Array.from({ length: totalSlots }).map((_, idx) => ({
      id: `slot_${pageNum}_${idx}_${Date.now()}_${Math.random()}`,
      imageId: null,
      rotation: 0,
      zoom: 1.0,
      offsetX: 0,
      offsetY: 0,
      bgColor: settings.defaultBgColor || '#ffffff',
      fitMode: settings.defaultFitMode || 'cover',
    }));

    return {
      id: `page_${pageNum}_${Date.now()}`,
      pageNumber: pageNum,
      slots,
    };
  };

  // Re-calculate page slot structure whenever layout parameters change
  useEffect(() => {
    const { cols, rows } = calculateGridDimensions(settings);
    const totalSlots = cols * rows;

    setPages((prevPages) => {
      if (prevPages.length === 0) {
        return [createFreshPage(1)];
      }

      return prevPages.map((page) => {
        const existingSlots = page.slots;
        const newSlots: PhotoSlot[] = [];

        for (let i = 0; i < totalSlots; i++) {
          if (existingSlots[i]) {
            newSlots.push(existingSlots[i]);
          } else {
            newSlots.push({
              id: `slot_${page.pageNumber}_${i}_${Date.now()}_${Math.random()}`,
              imageId: null,
              rotation: 0,
              zoom: 1.0,
              offsetX: 0,
              offsetY: 0,
              bgColor: settings.defaultBgColor || '#ffffff',
              fitMode: settings.defaultFitMode || 'cover',
            });
          }
        }
        return { ...page, slots: newSlots };
      });
    });
  }, [
    settings.paperSize,
    settings.orientation,
    settings.layoutPreset,
    settings.gridCols,
    settings.gridRows,
    settings.targetPhotoPreset,
  ]);

  // Handle uploading photos (Batch / Drag-Drop / Single)
  const handleUploadPhotos = (fileList: FileList | File[]) => {
    const filesArray = Array.from(fileList).filter((f) => f.type.startsWith('image/'));

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (!dataUrl) return;

        const img = new Image();
        img.onload = async () => {
          // Auto edge color calculation for background match
          const edgeColor = await sampleImageEdgeColor(dataUrl);

          const newImg: UploadedImage = {
            id: `img_${Date.now()}_${Math.random()}`,
            name: file.name,
            dataUrl,
            width: img.width,
            height: img.height,
            aspectRatio: img.width / img.height,
            fileSize: file.size,
          };

          setUploadedImages((prev) => [...prev, newImg]);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  // Auto-Arrange 50+ photos across multiple print sheets
  const handleAutoArrangePhotos = () => {
    if (uploadedImages.length === 0) return;

    const { cols, rows } = calculateGridDimensions(settings);
    const slotsPerPage = cols * rows;
    const requiredPagesCount = Math.ceil(uploadedImages.length / slotsPerPage);

    const newPagesList: PrintPage[] = [];

    for (let p = 0; p < requiredPagesCount; p++) {
      const pageSlots: PhotoSlot[] = [];

      for (let s = 0; s < slotsPerPage; s++) {
        const imgIndex = p * slotsPerPage + s;
        const assignedImg = uploadedImages[imgIndex] || null;

        pageSlots.push({
          id: `slot_auto_${p}_${s}_${Date.now()}`,
          imageId: assignedImg ? assignedImg.id : null,
          rotation: 0,
          zoom: 1.0,
          offsetX: 0,
          offsetY: 0,
          bgColor: settings.defaultBgColor || '#ffffff',
          fitMode: settings.defaultFitMode || 'contain',
        });
      }

      newPagesList.push({
        id: `page_auto_${p + 1}_${Date.now()}`,
        pageNumber: p + 1,
        slots: pageSlots,
      });
    }

    setPages(newPagesList);
    setCurrentPageIndex(0);
  };

  // Clear all uploaded photos
  const handleClearAllPhotos = () => {
    setUploadedImages([]);
    setPages([createFreshPage(1)]);
    setSelectedSlotId(null);
  };

  // Assign photo to slot
  const handleAssignImageToSlot = (slotId: string, imageId: string) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        slots: p.slots.map((s) => (s.id === slotId ? { ...s, imageId } : s)),
      }))
    );
  };

  // Update specific slot properties (rotation, zoom, fitMode, bgColor, etc.)
  const handleUpdateSlot = (slotId: string, updated: Partial<PhotoSlot>) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        slots: p.slots.map((s) => (s.id === slotId ? { ...s, ...updated } : s)),
      }))
    );
  };

  // Get currently selected slot object
  const currentPage = pages[currentPageIndex] || pages[0];
  const selectedSlot =
    currentPage?.slots.find((s) => s.id === selectedSlotId) || null;

  // Duplicate current selected slot photo into next available slots
  const handleDuplicateSlotToNext = () => {
    if (!selectedSlot || !selectedSlot.imageId) return;

    setPages((prev) => {
      let foundSelected = false;
      return prev.map((page) => ({
        ...page,
        slots: page.slots.map((slot) => {
          if (slot.id === selectedSlot.id) {
            foundSelected = true;
            return slot;
          }
          if (foundSelected && !slot.imageId) {
            return {
              ...slot,
              imageId: selectedSlot.imageId,
              rotation: selectedSlot.rotation,
              zoom: selectedSlot.zoom,
              fitMode: selectedSlot.fitMode,
              bgColor: selectedSlot.bgColor,
            };
          }
          return slot;
        }),
      }));
    });
  };

  // Clear photo from current selected slot
  const handleClearSelectedSlot = () => {
    if (!selectedSlotId) return;
    handleUpdateSlot(selectedSlotId, { imageId: null });
  };

  // Add fresh page
  const handleAddPage = () => {
    setPages((prev) => [...prev, createFreshPage(prev.length + 1)]);
    setCurrentPageIndex(pages.length);
  };

  // Delete page
  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) return;
    const filtered = pages.filter((_, i) => i !== index);
    setPages(filtered);
    setCurrentPageIndex(Math.max(0, index - 1));
  };

  // Duplicate page
  const handleDuplicatePage = (index: number) => {
    const pageToCopy = pages[index];
    if (!pageToCopy) return;

    const copiedPage: PrintPage = {
      id: `page_dup_${Date.now()}`,
      pageNumber: pages.length + 1,
      slots: pageToCopy.slots.map((s) => ({
        ...s,
        id: `slot_dup_${Date.now()}_${Math.random()}`,
      })),
    };

    setPages((prev) => [...prev, copiedPage]);
    setCurrentPageIndex(pages.length);
  };

  // Trigger Direct Print
  const handleDirectPrint = () => {
    window.print();
  };

  // Export high-res single PNG image for current page
  const handleExportPng = async () => {
    setIsExportingPng(true);
    setExportNotice(translations[settings.lang].generatingPng);

    try {
      const pageToExport = pages[currentPageIndex] || pages[0];
      await exportCurrentPageToPNG(
        pageToExport,
        settings,
        uploadedImages,
        `PrintSheet_Page_${currentPageIndex + 1}_${settings.paperSize}.png`,
        300
      );
    } catch (e) {
      console.error('PNG export error', e);
    } finally {
      setIsExportingPng(false);
      setExportNotice(null);
    }
  };

  // Export high-res PDF
  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setExportNotice(translations[settings.lang].generatingPdf);

    try {
      const pdfBlob = await exportAllPagesToPDF(pages, settings, uploadedImages);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PrintSheets_${settings.paperSize}_300DPI.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('PDF generation error', e);
    } finally {
      setIsExportingPdf(false);
      setExportNotice(null);
    }
  };

  // Export high-res ZIP
  const handleExportZip = async () => {
    setIsExportingZip(true);
    setExportNotice(translations[settings.lang].generatingZip);

    try {
      const zipBlob = await exportAllPagesToZIP(pages, settings, uploadedImages);
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PrintSheets_Bundle_${settings.paperSize}.zip`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('ZIP generation error', e);
    } finally {
      setIsExportingZip(false);
      setExportNotice(null);
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-100 flex flex-col font-['Vazirmatn',sans-serif] ${
        settings.lang === 'fa' ? 'rtl' : 'ltr'
      }`}
      dir={settings.lang === 'fa' ? 'rtl' : 'ltr'}
    >
      {/* Header Bar */}
      <Header
        settings={settings}
        onUpdateSettings={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
        onDirectPrint={handleDirectPrint}
        onExportPdf={handleExportPdf}
        onExportPng={handleExportPng}
        onExportZip={handleExportZip}
        isExportingPdf={isExportingPdf}
        isExportingPng={isExportingPng}
        isExportingZip={isExportingZip}
        onToggleMobileSidebar={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
        photoCount={uploadedImages.length}
      />

      {/* Main App Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar Settings Drawer */}
        <Sidebar
          settings={settings}
          onUpdateSettings={(updated) => setSettings((prev) => ({ ...prev, ...updated }))}
          uploadedImages={uploadedImages}
          onUploadPhotos={handleUploadPhotos}
          onClearAllPhotos={handleClearAllPhotos}
          onAutoArrangePhotos={handleAutoArrangePhotos}
          selectedSlot={selectedSlot}
          onUpdateSelectedSlot={(updated) => {
            if (selectedSlotId) handleUpdateSlot(selectedSlotId, updated);
          }}
          onDuplicateSlotToNext={handleDuplicateSlotToNext}
          onClearSelectedSlot={handleClearSelectedSlot}
          isOpenMobile={isOpenMobileSidebar}
          onCloseMobile={() => setIsOpenMobileSidebar(false)}
        />

        {/* Interactive Print Sheet Preview Canvas */}
        <InteractiveCanvas
          settings={settings}
          pages={pages}
          currentPageIndex={currentPageIndex}
          onSelectPageIndex={setCurrentPageIndex}
          onAddPage={handleAddPage}
          onDeletePage={handleDeletePage}
          onDuplicatePage={handleDuplicatePage}
          uploadedImages={uploadedImages}
          selectedSlotId={selectedSlotId}
          onSelectSlot={(slot) => setSelectedSlotId(slot.id)}
          onAssignImageToSlot={handleAssignImageToSlot}
          onUpdateSlot={handleUpdateSlot}
          onExportPng={handleExportPng}
          isExportingPng={isExportingPng}
        />
      </div>

      {/* Progress Toast Banner */}
      {exportNotice && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-bounce">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          <span>{exportNotice}</span>
        </div>
      )}
    </div>
  );
}
