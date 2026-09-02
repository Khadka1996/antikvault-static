# Caveat-Bold.ttf

The handwriting-style font used for the banknote watermark (see
`scripts/generate-catalog.js`).

- **Font**: [Caveat](https://fonts.google.com/specimen/Caveat) (Bold), by Impallari Type / Pablo Impallari.
- **Source**: Google Fonts (`fonts.gstatic.com`).
- **License**: [SIL Open Font License 1.1](https://openfontlicense.org/) — free to use, embed, and redistribute.

`scripts/generate-catalog.js` installs this file into the local user's fontconfig
directory (`~/.local/share/fonts/`) the first time it runs, since SVG text
rendering (via librsvg, sharp's SVG backend) resolves fonts through fontconfig by
family name — it can't load an embedded/data-URI font directly.
