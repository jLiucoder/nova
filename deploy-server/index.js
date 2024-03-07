const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');

// const redis = new Redis({
// 	host: 'localhost',
// 	port: 6379,
// });

const s3Client = new S3Client({
	region: 'us-east-2',
	credentials: {
		accessKeyId: '',
		secretAccessKey: '',
	},
});

const PROJECT_ID = process.env.PROJECT_ID;

// function publishLog(log : string) {
// 	redis.publish(`logs from ${PROJECT_ID}`, JSON.stringify(log));
// }

async function init() {
	console.log('Executing scripts');
	// publishLog('Executing scripts');

	console.log('dirname', __dirname);
	const outDirPath = path.join(__dirname, 'output');
	console.log('outDirPath', outDirPath);

	const p = exec(`cd ${outDirPath} && npm install && npm run build`);

	p.stdout?.on('data', (data) => {
		console.log(data.toString());
		// publishLog(data.toString());
	});

	p.stdout?.on('error', (data) => {
		console.log(data.toString());
		// publishLog(`error: ${data.toString()}`);
	});

	p.on('close', async () => {
		console.log('Build done');
		// publishLog('Build done');
		const distFolderPath = path.join(__dirname, 'output', 'dist');

		if (!fs.existsSync(distFolderPath)) {
			console.log(
				'Error: dist folder does not exist. Build process might have failed or did not generate a dist folder.'
			);
			return; // Exit the function if dist folder does not exist
		}
		
		console.log('distFolerPath:', distFolderPath.toString());
		const distFolderContents = fs.readdirSync(distFolderPath, {
			recursive: true,
		});
		console.log('distFolderContents:', distFolderContents.toString());

		// publishLog(`Starting to upload`);

		for (const file of distFolderContents) {
			const filePath = path.join(distFolderPath, file);
			if (fs.lstatSync(filePath).isDirectory()) continue;

			console.log('uploading', filePath);
			// publishLog(`uploading ${file}`);

			const params = new PutObjectCommand({
				Bucket: 'nova-user-files-bucket',
				Key: `__outputs/${PROJECT_ID}/${file}`,
				Body: fs.createReadStream(filePath),
				ContentType: mime.lookup(filePath),
			});

			await s3Client.send(params);

			// publishLog(`uploaded ${file}`);
			console.log('uploaded', filePath);
		}
		// publishLog(`Done`);
		console.log('Done...');
	});
}

init();
