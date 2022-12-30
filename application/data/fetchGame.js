// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"

const dbclient = new DynamoDBClient();

const fetchGame = async gameId => {
  const params = {
    TableName: "turn-based-game",
    Key: {
      gameId: {'S': gameId}
    }
  };

  try {
    const game = await dbclient.send(new GetItemCommand(params));
    return game.Item;
  } catch (error) {
    console.log("Error fetching game: ", error.message);
    throw new Error("Could not fetch game");
  }
};

export default fetchGame;
