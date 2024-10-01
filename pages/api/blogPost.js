// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import connectDb from "@/middleware/mongoose"
import Blog from "@/models/blog";


const handler = async(req,res)=>{
    if (req.method === 'POST') {
        const { author, title, category, content,message } = req.body;

        console.log(author, title , category , content, message);
        // Basic server-side validation
        if (!author || !title || !category || !content || !message) {
          return res.status(400).json({ error: 'All fields are required.' });
        }
    
        try {
          // Create a new blog post instance
          const newBlog = new Blog({
            author,
            title,
            category,
            content,
            message
          });
    
          // Save the blog post to the database
          const savedBlog = await newBlog.save();
    
          return res.status(201).json({ success: true, blog: savedBlog });
        } catch (error) {
          return res.status(500).json({ error: 'Failed to create blog post', details: error.message });
        }
      } else {
        // If it's not a POST request, return method not allowed
        return res.status(405).json({ error: 'Method not allowed' });
      }

}

export default connectDb(handler)
  