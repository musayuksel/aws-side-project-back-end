// src/index.js
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const stream = require("stream");
const BUCKET_NAME = "musa-website-lambda-edge-test-bucket-081224v3"; // Hardcoded bucket name

const s3 = new S3Client({ region: "us-east-1" });

const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2)); // Log the received event

  const key = event.queryStringParameters.fileName || "default-config.json";
  const params = { Bucket: BUCKET_NAME, Key: key };

  try {
    const data = await s3.send(new GetObjectCommand(params));
    const fileContent = JSON.parse(await streamToString(data.Body));
    fileContent.updated = "withLambda";

    console.log("File content:", fileContent); // Log the file content

    return {
      statusCode: 200,
      body: JSON.stringify(fileContent),
    };
  } catch (error) {
    console.error("Error getting object from S3:", error); // Log the error

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
