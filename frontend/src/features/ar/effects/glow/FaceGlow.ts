import type { FaceLandmark } from '../../hooks/useFaceLandmarks';

export class FaceGlow {
  constructor(private ctx: CanvasRenderingContext2D) {}

  apply(landmarks: FaceLandmark[], width: number, height: number, intensity: number) {
    if (intensity === 0) return;

    const faceCenter = landmarks[1];
    const x = faceCenter.x * width;
    const y = faceCenter.y * height;
    const radius = width * 0.25;

    const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255, 245, 230, ${intensity * 0.15})`);
    gradient.addColorStop(0.4, `rgba(255, 220, 200, ${intensity * 0.08})`);
    gradient.addColorStop(0.7, `rgba(255, 200, 180, ${intensity * 0.03})`);
    gradient.addColorStop(1, 'rgba(255, 200, 180, 0)');

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.restore();
  }
}
