// src/index.js
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
  const bucket = process.env.BUCKET_NAME;
  const key = event.queryStringParameters.fileName || 'default-config.json';

  const params = { Bucket: bucket, Key: key };

  try {
    const data = await s3.getObject(params).promise();
    return {
      statusCode: 200,
      body: data.Body.toString(),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
