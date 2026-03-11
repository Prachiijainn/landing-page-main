import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ExternalLink } from 'lucide-react';

const hasValidConfig = !!import.meta.env.VITE_FIREBASE_API_KEY && !!import.meta.env.VITE_MONGODB_APP_ID;

const MockModeBanner = () => {
  if (hasValidConfig) return null;

  return (
    <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>Demo Mode:</strong> Using mock data. Set up Firebase and MongoDB for full functionality.
        </span>
      </AlertDescription>
    </Alert>
  );
};

export default MockModeBanner;