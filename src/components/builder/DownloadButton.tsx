import React, { useState } from 'react';
import { Button } from 'react-aria-components';
import { Download, Loader2, AlertCircle, RotateCcw } from 'lucide-react';
import { saveAs } from 'file-saver';
import { ZipDownloadService, ZipDownloadError } from '../../ts/zip/ZipDownloadService';

export interface DownloadButtonProps {
  systemId: string;
  systemXml: string;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onError?: (error: Error) => void;
}

interface DownloadState {
  isLoading: boolean;
  error: string | null;
  retryCount: number;
}

const MAX_RETRY_ATTEMPTS = 3;

export function DownloadButton({
  systemId,
  systemXml,
  onDownloadStart,
  onDownloadComplete,
  onError
}: DownloadButtonProps) {
  const [state, setState] = useState<DownloadState>({
    isLoading: false,
    error: null,
    retryCount: 0
  });
  
  const zipService = new ZipDownloadService();

  const handleDownload = async (isRetry = false) => {
    if (state.isLoading) return; // Prevent multiple simultaneous downloads

    try {
      setState(prev => ({
        ...prev,
        isLoading: true,
        error: null,
        retryCount: isRetry ? prev.retryCount + 1 : 0
      }));
      
      onDownloadStart?.();

      // Generate the zip using JSZip library with error handling
      let zipBlob: Blob;
      try {
        zipBlob = await zipService.generateModZip(systemId, systemXml);
      } catch (error) {
        if (error instanceof ZipDownloadError) {
          throw new Error(`Zip generation failed: ${error.message}`);
        }
        throw new Error('Failed to create zip file. Please check your system data and try again.');
      }

      // Trigger browser download using file-saver library with error handling
      try {
        saveAs(zipBlob, `${systemId}.zip`);
      } catch (error) {
        throw new Error('Failed to download file. Your browser may have blocked the download or storage is full.');
      }

      // Clear error state on success
      setState(prev => ({ ...prev, error: null, retryCount: 0 }));

      // Navigate to success page with installation instructions
      onDownloadComplete?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Download failed with unknown error';
      
      setState(prev => ({ ...prev, error: errorMessage }));
      
      const errorObj = error instanceof Error ? error : new Error(errorMessage);
      onError?.(errorObj);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRetry = () => {
    handleDownload(true);
  };

  const canRetry = state.error && state.retryCount < MAX_RETRY_ATTEMPTS;
  const showError = state.error && !state.isLoading;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Button
          onPress={() => handleDownload()}
          isDisabled={state.isLoading}
          aria-label={state.isLoading ? 'Downloading...' : 'Download ZIP'}
        >
          {state.isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download size={16} />
              Download ZIP
            </>
          )}
        </Button>
        
        {canRetry && (
          <Button
            onPress={handleRetry}
            isDisabled={state.isLoading}
            aria-label={`Retry download (${state.retryCount}/${MAX_RETRY_ATTEMPTS})`}
          >
            <RotateCcw size={16} />
            Retry ({state.retryCount}/{MAX_RETRY_ATTEMPTS})
          </Button>
        )}
      </div>
      
      {showError && (
        <div 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.5rem',
            backgroundColor: 'var(--color-error-bg, #fef2f2)',
            border: '1px solid var(--color-error-border, #fecaca)',
            borderRadius: '0.375rem',
            color: 'var(--color-error-text, #dc2626)',
            fontSize: '0.875rem'
          }}
          role="alert"
          aria-live="polite"
        >
          <AlertCircle size={16} />
          <span>{state.error}</span>
        </div>
      )}
    </div>
  );
}