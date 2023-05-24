import dotenv from 'dotenv';
import aws from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from 'util';

const randomBytes = promisify(crypto.randomBytes);

const region = 'ap-northeast-1';
const bucketName = 'keto-food-generator-bucket';
const accessKeyId = 'AKIAQDTYZYQMKSSXCK32';
const secretAccessKey = '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';

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

export async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex');

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 1000,
  };

  console.log(params);

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
}
