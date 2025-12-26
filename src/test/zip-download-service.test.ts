import { describe, test, expect } from 'vitest';
import fc from 'fast-check';
import JSZip from 'jszip';
import { ZipDownloadService, ZipDownloadError } from '../ts/zip/ZipDownloadService';

describe('ZipDownloadService', () => {
  
  /**
   * Property 2: Zip structure correctness
   * Feature: add-zip-download, Property 2: Zip structure correctness
   * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5
   */
  test('zip structure correctness property', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate systemId: alphanumeric strings with some special characters
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        // Generate XML content: non-empty strings that look like XML
        fc.string({ minLength: 10 }).map(s => `<System>${s}</System>`),
        async (systemId, systemXml) => {
          const service = new ZipDownloadService();
          
          // Generate the zip
          const zipBlob = await service.generateModZip(systemId, systemXml);
          
          // Load the zip to verify structure
          // Convert blob to ArrayBuffer for JSZip compatibility
          const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as ArrayBuffer);
            reader.onerror = reject;
            reader.readAsArrayBuffer(zipBlob);
          });
          const zip = await JSZip.loadAsync(arrayBuffer);
          
          // Requirement 2.1: Root folder named with systemId
          const rootFolderName = Object.keys(zip.files).find(name => 
            name === `${systemId}/` || name.startsWith(`${systemId}/`)
          )?.split('/')[0];
          expect(rootFolderName).toBe(systemId);
          
          // Requirement 2.2: System.xml file with provided content
          const systemXmlFile = zip.files[`${systemId}/System.xml`];
          expect(systemXmlFile).toBeDefined();
          const systemXmlContent = await systemXmlFile.async('string');
          expect(systemXmlContent).toBe(systemXml);
          
          // Requirement 2.3: mod.toml file with systemId interpolated
          const modTomlFile = zip.files[`${systemId}/mod.toml`];
          expect(modTomlFile).toBeDefined();
          const modTomlContent = await modTomlFile.async('string');
          expect(modTomlContent).toContain(`name = "${systemId}"`);
          expect(modTomlContent).toContain('description = "A custom system"');
          expect(modTomlContent).toContain('systems = [ "System.xml" ]');
          
          // Requirement 2.4: README.txt file with systemId in instructions
          const readmeFile = zip.files[`${systemId}/README.txt`];
          expect(readmeFile).toBeDefined();
          const readmeContent = await readmeFile.async('string');
          expect(readmeContent).toContain(`Your custom system ${systemId} mod!`);
          expect(readmeContent).toContain(`id = "${systemId}"`);
          expect(readmeContent).toContain('enabled = true');
          
          // Requirement 2.5: Exactly three files in the root folder
          const filesInRoot = Object.keys(zip.files).filter(name => 
            name.startsWith(`${systemId}/`) && 
            !name.endsWith('/') && 
            name.split('/').length === 2
          );
          expect(filesInRoot).toHaveLength(3);
          expect(filesInRoot).toContain(`${systemId}/System.xml`);
          expect(filesInRoot).toContain(`${systemId}/mod.toml`);
          expect(filesInRoot).toContain(`${systemId}/README.txt`);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 6: Error handling
   * Feature: add-zip-download, Property 6: Error handling
   * Validates: Requirements 6.2, 6.4
   */
  test('error handling property', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate invalid inputs and error scenarios
        fc.oneof(
          // Invalid systemId cases
          fc.record({
            systemId: fc.oneof(
              fc.constant(''), // empty string
              fc.constant('   '), // whitespace only
              fc.constant(null as any), // null
              fc.constant(undefined as any), // undefined
              fc.constant(123 as any) // wrong type
            ),
            systemXml: fc.string({ minLength: 1 }).map(s => `<System>${s}</System>`),
            expectedError: fc.constant('System ID is required and must be a non-empty string')
          }),
          // Invalid systemXml cases
          fc.record({
            systemId: fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
            systemXml: fc.oneof(
              fc.constant(''), // empty string
              fc.constant('   '), // whitespace only
              fc.constant(null as any), // null
              fc.constant(undefined as any), // undefined
              fc.constant(456 as any) // wrong type
            ),
            expectedError: fc.constant('System XML is required and must be a non-empty string')
          })
        ),
        async ({ systemId, systemXml, expectedError }) => {
          const service = new ZipDownloadService();
          
          // Requirement 6.2: Appropriate error messages for library failures
          try {
            await service.generateModZip(systemId, systemXml);
            // Should not reach here - expect an error to be thrown
            expect.fail('Expected ZipDownloadError to be thrown');
          } catch (error) {
            // Requirement 6.4: Clear error messaging
            expect(error).toBeInstanceOf(ZipDownloadError);
            if (error instanceof ZipDownloadError) {
              expect(error.message).toBe(expectedError);
              expect(error.name).toBe('ZipDownloadError');
            }
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});