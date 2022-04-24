class CommandExecutionError extends Error {
  constructor(message, output, exitCode) {
    super(message);
    this.output = output;
    this.exitCode = exitCode;
  }
}

module.exports = {
  CommandExecutionError,
};
