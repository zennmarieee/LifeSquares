import { Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';

function BlogPage() {
    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <main className="w-full px-6 py-12">
            <div className="max-w-4xl mx-auto space-y-6">
                <section className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-10">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-3">Blog</p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-3">Notes from the LifeSquares journey</h1>
                    <p className="text-gray-700 leading-relaxed">
                        Updates, reflections, and ideas about intentional living — written one week at a time.
                    </p>
                    <p className="text-sm text-gray-500 mt-4">{sortedPosts.length} post{sortedPosts.length === 1 ? '' : 's'}</p>
                </section>

                <section className="space-y-4">
                    {sortedPosts.length === 0 && (
                        <div className="bg-white/70 border border-gray-200 rounded-xl p-6 text-gray-600">
                            No posts yet. Add one in <span className="font-medium">src/data/blogPosts.js</span> and it will appear automatically.
                        </div>
                    )}

                    {sortedPosts.map((post) => (
                        <article key={post.id} className="bg-white/70 border border-gray-200 rounded-xl p-6 md:p-7">
                            <h2 className="text-2xl font-semibold text-gray-800">
                                <Link to={`/blog/${post.id}`} className="hover:underline">
                                    {post.title}
                                </Link>
                            </h2>
                            <p className="text-xs uppercase tracking-wide text-gray-500 mt-2 mb-4">{post.date}</p>
                            {post.excerpt && <p className="text-gray-700 mb-4 text-base">{post.excerpt}</p>}
                            <Link
                                to={`/blog/${post.id}`}
                                className="inline-flex items-center text-sm font-medium text-gray-800 hover:underline"
                            >
                                Read more →
                            </Link>
                        </article>
                    ))}
                </section>
            </div>
        </main>
    );
}

export default BlogPage;
