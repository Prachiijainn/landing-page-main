import { hasValidSupabaseConfig } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ExternalLink } from 'lucide-react';

const MockModeBanner = () => {
  if (hasValidSupabaseConfig) return null;

  return (
    <Alert className="border-yellow-200 bg-yellow-50 text-yellow-800 mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          <strong>Demo Mode:</strong> Using mock data. Set up Supabase for full functionality.
        </span>
        <a 
          href="/SUPABASE_SETUP.md" 
          target="_blank" 
          className="flex items-center text-yellow-700 hover:text-yellow-900 underline ml-4"
        >
          Setup Guide <ExternalLink className="w-3 h-3 ml-1" />
        </a>
      </AlertDescription>
    </Alert>
  );
};

export default MockModeBanner;