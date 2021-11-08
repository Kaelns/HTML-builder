const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const pathToFile = path.join(__dirname, './text.txt');

const rl = readline.createInterface({ input, output });

const closeReadline = () => {
  rl.write('Good luck!');
  rl.close();
};

const appendFile = (input) => {
  fs.appendFile(
    pathToFile,
    ` ${input} `,
    err => {
      if (err) throw err;
    }
  );
};


fs.access(pathToFile, fs.F_OK, (err) => {
  if (err) {  
    fs.open(pathToFile, 'w', (err) => {
      if (err) throw err;
    });
  }  
});

output.write('Write whatever you want\n');

rl.on('line', (input) => {
  if (input === 'exit') {
    closeReadline();
    return;
  }
  appendFile (input);
});

rl.on('SIGINT', () => { 
  closeReadline();
});