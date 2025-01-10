## Deployment Guide

### Architecture Diagram

<!-- add diagram here -->

---

### How to Deploy the CloudFront Distribution

1. Clone the repository.
2. Create a new stack in AWS CloudFormation and upload the `cloudfront.template.yaml` file.
3. Fill in the required parameters (e.g., `ConfigBucket`).
4. Deploy the stack.
5. Once the stack is created, retrieve the CloudFront distribution URL from the `Output` section of the stack.
6. Upload the `default-config.json` file to the S3 bucket created by the stack.
7. Access the application via the CloudFront distribution URL.

---

### How to Deploy the API Gateway and Lambda Functions

1. Clone the repository.
2. Prepare the Lambda code by zipping the handler and dependencies:
   ```bash
   zip -r lambda-functions.zip handlers package.json node_modules
   ```
3. Upload the zip file to an S3 bucket (e.g., musa-yxl-lambda-apigateway-code).
4. Create a new stack in AWS CloudFormation and upload the gateway.lambda-db-template.yaml file.
5. Fill in the required parameters (e.g., TableName, CodeBucket, CodeKey).
6. Deploy the stack.
7. Once the stack is created, retrieve the API Gateway endpoint from the Output section of the stack.
