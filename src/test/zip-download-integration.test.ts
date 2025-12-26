import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { ZipDownloadService } from '../ts/zip/ZipDownloadService';

describe('Zip Download Integration Tests', () => {
  let zipService: ZipDownloadService;

  beforeEach(() => {
    zipService = new ZipDownloadService();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Integration Test: End-to-end zip generation flow
   * Tests complete zip creation with all required files
   * Validates: All requirements
   */
  test('complete end-to-end zip generation flow', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate test data
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.string({ minLength: 50 }).map(s => `<System><Body name="test">${s}</Body></System>`),
        async (systemId, systemXml) => {
          // Test 1: Generate zip blob
          const zipBlob = await zipService.generateModZip(systemId, systemXml);
          
          // Verify zip blob properties
          expect(zipBlob).toBeInstanceOf(Blob);
          expect(zipBlob.type).toBe('application/zip');
          expect(zipBlob.size).toBeGreaterThan(0);

          // Test 2: Verify zip can be read back
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(zipBlob);

          // Test 3: Verify zip structure
          const rootFolder = loadedZip.folder(systemId);
          expect(rootFolder).toBeTruthy();

          // Test 4: Verify required files exist
          const systemXmlFile = rootFolder?.file('System.xml');
          const modTomlFile = rootFolder?.file('mod.toml');
          const readmeFile = rootFolder?.file('README.txt');

          expect(systemXmlFile).toBeTruthy();
          expect(modTomlFile).toBeTruthy();
          expect(readmeFile).toBeTruthy();

          // Test 5: Verify file contents
          const extractedSystemXml = await systemXmlFile?.async('string');
          const extractedModToml = await modTomlFile?.async('string');
          const extractedReadme = await readmeFile?.async('string');

          expect(extractedSystemXml).toBe(systemXml);
          expect(extractedModToml).toContain(systemId);
          expect(extractedModToml).toContain('name = "' + systemId + '"');
          expect(extractedModToml).toContain('systems = [ "System.xml" ]');
          expect(extractedReadme).toContain(systemId);
          expect(extractedReadme).toContain('manifest.toml');
          expect(extractedReadme).toContain('id = "' + systemId + '"');
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Integration Test: Error handling scenarios
   * Tests various error conditions and recovery
   * Validates: Requirements 6.2, 6.4
   */
  test('error handling integration scenarios', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.oneof(
          fc.constant(''), // Empty systemId
          fc.constant('   '), // Whitespace-only systemId
          fc.string({ maxLength: 0 }) // Zero-length systemId
        ),
        fc.string({ minLength: 10 }),
        async (invalidSystemId, validXml) => {
          // Test error handling for invalid systemId
          await expect(zipService.generateModZip(invalidSystemId, validXml))
            .rejects
            .toThrow(/system id is required/i);
        }
      ),
      { numRuns: 50 }
    );

    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.oneof(
          fc.constant(''), // Empty XML
          fc.constant('   '), // Whitespace-only XML
          fc.string({ maxLength: 0 }) // Zero-length XML
        ),
        async (validSystemId, invalidXml) => {
          // Test error handling for invalid XML
          await expect(zipService.generateModZip(validSystemId, invalidXml))
            .rejects
            .toThrow(/system xml is required/i);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Integration Test: File template generation
   * Tests that all file templates are generated correctly
   * Validates: Requirements 2.3, 2.4, 2.5
   */
  test('file template generation integration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.string({ minLength: 50 }).map(s => `<System><Body name="test">${s}</Body></System>`),
        async (systemId, systemXml) => {
          const zipBlob = await zipService.generateModZip(systemId, systemXml);
          
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(zipBlob);
          const rootFolder = loadedZip.folder(systemId);

          // Test mod.toml template
          const modTomlFile = rootFolder?.file('mod.toml');
          const modTomlContent = await modTomlFile?.async('string');
          
          expect(modTomlContent).toMatch(/^name = "/);
          expect(modTomlContent).toContain(`name = "${systemId}"`);
          expect(modTomlContent).toContain('description = "A custom system"');
          expect(modTomlContent).toContain('systems = [ "System.xml" ]');

          // Test README.txt template
          const readmeFile = rootFolder?.file('README.txt');
          const readmeContent = await readmeFile?.async('string');
          
          expect(readmeContent).toContain(`Your custom system ${systemId} mod!`);
          expect(readmeContent).toContain('manifest.toml');
          expect(readmeContent).toContain(`id = "${systemId}"`);
          expect(readmeContent).toContain('enabled = true');
          expect(readmeContent).toContain('$HOME\\Documents\\My Games\\Kitten Space Agency\\manifest.toml');

          // Test System.xml is preserved exactly
          const systemXmlFile = rootFolder?.file('System.xml');
          const systemXmlContent = await systemXmlFile?.async('string');
          
          expect(systemXmlContent).toBe(systemXml);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Integration Test: Large system handling
   * Tests performance with larger XML files
   * Validates: Requirements 6.3
   */
  test('large system handling integration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.integer({ min: 100, max: 1000 }), // Number of celestial bodies
        async (systemId, bodyCount) => {
          // Generate a large XML with many celestial bodies
          const bodies = Array.from({ length: bodyCount }, (_, i) => 
            `<Body name="Body${i}" mass="${Math.random() * 1000}" radius="${Math.random() * 100}" />`
          ).join('\n  ');
          
          const largeSystemXml = `<System>\n  ${bodies}\n</System>`;
          
          // Test that large systems can be processed
          const startTime = Date.now();
          const zipBlob = await zipService.generateModZip(systemId, largeSystemXml);
          const endTime = Date.now();
          
          // Verify zip was created successfully
          expect(zipBlob).toBeInstanceOf(Blob);
          expect(zipBlob.size).toBeGreaterThan(largeSystemXml.length); // Should be at least as large as the XML
          
          // Verify reasonable performance (should complete within 5 seconds)
          expect(endTime - startTime).toBeLessThan(5000);
          
          // Verify content integrity
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(zipBlob);
          const rootFolder = loadedZip.folder(systemId);
          const systemXmlFile = rootFolder?.file('System.xml');
          const extractedXml = await systemXmlFile?.async('string');
          
          expect(extractedXml).toBe(largeSystemXml);
          expect(extractedXml).toContain(`Body${bodyCount - 1}`); // Verify last body is present
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Integration Test: Special character handling
   * Tests handling of special characters in systemId and XML
   * Validates: Requirements 2.1, 2.2
   */
  test('special character handling integration', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.string({ minLength: 10 }).map(s => `<System><Body name="Test &amp; Body" description="${s.replace(/[<>&"]/g, '_')}" /></System>`),
        async (systemId, xmlWithSpecialChars) => {
          const zipBlob = await zipService.generateModZip(systemId, xmlWithSpecialChars);
          
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(zipBlob);
          
          // Verify zip structure with special characters
          const rootFolder = loadedZip.folder(systemId);
          expect(rootFolder).toBeTruthy();
          
          // Verify XML with special characters is preserved
          const systemXmlFile = rootFolder?.file('System.xml');
          const extractedXml = await systemXmlFile?.async('string');
          expect(extractedXml).toBe(xmlWithSpecialChars);
          
          // Verify templates handle systemId correctly
          const modTomlFile = rootFolder?.file('mod.toml');
          const modTomlContent = await modTomlFile?.async('string');
          expect(modTomlContent).toContain(`name = "${systemId}"`);
          
          const readmeFile = rootFolder?.file('README.txt');
          const readmeContent = await readmeFile?.async('string');
          expect(readmeContent).toContain(`system ${systemId} mod`);
          expect(readmeContent).toContain(`id = "${systemId}"`);
        }
      ),
      { numRuns: 50 }
    );
  });
});