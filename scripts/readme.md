## Using the Pebkac pebkac-orbital-updates.ps1 script! 

--- 

You can download the powershell script `pebkac-orbital-updates.ps1` to generate your own orbital data for solar bodies 
and paste the results into the Pebkac website tool to generate that data into XML format to use in KSA solar system XML files 

- look inside the .ps1 script file at the top for instructions on entering your own objects 
- Look inside the .ps1 script file near the top for settings variables 
- look inside the solar-bodies-seed-file.csv file for examples if creating your own list of solar bodies to process 

--- 

### Running the script

- Have powershell installed 
    - Windows - either the default OS installed Powershell 5 (call terminal with 'powershell'), 
        or install Powershell 7 (call terminal with 'pwsh') 
    - Linux / MacOS - install Powershell 7

Windows 
- Open a terminal (powershell or pwsh) prompt in the folder where the script and 'solar-bodies-seed-file.csv' file are both placed 
- Run the script by entering (exactly)~:  `./pebkac-orbital-updates.ps1` 
- Wait for the results 

Linux / MacOS 
- Open a terminal 
- Run the script by entering (exactly)~:  `pwsh -File ./pebkac-orbital-updates.ps1` 
- Wait for the results 

--- 

### Using the data

After the data is harvested / generated, you can copy/paste the new data in `orbital-bodies-seed-file_updated.csv` to 
the Pebkac website tool if you wish 

---

### CLI parameters

If no parameters are passed to the script when running, it will use the currently saved settings values and run through the entire solar-bodies-seed-file.csv, or whatever CSV file is set.

Some parameters may be passed to the script to do a few things rather than let the script run and simply use the settings set inside.
To see what the current possible parameters are - use the `-get help` parameter when running the script
- Windows  
  ```./pebkac-orbital-updates -get help```  
  
- Linux / MacOS  
  ```pwsh -File ./pebkac-orbital-updates.ps1 -get help```  
  
---

### Terms legend

- `EPOCH` - The time calculations are made for - Julian date (JD)
- `REF_FRAME` - The coordinate plane that orbital elements to be referenced off of - 'Ecliptic' (wrt the J2000 ecliptic) or 'Equitorial' (wrt the parent body equator)
- `ROT_FRAME` - The coordinate plane that body tilt and rotation is referenced off of - 'Ecliptic' (wrt the J2000 ecliptic) or 'Perifocal' (wrt the orbit's focus)
- `TILT_OBLIQUITY` - The tilt in degrees from the reference frame being used
- `TILT_AZIMUTH_DEG` - The coordinate rotation in degrees where the TILT_OBLIQUITY is rotated to.
- `PARENT_ROT_LONG` - The parent's rotational longitude at the time
- `MEAN_RADIUS_KM` - The body's mean radius in KM
- `GM_KM3/S2` - The gravitational parameter for the body.  The value used for GM is the produce of the mass (in kg) times the gravitational constant (in km^3*kg^-1*s^-2)
- `SIDEREAL_PERIOD_SEC` - The body's period for one full rotation on its axis relative to the fixed stars - in seconds
- `RETROGRADE_ROT` - If the body rotates clockwise (most bodies in the solar system rotate counter-clockwise) - TRUE or FALSE
- `GROUP` - A name you can enter for helpful sorting in the Pebkac website selection table
- `BODY_TYPE` - A KSA body type to use during XML generation - 'PlanetaryBody, Asteroid, MinorBody, Comet, AtmosphericBody'


---






---


