import { useStore } from "@nanostores/react";
import { useQueryState } from 'nuqs';
import { XmlEditor } from "../monaco/XmlEditor";
import { DownloadButton } from "./DownloadButton";
import { $generatedSystemXml, $systemSettings } from "../../state/builder-state";

export function SystemXmlEditor() {
  const xml = useStore($generatedSystemXml);
  const systemSettings = useStore($systemSettings);
  const [, setTab] = useQueryState('tab');

  const handleDownloadComplete = () => {
    // Navigate to instruction page after successful download
    setTab('installation');
  };

  const handleDownloadError = (error: Error) => {
    // Enhanced error handling with user-friendly messages
    console.error('Download failed:', error);
    
    // The DownloadButton component now handles error display internally,
    // but we can still log for debugging purposes
    // Error display is now handled by the DownloadButton component itself
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'max-content 1fr', gap: '0.5rem' }}>
      <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--container-border-color)' }}>
        <DownloadButton
          systemId={systemSettings.systemId}
          systemXml={xml}
          onDownloadComplete={handleDownloadComplete}
          onError={handleDownloadError}
        />
      </div>
      <XmlEditor value={xml} />
    </div>
  );
}