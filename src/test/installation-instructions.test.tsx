import { describe, test, expect, vi } from 'vitest';
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { InstallationInstructions } from '../components/builder/InstallationInstructions';

// Mock nanostores
vi.mock('@nanostores/react', () => ({
  useStore: vi.fn(() => ({ systemId: 'MockSystem' }))
}));

describe('InstallationInstructions', () => {
  
  /**
   * Property 5: Instruction page rendering
   * Feature: add-zip-download, Property 5: Instruction page rendering
   * Validates: Requirements 5.1, 5.3
   */
  test('instruction page rendering property', () => {
    fc.assert(
      fc.property(
        // Generate systemId: alphanumeric strings with some special characters
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        (systemId) => {
          // Render the component with the generated systemId
          const { container } = render(<InstallationInstructions systemId={systemId} />);
          const content = container.textContent || '';
          
          // Requirement 5.1: Display directions to extract zip to correct path
          expect(content).toContain('C:\\Program Files\\Kitten Space Agency\\Content');
          expect(content).toContain(`${systemId}.zip`);
          expect(content).toContain(`folder named ${systemId}`);
          
          // Requirement 5.3: Display manifest.toml editing instructions with specific systemId
          expect(content).toContain('manifest.toml');
          expect(content).toContain(`id = "${systemId}"`);
          expect(content).toContain('enabled = true');
          
          // Verify the systemId appears in the custom system reference
          expect(content).toContain(`custom system ${systemId}`);
          
          // Verify the manifest.toml path is shown
          expect(content).toContain('$HOME\\Documents\\My Games\\Kitten Space Agency\\manifest.toml');
          
          // Verify the exact format needed for manifest.toml entry is provided
          expect(content).toContain('[[mods]]');
          expect(content).toContain(`id = "${systemId}"`);
          expect(content).toContain('enabled = true');
        }
      ),
      { numRuns: 100 }
    );
  });
});