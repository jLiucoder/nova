import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { generateSlug } from 'random-word-slugs';
import simpleGit from 'simple-git';
import { uploadS3 } from './utils/s3-util';
import { getAllFiles } from './utils/utils';
import path from 'path';
import { sendSQS } from './utils/sqs-util';

dotenv.config();

const app = express();
app.use(express.json());

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});

app.get('/', (req: Request, res: Response) => {
	res.send('Hello World');
});

app.post('/upload', async (req: Request, res: Response) => {
	const repoURL = req.body.repoURL;
	const slug = generateSlug();
	const id = slug + '-' + Date.now().toString();

	await simpleGit().clone(repoURL, path.join(__dirname, `output/${id}`));

	let files = getAllFiles(path.join(__dirname, `output/${id}`));

	for (const file of files) {
		await uploadS3(file.slice(__dirname.length + 1), file);
	}

    const response = sendSQS(id, { id: id, status: 'uploaded' }, 'upload');

    if (response instanceof Error) {
        console.error('Error sending message to SQS:', response);
        res.status(500).json({ error: 'Error sending message to SQS' });
    }

    // return the id of the upload back to user
	res.json({ id: id });
});
