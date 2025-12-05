# Script to get osculating orbital elements from JPL Horizons system for a list of targets specified in an input CSV file.

# The input CSV list is REQUIRED to have a header using AT LEAST these non-zero values entered: 
# ID,ID_JPLREF,PARENT,PARENT_JPLREF,EPOCH,REF_FRAME,A_SEMI_MAJOR_AXIS_KM,EC_ECCENTRICITY,W_ARG_PERIAPSIS_DEG,TP_TIME_DAYS,MA_MEAN_ANOMALY_DEG,IN_INCLINATION_DEG,OM_LONGITUDE_ASCENDING_NODE_DEG,PR_SIDEREAL_ORBIT_PERIOD_SEC,ROT_FRAME,TILT_OBLIQUITY_DEG,TILT_AZIMUTH_DEG,PARENT_ROT_LONG,MEAN_RADIUS_KM,GM_KM3/S2,SIDEREAL_PERIOD_SEC,RETROGRADE_ROT,GROUP,BODY_TYPE
#
# (Example data lines below the header with 0 values not needing entries - use a spreadsheet to or text editor extention to align columns.)
# Vesta,A807%20FA,Sol,10,2451545,Ecliptic,353280597.821,0.0900,149.587,69.8708,341.024,7.134,103.951,0,Ecliptic,32.276,240.826,111.467,261.4,17.288,19224,FALSE,Asteroid,Asteroid
# Sedna,90377,Sol,10,2451545,Ecliptic,0,0,0,0,0,0,0,0,Ecliptic,0,0,0,453,266.9,36982,FALSE,Trans-Neptunian,Asteroid
# Tempel 1,90000192,Sol,10,2451545,Ecliptic,0,0,0,0,0,0,0,0,Ecliptic,0,0,0,3,0.00000504,146520,FALSE,Comet,Comet
#
#     - JPLREF Is the JPL Horizons database ID for the body or barycenter.  Maybe in the future barycenter IDs can be figured out, but for now use the main body ID or data may not be found.
#         Sometimes the JPLREF number for a body is the same as it's IAU number, and sometimes it isn't.
#         To find the JPLREF for a target body, you can try searching for it in the JPL Small-Body Database Browser,
#         (https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html) or in the JPL Horizons web interface (https://ssd.jpl.nasa.gov/horizons/app.html#/).
#     - REF_FRAME is either 'Ecliptic' or 'Equatorial' for the orbit definition plane.
#     - ROT_FRAME is either 'Ecliptic', or 'Perifocal' for the bodies tilt definition plane.
#     - GROUP is used on the Pebkac website for sorting purposes.
#     - BODY_TYPE is the KSA body type to use during XML generation - 'PlanetaryBody, Asteroid, MinorBody, Comet, AtmosphericBody'
#
# (Look at / save the default Pebkac website CSV data for more examples.)


# These params can be edited to change default behavoir, or you can override set these when invoking the script.
param(
    # File name settings
        [string]$InputFile = "solar-bodies-seed-file.csv",
        [string]$OutputFile = "orbital-update-data",

    # MODE settings
        # 'sheet' = get all elements at the time specified in the EPOCH column of the input CSV file for each target.
        # 'fixed' = get all elements at a single fixed time specified by FixedTime param - some targets may not have data at that time to update with.
        # 'span' = get EC, IN, and A averaged over the time span / steps, and use MA, W, OM, and PR from the starting date.
        [ValidateSet('sheet','fixed','span')][string]$Mode = 'sheet',

        # Time for 'FIXED' mode setting - these are Julian Days JD Date/Time converters online.
        # NASA JPN JD Date/Time Converter - https://ssd.jpl.nasa.gov/tools/jdc
        [string]$FixedTime = '2461014.643',

        # SPAN mode begin/end/steps
        [string]$SpanBegin = '2451545.0',
        [string]$SpanEnd = '2455195.0',
        [string]$SpanSteps = '3650',

    # General Settings
        # If true then another new file will output which is the input CSV file updated with the new orbital data obtained.
        # If the resulting combined CSV has all of the columns/information required by the Pebkac website tool, then it can be copy/pasted there directly.
        [bool]$CreateUpdatedCsvInputFile = $true,

    # Special placeholder parameters for CLI useage.
        [string]$DateConvert = '',
        [string]$get = '',
        [string]$bodies = '',
        [string]$time = ''
        )










# Don't edit below this unless you know what you're doing.


# FUNCTIONS BEGIN - These need to be defined first before being called in the main body (that's just how Powershell works).
function Get-CurrentUtcTime() {
    # If powershell is version 7 or greater, use Get-Date -AsUTC for better performance.
    if ($PSVersionTable.PSVersion.Major -ge 7) {
        $UtcNow = Get-Date -AsUTC
    } else {
        $UtcNow = (Get-Date).ToUniversalTime()
    }
    # Now converts the UTC time to string format 'YYYY-MM-DD HH:MM'
    $utcString = $UtcNow.ToString("yyyy-MM-dd HH:mm")
    return $utcString
}
function Convert-ToJulianDate {
    param(
        [string]$DateConvert
    )
    # Calculates the exact Julian date for the provided string of the date in the form of 'YYYY-MM-DD HH:MM'
    # If $DateConvert doesn't have a 0 in front of 1-9 hours, add it.
    if ( $DateConvert -match '^\d{4}-\d{2}-\d{2} \d{1}:' ) {
        $DateConvert = $DateConvert -replace '(\d{4}-\d{2}-\d{2} )(\d{1}:)', '${1}0${2}'
    }
    $dateTime = [DateTime]::ParseExact($DateConvert, 'yyyy-MM-dd HH:mm', $null)
    $julianDate = $dateTime.ToOADate() + 2415018.5
    return $julianDate
}
# Briefly checks a few special CLI parameters and handles them before the main body of the script before we get too far down for no reason.
if ( $get -ne '' -and $get.ToLower() -eq 'currentdate' ) {
    $currentUtc = Get-CurrentUtcTime
    $julianDate = Convert-ToJulianDate -DateConvert $currentUtc
    Write-Host "`nJulian Date for current UTC time $currentUtc is: " -NoNewline
    Write-Host "$([Math]::Round($julianDate,4))`n" -ForegroundColor Yellow
    exit 0
}
if ( $DateConvert -ne '' ) {
    $julianDate = Convert-ToJulianDate -DateConvert $DateConvert
    Write-Host "`nJulian Date for $DateConvert UTC is: " -NoNewline
    Write-Host "$([Math]::Round($julianDate,4))`n" -ForegroundColor Yellow
    exit 0
}
# IF -help was used, show help and exit.
if ( $get -ne '' -and $get -eq 'help' ) {
    Write-Host "`nAvailable script parameters to pass directly:" -ForegroundColor Yellow; Write-Host "`n (1)  " -NoNewline; Write-Host "-dateconvert" -ForegroundColor Yellow -NoNewline; Write-Host " `"<YYYY-MM-DD HH:MM>`"`n (2)" -NoNewline
    Write-Host "  -get " -ForegroundColor Yellow -NoNewline; Write-Host "currentdate";
    Write-Host " (3)  " -NoNewline; Write-Host "-get" -ForegroundColor Yellow -NoNewline; Write-Host " bodies " -NoNewline; Write-Host "-bodies" -ForegroundColor Yellow -NoNewline; Write-Host " `"<comma delimited list>`"";
    Write-Host " (4)  " -NoNewline; Write-Host "-get" -ForegroundColor Yellow -NoNewline; Write-Host " bodies " -NoNewline; Write-Host "-bodies" -ForegroundColor Yellow -NoNewline; Write-Host " `"<cdl>`" " -NoNewline; Write-Host "-time" -ForegroundColor Yellow -NoNewline; Write-Host " <JD date/'currentdate'>"
    Write-Host " (5)  " -NoNewline; Write-Host "-get" -ForegroundColor Yellow -NoNewline; Write-Host " bodies " -NoNewline; Write-Host "-bodies" -ForegroundColor Yellow -NoNewline; Write-Host " `"<cdl>`" " -NoNewline; Write-Host "-mode" -ForegroundColor Yellow -NoNewline; Write-Host " span " -NoNewline; Write-Host "-spanbegin" -ForegroundColor Yellow -NoNewline; Write-Host " <JD> " -NoNewline; Write-Host "-spanend" -ForegroundColor Yellow -NoNewline; Write-Host " <JD> " -NoNewline; Write-Host "-spanssteps" -ForegroundColor Yellow -NoNewline; Write-Host " `<steps>`"`n"
    Write-Host " (1): Converts the provided UTC date/time string to Julian Date."
    Write-Host " (2): Outputs the current UTC date/time as a decimal Julian Date."
    Write-Host " (3): Only processes the bodies listed in the comma delimited list provided (found in the set input CSV file)"
    Write-Host " (4): The same as get bodies but overrides the EPOCH time to find to the entered decimal Julian Date entered."
    Write-Host " (5): Gets bodies in span mode for the specified range of Julian Dates and the number of data point steps between those dates.`n"
    Write-Host "  Examples:`n  -dateconvert '2025-12-25 15:30'`n  -get bodies -bodies 'Earth,Luna,Quaoar,Weywot' -time currentdate`n  -get bodies -bodies 'Vesta,Sedna,Tempel 1' -time '2461014.5'`n  -get bodies -bodies 'Vesta,Sedna' -mode span -spanbegin '2451545.0' -spanend '2455195.0' -spanssteps '3650'`n"
    exit 0
}

# Past the special CLI parameter handling for ones which only do small functions and exit, now the main body of the script.
Set-StrictMode -Version Latest
function TargetExceptions {
    param($TARGET)
    # Pre-checks if an exception target was found, and if it passes that sets the output file name based on mod.
    #if ( $TARGET -ne 'Dactyl' -and $TARGET -ne 'Oumuamua') { return $false }
    if ( $Mode -ne 'span' ) { $sendOutLine = $outCsv } else { $sendOutLine = $outAvgs }
    
    if ( $TARGET -eq 'Dactyl' ) { # Small moonlet of asteroid Ida.
       "Dactyl,243,Ida,243,2451545,Equatorial,90,0.2,155.5,0,176.8,8,13,0,Perifocal,0,0,0" | Out-File -FilePath $sendOutLine -Append -Encoding utf8; return $true }
    if ( $TARGET -eq 'Oumuamua' ) { # Only overrides in 'span' mode because it averages some pretty wacky results like negative 3000 degrees.
        if ( $Mode -eq 'span' ) { "Oumuamua,DES=3788040,Sol,10,2451545,Ecliptic,38284488,1.20113,241.9,0,-172.5,122.74,24.597,Perifocal,0,0,0" | Out-File -FilePath $sendOutLine -Append -Encoding utf8; return $true } else { return $false }}
    if ( $TARGET -eq 'S2009_S_01' ) { # Unnamed innermost moon embedded within Saturn's ring system
        "S2009_S_01,none,Saturn,699,2451545,Equatorial,116914,0,106.686,0.1,0,0,169.527,0,Perifocal,0,0,0" | Out-File -FilePath $sendOutLine -Append -Encoding utf8; return $true }
    if ( $TARGET -like '*S/2015_1*(MK2)*' ) { # Makemake's moon.
       "S/2015_1 (MK2),136472,Makemake,136472,2451545,Ecliptic,22250,0,0,6,0,75,0,1557187,Perifocal,0,0,0" | Out-File -FilePath $sendOutLine -Append -Encoding utf8; return $true }
    return $false; # If no exception handled.
}
function SpanExceptions {
    param($TARGET)
    # Placeholder for any special handling of targets in span mode if needed.
    if ( $TARGET -eq 'Dimorphos' ) { 
        return [PSCustomObject]@{
            Handled = $true; FRAME = 'Equatorial'; A_SEMI_MAJOR_AXIS = 1.2; EC_ECCENTRICITY = 0.01817; W_ARG_PERIAPSIS = 54.5; TP_TIME_DAYS = 0;
            MA_MEAN_ANOMALY = 359.9; IN_INCLINATION = 1.7; OM_LONGITUDE_ASCENDING_NODE = 40; PR_SIDEREAL_ORBIT_PERIOD_SECONDS = 44514;
        }
    }
    return [PSCustomObject]@{ Handled = $false }
}
function Invoke-HorizonsApiText {
    param(
        [string]$CommandUri
    )
    try {
        # Original method, works but leaves some console outputs
        # $resp = Invoke-WebRequest -Uri $CommandUri -UseBasicParsing -TimeoutSec 60 

        $resp = (New-Object System.Net.WebClient).DownloadString($CommandUri) | Out-String
        return $resp
    }
    catch {
        Write-Warning "Request failed: $_"
        return ''
    }
}
# Function to get $lines from Horizons API call between $$SOE and $$EOE markers fully matching them, not just $$
# Has to carry the $lines variable out from the function after they're found.
function Get-LinesData {
    param([string]$content)
    $global:lines = @()
    $inDataSection = $false
    $contentLines = $content -split "`n"
    foreach ($dataline in $contentLines) {
        $trimmedLine = $dataline.Trim()
        if ($trimmedLine -eq '$$SOE') { $inDataSection = $true; continue }
        if ($trimmedLine -eq '$$EOE') { $inDataSection = $false; continue }
        if ($inDataSection) { $global:lines += $trimmedLine }
    }
}
# FUNCTIONS END

# Sets the header to be sent to the data output CSV file.
$HEADER = 'ID,ID_JPLREF,PARENT,PARENT_JPLREF,EPOCH,REF_FRAME,A_SEMI_MAJOR_AXIS_KM,EC_ECCENTRICITY,W_ARG_PERIAPSIS_DEG,TP_TIME_DAYS,MA_MEAN_ANOMALY_DEG,IN_INCLINATION_DEG,OM_LONGITUDE_ASCENDING_NODE_DEG,PR_SIDEREAL_ORBIT_PERIOD_SEC,ROT_FRAME,TILT_OBLIQUITY_DEG,TILT_AZIMUTH_DEG,PARENT_ROT_LONG'

# OutputFile.csv and averages files
$outCsv = "$OutputFile.csv"
$outAvgs = "${OutputFile}_averages.csv"

# Remove any existing outputs
if (Test-Path $outCsv) { Remove-Item $outCsv }
if (Test-Path $outAvgs) { Remove-Item $outAvgs }

# Write headers
if ($Mode -eq 'span') { "$HEADER" | Out-File -FilePath $outAvgs -Encoding utf8 } else { "$HEADER" | Out-File -FilePath $outCsv -Encoding utf8 }

# Read input CSV (assumes header row)
if (-Not (Test-Path $InputFile)) { throw "Input CSV file not found with valid column headers." }
$rows = Import-Csv -Path $InputFile


# The main loop of the script which processes each target in the input CSV file and generates output data.
foreach ($r in $rows) {
    # Map expected columns - tolerate different header names by fallback
    $TARGET = $r.ID
    $TARGET_JPLREF = $r.ID_JPLREF
    $PARENT_NAME = $r.PARENT      
    $PARENT_JPLREF = $r.PARENT_JPLREF
    $EPOCH = if ($Mode -eq 'fixed') { $FixedTime } else { ($r.EPOCH -as [string]) }
    $FRAME = if ($r.REF_FRAME -ne '' ) { $r.REF_FRAME } else { '' }
    $ROT_FRAME = $r.ROT_FRAME
    if ([string]::IsNullOrEmpty($EPOCH)) { $EPOCH = '2451545.0' } # Default epoch if none provided - the J2000 reference date.

    # If -get flag was used with bodies, only process those targets and continue on if not in the $bodies comma delimited list.
    if ($get -eq 'bodies' -and $bodies -ne '' -and -not ($bodies -split ',' | ForEach-Object { $_.Trim() } | Where-Object { $_ -eq $TARGET })) {
        continue
    }
    # If the -time flag was used with -get 'bodies override the EPOCH - better hope they entered Julian JD date!
    if ($get -eq 'bodies' -and $time -ne '' ) {
        if ( $time -eq 'currentdate' ) {
            $currentUtc = Get-CurrentUtcTime
            $time = Convert-ToJulianDate -DateConvert $currentUtc
        }
        $EPOCH = $time
    }

    # Build center value like 500@<PARENT_JPLREF>
    $CENTER = "500@${PARENT_JPLREF}"

    Write-Output "$PARENT_NAME`:$PARENT_JPLREF---$TARGET`:$TARGET_JPLREF"

    # The function returns a value determining if it handled a special target case.
    $result = TargetExceptions $TARGET
    # If an exception TARGET was handled, skip normal processing of this target because it had default values plugged into the CSV instead.
    # Skips this ENTIRE loop iteration and goes to the next target.

    # First though writes the value of the $result variable to see if it was handled.
    if ( $result -eq $true ) { continue }

    # Reference plane
        if ( $FRAME -ne '' ) { if ( $FRAME -eq 'Ecliptic' ) { $REF_PLANE = 'E' } elseif ( $FRAME -eq 'Equatorial' ) { $REF_PLANE = 'B'} else { $REF_PLANE = 'Ecliptic' } }
        if ( $FRAME -eq '' ) { 
            # If no REF_PLANE column in CSV, determine based on parent body.
            $REF_PLANE = if ($PARENT_NAME -eq 'Sol') { 'E' } else { 'B' } 
        }
        # If the parent is an asteroid (not the Sun), use 'F' plane, because that's what Horizons has data for with asteroids which orbit other asteroids.
        if ( $PARENT_NAME -ne 'Sol' -and $r.GROUP -eq 'Asteroid' ) { $REF_PLANE = 'F' }

    # FIRST - Use Horizons API to get obserer data for the target at the specified time (initial time if span mode) - for data needed in calculating the rotation axis orientation in KSA with respect to ecliptic.
    if ( $Mode -ne 'span' ) { $OBSERVER_TIME = $EPOCH } else { $OBSERVER_TIME = $SpanBegin }

    $uri = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&MAKE_EPHEM=YES&COMMAND='${TARGET_JPLREF}'&EPHEM_TYPE=OBSERVER&CENTER='${CENTER}'&TLIST_TYPE=JD&TIME_TYPE=TT&TLIST='${OBSERVER_TIME}'&QUANTITIES='14,32'&REF_SYSTEM='ICRF'&CAL_FORMAT='CAL'&CAL_TYPE='M'&TIME_DIGITS='MINUTES'&ANG_FORMAT='DEG'&APPARENT='AIRLESS'&RANGE_UNITS='AU'&SUPPRESS_RANGE_RATE='NO'&SKIP_DAYLT='NO'&SOLAR_ELONG='0,180'&EXTRA_PREC='NO'&R_T_S_ONLY='NO'&CSV_FORMAT='YES'&OBJ_DATA='NO'"
    $content = Invoke-HorizonsApiText -CommandUri $uri
    # Returns $lines between $$SOE and $$EOE markers.
    Get-LinesData($content)

    if (-not $lines) {
        Write-Host "Found no rotation info for $TARGET ($TARGET_JPLREF), used Perifocal frame with 0 Tilt."
        $ROT_FRAME = 'Perifocal'; $PARENT_ROT_LONG = 0; $TILT_OBLIQUITY = 0; $AZIMUTH = 0; 
    } else {
        foreach ($line in $lines) {
            # Searches the line for the string 'n.a.' inside which means a bad result, and set defaults - just do this silently with no console message.
            if ( $line -like '*n.a.*' ) {
                # If rotation data doesn't exist for this entry, use a Perifocal frame and set the tilt to 0, that way the tilt is just 90 degrees to the parent's equatorial plane.
                $ROT_FRAME = 'Perifocal'; $PARENT_ROT_LONG = 0; $TILT_OBLIQUITY = 0; $AZIMUTH = 0; 
                continue
            }
            $tokens = $line -split ','
            # Initial parent rotational longitude is a KSA value used to place the parent's initial rotation value correctly and it takes into account the body's True Anomaly automatically.
            $PARENT_ROT_LONG = [Math]::Round([decimal]$tokens[3],3)
            $NPOLE_RA = [Math]::Round([decimal]$tokens[5],3)
            $NPOLE_DC = [Math]::Round([decimal]$tokens[6],3)

            # First converts NPOLE_RA & NPOLE_DC (celestial) to LAT & LON (ecliptic) using the variables we just found.  Earth is not the only body that needs this conversion, other bodies with axial tilts also need it.
            # Formula source: https://ssd.jpl.nasa.gov/?horizons_doc#topocentric
            $epsilon = 23.4392911 # Obliquity of the ecliptic at J2000
            $epsilonRad = [Math]::PI * $epsilon / 180.0
            $NPOLE_RA_Rad = [Math]::PI * $NPOLE_RA / 180.0
            $NPOLE_DC_Rad = [Math]::PI * $NPOLE_DC / 180.0
            $sinLat = ( [Math]::Sin($NPOLE_DC_Rad) * [Math]::Cos($epsilonRad) ) - ( [Math]::Cos($NPOLE_DC_Rad) * [Math]::Sin($epsilonRad) * [Math]::Sin($NPOLE_RA_Rad) )
            $LAT_Rad = [Math]::Asin($sinLat)
            $y = ( [Math]::Sin($NPOLE_RA_Rad) * [Math]::Cos($epsilonRad) ) + ( [Math]::Tan($NPOLE_DC_Rad) * [Math]::Sin($epsilonRad) )
            $x = [Math]::Cos($NPOLE_RA_Rad)
            $LON_Rad = [Math]::Atan2($y, $x)
            $LAT = [Math]::Round( ( $LAT_Rad * 180.0 / [Math]::PI ), 3 )
            $LON = [Math]::Round( ( $LON_Rad * 180.0 / [Math]::PI ), 3 )
            if ( $LON -lt 0 ) { $LON += 360.0 } # Ensure LON is positive value
            # AxialTilt - TILT_OBLIQUITY = (90 deg - LAT)
            $TILT_OBLIQUITY = [Math]::Round( (90.0 - $LAT), 3 )
            # Azimuth - AZIMUTH = (LON - 90 deg)
            $AZIMUTH = [Math]::Round( ($LON - 90.0), 3 )
            if ( $AZIMUTH -lt 0 ) { $AZIMUTH += 360.0 } # Ensure AZIMUTH is positive value
            # Now we have PARENT_ROT_LONG, TILT_OBLIQUITY, and AZIMUTH.
            #Write-Host "PARENT_ROT_LONG: $PARENT_ROT_LONG, TILT_OBLIQUITY: $TILT_OBLIQUITY, AZIMUTH: $AZIMUTH"
            continue; # Just in case there is a second line somehow
        }
    }

    # SECOND - Use Horizons API to get osculating elements orbital data for the target at the specified time or time span
    if ($Mode -ne 'span') {
        # SHEET OR FIXED MODE - for time used.
        $uri = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&MAKE_EPHEM='YES'&COMMAND='${TARGET_JPLREF}'&EPHEM_TYPE='ELEMENTS'&CENTER='${CENTER}'&TLIST_TYPE='JD'&TIME_TYPE='TDB'&TLIST='${EPOCH}'&REF_SYSTEM='ICRF'&REF_PLANE='${REF_PLANE}'&CAL_TYPE='M'&OUT_UNITS='KM-S'&ELM_LABELS='YES'&TP_TYPE='ABSOLUTE'&CSV_FORMAT='YES'&OBJ_DATA='YES'"
        $content = Invoke-HorizonsApiText -CommandUri $uri
        # Returns $lines between $$SOE and $$EOE markers.
        Get-LinesData($content)
        if (-not $lines) {
            Write-Host "No ephemeris for target $TARGET ($TARGET_JPLREF) around EPOCH $EPOCH, FRAME $REF_PLANE"
            "Error finding $PARENT_NAME`:$PARENT_JPLREF---$TARGET`:$TARGET_JPLREF" | Out-File -FilePath $outCsv -Append -Encoding utf8
            continue
        }

        foreach ($line in $lines) {
            # FYI - This is how you'd parse numbers if you needed to account for localization since some countries return decimals using comma instead of period.
            # Since NASA horizons uses an email format they aren't localizing the data...yet.
            # [decimal]::Parse($tokens[2], [System.Globalization.NumberStyles]::Float, [System.Globalization.CultureInfo]::InvariantCulture)

            $tokens = $line -split ','
            $EC_ECCENTRICITY = [Math]::Round([decimal]$tokens[2],4)
            $IN_INCLINATION = [Math]::Round([decimal]$tokens[4],3)
            $A_SEMI_MAJOR_AXIS = [Math]::Round([decimal]$tokens[11],3)
            $MA_MEAN_ANOMALY = [Math]::Round([decimal]$tokens[9],3)
            $W_ARG_PERIAPSIS = [Math]::Round([decimal]$tokens[6],3)
            # Gets the Time at Periapsis but adjusts it by subtracting the EPOCH time since the KSA game time starts at 0.
            $TP_TIME_DAYS = ( [Math]::Round([decimal]$tokens[7],4) - $EPOCH )
            $OM_LONGITUDE_ASCENDING_NODE = [Math]::Round([decimal]$tokens[5],3)
            # Handle special 'bogus' PR valus - Horizons uses 9.999999999999998E+99 to indicate infinite period for hyperbolic orbits.
            $PR = [string]$r.PR_SIDEREAL_ORBIT_PERIOD_SEC
            if ( "${PR}" -eq '9.999999999999998E+99' ) { $PR_SIDEREAL_ORBIT_PERIOD_SECONDS = '0' } else { $PR_SIDEREAL_ORBIT_PERIOD_SECONDS = [Math]::Round($PR) }
    
            $outLine = "${TARGET},${TARGET_JPLREF},${PARENT_NAME},${PARENT_JPLREF},${EPOCH},${FRAME},${A_SEMI_MAJOR_AXIS},${EC_ECCENTRICITY},${W_ARG_PERIAPSIS},${TP_TIME_DAYS},${MA_MEAN_ANOMALY},${IN_INCLINATION},${OM_LONGITUDE_ASCENDING_NODE},${PR_SIDEREAL_ORBIT_PERIOD_SECONDS},${ROT_FRAME},${TILT_OBLIQUITY},${AZIMUTH},${PARENT_ROT_LONG}"
            $outLine | Out-File -FilePath $outCsv -Append -Encoding utf8
        }
    }
    else {
        # SPAN MODE - Fist check for exceptions to getting orbital data in span mode.

        # Exception handling.
        $spanResult = SpanExceptions $TARGET
        if ( $spanResult.Handled -eq $true ) { 
            # If an exception TARGET was handled, use the returned values and write out the data.
            $FRAME = $spanResult.FRAME
            $A_SEMI_MAJOR_AXIS = $spanResult.A_SEMI_MAJOR_AXIS
            $EC_ECCENTRICITY = $spanResult.EC_ECCENTRICITY
            $W_ARG_PERIAPSIS = $spanResult.W_ARG_PERIAPSIS
            $TP_TIME_DAYS = $spanResult.TP_TIME_DAYS
            $MA_MEAN_ANOMALY = $spanResult.MA_MEAN_ANOMALY
            $IN_INCLINATION = $spanResult.IN_INCLINATION
            $OM_LONGITUDE_ASCENDING_NODE = $spanResult.OM_LONGITUDE_ASCENDING_NODE
            $PR_SIDEREAL_ORBIT_PERIOD_SECONDS = $spanResult.PR_SIDEREAL_ORBIT_PERIOD_SECONDS
            
            Write-Host "Handled orbital data exception for ${TARGET},${TARGET_JPLREF},${PARENT_NAME},${PARENT_JPLREF},${SpanBegin},${FRAME},${A_SEMI_MAJOR_AXIS},${EC_ECCENTRICITY}"
            $outLine = "${TARGET},${TARGET_JPLREF},${PARENT_NAME},${PARENT_JPLREF},${SpanBegin},${FRAME},${A_SEMI_MAJOR_AXIS},${EC_ECCENTRICITY},${W_ARG_PERIAPSIS},${TP_TIME_DAYS},${MA_MEAN_ANOMALY},${IN_INCLINATION},${OM_LONGITUDE_ASCENDING_NODE},${PR_SIDEREAL_ORBIT_PERIOD_SECONDS},${ROT_FRAME},${TILT_OBLIQUITY},${AZIMUTH},${PARENT_ROT_LONG}"
            $outLine | Out-File -FilePath $outAvgs -Append -Encoding utf8
            continue }

        # SPAN MODE: request a time range, Horizons expects START_TIME/STOP_TIME (use JD prefix)
        $start = "JD$SpanBegin"
        $stop = "JD$SpanEnd"
        # Do parsing of different step types later - Use STEP_SIZE as days; if user provided text with units, send it raw

        $uri = "https://ssd.jpl.nasa.gov/api/horizons.api?format=text&MAKE_EPHEM='YES'&COMMAND='${TARGET_JPLREF}'&EPHEM_TYPE='ELEMENTS'&CENTER='${CENTER}'&START_TIME='${start}'&STOP_TIME='${stop}'&STEP_SIZE='${SpanSteps}'&REF_SYSTEM='ICRF'&REF_PLANE='${REF_PLANE}'&CAL_TYPE='M'&OUT_UNITS='KM-S'&ELM_LABELS='YES'&TP_TYPE='ABSOLUTE'&CSV_FORMAT='YES'&OBJ_DATA='YES'"
        $content = Invoke-HorizonsApiText -CommandUri $uri
        # Returns $lines between $$SOE and $$EOE markers.
        Get-LinesData($content)
        if (-not $lines) {
            Write-Host "No span ephemeris for target $TARGET ($TARGET_JPLREF)"
            "Error finding $PARENT_NAME`:$PARENT_JPLREF---$TARGET`:$TARGET_JPLREF" | Out-File -FilePath $outAvgs -Append -Encoding utf8
            continue
        }
        # Reinitializes as empty each array for parameters to taking averages for.
        $a_vals = @()
        $ec_vals = @()
        $in_vals = @()

        $firstIteration = $true
        foreach ($line in $lines) {
            $tokens = $line -split ','
            
            # Only captures these variables on the first iteration (beginning EPOCH date used).
            if ( $firstIteration ) {
                $MA_MEAN_ANOMALY = [Math]::Round([decimal]$tokens[9],3)
                $W_ARG_PERIAPSIS = [Math]::Round([decimal]$tokens[6],3)
                # Gets the Time at Periapsis but adjusts it by subtracting the EPOCH time since the KSA game time starts at 0.
                $TP_TIME_DAYS = ( [Math]::Round([decimal]$tokens[7],4) - $EPOCH )
                $OM_LONGITUDE_ASCENDING_NODE = [Math]::Round([decimal]$tokens[5],3)
                # Handle special 'bogus' PR valus - Horizons uses 9.999999999999998E+99 to indicate infinite period for hyperbolic orbits.
                $PR = [string]$r.PR_SIDEREAL_ORBIT_PERIOD_SEC
                if ( "${PR}" -eq '9.999999999999998E+99' ) { $PR_SIDEREAL_ORBIT_PERIOD_SECONDS = '0' } else { $PR_SIDEREAL_ORBIT_PERIOD_SECONDS = [Math]::Round([decimal]$PR,1) }

                $firstIteration = $false
            }
            # Because we're counting on mutiple lines to average, create arrays for variables we want averaged.
            $ec_vals += ([Math]::Round([decimal]$tokens[2],4))
            $in_vals += ([Math]::Round([decimal]$tokens[4],3))
            $a_vals += ([Math]::Round([decimal]$tokens[11],3))
        }

        # Compute averages (if we have values)
        $A_SEMI_MAJOR_AXIS = if ($a_vals.Count -gt 0) { [Math]::Round(($a_vals | Measure-Object -Average).Average,3) } else { 0 }
        $EC_ECCENTRICITY = if ($ec_vals.Count -gt 0) { [Math]::Round(($ec_vals | Measure-Object -Average).Average,4) } else { 0 }
        $IN_INCLINATION = if ($in_vals.Count -gt 0) { [Math]::Round(($in_vals | Measure-Object -Average).Average,3) } else { 0 }

        $outLine = "${TARGET},${TARGET_JPLREF},${PARENT_NAME},${PARENT_JPLREF},${SpanBegin},${FRAME},${A_SEMI_MAJOR_AXIS},${EC_ECCENTRICITY},${W_ARG_PERIAPSIS},${TP_TIME_DAYS},${MA_MEAN_ANOMALY},${IN_INCLINATION},${OM_LONGITUDE_ASCENDING_NODE},${PR_SIDEREAL_ORBIT_PERIOD_SECONDS},${ROT_FRAME},${TILT_OBLIQUITY},${AZIMUTH},${PARENT_ROT_LONG}"
        $outLine | Out-File -FilePath $outAvgs -Append -Encoding utf8
    }
}

Write-Output "`nFinished obtaining and processing orbital ephemeris data.`n"

if ($Mode -eq 'span') { Write-Host "Orbital data only: " -NoNewline; Write-Host "$outAvgs" -ForegroundColor Green } else { Write-Host "Output orbital data: " -NoNewline; Write-Host "$outCsv" -ForegroundColor Green }

# If option is $true to create an update CSV file which is the original input file with values updated from the generated orbital data.
if ($CreateUpdatedCsvInputFile) {
    $updatedCsv = "${InputFile}_updated.csv"
    if (Test-Path $updatedCsv) { Remove-Item $updatedCsv }

    # Read generated orbital data CSV
    if ($Mode -eq 'span') { $updatedDataRows = Import-Csv -Path $outAvgs } else { $updatedDataRows = Import-Csv -Path $outCsv }

    $rows2 = Import-Csv -Path $InputFile

    # Build a lookup hashtable for updated data (ID -> row)
    $updatedDataMap = @{}
    foreach ($u in $updatedDataRows) { $updatedDataMap[$u.ID] = $u }

    # Update $rows2 in-place using the lookup map. This avoids pipeline/Where-Object misuse and index issues.
    foreach ($row in $rows2) {
        if ($null -ne $row.ID -and $updatedDataMap.ContainsKey($row.ID)) {
            $u = $updatedDataMap[$row.ID]
            $row.EPOCH = $u.EPOCH
            $row.REF_FRAME = $u.REF_FRAME
            $row.A_SEMI_MAJOR_AXIS_KM = $u.A_SEMI_MAJOR_AXIS_KM
            $row.EC_ECCENTRICITY = $u.EC_ECCENTRICITY
            $row.W_ARG_PERIAPSIS_DEG = $u.W_ARG_PERIAPSIS_DEG
            $row.TP_TIME_DAYS = $u.TP_TIME_DAYS
            $row.MA_MEAN_ANOMALY_DEG = $u.MA_MEAN_ANOMALY_DEG
            $row.IN_INCLINATION_DEG = $u.IN_INCLINATION_DEG
            $row.OM_LONGITUDE_ASCENDING_NODE_DEG = $u.OM_LONGITUDE_ASCENDING_NODE_DEG
            $row.PR_SIDEREAL_ORBIT_PERIOD_SEC = $u.PR_SIDEREAL_ORBIT_PERIOD_SEC
            $row.ROT_FRAME = $u.ROT_FRAME
            $row.TILT_OBLIQUITY_DEG = $u.TILT_OBLIQUITY_DEG
            $row.TILT_AZIMUTH_DEG = $u.TILT_AZIMUTH_DEG
            $row.PARENT_ROT_LONG = $u.PARENT_ROT_LONG
        }
    }

    # Export updated rows to new CSV file without double-quotes.
    # ConvertTo-Csv creates CSV lines; strip double quotes from each line to avoid quotes in the output.
    $csvLines = $rows2 | ConvertTo-Csv -NoTypeInformation
    $csvLines = $csvLines | ForEach-Object { $_ -replace '"','' }

    # If the -get bodies flag was used, only include those bodies in the updated CSV.
    if ($get -eq 'bodies' -and $bodies -ne '' ) {
        $bodiesList = $bodies -split ',' | ForEach-Object { $_.Trim() }
        # Keep only lines where the ID column matches one of the specified bodies.
        $headerLine = $csvLines[0]
        $filteredLines = @($headerLine)
        foreach ($line in $csvLines[1..($csvLines.Count - 1)]) {
            $columns = $line -split ','
            $idValue = $columns[0]
            if ($bodiesList -contains $idValue) {
                $filteredLines += $line
            }
        }
        $csvLines = $filteredLines
    }
    $csvLines | Set-Content -Path $updatedCsv -Encoding utf8

    Write-Host "Updated CSV data file: " -NoNewline; Write-Host "$updatedCsv`n" -ForegroundColor Green
}
