const express = require('express');
const {check} = require('express-validator');

const Blog = require('../controllers/blog');
const validate = require('../middlewares/validator');

const router = express.Router();

router.get('/user/:id', Blog.getuserblog);

router.get('/', Blog.getallblog);

router.post('/',  [
    check('title').not().isEmpty().withMessage({success:false,message:'Title is required'}),
    check('description').not().isEmpty().withMessage({success:false,message:'Description is required'}),
    check('userId').not().isEmpty().withMessage({success:false,message:'UserId is required'})
], validate, Blog.addblog);


router.get('/:id', Blog.getblogbyid);

router.put('/:id', Blog.updateblog);

router.delete('/:id', Blog.deleteblog);

module.exports = router;