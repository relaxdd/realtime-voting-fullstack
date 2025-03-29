import { config } from 'dotenv'
import { existsSync } from 'fs'
import { join } from 'path'
import dotenvExpand from 'dotenv-expand'

/**
 * @version 1.1.0
 * @author awenn2015
 */
class DotEnvService {
  private readonly allowed: string[]
  private readonly mode: string

  public constructor(public isDev: boolean, narrow = false) {
    this.mode = this.isDev ? 'development' : 'production'
    this.allowed = narrow
      ? [`.env.${this.mode}.local`, `.env.${this.mode}`]
      : [`.env.${this.mode}.local`, `.env.${this.mode}`, '.env.local', '.env']
  }

  private findEnv(rootDir: string) {
    const find = this.allowed.find(it => {
      return existsSync(join(rootDir, it))
    })

    return find ? join(rootDir, find) : undefined
  }

  public load(rootDir: string, envFile?: string) {
    envFile = envFile || this.findEnv(rootDir)
    if (!envFile) return

    dotenvExpand.expand(config({
      path: envFile,
      debug: this.isDev,
      encoding: 'utf-8',
      override: true,
    }))
  }
}

export default DotEnvService
