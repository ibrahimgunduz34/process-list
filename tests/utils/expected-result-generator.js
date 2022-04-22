'use strict';

const createGetListResultAsObject = () => {
  return [
    {
      USER: 'ibrahimgunduz',
      PID: '43883',
      '%CPU': '9.3',
      '%MEM': '0.8',
      VSZ: '6481700',
      RSS: '268976',
      TT: '??',
      STAT: 'R',
      STARTED: '9:47AM',
      TIME: '6:38.18',
      COMMAND: '/Applications/iTerm.app/Contents/MacOS/iTerm2'
    },
    {
      USER: '_coreaudiod',
      PID: '169',
      '%CPU': '4.9',
      '%MEM': '0.1',
      VSZ: '5440836',
      RSS: '22728',
      TT: '??',
      STAT: 'Ss',
      STARTED: '9Apr22',
      TIME: '101:51.90',
      COMMAND: '/usr/sbin/coreaudiod'
    }
  ];
}

const createGetListResultAsList = () => {
  return [
    [
      'USER',    'PID',
      '%CPU',    '%MEM',
      'VSZ',     'RSS',
      'TT',      'STAT',
      'STARTED', 'TIME',
      'COMMAND'
    ],
    [
      'ibrahimgunduz',
      '43883',
      '9.3',
      '0.8',
      '6481700',
      '268976',
      '??',
      'R',
      '9:47AM',
      '6:38.18',
      '/Applications/iTerm.app/Contents/MacOS/iTerm2'
    ],
    [
      '_coreaudiod',
      '169',
      '4.9',
      '0.1',
      '5440836',
      '22728',
      '??',
      'Ss',
      '9Apr22',
      '101:51.90',
      '/usr/sbin/coreaudiod'
    ]
  ];
}

module.exports = {
  createGetListResultAsObject: createGetListResultAsObject,
  createGetListResultAsList: createGetListResultAsList,
}