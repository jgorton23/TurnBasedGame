echo "Creating Lambda function"
FUNCTION_ARN=$(aws lambda create-function \
  --function-name turn-based-api \
  --runtime nodejs16.x \
  --role arn:aws:iam::937654228897:role/Cloud9-turn-based-api-lambda-role \
  --handler application/handler.handler \
  --timeout 12 \
  --memory 1024 \
  --publish \
  --environment '{
    "Variables": {
      "USER_POOL_ID": "'${USER_POOL_ID}'",
      "COGNITO_CLIENT_ID": "'${COGNITO_CLIENT_ID}'"
    }
  }' \
  --zip-file fileb://application.zip \
  --query 'FunctionArn' \
  --output text \
  --profile jacob)

echo "Lambda function created with ARN ${FUNCTION_ARN}"
echo "export FUNCTION_ARN=${FUNCTION_ARN}" >> env.sh
