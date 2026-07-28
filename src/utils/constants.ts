import { PaperSize, AppSettings } from '../types';

export const PAPER_DIMENSIONS_MM: Record<Exclude<PaperSize, 'Custom'>, { width: number; height: number }> = {
  A3: { width: 297, height: 420 },
  A4: { width: 210, height: 297 },
  A5: { width: 148, height: 210 },
  A6: { width: 105, height: 148 },
};

export const PHOTO_PRESET_MM: Record<string, { width: number; height: number; nameFa: string; nameEn: string }> = {
  A4: { width: 210, height: 297, nameFa: 'کاغذ A4', nameEn: 'A4 Size' },
  A5: { width: 148, height: 210, nameFa: 'کاغذ A5', nameEn: 'A5 Size' },
  A6: { width: 105, height: 148, nameFa: 'کاغذ A6', nameEn: 'A6 Size' },
  '10x15': { width: 100, height: 150, nameFa: '۱۰ در ۱۵ سانتی‌متر (4x6 in)', nameEn: '10x15 cm (4x6 in)' },
  '13x18': { width: 130, height: 180, nameFa: '۱۳ در ۱۸ سانتی‌متر (5x7 in)', nameEn: '13x18 cm (5x7 in)' },
  '9x13': { width: 90, height: 130, nameFa: '۹ در ۱۳ سانتی‌متر (3.5x5 in)', nameEn: '9x13 cm (3.5x5 in)' },
  '3.5x5': { width: 89, height: 127, nameFa: '۳.۵ در ۵ اینچ', nameEn: '3.5x5 inch' },
  custom: { width: 100, height: 150, nameFa: 'سفارشی', nameEn: 'Custom Size' },
};

export function getPaperDimensions(settings: AppSettings): { widthMM: number; heightMM: number } {
  let w = 210;
  let h = 297;

  if (settings.paperSize === 'Custom') {
    w = settings.customPaperWidthMM || 210;
    h = settings.customPaperHeightMM || 297;
  } else {
    const dim = PAPER_DIMENSIONS_MM[settings.paperSize];
    w = dim.width;
    h = dim.height;
  }

  // Adjust for orientation
  if (settings.orientation === 'landscape') {
    return { widthMM: Math.max(w, h), heightMM: Math.min(w, h) };
  } else {
    return { widthMM: Math.min(w, h), heightMM: Math.max(w, h) };
  }
}

/**
 * Calculates optimal grid rows and cols based on preset or custom settings
 */
export function calculateGridDimensions(settings: AppSettings): { cols: number; rows: number } {
  const paper = getPaperDimensions(settings);
  const paperW = paper.widthMM;
  const paperH = paper.heightMM;

  switch (settings.layoutPreset) {
    case '4_A5_ON_A3':
      return settings.orientation === 'landscape' ? { cols: 2, rows: 2 } : { cols: 2, rows: 2 };
    case '2_A4_ON_A3':
      return settings.orientation === 'landscape' ? { cols: 2, rows: 1 } : { cols: 1, rows: 2 };
    case '8_A6_ON_A3':
      return settings.orientation === 'landscape' ? { cols: 4, rows: 2 } : { cols: 2, rows: 4 };
    case '2_A5_ON_A4':
      return settings.orientation === 'landscape' ? { cols: 2, rows: 1 } : { cols: 1, rows: 2 };
    case '4_A6_ON_A4':
      return { cols: 2, rows: 2 };
    case '9_3.5x5_ON_A4':
      return { cols: 3, rows: 3 };
    case 'CUSTOM_GRID':
      return {
        cols: Math.max(1, settings.gridCols),
        rows: Math.max(1, settings.gridRows),
      };
    case 'AUTO':
    default: {
      // Auto compute how many slots fit on paper based on target photo size
      let photoW = 100;
      let photoH = 150;
      
      if (settings.targetPhotoPreset === 'custom') {
        photoW = settings.customPhotoWidthMM || 100;
        photoH = settings.customPhotoHeightMM || 150;
      } else if (PHOTO_PRESET_MM[settings.targetPhotoPreset]) {
        photoW = PHOTO_PRESET_MM[settings.targetPhotoPreset].width;
        photoH = PHOTO_PRESET_MM[settings.targetPhotoPreset].height;
      }

      const availableW = paperW - 2 * settings.marginMM;
      const availableH = paperH - 2 * settings.marginMM;

      // Try orientation 1 (normal)
      const cols1 = Math.max(1, Math.floor((availableW + settings.gapMM) / (photoW + settings.gapMM)));
      const rows1 = Math.max(1, Math.floor((availableH + settings.gapMM) / (photoH + settings.gapMM)));
      
      // Try orientation 2 (rotated photo 90 deg)
      const cols2 = Math.max(1, Math.floor((availableW + settings.gapMM) / (photoH + settings.gapMM)));
      const rows2 = Math.max(1, Math.floor((availableH + settings.gapMM) / (photoW + settings.gapMM)));

      if (cols2 * rows2 > cols1 * rows1) {
        return { cols: cols2, rows: rows2 };
      }
      return { cols: cols1, rows: rows1 };
    }
  }
}
