import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';
import type { VariantType } from '../variants/types';
import type { ArSettings } from '../state/useArSettings';
import { VARIANT_CONFIGS } from '../variants/types';

interface LensNotesProps {
  variant: VariantType;
  settings: ArSettings;
}

export function LensNotes({ variant, settings }: LensNotesProps) {
  const config = VARIANT_CONFIGS[variant];

  const activeEffects: string[] = [];
  if (settings.skinSmoothing > 0) activeEffects.push('skin smoothing');
  if (settings.blush > 0) activeEffects.push('blush');
  if (settings.lipGloss > 0) activeEffects.push('lip gloss');
  if (settings.eyeSparkle > 0) activeEffects.push('eye sparkle');
  if (settings.glow > 0) activeEffects.push('face glow');
  if (settings.sparkles > 0) activeEffects.push('sparkles');
  if (settings.backgroundBlur) activeEffects.push('background blur');

  return (
    <Card className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm border-amber-200/50 dark:border-neutral-700/50">
      <CardHeader className="border-b border-amber-200/50 dark:border-neutral-700/50">
        <div className="flex items-center gap-2">
          <Info className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <CardTitle className="text-lg">Current Look</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div>
          <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
            {config.name}
          </h4>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {config.description}
          </p>
        </div>

        <div>
          <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Active Elements:
          </h5>
          <ul className="space-y-1">
            {config.addOns.map((addon) => (
              <li
                key={addon}
                className="text-sm text-neutral-600 dark:text-neutral-400 flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-rose-400" />
                {addon}
              </li>
            ))}
          </ul>
        </div>

        {activeEffects.length > 0 && (
          <div>
            <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Active Effects:
            </h5>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {activeEffects.join(', ')}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
