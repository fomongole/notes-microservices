import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import hpp from 'hpp';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { PORT, AUTH_SERVICE_URL, USER_SERVICE_URL, NOTES_SERVICE_URL, CLIENT_URL } from './config/env';

const app = express();

// 1. Security & Logging
app.use(helmet());
// app.use(hpp());
app.use(morgan('dev')); // Logs requests to console
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// 2. Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'API Gateway' });
});

// 3. Proxy Rules

// Auth Service: /api/auth/* -> http://localhost:3001/auth/*
app.use('/api/auth', createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/auth': '/auth' // Strip '/api/auth' and replace with '/auth'
    }
}));

// User Service: /api/users/* -> http://localhost:3002/users/*
// Also handles /internal/users if you ever needed to debug (but usually blocked)
app.use('/api/users', createProxyMiddleware({
    target: USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/users': '/users'
    }
}));

// Notes Service: /api/notes/* -> http://localhost:3003/notes/*
app.use('/api/notes', createProxyMiddleware({
    target: NOTES_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        '^/api/notes': '/notes'
    }
}));

// 4. Start Gateway
app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
    console.log(`👉 Auth Service Proxy -> ${AUTH_SERVICE_URL}`);
    console.log(`👉 User Service Proxy -> ${USER_SERVICE_URL}`);
    console.log(`👉 Notes Service Proxy -> ${NOTES_SERVICE_URL}`);
});