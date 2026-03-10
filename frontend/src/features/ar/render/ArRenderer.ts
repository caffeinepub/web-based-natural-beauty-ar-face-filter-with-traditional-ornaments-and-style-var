import type { FaceLandmarks } from '../hooks/useFaceLandmarks';
import type { VariantType } from '../variants/types';
import type { ArSettings } from '../state/useArSettings';
import { NaturalBeautyMakeup } from '../effects/makeup/NaturalBeautyMakeup';
import { TraditionalOrnaments } from '../effects/ornaments/TraditionalOrnaments';
import { FaceGlow } from '../effects/glow/FaceGlow';
import { PastelSparkles } from '../effects/particles/PastelSparkles';
import { BackgroundBlur } from '../effects/background/BackgroundBlur';
import { BridalVariant } from '../variants/bridal';
import { AnimeSparkleVariant } from '../variants/animeSparkle';
import { FestivalVariant } from '../variants/festival';

export class ArRenderer {
  private ctx: CanvasRenderingContext2D;
  private makeup: NaturalBeautyMakeup;
  private ornaments: TraditionalOrnaments;
  private glow: FaceGlow;
  private sparkles: PastelSparkles;
  private backgroundBlur: BackgroundBlur;
  private bridal: BridalVariant;
  private anime: AnimeSparkleVariant;
  private festival: FestivalVariant;

  constructor(
    private canvas: HTMLCanvasElement,
    private video: HTMLVideoElement,
    private captureCanvas: HTMLCanvasElement
  ) {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('Could not get canvas context');
    this.ctx = ctx;

    this.makeup = new NaturalBeautyMakeup(ctx);
    this.ornaments = new TraditionalOrnaments(ctx);
    this.glow = new FaceGlow(ctx);
    this.sparkles = new PastelSparkles(ctx);
    this.backgroundBlur = new BackgroundBlur(ctx);
    this.bridal = new BridalVariant(ctx);
    this.anime = new AnimeSparkleVariant(ctx);
    this.festival = new FestivalVariant(ctx);
  }

  render(
    faceLandmarks: FaceLandmarks | null,
    mask: ImageData | null,
    variant: VariantType,
    settings: ArSettings
  ) {
    if (this.video.readyState !== 4) return;

    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    this.ctx.save();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (settings.backgroundBlur && mask) {
      this.backgroundBlur.apply(this.video, mask, settings.backgroundBlurIntensity);
    } else {
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    }

    if (faceLandmarks) {
      const landmarks = faceLandmarks.landmarks;

      this.makeup.apply(landmarks, this.canvas.width, this.canvas.height, {
        smoothing: settings.skinSmoothing,
        blush: settings.blush,
        lipGloss: settings.lipGloss,
        eyeSparkle: settings.eyeSparkle,
      });

      this.glow.apply(landmarks, this.canvas.width, this.canvas.height, settings.glow);

      this.sparkles.apply(
        landmarks,
        this.canvas.width,
        this.canvas.height,
        settings.sparkles
      );

      this.ornaments.apply(landmarks, this.canvas.width, this.canvas.height);

      if (variant === 'bridal') {
        this.bridal.apply(landmarks, this.canvas.width, this.canvas.height);
      } else if (variant === 'anime') {
        this.anime.apply(landmarks, this.canvas.width, this.canvas.height);
      } else if (variant === 'festival') {
        this.festival.apply(landmarks, this.canvas.width, this.canvas.height);
      }
    }

    this.ctx.restore();
  }
}
