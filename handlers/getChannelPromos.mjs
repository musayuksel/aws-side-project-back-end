import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log({ event });
  try {
    const channel = event.queryStringParameters?.channel;

    if (!channel) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": event.headers.origin || "*",
        },
        body: JSON.stringify({ message: "Channel is required" }),
      };
    }

    const params = {
      TableName: process.env.TABLE_NAME,
      Key: { channel },
    };

    console.log({ params });
    const command = new GetCommand(params);
    const data = await docClient.send(command);

    const response = {
      stat: { name: "connected_bridge" },
      channel,
      promoted: data.Item?.promoted || [],
    };

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": event.headers.origin || "*",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": event.headers.origin || "*",
      },
      body: JSON.stringify({ message: error.message }),
    };
  }
};
