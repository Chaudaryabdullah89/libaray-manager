import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosapiurl from '../Components/axios';
import Footer from '../Components/Footer';
import { useAuth } from '../context/Authcontext';

const ReadBook = () => {
  const { users } = useAuth();
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  // console.log(user)

  // After fetching the book
useEffect(() => {
  if (book && book.user) {
    axios.get(`${axiosapiurl}/get-user/${book.user}`)
      .then((res) => {
        setUser(res.data);
        console.log(res.data);
      })
      .catch(err => setUser(null));
  }
}, [book]);
  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    axios.get(`${axiosapiurl}/get-book/${bookId}`)
      .then(res => {
        setBook(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load book.');
        setLoading(false);
      });
  }, [bookId]);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading book...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-500">{error}</div>;
  if (!book) return <div className="flex items-center justify-center min-h-screen bg-gray-100">Book not found.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-400 py-4 px-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-white font-semibold hover:underline">&larr; Back to Library</button>
        <button className="bg-white/20 text-white px-4 py-2 rounded-lg font-semibold hover:bg-white/30 transition flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 8a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.274.96-.687 1.858-1.217 2.664A9.956 9.956 0 0112 19c-2.21 0-4.253-.72-5.825-1.936A9.956 9.956 0 012.458 12z" /></svg>
          Share
        </button>
      </div>
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-br from-blue-100 to-white py-10 px-4 flex flex-col md:flex-row gap-10 items-center justify-center border-b border-gray-200">
        <div className="flex-shrink-0 w-64 h-96 bg-white rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
          <img
            src={book.image || "/placeholder-book.png"}
            alt={book.title}
            className="object-contain w-full h-full"
            loading="lazy"
          />
        </div>
        <div className="flex-1 flex flex-col justify-center max-w-2xl">
          <h1 className="text-5xl font-extrabold text-blue-900 mb-2 leading-tight">{book.title}</h1>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-lg text-gray-700 font-semibold">
              by {book.author}
              {/* {book.user && user && (
                // <span className="ml-2 text-sm text-gray-500">({user.username})</span>
              )} */}
            </span>
            <span className="inline-block bg-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded">{book.genre}</span>
            <span className="inline-block bg-green-200 text-green-800 text-xs font-bold px-3 py-1 rounded">{book.year}</span>
            {book.price &&  (
              <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded">
                ${parseFloat(book.price).toFixed(2)}
              </span>
            )}
          </div>
          <div className="flex items-center gap-6 mt-2">
            <div className="flex items-center gap-2">
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(book.author)}&background=0D8ABC&color=fff`} alt="Author" className="w-8 h-8 rounded-full" />
              <span className="text-gray-600 text-sm">Author</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 text-sm">Added: {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : 'N/A'}</span>
          </div>
          {user && user.user && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-gray-500 text-sm">Uploaded by:</span>
              <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">
                <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9.004 9.004 0 0112 15c2.003 0 3.868.658 5.334 1.77M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {user.user.email}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-8 px-4 py-10 max-w-6xl mx-auto w-full">
        {/* Main Article */}
        <main className="flex-1 min-w-0">
          <article className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Book Description</h2>
            <p className="text-gray-700 text-lg whitespace-pre-line leading-relaxed mb-8">
              {book.description}
            </p>
            {/* Book PDF Preview */}
            {book.pdf && book.pdf.match(/^https?:\/\/.+\.pdf(\?.*)?$/i) && (
              <section className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Read Book PDF</h3>
                {/* <iframe
                  src={book.pdf}
                  title="Book PDF"
                  className="w-full h-[600px] border rounded-lg"
                  frameBorder="0"
                  allowFullScreen
                /> */}
                <div className="text-xs text-gray-500 mt-1">
                  <a href={book.pdf} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Click here to  Read the Book PDF</a>.
                </div>
              </section>
            )}
          </article>
        </main>
        {/* Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0 bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-10 md:mt-0">
          <h3 className="text-lg font-bold text-blue-800 mb-4">Book Details</h3>
          <ul className="text-gray-700 text-base space-y-2">
            <li><span className="font-semibold">Title:</span> {book.title}</li>
            <li><span className="font-semibold">Author:</span> {book.author}</li>
            <li><span className="font-semibold">Genre:</span> {book.genre}</li>
            <li><span className="font-semibold">Year:</span> {book.year}</li>
            <li><span className="font-semibold">Price:</span> {book.price ? `$${parseFloat(book.price).toFixed(2)}` : 'Free'}</li>
            {book.createdAt && <li><span className="font-semibold">Added:</span> {new Date(book.createdAt).toLocaleDateString()}</li>}
          </ul>
          <div className="mt-6">
            <a href={book.pdf} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mb-2">Read PDF</a>
            <button onClick={()=>{window.alert('Report Feature is Coming Soon')}} className="block w-full text-center bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">Report Issue</button>
          </div>
        </aside>
      </div>
     
    </div>
  );
};

export default ReadBook; 