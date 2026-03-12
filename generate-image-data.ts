import fs from 'fs';

const data = fs.readFileSync('images.json', 'utf-8');
const content = `export const IMAGE_DATA: Record<string, string[]> = ${data};`;
fs.writeFileSync('image-data.ts', content);
