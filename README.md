# Unit Converter

A small in-browser toolkit for converting between the units commonly used in atomic, molecular, and optical physics. Built to save the repeated trips to a calculator when switching between spectroscopy units, atomic units, and SI.

**[Live demo](https://ngolubev.com/programs/unitconverter/)**

## What it covers

The page is organized into two independent converters:

- **Photon Energy Converter** - a set of linked fields (eV, nm, cm⁻¹, fs, Hartree, µm, THz, atomic units of time) that describe the same photon; editing any one field updates all the others live.
- **General Unit Converter** - a property/unit dropdown pair for converting between two chosen units at a time, covering:
  - Length (Bohr, Å, nm, cm, m)
  - Time (atomic unit, attosecond, femtosecond, second)
  - Mass (electron mass, amu, grams, kilograms)
  - Energy/Wavelength (Hartree, eV, kcal/mol, kJ/mol, nm)
  - Field Strength and Intensity (atomic units, V/nm, V/m, W/cm², W/m²)

## Running locally

This is a static site with no build step. Serve the directory with any static file server and open it in a browser, for example:

```bash
python3 -m http.server
```

Then visit `http://localhost:8000`.

## Tech stack

Vanilla HTML/CSS/JS (no framework, no dependencies).

## Developers

Kristy Hudgins and Nikolay Golubev

## License

[GPL-3.0](LICENSE)
