import express from 'express';
import httpProxy from 'http-proxy';
import { Request, Response } from 'express';

const app = express();
app.use(express.json());

const SERVER_PORT = 8000;
const BASE_PATH =
	'https://nova-user-files-bucket.s3.us-east-2.amazonaws.com/__outputs';

const proxy = httpProxy.createProxy();

app.use((req: Request, res: Response) => {
	const hostname = req.hostname;
	const subdomain = hostname.split('.')[0];
	console.log('Request received for subdomain:', subdomain);

	const resolveTo = `${BASE_PATH}/${subdomain}`;

	console.log('Proxying to:', resolveTo);

	return proxy.web(req, res, { target: resolveTo, changeOrigin: true });
});

proxy.on('proxyReq', (proxyReq, req, res) => {
	const url = req.url;
	if (url === '/') proxyReq.path += 'index.html';

	return proxyReq;
});

app.listen(SERVER_PORT, () => {
	console.log(`API Server listening on port ${SERVER_PORT}`);
});
