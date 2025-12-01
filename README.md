# PEBKAC

Problem Exists Between Kitten and Chair

https://meow.science.fail/pebkac/

A tool to take in CSV data representing celestial bodies and spit out Kitten Space Agency `<System />` XML for it

The default dataset is about 473 Sol system bodies

# TODOs

* 🚧 Add zod/arktype schema validation of CSV data
* 🚧 Add a "download zip" or tar.gz archive of a full mod folder including a `mod.toml` etc
* 🚧 Add a auto installer (zero install, from browser) that manages the file installation and manifest.toml updation using File System Access API


# Updation Instructions

## When new KSA version lands

1. Take the new version (e.g. `v2025.11.5.2897`) and update it in
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