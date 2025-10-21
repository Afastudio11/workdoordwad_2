# Test Data Files

This directory contains test files used during E2E testing.

## Files

- `test-cv.pdf` - Sample CV file for upload testing
- `test-photo.jpg` - Sample profile photo for upload testing
- `test-document.docx` - Sample document file
- `large-file.pdf` - Large file (10MB+) for file size limit testing

## Creating Test Files

You can create these files manually or use the provided script:

```bash
npm run generate:test-data
```

This will generate all necessary test files with appropriate content and sizes.

## File Size Limits

The application should enforce these limits:
- CV files: Max 5MB
- Photos: Max 2MB
- Document files: Max 5MB

Test files are created to verify these limits are properly enforced.
