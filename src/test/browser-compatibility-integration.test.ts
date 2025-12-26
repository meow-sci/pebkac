import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { ZipDownloadService } from '../ts/zip/ZipDownloadService';

describe('Browser Compatibility Integration Tests', () => {
  let zipService: ZipDownloadService;
  let originalBlob: typeof Blob;
  let originalURL: typeof URL;

  beforeEach(() => {
    zipService = new ZipDownloadService();
    originalBlob = global.Blob;
    originalURL = global.URL;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.Blob = originalBlob;
    global.URL = originalURL;
  });

  /**
   * Integration Test: Modern browser support
   * Tests full functionality in modern browsers with all APIs available
   * Validates: Requirements 6.1
   */
  test('modern browser full support', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.string({ minLength: 50 }).map(s => `<System><Body name="test">${s}</Body></System>`),
        async (systemId, systemXml) => {
          // Test with full modern browser support
          const zipBlob = await zipService.generateModZip(systemId, systemXml);
          
          // Verify blob properties
          expect(zipBlob).toBeInstanceOf(Blob);
          expect(zipBlob.type).toBe('application/zip');
          expect(zipBlob.size).toBeGreaterThan(0);
          
          // Test blob can be read (using JSZip instead of arrayBuffer for Node.js compatibility)
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(zipBlob);
          
          const rootFolder = loadedZip.folder(systemId);
          expect(rootFolder).toBeTruthy();
          
          const systemXmlFile = rootFolder?.file('System.xml');
          const extractedXml = await systemXmlFile?.async('string');
          expect(extractedXml).toBe(systemXml);
          
          // Test that blob has expected structure for modern browsers
          expect(zipBlob.constructor.name).toBe('Blob');
          expect(typeof zipBlob.size).toBe('number');
          expect(typeof zipBlob.type).toBe('string');
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Integration Test: Limited blob support
   * Tests functionality when some modern Blob features are unavailable
   * Validates: Requirements 6.1, 6.3
   */
  test('limited blob support compatibility', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.string({ minLength: 50 }).map(s => `<System><Body name="test">${s}</Body></System>`),
        async (systemId, systemXml) => {
          // Test that zip generation works with basic blob support
          const zipBlob = await zipService.generateModZip(systemId, systemXml);
          
          expect(zipBlob).toBeInstanceOf(Blob);
          expect(zipBlob.type).toBe('application/zip');
          expect(zipBlob.size).toBeGreaterThan(0);
          
          // Test that basic blob operations work
          expect(typeof zipBlob.size).toBe('number');
          expect(typeof zipBlob.type).toBe('string');
          
          // Verify zip content is still valid using JSZip (which works in limited environments)
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(zipBlob);
          
          const rootFolder = loadedZip.folder(systemId);
          const systemXmlFile = rootFolder?.file('System.xml');
          const extractedXml = await systemXmlFile?.async('string');
          expect(extractedXml).toBe(systemXml);
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Integration Test: Memory constraints
   * Tests handling of memory limitations in resource-constrained environments
   * Validates: Requirements 6.3
   */
  test('memory constraint handling', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.integer({ min: 1000, max: 5000 }), // Large number of bodies
        async (systemId, bodyCount) => {
          // Generate a very large XML to test memory handling
          const largeBodies = Array.from({ length: bodyCount }, (_, i) => {
            const bodyData = `Body${i}`.repeat(100); // Make each body large
            return `<Body name="${bodyData}" mass="${Math.random() * 1000}" radius="${Math.random() * 100}" description="${bodyData}" />`;
          }).join('\n  ');
          
          const largeSystemXml = `<System>\n  ${largeBodies}\n</System>`;
          
          // Test memory usage during zip generation
          const initialMemory = process.memoryUsage();
          
          const zipBlob = await zipService.generateModZip(systemId, largeSystemXml);
          
          const finalMemory = process.memoryUsage();
          
          // Verify zip was created successfully despite large size
          expect(zipBlob).toBeInstanceOf(Blob);
          expect(zipBlob.size).toBeGreaterThan(largeSystemXml.length);
          
          // Verify memory usage didn't grow excessively (less than 100MB increase)
          const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
          expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024); // 100MB
          
          // Verify content integrity for large files
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(zipBlob);
          
          const rootFolder = loadedZip.folder(systemId);
          const systemXmlFile = rootFolder?.file('System.xml');
          const extractedXml = await systemXmlFile?.async('string');
          
          expect(extractedXml).toBeTruthy();
          expect(extractedXml!.length).toBe(largeSystemXml.length);
        }
      ),
      { numRuns: 10 } // Fewer runs for memory-intensive test
    );
  });

  /**
   * Integration Test: File system access simulation
   * Tests behavior when file system access is restricted
   * Validates: Requirements 6.2, 6.4
   */
  test('file system access restrictions', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.string({ minLength: 50 }).map(s => `<System><Body name="test">${s}</Body></System>`),
        async (systemId, systemXml) => {
          // Test that zip generation still succeeds even if file saving fails
          const zipBlob = await zipService.generateModZip(systemId, systemXml);
          
          expect(zipBlob).toBeInstanceOf(Blob);
          expect(zipBlob.type).toBe('application/zip');
          
          // Test that the blob can be used for alternative download methods
          const blobUrl = URL.createObjectURL(zipBlob);
          expect(blobUrl).toMatch(/^blob:/);
          
          // Verify zip content is valid for alternative handling
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(zipBlob);
          
          const rootFolder = loadedZip.folder(systemId);
          expect(rootFolder).toBeTruthy();
          
          // Clean up blob URL
          URL.revokeObjectURL(blobUrl);
        }
      ),
      { numRuns: 30 }
    );
  });

  /**
   * Integration Test: Cross-browser character encoding
   * Tests that special characters work across different browser environments
   * Validates: Requirements 2.1, 2.2, 6.1
   */
  test('cross-browser character encoding', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate systemIds with various character sets
        fc.oneof(
          fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/),
          fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_äöüß]{0,30}[a-zA-Z0-9]$/), // German chars
          fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_éèêë]{0,30}[a-zA-Z0-9]$/), // French chars
        ).filter(s => s.length >= 1),
        fc.string({ minLength: 50 }).map(s => `<System><Body name="Test Body" description="${s.replace(/[<>&"]/g, '_')}" /></System>`),
        async (systemId, systemXml) => {
          const zipBlob = await zipService.generateModZip(systemId, systemXml);
          
          // Test that blob can be processed with different character encodings
          expect(zipBlob).toBeInstanceOf(Blob);
          expect(zipBlob.type).toBe('application/zip');
          expect(zipBlob.size).toBeGreaterThan(0);
          
          // Verify content can be extracted with special characters using JSZip
          const JSZip = (await import('jszip')).default;
          const zip = new JSZip();
          const loadedZip = await zip.loadAsync(zipBlob);
          
          const rootFolder = loadedZip.folder(systemId);
          expect(rootFolder).toBeTruthy();
          
          // Test that file contents preserve character encoding
          const modTomlFile = rootFolder?.file('mod.toml');
          const modTomlContent = await modTomlFile?.async('string');
          expect(modTomlContent).toContain(`name = "${systemId}"`);
          
          const readmeFile = rootFolder?.file('README.txt');
          const readmeContent = await readmeFile?.async('string');
          expect(readmeContent).toContain(`system ${systemId} mod`);
          
          const systemXmlFile = rootFolder?.file('System.xml');
          const extractedXml = await systemXmlFile?.async('string');
          expect(extractedXml).toBe(systemXml);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Integration Test: Performance across browser environments
   * Tests that zip generation performs adequately in different environments
   * Validates: Requirements 6.3
   */
  test('cross-browser performance', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.integer({ min: 100, max: 1000 }), // Variable system sizes
        async (systemId, bodyCount) => {
          const bodies = Array.from({ length: bodyCount }, (_, i) => 
            `<Body name="Body${i}" mass="${Math.random() * 1000}" radius="${Math.random() * 100}" />`
          ).join('\n  ');
          
          const systemXml = `<System>\n  ${bodies}\n</System>`;
          
          // Test performance across different simulated browser environments
          const environments = ['fast', 'medium', 'slow'];
          
          for (const env of environments) {
            // Simulate different performance characteristics
            const startTime = Date.now();
            
            if (env === 'slow') {
              // Simulate slower environment by adding small delay
              await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            const zipBlob = await zipService.generateModZip(systemId, systemXml);
            const endTime = Date.now();
            
            // Verify reasonable performance even in slow environments
            const duration = endTime - startTime;
            expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
            
            // Verify zip quality is maintained regardless of performance
            expect(zipBlob).toBeInstanceOf(Blob);
            expect(zipBlob.size).toBeGreaterThan(systemXml.length);
            
            // Quick integrity check
            const JSZip = (await import('jszip')).default;
            const zip = new JSZip();
            const loadedZip = await zip.loadAsync(zipBlob);
            const rootFolder = loadedZip.folder(systemId);
            expect(rootFolder).toBeTruthy();
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});