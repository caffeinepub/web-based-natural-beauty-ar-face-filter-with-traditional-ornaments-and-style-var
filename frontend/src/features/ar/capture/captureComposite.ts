import type { VariantType } from '../variants/types';

export function captureComposite(canvas: HTMLCanvasElement, variant: VariantType) {
  try {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error('Failed to create image blob');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      link.download = `beauty-filter-${variant}-${timestamp}.png`;
      link.href = url;
      link.click();

      setTimeout(() => URL.revokeObjectURL(url), 100);
    }, 'image/png');
  } catch (error) {
    console.error('Failed to capture image:', error);
  }
}
