// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import uuid from "uuidv4";
import { sendMessage } from "./sendMessage.js"
const dbclient = new DynamoDBClient()

const createGame = async ({ creator, opponent }) => {
  const params = {
    TableName: "turn-based-game",
    Item: {
      gameId: {'S': uuid().split('-')[0]},
      user1: {'S': creator},
      user2: {'S': opponent.username},
      heap1: {'N': 5},
      heap2: {'N': 4},
      heap3: {'N': 5},
      lastMoveBy: {'S': creator}
    }
  };

  try {
    await dbclient.send(new PutItemCommand(params));
  } catch (error) {
    console.log("Error creating game: ", error.message);
    throw new Error("Could not create game");
  }

  const message = `Hi ${opponent.username}. Your friend ${creator} has invited you to a new game! Your game ID is ${params.Item.gameId}`;
  try {
    await sendMessage({ phoneNumber: opponent.phoneNumber, message });
  } catch (error) {
    console.log("Error sending message: ", error.message);
    throw new Error("Could not send message to user");
  }

  return params.Item;
};

export default createGame;
