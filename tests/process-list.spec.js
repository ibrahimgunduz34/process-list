const childProcess = require('child_process');
const sinon = require('sinon');
const { EventEmitter } = require('events');
const chai = require('chai');
const ProcessList = require('../src/process-list');
const commandOutputGenerator = require('./utils/command-output-generator');
const expectedResultGenerator = require('./utils/expected-result-generator');
const { CommandExecutionError } = require('../src/exceptions');

const { expect } = chai;

chai.config.truncateThreshold = 0

describe('ProcessList Tests', () => {
  let spawnStub;
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();

    spawnStub = new EventEmitter();
    spawnStub.stdout = new EventEmitter();
    spawnStub.stderr = new EventEmitter();

    sandbox.stub(childProcess, 'spawn').returns(spawnStub);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('Error Cases', () => {
    const dataProvider = [
      {
        scenario: 'When the ps command does not exist',
        commandOutput: commandOutputGenerator.createCommandNotFoundOutput(),
      },
      {
        scenario: 'When the ps command is terminated with non-zero exit code',
        commandOutput: commandOutputGenerator.createFailedPsOutput(),
      },
    ];

    dataProvider.forEach((scenario) => {
      describe(scenario.scenario, () => {
        it('should throw an error with the expected error message', (done) => {
          const expectedError = new CommandExecutionError(
            'The ps command execution was failed with non-zero exit code',
            scenario.commandOutput.message,
            scenario.commandOutput.code,
          );
          
          ProcessList.getList()
            .then(() => {
              done('It was expected that getList throws an error')
            })
            .catch((error) => {
              // Chai fails when the error and expected error was compared with `deep.equal`
              expect(error).to.include(expectedError)
              done();
            })
            .catch(done)

          spawnStub.stderr.emit('data', Buffer.from(scenario.commandOutput.message));
          spawnStub.emit('close', scenario.commandOutput.code);
        });
      });
    });
  });

  describe('Positive Cases', () => {
    const dataProvider = [
      {
        scenario: 'When the ps command returned the running processes successfully and getList() command called with default parameters',
        expectation: 'should return the process list as list of objects',
        expectedResult: expectedResultGenerator.createGetListResultAsObject(),
        asArray: false,
      },
      {
        scenario: 'When the ps command returned the running processes successfully and getList() command called with asArray=true parameter',
        expectation: 'should return the process list as list of array',
        expectedResult: expectedResultGenerator.createGetListResultAsList(),
        asArray: true,
      },
    ];

    dataProvider.forEach((scenario) => {
      describe(scenario.scenario, () => {
        it(scenario.expectation, (done) => {
          ProcessList.getList({ asArray: scenario.asArray })
            .then((processes) => {
              expect(processes).to.be.deep.equal(scenario.expectedResult);
              done();
            })
            .catch(done);

          const output = commandOutputGenerator.createSuccessfulPsOutput();

          spawnStub.stdout.emit('data', Buffer.from(output.message));
          spawnStub.emit('close', output.code);
        });
      });
    });
  
    describe('When the ps command returned result in multiple chunks', () => {
      it('should return the process list expectedly', (done) => {
        ProcessList.getList()
            .then((processes) => {
              expect(processes).to.be.deep.equal(expectedResult);
              done();
            })
            .catch(done);

        const expectedResult = expectedResultGenerator.createGetListResultAsObject();
        const output = commandOutputGenerator.createSuccessfulPsOutput();

        const firstChunkSize = Math.floor(output.message.length / 3);  
        const firstChunk = output.message.substring(0, firstChunkSize);
        const secondChunk = output.message.substring(firstChunkSize, output.message.length);

        spawnStub.stdout.emit('data', Buffer.from(firstChunk));
        spawnStub.stdout.emit('data', Buffer.from(secondChunk));
        spawnStub.emit('close', output.code);
      });
    });
  });
});
