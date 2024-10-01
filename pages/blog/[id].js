import React from 'react';
import blog from '@/models/blog';
import mongoose from 'mongoose';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cookie from 'cookie';
import user from '@/models/user';

const Post = ({ post , user }) => {
  const router = useRouter();

  const handleEdit = () => {

    // Redirect to edit page, if you have it set up
    // router.push(`/blog/edit/${post._id}`);
    console.log("edit");
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const res = await fetch(`/api/blog/${id}`, {
          method: 'DELETE',
        });

        if (res.ok) {
          alert('Post deleted successfully!');
          // Redirect to homepage or another page after deletion
          router.push('/');
        } else {
          const { message } = await res.json();
          alert(`Error: ${message}`);
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('An error occurred while deleting the post.');
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Post Header */}
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">{post.title}</h1>
        <p className="text-gray-600 text-sm md:text-base">
          By <span className="text-blue-600">{post.author}</span> |{' '}
          {new Date(post.createdAt).toLocaleDateString('en-GB')}
        </p>
      </header>

      {/* Post Content */}
      <article className="prose prose-lg text-gray-800 leading-8">
        <p className="mb-6">{post.content}</p>
      </article>

      {/* Post Message */}
      <section className="mt-10 bg-blue-50 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Message</h2>
        <p className="text-gray-700 leading-relaxed">{post.message}</p>
      </section>

      {/* Action Buttons */}
      { (user.name === post.author || user.name === "Admin") && <div className="mt-8 flex space-x-4">
        {/* Edit Button */}
        {/* <button onClick={handleEdit} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">
          Edit
        </button> */}

        {/* Delete Button */}
        <button
          className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200"
          onClick={() => handleDelete(post._id)}
        >
          Delete
        </button>
      </div>}

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Business Blog. All rights reserved.
      </footer>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { id } = context.params;
  const { req } = context;
  const cookies = req.headers.cookie ? cookie.parse(req.headers.cookie) : {};
  const email = cookies.email || null;

  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const post = await blog.findById(id);

  const u = await user.findOne({email:email})
  return {
    props: { post: post ? JSON.parse(JSON.stringify(post)) : null,user: u ? JSON.parse(JSON.stringify(u)) : {name:"Guest"}  },
  };
}

export default Post;
