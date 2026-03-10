export class BackgroundBlur {
  private tempCanvas: HTMLCanvasElement;
  private tempCtx: CanvasRenderingContext2D;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.tempCanvas = document.createElement('canvas');
    const tempCtx = this.tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error('Could not create temp canvas context');
    this.tempCtx = tempCtx;
  }

  apply(video: HTMLVideoElement, mask: ImageData, intensity: number) {
    const width = video.videoWidth;
    const height = video.videoHeight;

    this.tempCanvas.width = width;
    this.tempCanvas.height = height;

    this.tempCtx.filter = `blur(${intensity * 8}px)`;
    this.tempCtx.drawImage(video, 0, 0, width, height);
    this.tempCtx.filter = 'none';

    this.ctx.drawImage(this.tempCanvas, 0, 0, width, height);

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-in';
    
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = mask.width;
    maskCanvas.height = mask.height;
    const maskCtx = maskCanvas.getContext('2d');
    if (maskCtx) {
      maskCtx.putImageData(mask, 0, 0);
      this.ctx.filter = 'blur(8px)';
      this.ctx.drawImage(maskCanvas, 0, 0, width, height);
      this.ctx.filter = 'none';
    }
    
    this.ctx.restore();

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-over';
    this.tempCtx.filter = `blur(${intensity * 8}px)`;
    this.tempCtx.drawImage(video, 0, 0, width, height);
    this.ctx.drawImage(this.tempCanvas, 0, 0, width, height);
    this.ctx.restore();
  }
}
