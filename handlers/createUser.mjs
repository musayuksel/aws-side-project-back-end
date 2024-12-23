import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log({ event });
  try {
    const requestBody = JSON.parse(event.body);
    const { email, name, age } = requestBody;

    if (
      !email ||
      typeof email !== "string" ||
      !name ||
      typeof name !== "string" ||
      age === undefined ||
      typeof age !== "number"
    ) {
      console.error("Invalid input data:", { email, name, age });
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": event.headers.origin,
        },
        body: JSON.stringify({
          message:
            "Email (string), name (string), and age (number) are required and must be of the correct type.",
        }),
      };
    }

    const params = {
      TableName: process.env.TABLE_NAME,
      Item: { email, name, age },
    };

    console.log({ params });
    const command = new PutCommand(params);
    await docClient.send(command);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": event.headers.origin,
      },
      body: JSON.stringify({ message: "User created successfully" }),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      statusCode: 500,
      hheaders: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": event.headers.origin,
      },
      body: JSON.stringify({ message: error.message }), // Include the actual error message
    };
  }
};
