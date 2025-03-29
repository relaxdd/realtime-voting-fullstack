import { Options } from 'yargs'

const allowedModeTypes = ['production', 'development'] as const

const argvOptions = {
  'is-deploy': {
    type: 'boolean',
    default: false,
    boolean: true,
    description: 'It affects where the necessary files will be searched',
  },
  port: {
    type: 'number',
    number: true,
    description: 'Server startup port',
    default: undefined,
  },
  mode: {
    type: 'string',
    string: true,
    choices: allowedModeTypes,
    default: 'development',
  },
  'allow-origin': {
    type: 'string',
    string: true,
    description: 'Allowed client origin address',
    default: undefined,
  },
  env: {
    type: 'string',
    string: true,
  },
  expose: {
    type: 'boolean',
    boolean: true,
    default: false,
  },
} as const satisfies { [key: string]: Options }

export {
  argvOptions,
}
