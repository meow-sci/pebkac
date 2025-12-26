# Requirements Document

## Introduction

This feature adds zip download functionality to the PEBKAC application, allowing users to download their generated KSA XML files along with supporting data as a convenient zip archive. This enhances the user experience by providing a single download containing all necessary files for KSA mod integration.

## Glossary

- **PEBKAC_System**: The web-based celestial body conversion application
- **KSA_XML**: Kitten Space Agency XML format files for game mod integration
- **Zip_Archive**: A compressed file containing multiple files and folders created using JSZip
- **Download_Manager**: Component responsible for handling file downloads using file-saver
- **System_ID**: The unique identifier for the celestial system from application state
- **Mod_Package**: Complete KSA mod structure with required files and folder organization

## Requirements

### Requirement 1

**User Story:** As a KSA modder, I want to download my generated system as a zip file, so that I can easily import all necessary files into my game mod folder.

#### Acceptance Criteria

1. WHEN a user clicks a download zip button, THE PEBKAC_System SHALL generate a zip archive using the JSZip library
2. WHEN generating the zip archive, THE PEBKAC_System SHALL create the archive entirely on the client-side without server interaction
3. WHEN the zip is created, THE PEBKAC_System SHALL trigger a browser download using the file-saver library
4. WHEN the download completes, THE PEBKAC_System SHALL navigate to a success page with installation instructions

### Requirement 2

**User Story:** As a user, I want the zip to contain properly organized files, so that I can understand the structure and easily use the contents.

#### Acceptance Criteria

1. THE Zip_Archive SHALL contain a root folder named with the current systemId value from application state
2. THE Zip_Archive SHALL contain a "System.xml" file inside the root folder with the generated KSA XML content
3. THE Zip_Archive SHALL contain a "mod.toml" file with name and description fields populated using the systemId
4. THE Zip_Archive SHALL contain a "README.txt" file with installation instructions referencing the systemId
5. THE Mod_Package SHALL follow the exact structure required for KSA mod integration

### Requirement 3

**User Story:** As a user, I want visual feedback during zip creation, so that I know the download process is working.

#### Acceptance Criteria

1. WHEN zip generation starts, THE PEBKAC_System SHALL display a loading indicator or progress feedback
2. WHILE the zip is being created, THE PEBKAC_System SHALL prevent multiple simultaneous download attempts
3. WHEN zip generation completes successfully, THE PEBKAC_System SHALL clear the loading indicator
4. IF zip generation fails, THEN THE PEBKAC_System SHALL display an error message and restore normal state

### Requirement 4

**User Story:** As a developer, I want the zip functionality to integrate seamlessly with existing code, so that it doesn't disrupt current workflows.

#### Acceptance Criteria

1. THE Download_Manager SHALL integrate with the existing nanostores state management system
2. THE Download_Manager SHALL retrieve the systemId from the current application state
3. WHEN generating files for the zip, THE PEBKAC_System SHALL use existing XML generation utilities
4. THE Download_Manager SHALL use JSZip and file-saver packages that are already installed in the project

### Requirement 5

**User Story:** As a user, I want clear installation instructions after download, so that I know exactly how to install my custom system mod.

#### Acceptance Criteria

1. WHEN the zip download is initiated, THE PEBKAC_System SHALL navigate to an instruction page
2. THE instruction page SHALL display directions to extract the zip to "C:\Program Files\Kitten Space Agency\Content"
3. THE instruction page SHALL display the manifest.toml editing instructions with the specific systemId
4. THE instruction page SHALL provide the exact text format needed for the manifest.toml entry

### Requirement 6

**User Story:** As a user, I want the download to work reliably across different browsers, so that I can use the feature regardless of my browser choice.

#### Acceptance Criteria

1. THE Download_Manager SHALL support zip downloads in modern browsers using JSZip and file-saver
2. WHEN JSZip or file-saver libraries fail, THE PEBKAC_System SHALL display appropriate error messages
3. THE Download_Manager SHALL handle zip generation without memory issues for typical system sizes
4. WHEN download fails, THE PEBKAC_System SHALL provide clear error messaging and allow retry