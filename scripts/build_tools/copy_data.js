#!/usr/bin/env node

/**
 * Copy data files to build output directory
 * Ensures that the latest data files are included in production builds
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define paths
const projectRoot = path.resolve(__dirname, '..', '..');
const sourceData = path.join(projectRoot, 'data', 'escuelas.json');
const docsData = path.join(projectRoot, 'docs', 'data', 'escuelas.json');
const sourceVariants = path.join(projectRoot, 'data', 'variants');
const docsVariants = path.join(projectRoot, 'docs', 'data', 'variants');

function copyFile(source, destination) {
    try {
        // Ensure destination directory exists
        const destDir = path.dirname(destination);
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }

        // Copy file
        fs.copyFileSync(source, destination);
        console.log(`✅ Copied: ${path.relative(projectRoot, source)} → ${path.relative(projectRoot, destination)}`);
        return true;
    } catch (error) {
        console.error(`❌ Error copying ${source}: ${error.message}`);
        return false;
    }
}

function copyDirectory(source, destination) {
    try {
        if (!fs.existsSync(source)) {
            console.log(`⚠️  Source directory not found: ${path.relative(projectRoot, source)}`);
            return true; // Not an error if variants don't exist
        }

        // Ensure destination directory exists
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }

        // Copy all files in directory
        const files = fs.readdirSync(source);
        let copiedCount = 0;

        for (const file of files) {
            const sourcePath = path.join(source, file);
            const destPath = path.join(destination, file);

            if (fs.statSync(sourcePath).isFile()) {
                fs.copyFileSync(sourcePath, destPath);
                copiedCount++;
            }
        }

        console.log(`✅ Copied ${copiedCount} variant files to ${path.relative(projectRoot, destination)}`);
        return true;
    } catch (error) {
        console.error(`❌ Error copying directory ${source}: ${error.message}`);
        return false;
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    console.log('🚀 Starting copy_data.js script...');
    main();
}

function main() {
    console.log('📋 Copying data files to build output...');
    console.log(`Source: ${sourceData}`);
    console.log(`Destination: ${docsData}`);

    let success = true;

    // Copy main data file
    if (!fs.existsSync(sourceData)) {
        console.error(`❌ Source data file not found: ${sourceData}`);
        success = false;
    } else {
        success &= copyFile(sourceData, docsData);
    }

    // Copy variants directory
    success &= copyDirectory(sourceVariants, docsVariants);

    if (success) {
        console.log('🎉 Data files copied successfully!');
        process.exit(0);
    } else {
        console.error('❌ Some data files failed to copy');
        process.exit(1);
    }
}

// Run main function
console.log('🚀 Starting copy_data.js script...');
main();

export { copyFile, copyDirectory };