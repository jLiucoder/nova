import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import dotenv from 'dotenv';
import {getAWSBucketName, getAWSCredentials, getAWSRegion} from "./aws-client";
dotenv.config();

export const client = new S3Client({
	region: getAWSRegion(),
	credentials: {
		accessKeyId: getAWSCredentials().accessKeyId,
		secretAccessKey: getAWSCredentials().secretAccessKey,
	},
});

export const uploadS3 = async (filename: string, localpath: string) => {
	const fileContent = fs.readFileSync(localpath);
	const params = new PutObjectCommand({
		Bucket: getAWSBucketName(),
		Key: filename,
		Body: fileContent,
	});

	try {
		const response = await client.send(params);
		console.log(response);
	} catch (error) {
		console.log(error);
		return error;
	}
};

export const downloadS3 = async (filename: string, localpath: string) => {
	const params = {
		Bucket: getAWSBucketName(),
		Key: filename,
	};

	try {
		const response = await client.send(new GetObjectCommand(params));
		fs.writeFileSync(localpath, response.Body);
		console.log(response);
	} catch (error) {
		console.log(error);
		return error;
	}
};
