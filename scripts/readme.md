## Using the Pebkac pebkac-orbital-updates.ps1 script! 

--- 

You can download the powershell script pebkac-orbital-updates.ps1 to generate your own orbital data for solar bodies 
and paste the results into the Pebkac website tool to generate that data into XML format to use in KSA solar system XML files 

- look inside the .ps1 script file at the top for instructions on entering your own objects 
- Look inside the .ps1 script file near the top for settings variables 
- look inside the solar-bodies-seed-file.csv file for examples if creating your own list of solar bodies to process 

--- 

- Have powershell installed 
    - Windows - either the default OS installed Powershell 5 (call terminal with 'powershell), 
        or install Powershell 7 (call terminal with 'pwsh') 
    - Linux / MacOS - install Powershell 7 Powershell 7 

Windows 
- Open a terminal (powershell or pwsh) prompt in the folder where the script and 'solar-bodies-seed-file.csv' file are both placed 
- Run the script by entering (exactly)~:  ./pebkac-orbital-updates.ps1 
- Wait for the results 

Linux / MacOS 
- Open a terminal 
- Run the script by entering (exactly)~:  pwsh -File ./pebkac-orbital-updates.ps1 
- Wait for the results 

--- 

After the data is harvested / generated, you can copy/paste the new data in orbital-bodies-seed-file_updated.csv to 
the Pebkac website tool if you wish 