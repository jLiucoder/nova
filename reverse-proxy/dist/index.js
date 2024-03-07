"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const SERVER_PORT = 8000;
const BASE_PATH = 'https://nova-user-files-bucket.s3.us-east-2.amazonaws.com/__outputs';
const proxy = http_proxy_1.default.createProxy();
app.use((req, res) => {
    const hostname = req.hostname;
    const subdomain = hostname.split('.')[0];
    console.log('Request received for subdomain:', subdomain);
    const resolveTo = `${BASE_PATH}/${subdomain}`;
    console.log('Proxying to:', resolveTo);
    return proxy.web(req, res, { target: resolveTo, changeOrigin: true });
});
proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html';
    return proxyReq;
});
app.listen(SERVER_PORT, () => {
    console.log(`API Server listening on port ${SERVER_PORT}`);
});
