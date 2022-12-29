// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

sns = new SNSClient();

const sendMessage = async ({ phoneNumber, message }) => {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber
  };

  response = await sns.send(new PublishCommand(params));
  return response;
};

module.exports = sendMessage;
