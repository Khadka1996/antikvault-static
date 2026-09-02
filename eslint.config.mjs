import next from 'eslint-config-next/core-web-vitals';

// Next 16 ships a flat ESLint config array — use it directly.
const config = [
  {
    ignores: ['out/**', '.next/**', 'node_modules/**'],
  },
  ...next,
];

export default config;
