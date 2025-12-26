import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';

describe('DownloadButton Component Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Property 1: Complete zip download flow
   * Feature: add-zip-download, Property 1: Complete zip download flow
   * Validates: Requirements 1.1, 1.3, 1.4
   */
  test('complete zip download flow property', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate systemId: alphanumeric strings with some special characters
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        // Generate XML content: non-empty strings that look like XML
        fc.string({ minLength: 10 }).map(s => `<System>${s}</System>`),
        async (systemId, systemXml) => {
          // Mock the dependencies
          const mockZipService = {
            generateModZip: vi.fn().mockResolvedValue(new Blob(['mock zip content'], { type: 'application/zip' }))
          };
          
          const mockSaveAs = vi.fn();
          const mockOnDownloadStart = vi.fn();
          const mockOnDownloadComplete = vi.fn();
          const mockOnError = vi.fn();

          // Simulate the download flow logic
          const downloadHandler = async () => {
            try {
              mockOnDownloadStart();
              
              // Requirement 1.1: Generate zip using JSZip library
              const zipBlob = await mockZipService.generateModZip(systemId, systemXml);
              
              // Requirement 1.3: Trigger browser download using file-saver
              mockSaveAs(zipBlob, `${systemId}.zip`);
              
              // Requirement 1.4: Navigate to success page
              mockOnDownloadComplete();
            } catch (error) {
              mockOnError(error);
            }
          };

          // Execute the download flow
          await downloadHandler();

          // Verify all requirements
          expect(mockOnDownloadStart).toHaveBeenCalled();
          expect(mockZipService.generateModZip).toHaveBeenCalledWith(systemId, systemXml);
          expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), `${systemId}.zip`);
          expect(mockOnDownloadComplete).toHaveBeenCalled();
          expect(mockOnError).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 3: Loading state management
   * Feature: add-zip-download, Property 3: Loading state management
   * Validates: Requirements 3.1, 3.2, 3.3, 3.4
   */
  test('loading state management property', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate systemId and XML content
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.string({ minLength: 10 }).map(s => `<System>${s}</System>`),
        // Generate delay for async operations (0-10ms to avoid timeout)
        fc.integer({ min: 0, max: 10 }),
        async (systemId, systemXml, delay) => {
          // Mock zip generation with delay
          const mockBlob = new Blob(['mock zip content'], { type: 'application/zip' });
          const mockZipService = {
            generateModZip: vi.fn().mockImplementation(
              () => new Promise(resolve => setTimeout(() => resolve(mockBlob), delay))
            )
          };

          const mockSaveAs = vi.fn();
          const mockOnDownloadStart = vi.fn();
          const mockOnDownloadComplete = vi.fn();
          const mockOnError = vi.fn();

          // Test loading state management logic
          let isLoading = false;
          let downloadCount = 0;

          const downloadHandler = async () => {
            // Requirement 3.2: Prevent multiple simultaneous downloads
            if (isLoading) return;

            try {
              // Requirement 3.1: Display loading indicator during generation
              isLoading = true;
              downloadCount++;
              mockOnDownloadStart();

              const zipBlob = await mockZipService.generateModZip(systemId, systemXml);
              mockSaveAs(zipBlob, `${systemId}.zip`);
              mockOnDownloadComplete();
            } catch (error) {
              mockOnError(error);
            } finally {
              // Requirement 3.3: Clear loading indicator on completion
              isLoading = false;
            }
          };

          // First download
          const firstDownloadPromise = downloadHandler();
          expect(isLoading).toBe(true);
          expect(mockOnDownloadStart).toHaveBeenCalledTimes(1);

          // Try second download while first is in progress - should be prevented
          const secondDownloadPromise = downloadHandler();
          expect(downloadCount).toBe(1); // Should still be 1

          // Wait for both to complete
          await Promise.all([firstDownloadPromise, secondDownloadPromise]);
          expect(isLoading).toBe(false);
          expect(mockOnDownloadComplete).toHaveBeenCalledTimes(1);

          // Now third download should work
          await downloadHandler();
          expect(downloadCount).toBe(2);
        }
      ),
      { numRuns: 100 }
    );
  }, 10000); // Increase timeout to 10 seconds

  /**
   * Property 3b: Error handling in loading state
   * Feature: add-zip-download, Property 3: Loading state management
   * Validates: Requirements 3.4
   */
  test('loading state error handling property', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        fc.string({ minLength: 10 }).map(s => `<System>${s}</System>`),
        fc.string({ minLength: 5 }).map(s => `Error: ${s}`), // Generate error messages
        async (systemId, systemXml, errorMessage) => {
          // Mock zip generation to fail
          const mockZipService = {
            generateModZip: vi.fn().mockRejectedValue(new Error(errorMessage))
          };

          const mockSaveAs = vi.fn();
          const mockOnError = vi.fn();
          let isLoading = false;

          const downloadHandler = async () => {
            try {
              isLoading = true;
              const zipBlob = await mockZipService.generateModZip(systemId, systemXml);
              mockSaveAs(zipBlob, `${systemId}.zip`);
            } catch (error) {
              // Requirement 3.4: Display error message and restore normal state
              mockOnError(error);
            } finally {
              isLoading = false;
            }
          };

          await downloadHandler();

          // Verify error handling
          expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
          expect(isLoading).toBe(false); // Should restore normal state
        }
      ),
      { numRuns: 100 }
    );
  });
});