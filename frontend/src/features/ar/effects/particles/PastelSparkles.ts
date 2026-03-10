import type { FaceLandmark } from '../../hooks/useFaceLandmarks';

interface Particle {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  angle: number;
  life: number;
}

export class PastelSparkles {
  private particles: Particle[] = [];
  private sparkleImg: HTMLImageElement | null = null;
  private imageLoaded = false;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.loadImage();
  }

  private async loadImage() {
    try {
      const img = new Image();
      img.onload = () => {
        this.sparkleImg = img;
        this.imageLoaded = true;
      };
      img.src = '/assets/generated/pastel-sparkles-sprites.dim_1024x1024.png';
    } catch (error) {
      console.error('Failed to load sparkle image:', error);
    }
  }

  apply(landmarks: FaceLandmark[], width: number, height: number, intensity: number) {
    if (intensity === 0) {
      this.particles = [];
      return;
    }

    const faceCenter = landmarks[1];
    const centerX = faceCenter.x * width;
    const centerY = faceCenter.y * height;

    if (Math.random() < intensity * 0.3) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * width * 0.15;
      this.particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        size: (Math.random() * 3 + 2) * intensity,
        alpha: Math.random() * 0.6 + 0.4,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
        life: 1,
      });
    }

    this.particles = this.particles.filter((p) => p.life > 0);

    this.particles.forEach((particle) => {
      particle.x += Math.cos(particle.angle) * particle.speed;
      particle.y += Math.sin(particle.angle) * particle.speed - 0.5;
      particle.life -= 0.01;
      particle.alpha = particle.life * 0.6;

      this.ctx.save();
      this.ctx.globalAlpha = particle.alpha * intensity;

      const gradient = this.ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.size * 2
      );
      gradient.addColorStop(0, 'rgba(255, 240, 245, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 220, 235, 0.6)');
      gradient.addColorStop(1, 'rgba(255, 200, 225, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }
}
