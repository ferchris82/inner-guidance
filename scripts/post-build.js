#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 Post-build: Copying configuration files...');

const distPath = path.join(__dirname, 'dist');
const publicPath = path.join(__dirname, 'public');

// Archivos que necesitamos copiar
const configFiles = [
  '_redirects',
  '.htaccess',
  '404.html'
];

configFiles.forEach(file => {
  const sourcePath = path.join(publicPath, file);
  const destPath = path.join(distPath, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file} to dist/`);
  } else {
    console.log(`⚠️  ${file} not found in public/`);
  }
});

console.log('✨ Post-build configuration completed!');
