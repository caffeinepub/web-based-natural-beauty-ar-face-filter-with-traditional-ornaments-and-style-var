import { useEffect, useRef, useState } from 'react';
import { useCamera } from '../camera/useCamera';
import { useFaceLandmarks } from '../features/ar/hooks/useFaceLandmarks';
import { usePersonSegmentation } from '../features/ar/hooks/usePersonSegmentation';
import { useArSettings } from '../features/ar/state/useArSettings';
import { ArRenderer } from '../features/ar/render/ArRenderer';
import { CameraErrorPanel } from '../features/ar/components/CameraErrorPanel';
import { EffectControlsPanel } from '../features/ar/components/EffectControlsPanel';
import { LensNotes } from '../features/ar/components/LensNotes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Download, Sparkles } from 'lucide-react';
import { captureComposite } from '../features/ar/capture/captureComposite';
import type { VariantType } from '../features/ar/variants/types';

export function ArFaceFilterPage() {
  const {
    isActive,
    isSupported,
    error,
    isLoading,
    startCamera,
    stopCamera,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'user',
    width: 1280,
    height: 720,
  });

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [variant, setVariant] = useState<VariantType>('natural');
  const { settings, updateSetting, reset } = useArSettings();
  const { landmarks, isReady: landmarksReady } = useFaceLandmarks(videoRef as React.RefObject<HTMLVideoElement>, isActive);
  const { mask, isReady: segmentationReady } = usePersonSegmentation(
    videoRef as React.RefObject<HTMLVideoElement>,
    isActive && settings.backgroundBlur
  );

  const rendererRef = useRef<ArRenderer | null>(null);

  useEffect(() => {
    if (previewCanvasRef.current && videoRef.current && canvasRef.current) {
      rendererRef.current = new ArRenderer(
        previewCanvasRef.current,
        videoRef.current,
        canvasRef.current
      );
    }
  }, [videoRef, canvasRef]);

  useEffect(() => {
    if (!rendererRef.current || !isActive || !landmarksReady) return;

    const animate = () => {
      if (rendererRef.current && isActive) {
        rendererRef.current.render(landmarks, mask, variant, settings);
        requestAnimationFrame(animate);
      }
    };

    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isActive, landmarksReady, landmarks, mask, variant, settings]);

  const handleCapture = () => {
    if (previewCanvasRef.current) {
      captureComposite(previewCanvasRef.current, variant);
    }
  };

  if (isSupported === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-amber-50 via-rose-50 to-amber-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <CameraErrorPanel
          error={{ type: 'not-supported', message: 'Camera not supported in this browser' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-amber-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <header className="border-b border-amber-200/50 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Natural Beauty Filter
                </h1>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Elegant AR face enhancement
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid lg:grid-cols-[1fr_380px] gap-6">
          <div className="space-y-4">
            <Card className="overflow-hidden bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-amber-200/50 dark:border-neutral-700/50">
              <div className="relative aspect-video bg-neutral-900">
                {error && <CameraErrorPanel error={error} />}
                
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="hidden"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                <canvas
                  ref={previewCanvasRef}
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />

                {!isActive && !error && (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/50 backdrop-blur-sm">
                    <div className="text-center space-y-4">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-rose-400 flex items-center justify-center">
                        <Camera className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-white text-lg font-medium">
                        Start your camera to begin
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-amber-200/50 dark:border-neutral-700/50 bg-gradient-to-r from-amber-50/50 to-rose-50/50 dark:from-neutral-800/50 dark:to-neutral-700/50">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex gap-2">
                    {!isActive ? (
                      <Button
                        onClick={startCamera}
                        disabled={isLoading}
                        className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        {isLoading ? 'Starting...' : 'Start Camera'}
                      </Button>
                    ) : (
                      <Button
                        onClick={stopCamera}
                        disabled={isLoading}
                        variant="outline"
                        className="border-amber-300 dark:border-neutral-600"
                      >
                        Stop Camera
                      </Button>
                    )}
                  </div>

                  <Button
                    onClick={handleCapture}
                    disabled={!isActive || !landmarksReady}
                    className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-amber-200/50 dark:border-neutral-700/50">
              <h3 className="text-sm font-semibold mb-3 text-neutral-900 dark:text-neutral-100">
                Style Variant
              </h3>
              <Tabs value={variant} onValueChange={(v) => setVariant(v as VariantType)}>
                <TabsList className="grid grid-cols-4 w-full bg-amber-100/50 dark:bg-neutral-700/50">
                  <TabsTrigger value="natural" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-rose-400 data-[state=active]:text-white">
                    Natural
                  </TabsTrigger>
                  <TabsTrigger value="bridal" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-rose-400 data-[state=active]:text-white">
                    Bridal
                  </TabsTrigger>
                  <TabsTrigger value="anime" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-rose-400 data-[state=active]:text-white">
                    Anime
                  </TabsTrigger>
                  <TabsTrigger value="festival" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-rose-400 data-[state=active]:text-white">
                    Festival
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </Card>

            <LensNotes variant={variant} settings={settings} />
          </div>

          <div className="space-y-4">
            <EffectControlsPanel
              settings={settings}
              onSettingChange={updateSetting}
              onReset={reset}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-amber-200/50 dark:border-neutral-700/50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-neutral-600 dark:text-neutral-400">
            <p>
              © {new Date().getFullYear()} · Built with love using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'ar-beauty-filter'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
