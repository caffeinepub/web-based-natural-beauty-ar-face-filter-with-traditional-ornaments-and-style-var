import type { FaceLandmark } from '../../hooks/useFaceLandmarks';

interface MakeupSettings {
  smoothing: number;
  blush: number;
  lipGloss: number;
  eyeSparkle: number;
}

export class NaturalBeautyMakeup {
  constructor(private ctx: CanvasRenderingContext2D) {}

  apply(
    landmarks: FaceLandmark[],
    width: number,
    height: number,
    settings: MakeupSettings
  ) {
    if (settings.smoothing > 0) {
      this.applySkinSmoothing(landmarks, width, height, settings.smoothing);
    }

    if (settings.blush > 0) {
      this.applyBlush(landmarks, width, height, settings.blush);
    }

    if (settings.lipGloss > 0) {
      this.applyLipGloss(landmarks, width, height, settings.lipGloss);
    }

    if (settings.eyeSparkle > 0) {
      this.applyEyeSparkle(landmarks, width, height, settings.eyeSparkle);
    }
  }

  private applySkinSmoothing(
    landmarks: FaceLandmark[],
    width: number,
    height: number,
    intensity: number
  ) {
    const faceOval = [
      10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378,
      400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21,
      54, 103, 67, 109,
    ];

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.filter = `blur(${intensity * 2}px)`;

    this.ctx.beginPath();
    faceOval.forEach((idx, i) => {
      const point = landmarks[idx];
      const x = point.x * width;
      const y = point.y * height;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    this.ctx.closePath();
    this.ctx.clip();

    const imageData = this.ctx.getImageData(0, 0, width, height);
    this.ctx.putImageData(imageData, 0, 0);

    this.ctx.restore();
  }

  private applyBlush(
    landmarks: FaceLandmark[],
    width: number,
    height: number,
    intensity: number
  ) {
    const leftCheek = landmarks[330];
    const rightCheek = landmarks[101];

    const drawBlush = (center: FaceLandmark) => {
      const x = center.x * width;
      const y = center.y * height;
      const radius = width * 0.06;

      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, `rgba(255, 182, 193, ${intensity * 0.3})`);
      gradient.addColorStop(0.6, `rgba(255, 182, 193, ${intensity * 0.15})`);
      gradient.addColorStop(1, 'rgba(255, 182, 193, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    };

    drawBlush(leftCheek);
    drawBlush(rightCheek);
  }

  private applyLipGloss(
    landmarks: FaceLandmark[],
    width: number,
    height: number,
    intensity: number
  ) {
    const upperLip = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
    const lowerLip = [146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'source-over';

    this.ctx.beginPath();
    upperLip.forEach((idx, i) => {
      const point = landmarks[idx];
      const x = point.x * width;
      const y = point.y * height;
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    });
    lowerLip.forEach((idx) => {
      const point = landmarks[idx];
      const x = point.x * width;
      const y = point.y * height;
      this.ctx.lineTo(x, y);
    });
    this.ctx.closePath();

    this.ctx.fillStyle = `rgba(255, 192, 203, ${intensity * 0.25})`;
    this.ctx.fill();

    const centerX = landmarks[13].x * width;
    const centerY = landmarks[13].y * height;
    const gradient = this.ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      width * 0.03
    );
    gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.4})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, width * 0.03, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  private applyEyeSparkle(
    landmarks: FaceLandmark[],
    width: number,
    height: number,
    intensity: number
  ) {
    const leftEye = landmarks[468];
    const rightEye = landmarks[473];

    const drawSparkle = (center: FaceLandmark) => {
      const x = center.x * width;
      const y = center.y * height;
      const size = width * 0.008;

      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      gradient.addColorStop(0, `rgba(255, 255, 255, ${intensity * 0.8})`);
      gradient.addColorStop(0.5, `rgba(255, 255, 255, ${intensity * 0.4})`);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = `rgba(255, 255, 255, ${intensity})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    };

    drawSparkle(leftEye);
    drawSparkle(rightEye);
  }
}
