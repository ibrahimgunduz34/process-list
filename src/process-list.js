'use strict';

const childProcess = require('child_process');

const DEFAULT_OPTIONS = ['aux']

const ProcessList = {
  getList: async ({asArray = false, options = []} = {}) => {
    options = options.length !== 0 ? options : DEFAULT_OPTIONS;
    const result = await ProcessList.callCommand(options);
    return ProcessList.parseResult(result, asArray);
  },

  callCommand: (options) => {
    return new Promise((resolve, reject) => {
      const result = childProcess.spawn('ps', options);
      const chunks = [];
      
      result.stdout.on('data', buffer => chunks.push(buffer));
      result.stderr.on('data', buffer => chunks.push(buffer));

      result.on('close', code => {
        const output = Buffer.concat(chunks);
        
        if (code !== 0) {  
          const errorMessage = `The ps command was exited with non-zero(${code}) exit code.\n\n` +
                              `Output:\n` +
                              `-----------------------\n` +
                              `${output.toString()}`

          reject(new Error(errorMessage));
        } else {
          resolve(output);
        }
      });
    });
  },

  parseResult: (result, asArray) => {
    const data = result.toString();
    const rows = data.split('\n');

    const cleanedRows = rows.map(item => item.replace(/ +(?= )/g,'').split(' '));
    cleanedRows.pop();

    const columns = cleanedRows[0];
    cleanedRows.shift();
    
    const processes = cleanedRows.map(line => line.reduce(ProcessList.parseProcessLine(columns), []));

    return asArray ?
      [columns, ...processes] :
      ProcessList.buildProcessListAsObject(columns, processes);
  },

  parseProcessLine: (columns) => (accumulator, value, index) => {
    if (index < columns.length) {
      accumulator.push(value);
    } else {
      const command = accumulator.slice(-1) + ' ' + value;
      accumulator.splice(-1, 1, command);
    }
    return accumulator;
  },

  buildProcessListAsObject: (columns, processes) => {
    return processes.map(item => item.reduce((acc, value, index) => {
      return {...acc, [columns[index]]: value}
    }, []))
  }
}

module.exports = {
  getList: ProcessList.getList,
};