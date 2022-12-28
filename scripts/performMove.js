// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb"

const client = new STSClient();

const assumeRole = new AssumeRoleCommand({ TokenCode: "977429", RoleSessionName: "sesh", RoleArn: "arn:aws:iam::937654228897:role/AccountAdmin", SerialNumber: "arn:aws:iam::937654228897:mfa/jgorton200@gmail.com"})
const response = await client.send(assumeRole)

const config = {
  credentials: {
    accessKeyId: response.Credentials.AccessKeyId,
    secretAccessKey: response.Credentials.SecretAccessKey,
    sessionToken: response.Credentials.SessionToken
  }
}

const dbclient = new DynamoDBClient(config)


const performMove = async ({ gameId, user, changedHeap, changedHeapValue }) => {
  if (changedHeapValue < 0 ) {
    throw new Error('Cannot set heap value below 0')
  }
  const params = {
    TableName: 'turn-based-game',
    Key: { 
      gameId: {'S': gameId}
    },
    UpdateExpression: `SET lastMoveBy = :user, ${changedHeap} = :changedHeapValue`,
    ConditionExpression: `(user1 = :user OR user2 = :user) AND lastMoveBy <> :user AND ${changedHeap} > :changedHeapValue`,
    ExpressionAttributeValues: {
      ':user': {'S': user},
      ':changedHeapValue': {'N': changedHeapValue},
    },
    ReturnValues: 'ALL_NEW'
  }
  try {
    const command = new UpdateItemCommand(params)
    const resp = await dbclient.send(command)
    console.log('Updated game: ', resp.Attributes)
  } catch (error) {
    console.log('Error updating item: ', error.message)
  }
}

performMove({ gameId: '5b5ee7d8', user: 'theseconduser', changedHeap: 'heap1', changedHeapValue: '3' })
