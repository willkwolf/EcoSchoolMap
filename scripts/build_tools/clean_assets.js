#!/usr/bin/env node

/**
 * clean_assets.js - Limpia assets antiguos antes del build
 *
 * Vite genera archivos con hash para cache busting (ej: main-ABC123.js).
 * Este script elimina assets antiguos para mantener docs/assets/ limpio.
 *
 * Solo mantiene los archivos que están referenciados en index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Rutas
const PROJECT_ROOT = path.resolve(__dirname, '../..');
const DOCS_DIR = path.join(PROJECT_ROOT, 'docs');
const ASSETS_DIR = path.join(DOCS_DIR, 'assets');
const INDEX_FILE = path.join(DOCS_DIR, 'index.html');

console.log('🧹 Limpiando assets antiguos...');

// Verificar que existe el directorio docs
if (!fs.existsSync(DOCS_DIR)) {
    console.log('⚠️  Directorio docs/ no existe, omitiendo limpieza');
    process.exit(0);
}

// Verificar que existe el directorio assets
if (!fs.existsSync(ASSETS_DIR)) {
    console.log('⚠️  Directorio docs/assets/ no existe, omitiendo limpieza');
    process.exit(0);
}

// Leer index.html para encontrar assets referenciados
let indexContent = '';
try {
    indexContent = fs.readFileSync(INDEX_FILE, 'utf-8');
} catch (error) {
    console.log('❌ Error leyendo index.html:', error.message);
    process.exit(1);
}

// Extraer assets referenciados (JS y CSS)
const assetRegex = /href="\.\/assets\/([^"]+\.(?:js|css))"|src="\.\/assets\/([^"]+\.(?:js|css))"/g;
const referencedAssets = new Set();

let match;
while ((match = assetRegex.exec(indexContent)) !== null) {
    const asset = match[1] || match[2];
    if (asset) {
        referencedAssets.add(asset);
    }
}

console.log(`📋 Assets referenciados en index.html: ${referencedAssets.size}`);
referencedAssets.forEach(asset => console.log(`   • ${asset}`));

// Listar todos los archivos en assets/
const allAssets = [];
try {
    const files = fs.readdirSync(ASSETS_DIR);
    for (const file of files) {
        const ext = path.extname(file).toLowerCase();
        if (ext === '.js' || ext === '.css') {
            allAssets.push(file);
        }
    }
} catch (error) {
    console.log('❌ Error listando assets:', error.message);
    process.exit(1);
}

console.log(`📂 Total assets en directorio: ${allAssets.length}`);

// Identificar assets a eliminar
const assetsToDelete = allAssets.filter(asset => !referencedAssets.has(asset));

if (assetsToDelete.length === 0) {
    console.log('✅ No hay assets antiguos para eliminar');
    process.exit(0);
}

console.log(`🗑️  Eliminando ${assetsToDelete.length} assets antiguos:`);

// Eliminar assets no referenciados
let deletedCount = 0;
for (const asset of assetsToDelete) {
    const assetPath = path.join(ASSETS_DIR, asset);
    try {
        fs.unlinkSync(assetPath);
        console.log(`   ✅ ${asset}`);
        deletedCount++;
    } catch (error) {
        console.log(`   ❌ Error eliminando ${asset}: ${error.message}`);
    }
}

console.log(`\n🎉 Limpieza completada: ${deletedCount} assets eliminados`);
console.log(`📊 Assets restantes: ${allAssets.length - deletedCount}`);