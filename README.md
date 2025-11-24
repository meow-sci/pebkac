# TODOs

* 🚧 Add zod/arktype schema validation of system data
* 🚧 Make it fully dynamic by exposing the CSV as default data in a Monaco editor that can be changed.  Generate the JSON data from CSV on-the-fly on client, remove all build time pre-processing.

# Updation Instructions

## When new KSA version lands

1. Take the new version (e.g. `v2025.11.8.2847`) and update it in
    1. `src/pages/index.astro` - the baked version info
    2. `scripts/pre-process-data.ts` - the `KSA_VERSION` const
2. Create folder `data/Core_v2025.11.8.2847` (use new version name)
    1. Copy the following files from the `Kitten Space Agency` game dir into this new folder
        1. `Content/Core/Astronomicals.xml`
        1. `Content/Core/EarthMercuryLoveJoy.xml`
        1. `Content/Core/EarthOnly.xml`
        1. `Content/Core/EarthSystem.xml`
        1. `Content/Core/SolSystem.xml`

## When CSV data updates

1. update `data/earth_system.csv`