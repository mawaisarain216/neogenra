import { defineConfig } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
export default defineConfig([...nextVitals,{files:['src/lib/blocks.tsx'],rules:{'react/jsx-key':'off'}}]);
