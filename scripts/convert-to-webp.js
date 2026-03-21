import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = '/Volumes/Jerry02(4T)/个人网站/网站进行版';
const PHOTO_DIR = path.join(ROOT_DIR, 'public/photography');

async function convertDir(dir) {
    const fullPath = path.join(PHOTO_DIR, dir);
    if (!fs.lstatSync(fullPath).isDirectory()) return;

    console.log(`Processing directory: ${dir}`);
    const files = fs.readdirSync(fullPath);
    
    for (const file of files) {
        if (file.toLowerCase().endsWith('.png')) {
            const inputPath = path.join(fullPath, file);
            const outputPath = inputPath.replace(/\.png$/i, '.webp');
            
            try {
                await sharp(inputPath)
                    .webp({ quality: 100, lossless: true })
                    .toFile(outputPath);
                console.log(`  Converted: ${file} -> ${path.basename(outputPath)}`);
                
                // Optionally delete PNG
                fs.unlinkSync(inputPath);
            } catch (err) {
                console.error(`  Failed to convert ${file}:`, err.message);
            }
        }
    }
}

async function main() {
    try {
        const dirs = fs.readdirSync(PHOTO_DIR);
        for (const dir of dirs) {
            await convertDir(dir);
        }
        console.log('Conversion complete!');
    } catch (err) {
        console.error('Error:', err.message);
    }
}

main();
