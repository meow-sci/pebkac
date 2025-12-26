# Implementation Plan: Add Zip Download

## Overview

This implementation plan breaks down the zip download feature into discrete coding tasks that build incrementally. Each task focuses on a specific component or functionality, with testing integrated throughout to catch issues early.

## Tasks

- [x] 1. Create zip download service
  - Implement ZipDownloadService class with JSZip integration
  - Add methods for generating mod.toml and README.txt templates
  - Create zip structure with systemId folder and required files
  - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 1.1 Write property test for zip structure
  - **Property 2: Zip structure correctness**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

- [x] 2. Create download button component
  - Implement DownloadButton React component with loading states
  - Add click handler that calls zip service and file-saver
  - Integrate with existing UI patterns and styling
  - _Requirements: 1.1, 1.3, 3.1, 3.2, 3.3_

- [x] 2.1 Write property test for download flow
  - **Property 1: Complete zip download flow**
  - **Validates: Requirements 1.1, 1.3, 1.4**

- [x] 2.2 Write property test for loading state management
  - **Property 3: Loading state management**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 3. Integrate download button with SystemXmlEditor
  - Add DownloadButton to existing SystemXmlEditor component
  - Connect with nanostores for systemId and generated XML
  - Ensure proper styling and layout within existing tab
  - _Requirements: 4.1, 4.2, 4.3_

- [x] 3.1 Write property test for state integration
  - **Property 4: State integration**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4**

- [x] 4. Create installation instructions page
  - Implement InstallationInstructions React component
  - Add template rendering for systemId interpolation
  - Include extraction path and manifest.toml instructions
  - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 4.1 Write property test for instruction page rendering
  - **Property 5: Instruction page rendering**
  - **Validates: Requirements 5.1, 5.3**

- [x] 5. Add navigation to instruction page
  - Create new tab or route for installation instructions
  - Implement navigation logic after successful download
  - Update BuilderPage component with new tab if needed
  - _Requirements: 1.4, 5.1_

- [ ] 6. Implement error handling
  - Add try-catch blocks for JSZip and file-saver operations
  - Create error state management and user feedback
  - Add retry functionality for failed downloads
  - _Requirements: 3.4, 6.2, 6.4_

- [ ] 6.1 Write property test for error handling
  - **Property 6: Error handling**
  - **Validates: Requirements 6.2, 6.4**

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Integration and final wiring
  - Connect all components together in the application
  - Test complete user flow from button click to instruction page
  - Verify zip downloads work in browser environment
  - _Requirements: All requirements_

- [ ] 8.1 Write integration tests
  - Test end-to-end download flow
  - Test browser compatibility scenarios
  - _Requirements: All requirements_

- [ ] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- All tasks include comprehensive testing from the beginning
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- JSZip and file-saver libraries are already installed in the project
- Integration with existing nanostores state management is required
- All components should follow existing React Aria Components patterns