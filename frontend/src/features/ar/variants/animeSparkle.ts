import type { FaceLandmark } from '../hooks/useFaceLandmarks';

interface AnimeParticle {
  x: number;
  y: number;
  size: number;
  type: 'heart' | 'star';
  alpha: number;
  speed: number;
  angle: number;
  life: number;
}

export class AnimeSparkleVariant {
  private particles: AnimeParticle[] = [];
  private heartsStarsImg: HTMLImageElement | null = null;
  private glitterTearsImg: HTMLImageElement | null = null;
  private imagesLoaded = false;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.loadImages();
  }

  private async loadImages() {
    try {
      this.heartsStarsImg = await this.loadImage('/assets/generated/anime-hearts-stars-sprites.dim_1024x1024.png');
      this.glitterTearsImg = await this.loadImage('/assets/generated/glitter-tears-pack.dim_1024x1024.png');
      this.imagesLoaded = true;
    } catch (error) {
      console.error('Failed to load anime images:', error);
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

    if (this.glitterTearsImg) {
      const leftEye = landmarks[159];
      const rightEye = landmarks[386];

      const leftX = leftEye.x * width;
      const leftY = leftEye.y * height + height * 0.03;
      const rightX = rightEye.x * width;
      const rightY = rightEye.y * height + height * 0.03;
      const size = width * 0.04;

      this.ctx.save();
      this.ctx.globalAlpha = 0.7;
      this.ctx.drawImage(this.glitterTearsImg, leftX - size / 2, leftY, size, size * 2);
      this.ctx.drawImage(this.glitterTearsImg, rightX - size / 2, rightY, size, size * 2);
      this.ctx.restore();
    }

    const faceCenter = landmarks[1];
    const centerX = faceCenter.x * width;
    const centerY = faceCenter.y * height;

    if (Math.random() < 0.15) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * width * 0.2;
      this.particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: Math.random() * 15 + 10,
        type: Math.random() > 0.5 ? 'heart' : 'star',
        alpha: 0.8,
        speed: Math.random() * 1 + 0.5,
        angle: Math.random() * Math.PI * 2,
        life: 1,
      });
    }

    this.particles = this.particles.filter((p) => p.life > 0);

    this.particles.forEach((particle) => {
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y -= particle.speed;
      particle.life -= 0.008;
      particle.alpha = particle.life * 0.8;

      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha;

      if (particle.type === 'heart') {
        this.ctx.fillStyle = 'rgba(255, 182, 193, 0.9)';
        this.ctx.beginPath();
        const x = particle.x;
        const y = particle.y;
        const size = particle.size;
        this.ctx.moveTo(x, y + size / 4);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y - size / 2, x, y - size);
        this.ctx.bezierCurveTo(x + size / 2, y - size / 2, x, y, x, y + size / 4);
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.9)';
        this.ctx.beginPath();
        const x = particle.x;
        const y = particle.y;
        const size = particle.size;
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? size : size / 2;
          const px = x + Math.cos(angle) * radius;
          const py = y + Math.sin(angle) * radius;
          if (i === 0) {
            this.ctx.moveTo(px, py);
          } else {
            this.ctx.lineTo(px, py);
          }
        }
        this.ctx.closePath();
        this.ctx.fill();
      }

      this.ctx.restore();
    });
  }
}
