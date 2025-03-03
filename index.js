import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import fileUpload from 'express-fileupload';
import path from 'path';
import morgan from 'morgan';
import i18next from 'i18next';
import fsBackend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import rourte from './routes/index.js';  
import socket from './socket/socket.js';
import './config/db.js';
import http from 'http';
import {  handleErrors } from './middlewares/errorHandler.js';
import { sendResponse } from './utils/responseHelper.js';

const app = express();
const server = http.createServer(app);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));

i18next
  .use(i18nextMiddleware.LanguageDetector)
  .use(fsBackend)
  .init({
    fallbackLng: 'en',
    preload: ['en', 'fr'],
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
  });

app.use(i18nextMiddleware.handle(i18next));  

// Body parsing and file upload
app.use(express.json());
app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));

// Log HTTP requests
app.use(morgan('dev'));

// Enable CORS for all origins
app.use(cors('*'));

// Use your route definitions
app.use('/', rourte);

// WebSocket setup
socket(app, server);

app.use((req, res) => {
  console.log(`Request Method: ${req.method}, Request URL: ${req.originalUrl}`);
  sendResponse(req, res, 404, false, `Resource Not Found: ${req.method} ${req.originalUrl}`);
});

// Handle errors and 404
app.use(handleErrors);

const port = process.env.PORT || 4004;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Handle unhandled promise rejections globally
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
