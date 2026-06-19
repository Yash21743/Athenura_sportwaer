const fs = require('fs');
let content = fs.readFileSync('./src/services/mockProducts.js', 'utf8');

const jerseys = ['real_1.png', 'real_2.png', 'real_3.png', 'real_4.png'];
let jIdx = 0;

// Replace all "images": ["..."] with high quality jersey images for EVERY product
const newContent = content.replace(/"images"\s*:\s*\[\s*"[^"]*"\s*\]/gi, (match) => {
    const img = jerseys[jIdx % jerseys.length];
    jIdx++;
    return '"images": ["/jerseys/' + img + '"]';
});

fs.writeFileSync('./src/services/mockProducts.js', newContent);
console.log('Done replacing images for ' + jIdx + ' products.');
