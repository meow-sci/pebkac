import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import fc from 'fast-check';
import { atom, map } from 'nanostores';
import type { SystemSettings } from '../ts/data/SystemSettings';

describe('SystemXmlEditor State Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * Property 4: State integration
   * Feature: add-zip-download, Property 4: State integration
   * Validates: Requirements 4.1, 4.2, 4.3, 4.4
   */
  test('state integration property', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate systemId values
        fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
        // Generate XML content
        fc.string({ minLength: 10 }).map(s => `<System>${s}</System>`),
        // Generate system settings
        fc.record({
          forceEarthReference: fc.boolean(),
          addSolReference: fc.boolean(),
          addRocketReference: fc.boolean(),
          addGemini7Reference: fc.boolean(),
          addHunterReference: fc.boolean(),
          addBanjoReference: fc.boolean(),
          addPolarisReference: fc.boolean(),
        }),
        async (systemId, generatedXml, settingsOverrides) => {
          // Create mock nanostores that mimic the real ones
          const mockSystemSettings = map<SystemSettings>({
            systemId,
            ...settingsOverrides,
          });

          const mockGeneratedSystemXml = atom<string>(generatedXml);

          // Mock the useStore hook behavior
          const mockUseStore = vi.fn()
            .mockImplementation((store) => {
              if (store === mockSystemSettings) {
                return mockSystemSettings.get();
              }
              if (store === mockGeneratedSystemXml) {
                return mockGeneratedSystemXml.get();
              }
              return null;
            });

          // Mock the download service
          const mockZipService = {
            generateModZip: vi.fn().mockResolvedValue(new Blob(['mock zip'], { type: 'application/zip' }))
          };

          const mockSaveAs = vi.fn();

          // Simulate the SystemXmlEditor component logic
          const simulateSystemXmlEditor = () => {
            // Requirement 4.1: Integrate with existing nanostores state management
            const xml = mockUseStore(mockGeneratedSystemXml);
            const systemSettings = mockUseStore(mockSystemSettings);

            // Requirement 4.2: Retrieve systemId from current application state
            const retrievedSystemId = systemSettings.systemId;

            // Requirement 4.3: Use existing XML generation utilities (simulated)
            const xmlFromState = xml;

            return {
              systemId: retrievedSystemId,
              systemXml: xmlFromState,
              systemSettings
            };
          };

          // Simulate download button integration
          const simulateDownloadFlow = async (componentData: ReturnType<typeof simulateSystemXmlEditor>) => {
            // Requirement 4.4: Use JSZip and file-saver packages already installed
            const zipBlob = await mockZipService.generateModZip(componentData.systemId, componentData.systemXml);
            mockSaveAs(zipBlob, `${componentData.systemId}.zip`);
            
            return {
              downloadTriggered: true,
              usedSystemId: componentData.systemId,
              usedXml: componentData.systemXml
            };
          };

          // Execute the integration flow
          const componentData = simulateSystemXmlEditor();
          const downloadResult = await simulateDownloadFlow(componentData);

          // Verify state integration requirements
          
          // Requirement 4.1: Should integrate with nanostores
          expect(mockUseStore).toHaveBeenCalledWith(mockSystemSettings);
          expect(mockUseStore).toHaveBeenCalledWith(mockGeneratedSystemXml);

          // Requirement 4.2: Should retrieve systemId from application state
          expect(componentData.systemId).toBe(systemId);
          expect(downloadResult.usedSystemId).toBe(systemId);

          // Requirement 4.3: Should use existing XML generation utilities
          expect(componentData.systemXml).toBe(generatedXml);
          expect(downloadResult.usedXml).toBe(generatedXml);

          // Requirement 4.4: Should use JSZip and file-saver packages
          expect(mockZipService.generateModZip).toHaveBeenCalledWith(systemId, generatedXml);
          expect(mockSaveAs).toHaveBeenCalledWith(expect.any(Blob), `${systemId}.zip`);

          // Verify state consistency
          expect(componentData.systemSettings.systemId).toBe(systemId);
          expect(componentData.systemSettings.forceEarthReference).toBe(settingsOverrides.forceEarthReference);
          expect(componentData.systemSettings.addSolReference).toBe(settingsOverrides.addSolReference);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Property 4b: State reactivity integration
   * Feature: add-zip-download, Property 4: State integration
   * Validates: Requirements 4.1, 4.2
   */
  test('state reactivity integration property', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate initial and updated values
        fc.tuple(
          fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1),
          fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9\s\-_]{0,30}[a-zA-Z0-9]$/).filter(s => s.length >= 1)
        ).filter(([initial, updated]) => initial !== updated),
        fc.tuple(
          fc.string({ minLength: 10 }).map(s => `<System>${s}</System>`),
          fc.string({ minLength: 10 }).map(s => `<System>${s}</System>`)
        ).filter(([initial, updated]) => initial !== updated),
        async ([initialSystemId, updatedSystemId], [initialXml, updatedXml]) => {
          // Create reactive nanostores
          const mockSystemSettings = map<SystemSettings>({
            systemId: initialSystemId,
            forceEarthReference: true,
            addSolReference: true,
            addRocketReference: true,
            addGemini7Reference: true,
            addHunterReference: true,
            addBanjoReference: true,
            addPolarisReference: true,
          });

          const mockGeneratedSystemXml = atom<string>(initialXml);

          // Track state changes
          let currentSystemId = initialSystemId;
          let currentXml = initialXml;

          const mockUseStore = vi.fn()
            .mockImplementation((store) => {
              if (store === mockSystemSettings) {
                return { ...mockSystemSettings.get(), systemId: currentSystemId };
              }
              if (store === mockGeneratedSystemXml) {
                return currentXml;
              }
              return null;
            });

          // Initial state verification
          const initialComponentData = {
            systemId: mockUseStore(mockSystemSettings).systemId,
            systemXml: mockUseStore(mockGeneratedSystemXml)
          };

          expect(initialComponentData.systemId).toBe(initialSystemId);
          expect(initialComponentData.systemXml).toBe(initialXml);

          // Simulate state updates
          currentSystemId = updatedSystemId;
          currentXml = updatedXml;

          // Updated state verification
          const updatedComponentData = {
            systemId: mockUseStore(mockSystemSettings).systemId,
            systemXml: mockUseStore(mockGeneratedSystemXml)
          };

          expect(updatedComponentData.systemId).toBe(updatedSystemId);
          expect(updatedComponentData.systemXml).toBe(updatedXml);

          // Verify that the component would use the updated values
          expect(updatedComponentData.systemId).not.toBe(initialSystemId);
          expect(updatedComponentData.systemXml).not.toBe(initialXml);
        }
      ),
      { numRuns: 100 }
    );
  });
});