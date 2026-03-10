import { useEffect, useState, useRef } from 'react';
import type { RefObject } from 'react';

export interface FaceLandmark {
  x: number;
  y: number;
  z: number;
}

export interface FaceLandmarks {
  landmarks: FaceLandmark[];
  timestamp: number;
}

declare global {
  interface Window {
    FaceLandmarker?: any;
    FilesetResolver?: any;
  }
}

export function useFaceLandmarks(
  videoRef: RefObject<HTMLVideoElement>,
  isActive: boolean
) {
  const [landmarks, setLandmarks] = useState<FaceLandmarks | null>(null);
  const [isReady, setIsReady] = useState(false);
  const faceLandmarkerRef = useRef<any>(null);
  const lastVideoTimeRef = useRef(-1);

  useEffect(() => {
    let cancelled = false;

    async function loadFaceLandmarker() {
      try {
        if (!window.FilesetResolver || !window.FaceLandmarker) {
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

        const faceLandmarker = await window.FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'GPU',
            },
            outputFaceBlendshapes: false,
            runningMode: 'VIDEO',
            numFaces: 1,
          }
        );

        if (cancelled) return;

        faceLandmarkerRef.current = faceLandmarker;
        setIsReady(true);
      } catch (error) {
        console.error('Failed to load face landmarker:', error);
      }
    }

    loadFaceLandmarker();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isActive || !isReady || !videoRef.current || !faceLandmarkerRef.current) {
      return;
    }

    let animationId: number;

    const detectLandmarks = () => {
      const video = videoRef.current;
      if (!video || video.readyState !== 4) {
        animationId = requestAnimationFrame(detectLandmarks);
        return;
      }

      const currentTime = video.currentTime;
      if (currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = currentTime;

        try {
          const results = faceLandmarkerRef.current.detectForVideo(
            video,
            performance.now()
          );

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            setLandmarks({
              landmarks: results.faceLandmarks[0],
              timestamp: performance.now(),
            });
          }
        } catch (error) {
          console.error('Face detection error:', error);
        }
      }

      animationId = requestAnimationFrame(detectLandmarks);
    };

    animationId = requestAnimationFrame(detectLandmarks);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isActive, isReady, videoRef]);

  return { landmarks, isReady };
}
