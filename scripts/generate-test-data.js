import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const testDataDir = path.join(__dirname, '..', 'tests', 'test-data');

if (!fs.existsSync(testDataDir)) {
  fs.mkdirSync(testDataDir, { recursive: true });
}

console.log('Generating test data files...');

const pdfHeader = '%PDF-1.4\n';
const pdfContent = pdfHeader + 'This is a test PDF file for E2E testing.\n%%EOF\n';
fs.writeFileSync(path.join(testDataDir, 'test-cv.pdf'), pdfContent);
console.log('✓ Created test-cv.pdf');

const jpegHeader = Buffer.from([
  0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01,
  0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00
]);
const jpegContent = Buffer.concat([jpegHeader, Buffer.alloc(1000, 0xFF)]);
fs.writeFileSync(path.join(testDataDir, 'test-photo.jpg'), jpegContent);
console.log('✓ Created test-photo.jpg');

const docxContent = 'This is a test document for E2E testing.';
fs.writeFileSync(path.join(testDataDir, 'test-document.docx'), docxContent);
console.log('✓ Created test-document.docx');

const largePdfContent = pdfHeader + 'A'.repeat(11 * 1024 * 1024) + '\n%%EOF\n';
fs.writeFileSync(path.join(testDataDir, 'large-file.pdf'), largePdfContent);
console.log('✓ Created large-file.pdf (11MB)');

const invalidPdfContent = 'This is not a valid PDF file';
fs.writeFileSync(path.join(testDataDir, 'invalid.pdf'), invalidPdfContent);
console.log('✓ Created invalid.pdf');

console.log('\nAll test data files generated successfully!');
console.log(`Location: ${testDataDir}`);
