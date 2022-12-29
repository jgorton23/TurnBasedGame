// Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0
import { STSClient, AssumeRoleCommand } from '@aws-sdk/client-sts'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

const client = new STSClient()

const command = new AssumeRoleCommand({ TokenCode: "220561", RoleSessionName: "sesh", RoleArn: "arn:aws:iam::937654228897:role/AccountAdmin", SerialNumber: "arn:aws:iam::937654228897:mfa/jgorton200@gmail.com" })

const response = await client.send(command)

const config = {
  credentials: {
    accessKeyId: response.Credentials.AccessKeyId,
    secretAccessKey: response.Credentials.SecretAccessKey,
    sessionToken: response.Credentials.SessionToken
  }
}

const sns = new SNSClient(config)

const sendMessage = async ({ phoneNumber, message }) => {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber
  }
  
  const command = new PublishCommand(params)
  return sns.send(command)
}

sendMessage({ phoneNumber: process.env.PHONE_NUMBER, message: 'Sending a message from SNS!'})
  .then(() => console.log('Sent message successfully'))
  .catch((error) => console.log('Error sending SNS: ', error.message))