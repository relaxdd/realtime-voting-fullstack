import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import DotEnvService from '../services/DotEnvService'
import { argvOptions } from '../options'
import { AppConfig } from '../defines'

export interface IEnvVariables {
  readonly PORT: number
  readonly EXPOSE: boolean
  readonly IS_DEV: boolean
  readonly IS_PROD: boolean
  readonly ROOT_DIR: string
  readonly NODE_ENV: 'production' | 'development'
  readonly PGSQL_URL: string | undefined
  readonly ALLOW_ORIGIN: string | undefined
  readonly PASSWORD_GEN_API_URL: string | undefined
}

function initEnvVariables(rootPaths: [string, string]): IEnvVariables {
  const argv = yargs(hideBin(process.argv)).options(argvOptions).parseSync()

  const NODE_ENV = argv.mode
  const IS_DEV = argv.mode === 'development'
  const IS_PROD = argv.mode === 'production'
  const ROOT_DIR = rootPaths[+argv.isDeploy]!

  new DotEnvService(IS_DEV).load(ROOT_DIR, argv?.env)

  const {
    expose: EXPOSE,
    port: PORT = +(process.env?.['PORT'] || AppConfig.PORT),
    allowOrigin: ALLOW_ORIGIN = process.env?.['ALLOW_ORIGIN'],
  } = argv

  const { PGSQL_URL = undefined, PASSWORD_GEN_API_URL = undefined } = process.env

  return {
    PORT,
    EXPOSE,
    IS_DEV,
    IS_PROD,
    ROOT_DIR,
    NODE_ENV,
    PGSQL_URL,
    ALLOW_ORIGIN,
    PASSWORD_GEN_API_URL,
  } as const
}

export default initEnvVariables
