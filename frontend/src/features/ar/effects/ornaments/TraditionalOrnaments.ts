import type { FaceLandmark } from '../../hooks/useFaceLandmarks';
import { applySecondaryMotion } from './secondaryMotion';

export class TraditionalOrnaments {
  private maangTikkaImg: HTMLImageElement | null = null;
  private noseRingImg: HTMLImageElement | null = null;
  private jhumkaImg: HTMLImageElement | null = null;
  private necklaceImg: HTMLImageElement | null = null;
  private imagesLoaded = false;

  private prevPositions = {
    maangTikka: { x: 0, y: 0 },
    noseRing: { x: 0, y: 0 },
    leftJhumka: { x: 0, y: 0 },
    rightJhumka: { x: 0, y: 0 },
    necklace: { x: 0, y: 0 },
  };

  constructor(private ctx: CanvasRenderingContext2D) {
    this.loadImages();
  }

  private async loadImages() {
    try {
      this.maangTikkaImg = await this.loadImage('/assets/generated/maang-tikka.dim_512x512.png');
      this.noseRingImg = await this.loadImage('/assets/generated/nose-ring.dim_512x512.png');
      this.jhumkaImg = await this.loadImage('/assets/generated/jhumka-earrings.dim_512x512.png');
      this.necklaceImg = await this.loadImage('/assets/generated/gold-necklace.dim_1024x512.png');
      this.imagesLoaded = true;
    } catch (error) {
      console.error('Failed to load ornament images:', error);
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

    this.drawMaangTikka(landmarks, width, height);
    this.drawNoseRing(landmarks, width, height);
    this.drawJhumkas(landmarks, width, height);
    this.drawNecklace(landmarks, width, height);
  }

  private drawMaangTikka(landmarks: FaceLandmark[], width: number, height: number) {
    if (!this.maangTikkaImg) return;

    const forehead = landmarks[10];
    const targetX = forehead.x * width;
    const targetY = forehead.y * height - height * 0.08;

    const smoothed = applySecondaryMotion(
      { x: targetX, y: targetY },
      this.prevPositions.maangTikka,
      0.15
    );
    this.prevPositions.maangTikka = smoothed;

    const size = width * 0.08;
    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.ctx.drawImage(
      this.maangTikkaImg,
      smoothed.x - size / 2,
      smoothed.y - size / 2,
      size,
      size
    );
    this.ctx.restore();
  }

  private drawNoseRing(landmarks: FaceLandmark[], width: number, height: number) {
    if (!this.noseRingImg) return;

    const nose = landmarks[98];
    const targetX = nose.x * width + width * 0.015;
    const targetY = nose.y * height;

    const smoothed = applySecondaryMotion(
      { x: targetX, y: targetY },
      this.prevPositions.noseRing,
      0.2
    );
    this.prevPositions.noseRing = smoothed;

    const size = width * 0.025;
    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.ctx.drawImage(
      this.noseRingImg,
      smoothed.x - size / 2,
      smoothed.y - size / 2,
      size,
      size
    );
    this.ctx.restore();
  }

  private drawJhumkas(landmarks: FaceLandmark[], width: number, height: number) {
    if (!this.jhumkaImg) return;

    const leftEar = landmarks[234];
    const rightEar = landmarks[454];

    const leftTargetX = leftEar.x * width - width * 0.02;
    const leftTargetY = leftEar.y * height + height * 0.02;

    const leftSmoothed = applySecondaryMotion(
      { x: leftTargetX, y: leftTargetY },
      this.prevPositions.leftJhumka,
      0.12
    );
    this.prevPositions.leftJhumka = leftSmoothed;

    const rightTargetX = rightEar.x * width + width * 0.02;
    const rightTargetY = rightEar.y * height + height * 0.02;

    const rightSmoothed = applySecondaryMotion(
      { x: rightTargetX, y: rightTargetY },
      this.prevPositions.rightJhumka,
      0.12
    );
    this.prevPositions.rightJhumka = rightSmoothed;

    const size = width * 0.06;

    this.ctx.save();
    this.ctx.globalAlpha = 0.95;
    this.ctx.drawImage(
      this.jhumkaImg,
      leftSmoothed.x - size / 2,
      leftSmoothed.y - size / 2,
      size,
      size
    );
    this.ctx.drawImage(
      this.jhumkaImg,
      rightSmoothed.x - size / 2,
      rightSmoothed.y - size / 2,
      size,
      size
    );
    this.ctx.restore();
  }

  private drawNecklace(landmarks: FaceLandmark[], width: number, height: number) {
    if (!this.necklaceImg) return;

    const chin = landmarks[152];
    const targetX = chin.x * width;
    const targetY = chin.y * height + height * 0.12;

    const smoothed = applySecondaryMotion(
      { x: targetX, y: targetY },
      this.prevPositions.necklace,
      0.18
    );
    this.prevPositions.necklace = smoothed;

    const neckWidth = width * 0.35;
    const neckHeight = neckWidth * 0.5;

    this.ctx.save();
    this.ctx.globalAlpha = 0.9;
    this.ctx.drawImage(
      this.necklaceImg,
      smoothed.x - neckWidth / 2,
      smoothed.y - neckHeight / 2,
      neckWidth,
      neckHeight
    );
    this.ctx.restore();
  }
}
