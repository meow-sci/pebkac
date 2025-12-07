# PEBKAC

___Problem Exists Between Kitten and Chair___

A web browser based tool to take in CSV data representing celestial bodies and spit out Kitten Space Agency `<System />` XML for it.

https://meow.science.fail/pebkac/  

  - The default dataset is about 476 Sol system bodies  

---

### Script to get new orbital data

A script file provided in the [scripts folder](https://github.com/meow-sci/pebkac/tree/main/scripts) on the project github (here) can be used to generate new data, which you can bring to the Pebkac website tool to generate into XML format for KSA solar system inclusion.  

See the readme in the [scripts folder](https://github.com/meow-sci/pebkac/tree/main/scripts) for details on how to use it.  

  - Written in Powershell script - which is OS cross-compatible and available for Windows (native), and Linux/MacOS (on installation).
  - Use it to update the already provided default CSV file of over 476 solar system bodies for different times / parameters!
  - Use it in combination with your own CSV file of solar system bodies (use the same format!) to generate new solar system body orbit data!

---
# TODOs

* 🚧 Add zod/arktype schema validation of CSV data
* 🚧 Add a "download zip" or tar.gz archive of a full mod folder including a `mod.toml` etc
* 🚧 Add a auto installer (zero install, from browser) that manages the file installation and manifest.toml updation using File System Access API


# Updation Instructions

## When new KSA version lands

1. Take the new version (e.g. `v2025.12.5.2976`) and update it in
    1. `src/pages/index.astro` - the baked version info
2. Update Core data in folder `src/data/mods/Core`
    1. Copy the following files from the `Kitten Space Agency` game dir into this folder
        1. `Content/Core/Astronomicals.xml`
        1. `Content/Core/EarthMercuryLoveJoy.xml`
        1. `Content/Core/EarthOnly.xml`
        1. `Content/Core/EarthSystem.xml`
        1. `Content/Core/SolSystem.xml`

## When CSV data updates

1. update `src/data/earth_system_data.csv`
