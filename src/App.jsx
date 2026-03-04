import { Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import LifeSquaresPage from './pages/LifeSquaresPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100" style={{ fontFamily: 'Quicksand, sans-serif' }}>
      <AppHeader />
      <Routes>
        <Route path="/" element={<LifeSquaresPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postId" element={<BlogPostPage />} />
      </Routes>
    </div>
  );
}

export default App;
