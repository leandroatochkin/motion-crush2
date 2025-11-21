import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

const app = express();
const host = process.env.PORT
const environment = process.env.ENVIRONMENT


app.listen(3000, ()=>console.log(`listening on port ${host}`))