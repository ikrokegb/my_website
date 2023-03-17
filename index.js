import express from "express";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import { validationResult } from 'express-validator';

mongoose
    .connect('mongodb+srv://ikristaai:66ggttrr45@cluster0.4aundnw.mongodb.net/?retryWrites=true&w=majority')
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));


const app = express();

app.use(express.json());

app.post('/auth/redister', registerValidation, (req, res) => {

});

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('server OK');
})