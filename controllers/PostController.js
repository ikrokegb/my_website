import PostModel from '../models/Post.js';

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.flatMap(post => post.tags);
        const uniqueTags = [...new Set(tags)].slice(0, 5); // уникальные теги
        res.json(uniqueTags)
        } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить теги',
        });
    }
};

export const getLastComments = async (req, res) => {
    try {
        const comments = await CommentModel.find().limit(5).exec();
        res.json(comments)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить комментарии',
        });
    }
};

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts);
        } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи',
        });
    }
};

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndUpdate(
            { _id: postId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        )
        .populate('user')
        .exec();

        if (!doc) {
            throw new Error('Статья не найдена');
        }

        res.json(doc);
    } catch (err) {
        console.error(err);

        if (err.message === 'Статья не найдена') {
            return res.status(404).json({
                message: 'Статья не найдена',
                error: err.message,
            });
        }

        res.status(500).json({
            message: 'Не удалось вернуть статью',
            error: err.message,
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось создать статью',
        });
    }
};

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOneAndDelete({ _id: postId }).exec();

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось удалить статью',
            error: err.message,
        });
    }
};

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId,
        }, 
        {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        },
        );

        res.json({
            success: true,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось обновить статью',
        });
    }
};