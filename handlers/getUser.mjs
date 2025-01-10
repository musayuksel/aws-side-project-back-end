import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log({ event });
  try {
    const email = event.queryStringParameters?.email;

    if (!email) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": event.headers.origin,
        },
        body: JSON.stringify({ message: "Email is required" }),
      };
    }

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { email },
    };

    console.log({ params });
    const command = new GetCommand(params);
    const data = await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": event.headers.origin,
      },
      body: JSON.stringify(data.Item || { message: "User not found" }),
    };
  } catch (error) {
    console.error("Error getting user:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": event.headers.origin,
      },
      body: JSON.stringify({ message: error.message }), // Return the actual error message for debugging
    };
  }
};
