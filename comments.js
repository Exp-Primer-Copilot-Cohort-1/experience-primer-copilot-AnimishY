// Create web server

// Import modules
const express = require('express');
const router = express.Router();

// Load comment model
const Comment = require('../../models/Comment');

// Load post model
const Post = require('../../models/Post');

// Load validation
const validateCommentInput = require('../../validation/comment');

// @route   GET api/comments/test
// @desc    Tests comments route
// @access  Public
router.get('/test', (req, res) => {
    res.json({msg: "Comments works"});
});

// @route   POST api/comments/:post_id
// @desc    Create comment
// @access  Private
router.post('/:post_id', passport.authenticate('jwt', {session: false}), (req, res) => {
    const {errors, isValid} = validateCommentInput(req.body);

    // Check validation
    if (!isValid) {
        // Return errors
        return res.status(400).json(errors);
    }

    Post.findById(req.params.post_id)
        .then(post => {
            const newComment = new Comment({
                text: req.body.text,
                user: req.user.id,
                post: post.id
            });

            // Save comment
            newComment.save()
                .then(comment => res.json(comment))
                .catch(() => res.status(404).json({commentnotfound: 'Comment not found'}));
        })
        .catch(() => res.status(404).json({postnotfound: 'Post not found'}));
});

// @route   DELETE api/comments/:id
// @desc    Delete comment
// @access  Private
router.delete('/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
    // Check if user is the owner of the comment
    Comment.findById(req.params.id)
        .then(comment => {
            if (comment.user.toString() !== req.user.id) {
                // User is not the owner
                return res.status(401).json({notauthorized: 'User not authorized'});
            }

            // User is the owner
            // Delete comment
            comment.remove()
                .then(() => res.json({success: true}))
                .catch(() => res.status(404).json({commentnotfound: 'Comment not found'}));
        })
        .catch(() => res.status(404).json({commentnotfound: 'Comment not found'}));
});
