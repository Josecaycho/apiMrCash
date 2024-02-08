require("dotenv").config();
const {S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand} = require('@aws-sdk/client-s3')
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner')
const fs = require("fs");

const client = new S3Client ({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

async function uploadFileValidate(file, dni) {
  const keySend = `dni/${dni}/${file.originalname}`
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: keySend,
    Body: file.buffer
  }
  const command = new PutObjectCommand(uploadParams)
  const result = await client.send(command)
  return {result: result, key: file.originalname}
}

async function uploadFileOrder(file, dni) {
  const keySend = `vaucher/${dni}/${file.originalname}`
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: keySend,
    Body: file.buffer
  }
  const command = new PutObjectCommand(uploadParams)
  const result = await client.send(command)
  return {result: result, key: file.originalname}
}

async function getFiles() {
  const command = new ListObjectsCommand({
    Bucket: process.env.AWS_BUCKET_NAME
  })
  return await client.send(command)
}

async function getFile(filename) {
  console.log(filename)
  const input = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename
  };
  const command = new GetObjectCommand(input)
  return await getSignedUrl(client, command, {expiresIn: 3600})
}

module.exports = {
  uploadFileValidate,
  uploadFileOrder,
  getFiles,
  getFile,
  client
}