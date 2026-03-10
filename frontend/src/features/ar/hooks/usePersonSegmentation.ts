import { useEffect, useState, useRef } from 'react';
import type { RefObject } from 'react';

declare global {
  interface Window {
    ImageSegmenter?: any;
    FilesetResolver?: any;
  }
}

export function usePersonSegmentation(
  videoRef: RefObject<HTMLVideoElement>,
  enabled: boolean
) {
  const [mask, setMask] = useState<ImageData | null>(null);
  const [isReady, setIsReady] = useState(false);
  const segmenterRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSegmenter() {
      if (!enabled) return;

      try {
        if (!window.ImageSegmenter || !window.FilesetResolver) {
          const script = document.createElement('script');
          script.src =
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/vision_bundle.js';
          script.async = true;
          document.head.appendChild(script);

          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        }

        if (cancelled) return;

        const filesetResolver = await window.FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );

        if (cancelled) return;

        const imageSegmenter = await window.ImageSegmenter.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/1/selfie_segmenter.tflite',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            outputCategoryMask: true,
          }
        );

        if (cancelled) return;

        segmenterRef.current = imageSegmenter;
        canvasRef.current = document.createElement('canvas');
        setIsReady(true);
      } catch (error) {
        console.error('Failed to load segmenter:', error);
      }
    }

    loadSegmenter();

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !isReady || !videoRef.current || !segmenterRef.current) {
      setMask(null);
      return;
    }

    let animationId: number;

    const segment = () => {
      const video = videoRef.current;
      if (!video || video.readyState !== 4) {
        animationId = requestAnimationFrame(segment);
        return;
      }

      try {
        const results = segmenterRef.current.segmentForVideo(
          video,
          performance.now()
        );

        if (results.categoryMask) {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = results.categoryMask.width;
            canvas.height = results.categoryMask.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              const imageData = ctx.createImageData(canvas.width, canvas.height);
              const maskData = results.categoryMask.getAsUint8Array();
              
              for (let i = 0; i < maskData.length; i++) {
                const alpha = maskData[i] > 0 ? 255 : 0;
                imageData.data[i * 4] = 255;
                imageData.data[i * 4 + 1] = 255;
                imageData.data[i * 4 + 2] = 255;
                imageData.data[i * 4 + 3] = alpha;
              }
              
              setMask(imageData);
            }
          }
        }
      } catch (error) {
        console.error('Segmentation error:', error);
      }

      animationId = requestAnimationFrame(segment);
    };

    animationId = requestAnimationFrame(segment);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [enabled, isReady, videoRef]);

  return { mask, isReady };
}
