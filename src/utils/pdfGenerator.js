import { jsPDF } from 'jspdf';

export const generatePDF = async (images, settings) => {
    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: settings.format === 'fit' ? 'a4' : settings.format, // Default init, changed per page if 'fit'
    });

    // Remove the default first page if 'fit' (we'll add pages per image)
    // Actually jsPDF adds one page by default. For 'fit', we might want custom logic.
    // Standard approach: Loop through images. If i > 0, doc.addPage().

    // Actually, for 'fit', we will set the page size to the image size for each page.
    // But jsPDF constructor takes one format. We can change page format dynamically? Yes using setPage().

    if (settings.format === 'fit') {
        doc.deletePage(1); // Remove default page
    }

    for (let i = 0; i < images.length; i++) {
        const { file, rotation } = images[i];

        // Create an image element to get dimensions/data
        const imgData = await readFileAsDataURL(file);
        const imgProps = await getImageProperties(imgData);

        // Handle Rotation logic for drawing
        // We need to draw it rotated.
        // If rotation is 90 or 270, width and height swap for the page layout calculation if we are fitting?
        // Let's keep it simple: We draw the image on a canvas rotated, then put that canvas data into PDF.

        const rotatedDataUrl = await getRotatedImage(imgData, rotation);
        const finalProps = await getImageProperties(rotatedDataUrl); // Props of the rotated image

        if (settings.format === 'fit') {
            const widthMm = pxToMm(finalProps.width);
            const heightMm = pxToMm(finalProps.height);

            doc.addPage([widthMm, heightMm], widthMm > heightMm ? 'l' : 'p');
            doc.addImage(rotatedDataUrl, 'JPEG', 0, 0, widthMm, heightMm);
        } else {
            // Standard formats (A4/Letter)
            if (i > 0) doc.addPage();

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Calculate scaling to fit page while maintaining aspect ratio
            const imgRatio = finalProps.width / finalProps.height;
            const pageRatio = pageWidth / pageHeight;

            let finalWidth, finalHeight;

            // Add some margin (e.g., 10mm)
            const margin = 10;
            const availableWidth = pageWidth - (margin * 2);
            const availableHeight = pageHeight - (margin * 2);

            if (imgRatio > availableWidth / availableHeight) {
                finalWidth = availableWidth;
                finalHeight = availableWidth / imgRatio;
            } else {
                finalHeight = availableHeight;
                finalWidth = availableHeight * imgRatio;
            }

            const x = (pageWidth - finalWidth) / 2;
            const y = (pageHeight - finalHeight) / 2;

            doc.addImage(rotatedDataUrl, 'JPEG', x, y, finalWidth, finalHeight);
        }
    }

    doc.save('converted-images.pdf');
};

const pxToMm = (px) => {
    return px * 0.264583;
};

const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

const getImageProperties = (src) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = src;
    });
};

const getRotatedImage = (src, rotation) => {
    if (rotation === 0) return Promise.resolve(src);

    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Swap dimensions for 90/270
            if (rotation % 180 !== 0) {
                canvas.width = img.height;
                canvas.height = img.width;
            } else {
                canvas.width = img.width;
                canvas.height = img.height;
            }

            ctx.translate(canvas.width / 2, canvas.height / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.drawImage(img, -img.width / 2, -img.height / 2);

            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.src = src;
    });
};
