const User = require('../models/user');
const Blog = require('../models/blog');

//addblog

exports.addblog = async (req, res)=>{
    try {
        const Blogger = await User.findById(req.body.userId);

        console.log(req.body);

        const newBlog = req.body;
        delete newBlog.userId;

        const blog = new Blog(newBlog);
        blog.userId = Blogger;
        await blog.save();


        Blogger.blogs.push(blog);

        const user = await Blogger.save();

        res.status(200).json({success: true,blog, user});

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

//get all blogs

exports.getallblog = async (req, res)=>{
    try {
        const blogs = await Blog.find({});
        res.status(200).json({success: true,blogs});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}


//get user blogs
exports.getuserblog = async(req, res) =>{
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);
        if(!user)
            return res.status(404).json({message: "User not exists"});

        const blogs = await Blog.find({userId});
        res.status(200).json({success: true,blogs});

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}


//delete blog
exports.deleteblog = async(req, res) => {
    try {
        const blog = await Blog.findByIdAndRemove(req.params.id);

        if(!blog) {
            return res.status(404).json({message: "Blog Doesnot exits"});
        }

        const user = await User.findById(blog.userId);
        user.blogs.pull(blog);
        await user.save();

        res.status(200).json({success: true,user});

    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}


//update blog
exports.updateblog = async(req, res) => {
    try {
        const blog = await Blog.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({success: true,message: "Blog is updated"});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}

//getblogbyid
exports.getblogbyid = async(req, res) => {
    try{
        const id = req.params.id;

        const blog = await Blog.findById(id);

        if(!blog){
            return  res.status(404).json({message: "Blog Doesnot exits"});
        }

        res.status(200).json({success: true,blog});
    } catch (error) {
        res.status(500).json({success: false, message: error.message})
    }
}



