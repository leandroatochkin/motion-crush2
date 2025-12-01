import bodyParser from 'body-parser';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import checkLoginRoute from './api/routes/auth/checkLogin.js';
import createSketchRoute from './api/routes/sketches/createSketch.js';
import paymentRoute from './api/routes/payment/payment.js';
import cors from 'cors';

const app = express();
const host = process.env.PORT
const environment = process.env.ENVIRONMENT

const frontendURL = process.env.FRONTEND_URL_A;
const allowedOrigins = [
    frontendURL,
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'), false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ⚠️ AGREGA ESTE MIDDLEWARE DE DEBUG
app.use((req, res, next) => {
    console.log('📥 Request recibida:');
    console.log('  Method:', req.method);
    console.log('  URL:', req.url);
    console.log('  Headers:', req.headers);
    console.log('  Body (antes de parser):', req.body);
    next();
});

app.use(bodyParser.json());

// ⚠️ OTRO LOG DESPUÉS DEL PARSER
app.use((req, res, next) => {
    console.log('📦 Body después del parser:', req.body);
    next();
});

app.use('/auth/check-login', checkLoginRoute);
app.use('/sketches/create-sketch', createSketchRoute);
app.use('/payment', paymentRoute)

app.listen(3000, ()=>console.log(`listening on port ${host}`))