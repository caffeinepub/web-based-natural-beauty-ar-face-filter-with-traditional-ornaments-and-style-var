import { useState } from 'react';
import { DEFAULT_SETTINGS } from './defaultSettings';

export interface ArSettings {
  skinSmoothing: number;
  blush: number;
  lipGloss: number;
  eyeSparkle: number;
  glow: number;
  sparkles: number;
  backgroundBlur: boolean;
  backgroundBlurIntensity: number;
}

export function useArSettings() {
  const [settings, setSettings] = useState<ArSettings>(DEFAULT_SETTINGS);

  const updateSetting = <K extends keyof ArSettings>(
    key: K,
    value: ArSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return { settings, updateSetting, reset };
}
