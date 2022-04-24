[![Npm Publish Workflow](https://github.com/ibrahimgunduz34/process-list/actions/workflows/npm-publish.yml/badge.svg)](https://github.com/ibrahimgunduz34/process-list/actions/workflows/npm-publish.yml)

# ProcessList

It's a library that simply wrap the `ps` command in order to access the active process list from your application.

## Installation:

```bash
$ npm install @ibrahimgunduz34/process-list
```

## Reference:

| Method                                 | Description                       |
|----------------------------------------|-----------------------------------|
| getList(asArray, options): Promise<[]> | Returns list of running processes |

### getList(asArray, options): Promise<[]>:

#### Parameters:

| Parameter  | Type     | Required | Default       | Description |
|------------|----------|----------|---------------|-----------------------------------|
| asArray    | boolean  | No       | false         | It allows the method to return the running processes as an array. The first item of the array would be the column list. By default, it takes false value and the method would returns the running processes as a list of objects that contains the process details with their column names. |
| options    | array    | No       | ['a','u','x'] | It allows passing extra arguments to the ps command.  |

#### Return:
It returns a Promise with the list of running processes as objects or arrays.

## Usage:

```javascript
const ProcessList = require('process-list');

// ...

const processes = await ProcessList.getList();
/**
  [
    {
      USER: 'root',
      PID: '6029',
      '%CPU': '0.0',
      '%MEM': '0.0',
      VSZ: '0',
      RSS: '0',
      TTY: '?',
      STAT: 'I',
      START: '09:56',
      TIME: '0:00',
      COMMAND: '[kworker/u4:2-events_unbound]'
    },
    {
      USER: 'root',
      PID: '6036',
      '%CPU': '0.0',
      '%MEM': '0.0',
      VSZ: '0',
      RSS: '0',
      TTY: '?',
      STAT: 'I',
      START: '09:56',
      TIME: '0:00',
      COMMAND: '[kworker/0:2-events]'
    },
    {
      USER: 'vagrant',
      PID: '6385',
      '%CPU': '0.0',
      '%MEM': '3.2',
      VSZ: '512544',
      RSS: '32736',
      TTY: 'pts/0',
      STAT: 'Rl+',
      START: '10:03',
      TIME: '0:00',
      COMMAND: 'node src/ntop.js'
    }
  ]
*/ 

//...

const processes = await ProcessList.getList({asArray: true});
/**
  [
    [
      'USER',
      'PID',
      '%CPU',
      '%MEM',
      'VSZ',
      'RSS',
      'TTY',
      'STAT',
      'START',
      'TIME',
      'COMMAND'
    ],
    [
      'root',
      '6029',
      '0.0',
      '0.0',
      '0',
      '0',
      '?',
      'I',
      '09:56',
      '0:00',
      '[kworker/u4:2-events_unbound]'
    ],
    [
      'root',
      '6036',
      '0.0',
      '0.0',
      '0',
      '0',
      '?',
      'I',
      '09:56',
      '0:00',
      '[kworker/0:2-events]'
    ],
    [
      'vagrant',
      '6385',
      '0.0',
      '3.2',
      '512544',
      '32736',
      'pts/0',
      'Rl+',
      '10:03',
      '0:00',
      'node src/ntop.js'
    ]
  ]
 */
```