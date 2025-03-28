interface IEnvirement {
  PORT: number
  MODE: 'development' | 'production'
  EXPOSE: boolean
  PGSQL_URL: string
}
