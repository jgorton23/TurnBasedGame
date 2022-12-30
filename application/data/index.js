// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
// const createGame = require("./createGame");
import createGame from "./createGame.js";
import fetchGame from "./fetchGame.js";
import performMove from "./performMove.js";
import handlePostMoveNotification from "./handlePostMoveNotification.js";

export {
  createGame,
  fetchGame,
  performMove,
  handlePostMoveNotification
};