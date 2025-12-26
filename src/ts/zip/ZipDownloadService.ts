import JSZip from 'jszip';

export interface ModFileContents {
  systemXml: string;
  modToml: string;
  readmeTxt: string;
}

export class ZipDownloadService {
  /**
   * Generates a complete KSA mod zip package
   * @param systemId - The unique identifier for the celestial system
   * @param systemXml - The generated KSA XML content
   * @returns Promise<Blob> - The zip file as a blob
   */
  async generateModZip(systemId: string, systemXml: string): Promise<Blob> {
    const zip = new JSZip();
    
    // Create root folder with systemId name
    const rootFolder = zip.folder(systemId);
    
    if (!rootFolder) {
      throw new Error(`Failed to create root folder: ${systemId}`);
    }
    
    // Generate file contents
    const fileContents = this.generateFileContents(systemId, systemXml);
    
    // Add files to the zip
    rootFolder.file('System.xml', fileContents.systemXml);
    rootFolder.file('mod.toml', fileContents.modToml);
    rootFolder.file('README.txt', fileContents.readmeTxt);
    
    // Generate and return the zip blob
    return await zip.generateAsync({ type: 'blob' });
  }
  
  /**
   * Generates the content for all mod files
   * @param systemId - The unique identifier for the celestial system
   * @param systemXml - The generated KSA XML content
   * @returns ModFileContents - Object containing all file contents
   */
  private generateFileContents(systemId: string, systemXml: string): ModFileContents {
    return {
      systemXml,
      modToml: this.generateModToml(systemId),
      readmeTxt: this.generateReadmeTxt(systemId)
    };
  }
  
  /**
   * Generates mod.toml content with systemId interpolation
   * @param systemId - The unique identifier for the celestial system
   * @returns string - The mod.toml file content
   */
  private generateModToml(systemId: string): string {
    return `name = "${systemId}"
description = "A custom system"
systems = [ "System.xml" ]`;
  }
  
  /**
   * Generates README.txt content with installation instructions
   * @param systemId - The unique identifier for the celestial system
   * @returns string - The README.txt file content
   */
  private generateReadmeTxt(systemId: string): string {
    return `Your custom system ${systemId} mod!

To have KSA enable your mod, you must edit $HOME\\Documents\\My Games\\Kitten Space Agency\\manifest.toml and add the following entry:

[[mods]]
id = "${systemId}"
enabled = true`;
  }
}