import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = '/Volumes/Jerry02(4T)/个人网站/网页接近终结版/public/sketch';
const files = fs.readdirSync(SRC);

files.forEach(file => {
  if (file.endsWith('.jpg') || file.endsWith('.JPG') || file.endsWith('.PNG')) {
    const basename = path.basename(file, path.extname(file));
    if (!fs.existsSync(path.join(SRC, basename + '.webp'))) {
        sharp(path.join(SRC, file))
          .webp({ quality: 80 })
          .toFile(path.join(SRC, basename + '.webp'))
          .then(() => console.log('Converted: ' + file))
          .catch(e => console.error(e));
    }
  }
});
