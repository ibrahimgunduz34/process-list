const childProcess = require('child_process');
const { CommandExecutionError } = require('./exceptions');

const DEFAULT_OPTIONS = ['aux'];

const ProcessList = {
  getList: async ({ asArray = false, options = [] } = {}) => {
    const commandOptions = options.length !== 0 ? options : DEFAULT_OPTIONS;
    const result = await ProcessList.callCommand(commandOptions);
    return ProcessList.parseResult(result, asArray);
  },

  callCommand: (options) => new Promise((resolve, reject) => {
    const result = childProcess.spawn('ps', options);
    const chunks = [];

    result.stdout.on('data', (buffer) => chunks.push(buffer));
    result.stderr.on('data', (buffer) => chunks.push(buffer));

    result.on('close', (code) => {
      const output = Buffer.concat(chunks);

      if (code !== 0) {
        const error = new CommandExecutionError(
          'The ps command execution was failed with non-zero exit code',
          output.toString(),
          code,
        );
        reject(error);
      } else {
        resolve(output);
      }
    });
  }),

  parseResult: (result, asArray) => {
    const data = result.toString();
    const rows = data.split('\n');

    const cleanedRows = rows.map((item) => item.replace(/ +(?= )/g, '').split(' '));
    cleanedRows.pop();

    const columns = cleanedRows[0];
    cleanedRows.shift();

    const processes = cleanedRows
      .map((line) => line.reduce(ProcessList.parseProcessLine(columns), []));

    return asArray
      ? [columns, ...processes]
      : ProcessList.buildProcessListAsObject(columns, processes);
  },

  parseProcessLine: (columns) => (accumulator, value, index) => {
    if (index < columns.length) {
      accumulator.push(value);
    } else {
      const command = `${accumulator.slice(-1)} ${value}`;
      accumulator.splice(-1, 1, command);
    }
    return accumulator;
  },

  buildProcessListAsObject: (columns, processes) => processes
    .map((item) => item
      .reduce((acc, value, index) => ({ ...acc, [columns[index]]: value }), [])),
};

module.exports = {
  getList: ProcessList.getList,
};
