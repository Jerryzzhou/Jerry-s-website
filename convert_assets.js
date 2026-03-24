import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SKETCH_SRC = '/Volumes/Jerry02(4T)/个人网站/sketch';
const SKETCH_DEST = '/Volumes/Jerry02(4T)/个人网站/网页接近终结版/public/sketch';

const DESIGN_SRC = '/Volumes/Jerry02(4T)/个人网站/Graphic Design';
const DESIGN_DEST = '/Volumes/Jerry02(4T)/个人网站/网页接近终结版/public/photography/graphic_design';

async function convertDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const files = fs.readdirSync(src);
  console.log(`Processing ${src} -> ${dest}`);

  for (const file of files) {
    if (file.startsWith('.') || file.startsWith('._')) continue;
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    const basename = path.basename(file, ext);
    const targetPath = path.join(dest, `${basename}.webp`);

    try {
      await sharp(path.join(src, file))
        .webp({ quality: 80 })
        .toFile(targetPath);
      console.log(`Converted: ${file} -> ${basename}.webp`);
    } catch (err) {
      console.error(`Error converting ${file}:`, err);
    }
  }
}

async function main() {
  await convertDir(SKETCH_SRC, SKETCH_DEST);
  await convertDir(DESIGN_SRC, DESIGN_DEST);
  console.log('Conversion complete!');
}

main();
