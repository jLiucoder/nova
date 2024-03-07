import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { generateSlug } from 'random-word-slugs';
import { sendSQS } from './utils/sqs-util';
import { Server } from 'socket.io';
import Redis from 'ioredis';
import { runTask } from './utils/ecs-client';

dotenv.config();

const app = express();
app.use(express.json());

const SOCKET_PORT = 9002;
const SERVER_PORT = 9000;

// const subscriber = new Redis({
// 	host: 'localhost',
// 	port: 6379,
// });

// const io = new Server({ cors: { origin: '*' } });

// io.on('connection', (socket) => {
// 	socket.on('subscribe', (channel) => {
// 		socket.join(channel);
// 		socket.emit('subscribed', channel);
// 	});
// });

// io.listen(SOCKET_PORT);
// console.log(`Socket.io listening on port ${SOCKET_PORT}`);

app.listen(SERVER_PORT, () => {
	console.log(`API Server listening on port ${SERVER_PORT}`);
});


app.get('/', (req: Request, res: Response) => {
	res.send('Hello World');
});

app.post('/project', async (req: Request, res: Response) => {
	const { gitURL } = req.body;

	if (!gitURL) {
		return res.status(400).json({ Error: 'gitURL is required' });
	}

	const projectSlug = generateSlug();

	try {
		await runTask(gitURL, projectSlug);
	} catch (e) {
		return res.status(500).json({ Error: `Error running task ${e}` });
	}

	return res.json({
		status: 'queued',
		data: { projectSlug, url: `http://${projectSlug}.localhost:8000` },
	});
});

// async function initRedisSubscribe() {
// 	console.log('Subscribed to logs....');
// 	subscriber.psubscribe('logs:*');
// 	subscriber.on('pmessage', (pattern, channel, message) => {
// 		io.to(channel).emit('message', message);
// 	});
// }

// initRedisSubscribe();
