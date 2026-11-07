import { mkdir, copyFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'script.js', 'favicon.svg']) await copyFile(file, `dist/${file}`);
console.log('Site estático preparado em dist/.');
