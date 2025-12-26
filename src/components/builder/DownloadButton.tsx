import React, { useState } from 'react';
import { Button } from 'react-aria-components';
import { Download, Loader2 } from 'lucide-react';
import { saveAs } from 'file-saver';
import { ZipDownloadService } from '../../ts/zip/ZipDownloadService';

export interface DownloadButtonProps {
  systemId: string;
  systemXml: string;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onError?: (error: Error) => void;
}

export function DownloadButton({
  systemId,
  systemXml,
  onDownloadStart,
  onDownloadComplete,
  onError
}: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const zipService = new ZipDownloadService();

  const handleDownload = async () => {
    if (isLoading) return; // Prevent multiple simultaneous downloads

    try {
      setIsLoading(true);
      onDownloadStart?.();

      // Generate the zip using JSZip library
      const zipBlob = await zipService.generateModZip(systemId, systemXml);

      // Trigger browser download using file-saver library
      saveAs(zipBlob, `${systemId}.zip`);

      // Navigate to success page with installation instructions
      onDownloadComplete?.();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Download failed');
      onError?.(errorObj);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onPress={handleDownload}
      isDisabled={isLoading}
      aria-label={isLoading ? 'Downloading...' : 'Download ZIP'}
    >
      {isLoading ? (
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
  );
}