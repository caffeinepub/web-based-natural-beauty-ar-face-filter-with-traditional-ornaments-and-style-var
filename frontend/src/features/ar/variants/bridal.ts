import type { FaceLandmark } from '../hooks/useFaceLandmarks';

export class BridalVariant {
  private jasmineImg: HTMLImageElement | null = null;
  private templeJewelryImg: HTMLImageElement | null = null;
  private imagesLoaded = false;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.loadImages();
  }

  private async loadImages() {
    try {
      this.jasmineImg = await this.loadImage('/assets/generated/jasmine-flowers.dim_1024x1024.png');
      this.templeJewelryImg = await this.loadImage('/assets/generated/temple-jewelry-pack.dim_1024x1024.png');
      this.imagesLoaded = true;
    } catch (error) {
      console.error('Failed to load bridal images:', error);
    }
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  apply(landmarks: FaceLandmark[], width: number, height: number) {
    if (!this.imagesLoaded) return;

    if (this.jasmineImg) {
      const leftTemple = landmarks[234];
      const x = leftTemple.x * width - width * 0.08;
      const y = leftTemple.y * height - height * 0.05;
      const size = width * 0.15;

      this.ctx.save();
      this.ctx.globalAlpha = 0.9;
      this.ctx.drawImage(this.jasmineImg, x, y, size, size);
      this.ctx.restore();
    }

    if (this.templeJewelryImg) {
      const forehead = landmarks[10];
      const x = forehead.x * width;
      const y = forehead.y * height - height * 0.12;
      const size = width * 0.2;

      this.ctx.save();
      this.ctx.globalAlpha = 0.85;
      this.ctx.drawImage(
        this.templeJewelryImg,
        x - size / 2,
        y - size / 2,
        size,
        size
      );
      this.ctx.restore();
    }
  }
}
