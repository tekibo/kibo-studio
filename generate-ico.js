#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Converts a PNG ArrayBuffer to an ICO ArrayBuffer mathematically.
 * @param {ArrayBuffer} pngBuffer - The raw bytes of the PNG file.
 * @returns {ArrayBuffer} The raw bytes of the resulting ICO file.
 */
function pngToIco(pngBuffer) {
    const pngView = new DataView(pngBuffer);

    // Verify PNG signature (8 bytes)
    const pngSignature = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
    for (let i = 0; i < 8; i++) {
        if (pngView.getUint8(i) !== pngSignature[i]) {
            throw new Error("Invalid PNG file signature.");
        }
    }

    // Extract Width and Height from the IHDR chunk (Big-Endian)
    const width = pngView.getUint32(16, false);
    const height = pngView.getUint32(20, false);

    // Mathematically bound the dimensions to the ICO's 8-bit limit.
    // The ICO spec requires values > 255 to be represented as 0. 
    // This tells the OS to dynamically read the true size directly from the PNG payload.
    const icoWidth = width > 255 ? 0 : width;
    const icoHeight = height > 255 ? 0 : height;

    // Prepare ICO ArrayBuffer
    const headerSize = 6;
    const directoryEntrySize = 16;
    const pngSize = pngBuffer.byteLength;
    const icoSize = headerSize + directoryEntrySize + pngSize;

    const icoBuffer = new ArrayBuffer(icoSize);
    const icoView = new DataView(icoBuffer);
    const icoBytes = new Uint8Array(icoBuffer);
    const pngBytes = new Uint8Array(pngBuffer);

    // Write ICONDIR (Header) - Little-Endian
    icoView.setUint16(0, 0, true);     // Reserved, must be 0
    icoView.setUint16(2, 1, true);     // Image type (1 = Icon)
    icoView.setUint16(4, 1, true);     // Number of images in file

    // Write ICONDIRENTRY (Directory Entry)
    icoView.setUint8(6, icoWidth);     // Width (0-255)
    icoView.setUint8(7, icoHeight);    // Height (0-255)
    icoView.setUint8(8, 0);            // Color count (0 = >8bpp)
    icoView.setUint8(9, 0);            // Reserved, must be 0
    icoView.setUint16(10, 1, true);    // Color planes (usually 1)

    // FIX: Explicitly set Bits Per Pixel to 32.
    // This explicitly tells the OS to look for and render the Alpha channel,
    // preventing the OS from masking out the main image content.
    icoView.setUint16(12, 32, true);

    icoView.setUint32(14, pngSize, true); // Size of the image data
    icoView.setUint32(18, headerSize + directoryEntrySize, true); // Offset of data

    // Copy the raw PNG Data seamlessly
    icoBytes.set(pngBytes, headerSize + directoryEntrySize);

    return icoBuffer;
}

// --- CLI Logic ---

function printHelp() {
    console.log(`
Usage: node png-to-ico.js [options]

Options:
  -i, --input <path>   Path to the input PNG file (relative or absolute).
  -h, --help           Show this help message.

Example:
  node png-to-ico.js -i ./assets/large-logo.png
    `);
}

// Parse arguments (zero dependencies)
const args = process.argv.slice(2);
let inputPath = null;

for (let i = 0; i < args.length; i++) {
    if (args[i] === '-h' || args[i] === '--help') {
        printHelp();
        process.exit(0);
    }
    if (args[i] === '-i' || args[i] === '--input') {
        inputPath = args[i + 1];
        i++; // Skip the next argument
    }
}

if (!inputPath) {
    console.error("\x1b[31mError: Please provide an input PNG file using the -i or --input flag.\x1b[0m");
    printHelp();
    process.exit(1);
}

// Resolve paths
const resolvedInputPath = path.resolve(process.cwd(), inputPath);
const parsedPath = path.parse(resolvedInputPath);
const outputPath = path.join(parsedPath.dir, `${parsedPath.name}.ico`);

// Execute conversion
try {
    if (!fs.existsSync(resolvedInputPath)) {
        throw new Error(`File not found: ${resolvedInputPath}`);
    }

    console.log(`Reading: ${resolvedInputPath}...`);
    const pngBuffer = fs.readFileSync(resolvedInputPath);

    // Extract underlying ArrayBuffer from Node.js Buffer safely
    const arrayBuffer = pngBuffer.buffer.slice(
        pngBuffer.byteOffset,
        pngBuffer.byteOffset + pngBuffer.byteLength
    );

    const icoBuffer = pngToIco(arrayBuffer);

    fs.writeFileSync(outputPath, Buffer.from(icoBuffer));
    console.log(`\x1b[32mSuccess! Saved full-alpha ICO as: ${outputPath}\x1b[0m`);

} catch (err) {
    console.error(`\x1b[31mConversion failed: ${err.message}\x1b[0m`);
    process.exit(1);
}