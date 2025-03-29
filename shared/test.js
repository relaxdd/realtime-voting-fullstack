import gql from 'graphql-tag'
import { resolve } from 'path'
import { readFileSync } from 'fs'

function main() {
  const schema = gql(readFileSync(resolve(process.cwd(), 'shared/schema.graphql'), { encoding: 'utf-8' }))
  console.log(schema)
}

main()