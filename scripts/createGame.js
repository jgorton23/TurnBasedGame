// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new STSClient();

const assumeRole = new AssumeRoleCommand({ TokenCode: "467806", RoleSessionName: "sesh", RoleArn: "arn:aws:iam::937654228897:role/AccountAdmin", SerialNumber: "arn:aws:iam::937654228897:mfa/jgorton200@gmail.com"})
const response = await client.send(assumeRole)

const config = {
  credentials: {
    accessKeyId: response.Credentials.AccessKeyId,
    secretAccessKey: response.Credentials.SecretAccessKey,
    sessionToken: response.Credentials.SessionToken
  }
}
const dbclient = new DynamoDBClient(config)

const params = {
  TableName: 'turn-based-game',
  Item: {
    gameId: {'S': '5b5ee7d8'},
    user1: {'S': 'myfirstuser'},
    user2: {'S': 'theseconduser'},
    heap1: {'N': '5'},
    heap2: {'N': '4'},
    heap3: {'N': '5'},
    lastMoveBy: {'S': 'myfirstuser'}
  }
}
dbclient.send(new PutItemCommand(params))
  .then(() => console.log('Game added successfully!'))
  .catch((error) => console.log('Error adding game', error))
