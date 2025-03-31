import Application from './class/Application'
import initEnvVariables from './shared/named/initEnvVariables'

// TODO: express-session
async function main() {
  try {
    const ENV = initEnvVariables([process.cwd(), __dirname])
    if (!ENV.PGSQL_URL) throw new Error('The "PGSQL_URL" argument cannot be empty')

    // const prisma = new PrismaClient({ datasourceUrl: ENV.PGSQL_URL })
    const application = new Application(ENV)
    await application.start()

    return { ENV, prisma: null }
  } catch (err) {
    console.error((err as Error)?.message)
    process.exit(1)
  }
}

export const { ENV, prisma } = await main()