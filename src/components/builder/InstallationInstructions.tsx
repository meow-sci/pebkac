import { useStore } from "@nanostores/react";
import { $systemSettings } from "../../state/builder-state";

export interface InstallationInstructionsProps {
  systemId?: string;
}

export function InstallationInstructions({ systemId: propSystemId }: InstallationInstructionsProps) {
  const systemSettings = useStore($systemSettings);
  const systemId = propSystemId || systemSettings.systemId;

  return (
    <div id="installation-instructions" style={{ padding: '1rem' }}>
      <h2>Installation Instructions</h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Step 1: Extract the Zip File</h3>
        <p>
          Extract your downloaded <code>{systemId}.zip</code> file to the following location:
        </p>
        <div style={{ 
          backgroundColor: 'color-mix(in srgb, var(--green-600) 8%, transparent)',
          border: '1px solid var(--green-600)',
          padding: '0.5rem',
          fontFamily: 'monospace',
          margin: '0.5rem 0'
        }}>
          C:\Program Files\Kitten Space Agency\Content
        </div>
        <p>
          After extraction, you should have a folder named <code>{systemId}</code> in the Content directory.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Step 2: Edit manifest.toml</h3>
        <p>
          Navigate to your KSA user directory and edit the <code>manifest.toml</code> file:
        </p>
        <div style={{ 
          backgroundColor: 'color-mix(in srgb, var(--green-600) 8%, transparent)',
          border: '1px solid var(--green-600)',
          padding: '0.5rem',
          fontFamily: 'monospace',
          margin: '0.5rem 0'
        }}>
          $HOME\Documents\My Games\Kitten Space Agency\manifest.toml
        </div>
        <p>
          Add the following entry to enable your custom system:
        </p>
        <div style={{ 
          backgroundColor: 'color-mix(in srgb, var(--green-600) 8%, transparent)',
          border: '1px solid var(--green-600)',
          padding: '0.5rem',
          fontFamily: 'monospace',
          margin: '0.5rem 0',
          whiteSpace: 'pre-line'
        }}>
{`[[mods]]
id = "${systemId}"
enabled = true`}
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3>Step 3: Launch KSA</h3>
        <p>
          Start Kitten Space Agency and your custom system <strong>{systemId}</strong> should be available for use!
        </p>
      </div>

      <div style={{ 
        backgroundColor: 'color-mix(in srgb, var(--green-600) 5%, transparent)',
        border: '1px solid var(--green-600)',
        padding: '1rem',
        marginTop: '1.5rem'
      }}>
        <h4>Need Help?</h4>
        <p>
          If you encounter any issues, make sure:
        </p>
        <ul>
          <li>The zip file was extracted to the correct Content directory</li>
          <li>The manifest.toml file was edited correctly</li>
          <li>KSA was restarted after making changes</li>
        </ul>
      </div>
    </div>
  );
}