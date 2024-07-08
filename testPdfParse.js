import pdfParse from 'pdf-parse';
import fs from 'fs';

const dataBuffer = fs.readFileSync('CVDiana.pdf');

pdfParse(dataBuffer).then(data => {
    console.log(data.text);
});
