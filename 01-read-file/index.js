const fs = require('fs');
const path = require('path');
const  {stdout} =  process;

const readableStream = fs.createReadStream(path.join(__dirname, './text.txt'), 'utf-8');

let data = '';

readableStream.on('data', chunk => data += chunk);
readableStream.on('end', () => stdout.write(data));
readableStream.on('error', error => stdout.write('Error', error.message));

// Пожалуйста, дайте время до среды выполнить задачки. Оч хочется набраться опыта и не забросить их просто так
