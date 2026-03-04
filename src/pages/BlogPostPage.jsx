import { Link, useParams } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

function BlogPostPage() {
    const { postId } = useParams();
    const post = blogPosts.find((entry) => entry.id === postId);

    if (!post) {
        return (
            <main className="w-full px-6 py-12">
                <div className="max-w-3xl mx-auto bg-white/70 border border-gray-200 rounded-xl p-6 md:p-8">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-3">Post not found</h1>
                    <p className="text-gray-600 mb-4">The blog post you are looking for does not exist.</p>
                    <Link to="/blog" className="text-gray-800 font-medium hover:underline">← Back to Blog</Link>
                </div>
            </main>
        );
    }

    return (
        <main className="w-full px-6 py-12">
            <article className="max-w-3xl mx-auto bg-white/70 border border-gray-200 rounded-xl p-6 md:p-10">
                <Link to="/blog" className="text-sm text-gray-600 hover:text-gray-900 hover:underline">← Back to Blog</Link>
                <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mt-4 mb-3">{post.title}</h1>
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-6">{post.date}</p>
                {post.excerpt && <p className="text-gray-700 text-lg leading-relaxed mb-5">{post.excerpt}</p>}
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
            </article>
        </main>
    );
}

export default BlogPostPage;