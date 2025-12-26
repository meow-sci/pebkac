# Design Document: Add Zip Download

## Overview

This design implements zip download functionality for the PEBKAC application, allowing users to download their generated KSA system as a complete mod package. The solution leverages existing client-side libraries (JSZip and file-saver) and integrates seamlessly with the current nanostores-based state management system.

The feature adds a download button to the System XML tab that generates a properly structured KSA mod zip file and provides post-download installation instructions.

## Architecture

### High-Level Flow
1. User clicks download button in System XML tab
2. Zip generation service creates mod package using current application state
3. Browser downloads zip file using file-saver
4. Application navigates to instruction page with installation steps

### Integration Points
- **State Management**: Integrates with existing nanostores (`$systemSettings`, `$generatedSystemXml`)
- **UI Components**: Adds download button to existing SystemXmlEditor component
- **Navigation**: Uses existing React Aria Components tab system for instruction page
- **Libraries**: Utilizes pre-installed JSZip and file-saver packages

## Components and Interfaces

### ZipDownloadService
**Purpose**: Core service for generating KSA mod zip packages

```typescript
interface ZipDownloadService {
  generateModZip(systemId: string, systemXml: string): Promise<Blob>
}

interface ModFileContents {
  systemXml: string
  modToml: string
  readmeTxt: string
}
```

**Responsibilities**:
- Create JSZip instance with proper folder structure
- Generate mod.toml content with systemId interpolation
- Generate README.txt content with installation instructions
- Return zip blob for download

### DownloadButton Component
**Purpose**: UI component for triggering zip download

```typescript
interface DownloadButtonProps {
  systemId: string
  systemXml: string
  onDownloadStart?: () => void
  onDownloadComplete?: () => void
  onError?: (error: Error) => void
}
```

**Responsibilities**:
- Display download button with loading states
- Handle click events and error states
- Trigger navigation to instruction page on success

### InstallationInstructions Component
**Purpose**: Post-download instruction page

```typescript
interface InstallationInstructionsProps {
  systemId: string
}
```

**Responsibilities**:
- Display extraction instructions for Windows path
- Show manifest.toml editing instructions
- Provide copy-paste ready configuration text

## Data Models

### Zip Structure
```
[systemId]/
├── System.xml          # Generated KSA XML
├── mod.toml           # Mod configuration
└── README.txt         # Installation instructions
```

### File Templates

**mod.toml Template**:
```toml
name = "[systemId]"
description = "A custom system"
systems = [ "System.xml" ]
```

**README.txt Template**:
```
Your custom system [systemId] mod!

To have KSA enable your mod, you must edit %HOME%\Documents\My Games\Kitten Space Agency\manifest.toml and add the following entry:

[[mods]]
id = "[systemId]"
enabled = true
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Complete zip download flow
*For any* valid systemId and generated XML, clicking the download button should generate a zip using JSZip, trigger download with file-saver, and navigate to the instruction page.
**Validates: Requirements 1.1, 1.3, 1.4**

### Property 2: Zip structure correctness
*For any* systemId and XML content, the generated zip should contain a root folder named with the systemId, containing exactly three files: System.xml with the provided content, mod.toml with systemId interpolated, and README.txt with systemId in installation instructions.
**Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

### Property 3: Loading state management
*For any* download operation, the system should display loading indicators during zip generation, prevent concurrent downloads, and clear loading state on completion or error.
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 4: State integration
*For any* application state, the download manager should retrieve systemId from nanostores, use existing XML generation utilities, and integrate with current state management patterns.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 5: Instruction page rendering
*For any* systemId, the instruction page should display the correct extraction path and manifest.toml instructions with the systemId properly interpolated.
**Validates: Requirements 5.1, 5.3**

### Property 6: Error handling
*For any* library failure or download error, the system should display appropriate error messages and allow retry while maintaining application stability.
**Validates: Requirements 6.2, 6.4**

## Error Handling

### JSZip Library Errors
- **Zip Creation Failures**: Catch JSZip exceptions during zip generation and display user-friendly error messages
- **Memory Limitations**: Handle large system data gracefully, potentially with size warnings
- **Browser Compatibility**: Graceful degradation if JSZip features are unavailable

### File-Saver Library Errors
- **Download Failures**: Catch file-saver exceptions and provide retry options
- **Browser Restrictions**: Handle cases where downloads are blocked by browser security
- **File System Errors**: Manage scenarios where user's file system is full or restricted

### State Management Errors
- **Missing Data**: Validate that systemId and XML content exist before zip generation
- **Invalid State**: Handle edge cases where application state is corrupted or incomplete
- **Concurrent Operations**: Prevent race conditions during zip generation

### User Experience Errors
- **Network Issues**: Handle offline scenarios gracefully
- **Navigation Failures**: Ensure instruction page loads even if navigation encounters issues
- **UI State Recovery**: Restore normal UI state after any error condition

## Testing Strategy

### Unit Testing Approach
- **Component Testing**: Test DownloadButton component with various props and states
- **Service Testing**: Test ZipDownloadService with different input combinations
- **Template Testing**: Verify mod.toml and README.txt generation with various systemIds
- **Error Scenarios**: Test error handling for library failures and invalid inputs

### Property-Based Testing Configuration
- **Framework**: Vitest with fast-check for property-based testing
- **Test Iterations**: Minimum 100 iterations per property test
- **Input Generation**: Smart generators for systemIds (alphanumeric, special characters, edge cases)
- **Zip Validation**: Custom assertions for zip structure and content verification

### Property Test Implementation
Each correctness property will be implemented as a property-based test:

1. **Property 1 Test**: Generate random systemIds and XML, verify complete download flow
   - **Tag**: Feature: add-zip-download, Property 1: Complete zip download flow

2. **Property 2 Test**: Generate random systemIds and content, verify zip structure
   - **Tag**: Feature: add-zip-download, Property 2: Zip structure correctness

3. **Property 3 Test**: Test loading states across various async scenarios
   - **Tag**: Feature: add-zip-download, Property 3: Loading state management

4. **Property 4 Test**: Verify state integration with different nanostores configurations
   - **Tag**: Feature: add-zip-download, Property 4: State integration

5. **Property 5 Test**: Generate random systemIds, verify instruction page content
   - **Tag**: Feature: add-zip-download, Property 5: Instruction page rendering

6. **Property 6 Test**: Simulate various error conditions, verify error handling
   - **Tag**: Feature: add-zip-download, Property 6: Error handling

### Integration Testing
- **End-to-End Flow**: Test complete user journey from button click to instruction page
- **Browser Testing**: Verify functionality across Chrome, Firefox, Safari, Edge
- **File System Integration**: Test actual zip download and extraction on different operating systems
- **State Persistence**: Verify application state remains consistent after download operations

### Test Utilities
- **Zip Assertion Helpers**: Custom utilities for validating zip structure and content
- **Mock Services**: Mock JSZip and file-saver for isolated testing
- **State Generators**: Utilities for generating valid application state for testing
- **Error Simulators**: Tools for simulating various error conditions

<function_calls>
<invoke name="prework">
<parameter name="featureName">add-zip-download