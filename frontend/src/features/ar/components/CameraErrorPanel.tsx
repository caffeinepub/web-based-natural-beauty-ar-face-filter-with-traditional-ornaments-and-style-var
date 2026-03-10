import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Camera } from 'lucide-react';
import type { CameraError } from '../../../camera/useCamera';

interface CameraErrorPanelProps {
  error: CameraError;
}

export function CameraErrorPanel({ error }: CameraErrorPanelProps) {
  const getErrorMessage = () => {
    switch (error.type) {
      case 'permission':
        return {
          title: 'Camera Permission Denied',
          message:
            'Please allow camera access in your browser settings to use this feature. You may need to refresh the page after granting permission.',
        };
      case 'not-supported':
        return {
          title: 'Camera Not Supported',
          message:
            'Your browser does not support camera access. Please try using a modern browser like Chrome, Firefox, or Safari.',
        };
      case 'not-found':
        return {
          title: 'No Camera Found',
          message:
            'No camera device was detected. Please connect a camera and refresh the page.',
        };
      default:
        return {
          title: 'Camera Error',
          message: error.message || 'An unexpected error occurred while accessing the camera.',
        };
    }
  };

  const { title, message } = getErrorMessage();

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm">
      <Card className="max-w-md bg-white/95 dark:bg-neutral-800/95">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Camera className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Alert className="border-amber-200 dark:border-amber-800">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-sm">{message}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
