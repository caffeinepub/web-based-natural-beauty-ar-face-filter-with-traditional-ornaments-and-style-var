import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import type { ArSettings } from '../state/useArSettings';

interface EffectControlsPanelProps {
  settings: ArSettings;
  onSettingChange: <K extends keyof ArSettings>(key: K, value: ArSettings[K]) => void;
  onReset: () => void;
}

export function EffectControlsPanel({
  settings,
  onSettingChange,
  onReset,
}: EffectControlsPanelProps) {
  return (
    <Card className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-amber-200/50 dark:border-neutral-700/50">
      <CardHeader className="border-b border-amber-200/50 dark:border-neutral-700/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Effect Controls</CardTitle>
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
            className="border-amber-300 dark:border-neutral-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Skin Smoothing</Label>
          <Slider
            value={[settings.skinSmoothing]}
            onValueChange={([value]) => onSettingChange('skinSmoothing', value)}
            min={0}
            max={1}
            step={0.1}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-amber-400 [&_[role=slider]]:to-rose-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Blush</Label>
          <Slider
            value={[settings.blush]}
            onValueChange={([value]) => onSettingChange('blush', value)}
            min={0}
            max={1}
            step={0.1}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-amber-400 [&_[role=slider]]:to-rose-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Lip Gloss</Label>
          <Slider
            value={[settings.lipGloss]}
            onValueChange={([value]) => onSettingChange('lipGloss', value)}
            min={0}
            max={1}
            step={0.1}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-amber-400 [&_[role=slider]]:to-rose-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Eye Sparkle</Label>
          <Slider
            value={[settings.eyeSparkle]}
            onValueChange={([value]) => onSettingChange('eyeSparkle', value)}
            min={0}
            max={1}
            step={0.1}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-amber-400 [&_[role=slider]]:to-rose-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Face Glow</Label>
          <Slider
            value={[settings.glow]}
            onValueChange={([value]) => onSettingChange('glow', value)}
            min={0}
            max={1}
            step={0.1}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-amber-400 [&_[role=slider]]:to-rose-400"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Sparkles</Label>
          <Slider
            value={[settings.sparkles]}
            onValueChange={([value]) => onSettingChange('sparkles', value)}
            min={0}
            max={1}
            step={0.1}
            className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-amber-400 [&_[role=slider]]:to-rose-400"
          />
        </div>

        <div className="pt-4 border-t border-amber-200/50 dark:border-neutral-700/50">
          <div className="flex items-center justify-between">
            <Label htmlFor="background-blur" className="text-sm font-medium">
              Background Blur
            </Label>
            <Switch
              id="background-blur"
              checked={settings.backgroundBlur}
              onCheckedChange={(checked) => onSettingChange('backgroundBlur', checked)}
            />
          </div>
          {settings.backgroundBlur && (
            <div className="mt-4 space-y-2">
              <Label className="text-sm font-medium">Blur Intensity</Label>
              <Slider
                value={[settings.backgroundBlurIntensity]}
                onValueChange={([value]) =>
                  onSettingChange('backgroundBlurIntensity', value)
                }
                min={0}
                max={1}
                step={0.1}
                className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-amber-400 [&_[role=slider]]:to-rose-400"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
