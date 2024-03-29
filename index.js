import express from 'express';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation, CommentCreateValidation } from './validations.js';

import {handleValidationErrors, checkAuth} from './utils/index.js';

import { UserController, PostController, CommentController } from './controllers/index.js';


mongoose
    .connect(
        'mongodb+srv://ikristaai:66ggttrr45@cluster0.4aundnw.mongodb.net/blog?retryWrites=true&w=majority'
        )
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `uploads/${req.file.originalname}`,
    });
});
app.get('/tags', PostController.getLastTags);

app.get('/posts', PostController.getAll);
app.get('posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);

//коммент
app.post('/comments', checkAuth, CommentCreateValidation, CommentController.createComment);
app.delete('/comments/:id', checkAuth, CommentController.deleteComment);
app.get('/comments/:id', CommentController.getOneComment);
app.get('/posts/:id/comments', CommentController.getAllComments);
app.patch(
    '/comments/:id', 
    checkAuth, 
    CommentCreateValidation, 
    handleValidationErrors,
    CommentController.updateComment);


app.patch(
    '/posts/:id', 
    checkAuth, 
    postCreateValidation, 
    handleValidationErrors,
    PostController.update,
    );

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('server OK');
});