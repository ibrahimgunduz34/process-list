const createSuccessfulPsOutput = () => ({
  message: 'USER               PID  %CPU %MEM      VSZ    RSS   TT  STAT STARTED      TIME COMMAND\n'
    + 'ibrahimgunduz    43883   9.3  0.8  6481700 268976   ??  R     9:47AM   6:38.18 /Applications/iTerm.app/Contents/MacOS/iTerm2\n'
    + '_coreaudiod        169   4.9  0.1  5440836  22728   ??  Ss    9Apr22 101:51.90 /usr/sbin/coreaudiod\n',
  code: 0,
});

const createFailedPsOutput = () => ({
  message: 'An unexpected error occurred',
  code: 255,
});

const createCommandNotFoundOutput = () => ({
  message: 'Command \'ps\' not found, did you mean:',
  code: 127,
});

module.exports = {
  createSuccessfulPsOutput,
  createFailedPsOutput,
  createCommandNotFoundOutput,
};
