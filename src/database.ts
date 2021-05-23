import aws from 'aws-sdk'

import { NotFoundError } from './errors'
import { Action, DatabaseEntry, DatabaseEntryInsert } from './types'

const documentClient = new aws.DynamoDB.DocumentClient()
const table = process.env.DYNAMODB_TABLE_NAME!

export const insert = async ({ id, data }: DatabaseEntryInsert) => {
  const params = {
    TableName: table,
    Item: {
      id,
      data,
      updated: Date.now(),
    },
  }

  await documentClient.put(params).promise()
}

export const getById = async (id: Action): Promise<DatabaseEntry> => {
  const params = {
    TableName: table,
    Key: {
      id: id,
    },
  }

  const data = await documentClient.get(params).promise()

  if (!data?.Item) throw new NotFoundError(`No data found for: ${id}`)
  return data.Item as DatabaseEntry
}
