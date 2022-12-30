// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb"

const dbclient = new DynamoDBClient();

const performMove = async ({ gameId, user, changedHeap, changedHeapValue }) => {
  if (changedHeapValue < 0) {
    throw new Error("Cannot set heap value below 0");
  }
  const params = {
    TableName: "turn-based-game",
    Key: {
      gameId: {'S': gameId}
    },
    UpdateExpression: `SET lastMoveBy = :user, ${changedHeap} = :changedHeapValue`,
    ConditionExpression: `(user1 = :user OR user2 = :user) AND lastMoveBy <> :user AND ${changedHeap} > :changedHeapValue`,
    ExpressionAttributeValues: {
      ":user": {'S': user},
      ":changedHeapValue": {'N': changedHeapValue}
    },
    ReturnValues: "ALL_NEW"
  };
  try {
    const resp = await dbclient.send(new UpdateItemCommand(params));
    return resp.Attributes;
  } catch (error) {
    console.log("Error updating item: ", error.message);
    throw new Error('Could not perform move')
  }
};

export default performMove;