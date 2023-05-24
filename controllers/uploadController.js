import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { promisify } from 'util';
const randomBytes = promisify(crypto.randomBytes);
const rawBytes = await randomBytes(16);
const imageName = rawBytes.toString('hex');

aws.config.update({
  accessKeyId: 'AKIAQDTYZYQMKSSXCK32',
  secretAccessKey: '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',
  region: 'ap-northeast-1',
});

const s3 = new aws.S3();

const region = 'ap-northeast-1';
const bucketName = 'keto-food-generator-bucket';
const accessKeyId = 'AKIAQDTYZYQMKSSXCK32';
const secretAccessKey = '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';
var date = new Date();
var dateNow =
  date.getFullYear() +
  ('0' + (date.getMonth() + 1)).slice(-2) +
  ('0' + date.getDate()).slice(-2) +
  ('0' + date.getHours()).slice(-2) +
  ('0' + date.getMinutes()).slice(-2) +
  ('0' + date.getSeconds()).slice(-2);

// const s3 = new aws.S3({
//   region,
//   accessKeyId,
//   secretAccessKey,
//   signatureVersion: 'v4',
// });

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'keto-food-generator-bucket',
    key: function (req, file, cb) {
      cb(null, +dateNow.toString() + '-' + imageName + '-' + file.originalname);
    },
  }),
});

export const uploadImage = asyncHandler(async (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const imageUrl = req.file.location;
    res.json({ imageUrl });
  });
});
