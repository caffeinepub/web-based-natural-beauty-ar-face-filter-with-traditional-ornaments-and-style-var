import type { FaceLandmark } from '../hooks/useFaceLandmarks';

interface ShimmerParticle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  angle: number;
  life: number;
}

export class FestivalVariant {
  private particles: ShimmerParticle[] = [];
  private bindiImg: HTMLImageElement | null = null;
  private diyaGlowImg: HTMLImageElement | null = null;
  private shimmerImg: HTMLImageElement | null = null;
  private imagesLoaded = false;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.loadImages();
  }

  private async loadImages() {
    try {
      this.bindiImg = await this.loadImage('/assets/generated/bindi.dim_256x256.png');
      this.diyaGlowImg = await this.loadImage('/assets/generated/diya-glow.dim_512x512.png');
      this.shimmerImg = await this.loadImage('/assets/generated/golden-shimmer-sprites.dim_1024x1024.png');
      this.imagesLoaded = true;
    } catch (error) {
      console.error('Failed to load festival images:', error);
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

    if (this.bindiImg) {
      const forehead = landmarks[9];
      const x = forehead.x * width;
      const y = forehead.y * height;
      const size = width * 0.015;

      this.ctx.save();
      this.ctx.globalAlpha = 0.95;
      this.ctx.drawImage(this.bindiImg, x - size / 2, y - size / 2, size, size);
      this.ctx.restore();
    }

    if (this.diyaGlowImg) {
      const faceCenter = landmarks[1];
      const x = faceCenter.x * width;
      const y = faceCenter.y * height;
      const size = width * 0.4;

      this.ctx.save();
      this.ctx.globalAlpha = 0.2;
      this.ctx.globalCompositeOperation = 'screen';
      this.ctx.drawImage(this.diyaGlowImg, x - size / 2, y - size / 2, size, size);
      this.ctx.restore();
    }

    const faceCenter = landmarks[1];
    const centerX = faceCenter.x * width;
    const centerY = faceCenter.y * height;

    if (Math.random() < 0.2) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * width * 0.18;
      this.particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.8 + 0.3,
        angle: Math.random() * Math.PI * 2,
        life: 1,
      });
    }

    this.particles = this.particles.filter((p) => p.life > 0);

    this.particles.forEach((particle) => {
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed - 0.3;
      particle.life -= 0.01;
      particle.alpha = particle.life * 0.7;

      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;

      const gradient = this.ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 2
      );
      gradient.addColorStop(0, 'rgba(255, 215, 0, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 200, 50, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 180, 0, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }
}
