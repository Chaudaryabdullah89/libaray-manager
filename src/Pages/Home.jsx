import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { BooksContext } from '../context/BooksContext';
import axiosapiurl from '../Components/axios';
import axios from'axios'
import toast from 'react-hot-toast'
const Home = () => {
  const { books, setBooks } = useContext(BooksContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Always fetch books on mount to ensure latest data
    axios.get(`${axiosapiurl}/get-books`).then(res => {
      setBooks(res.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [setBooks]);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 md:px-8">
  
   <h1 className='text-3xl sm:text-4xl md:text-5xl mt-8 font-bold text-center text-blue-800 mb-6'>Book Library</h1>
   <div className="flex justify-center mt-4 sm:mt-6 mb-6">
        <div className="flex justify-end w-full max-w-5xl">
          <button
            className="bg-green-600 cursor-pointer text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-green-700 transition text-sm sm:text-base shadow flex items-center gap-2"
            onClick={() => {
              setLoading(true);
              axios.get(`${axiosapiurl}/get-books`)
                .then(res => {
                  setBooks(res.data);
                  setLoading(false);
                  toast.success('Books refreshed!');
                })
                .catch(() => {
                  setLoading(false);
                  toast.error('Failed to refresh books.');
                });
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5 9A7.003 7.003 0 0112 5c1.657 0 3.156.576 4.342 1.535M19 15a7.003 7.003 0 01-7 4c-1.657 0-3.156-.576-4.342-1.535" /></svg>
            Refresh Books
          </button>
        </div>
      </div>
       {loading && (
     <div className="flex justify-center items-center min-h-[40vh]">
       <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
       </svg>
       <span className="ml-4 text-base sm:text-lg text-gray-700">Loading books...</span>
     </div>
   )}
   <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 p-4 sm:p-8 md:p-12 max-w-7xl mx-auto'>
    {books.map((book)=>(
        <div key={book._id} className="flex flex-col bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transition-shadow duration-200 group relative min-h-[440px]">
            <div className="w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                  </div>
                )}
            </div>
            <div className="flex-1 flex flex-col p-4 sm:p-5">
                <h2 className="text-lg sm:text-xl font-semibold mb-1 text-gray-900 truncate">{book.title}</h2>
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  by {book.author}
                  {book.userEmail && (
                    <span className="ml-2 text-xs text-gray-400">(author email: {book.userEmail})</span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  Added on {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "Unknown date"}
                </p>
                <p className="text-gray-700 text-xs sm:text-sm mb-3 line-clamp-2">{book.description.slice(0,50)}...</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">{book.genre}</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">{book.year}</span>
                </div>
                <div className="flex items-center gap-2 text-base text-gray-700 mb-2"><span className="font-medium">Genre:</span> {book.genre}</div>
                <div className="text-gray-600 text-base mb-4 line-clamp-2 min-h-[2.5em]">{book.description?.slice(0, 100) || ''}{book.description && book.description.length > 100 ? '...' : ''}</div>
                <div className="flex items-center justify-start mt-auto pt-4 gap-3 border-t border-gray-100">
                    <button
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-semibold shadow flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => navigate(`/book/${book._id}`)}
                    >
                        Read Book
                    </button>
                </div>
            </div>
        </div>
    ))}
   </div> 
    </div>
  )
}

export default Home
