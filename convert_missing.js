import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = '/Volumes/Jerry02(4T)/个人网站/网页接近终结版/public/sketch';

fs.readdirSync(SRC).forEach(file => {
  if (file.startsWith('插画-') && (file.endsWith('.jpg') || file.endsWith('.JPG'))) {
    const basename = path.basename(file, path.extname(file));
    sharp(path.join(SRC, file))
      .webp({ quality: 80 })
      .toFile(path.join(SRC, basename + '.webp'))
      .then(() => console.log('Converted: ' + file))
      .catch(e => console.error(e));
  }
});
