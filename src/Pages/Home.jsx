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
    <div>
   {loading && (
     <div className="flex justify-center items-center min-h-[40vh]">
       <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
       </svg>
       <span className="ml-4 text-lg text-gray-700">Loading books...</span>
     </div>
   )}
   <h1 className='text-4xl mt-10 font-bold text-center'>Book Library</h1>
   <div className="flex justify-center mt-6">
        <div className="flex justify-end mr-20 w-full">
          <button
            className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
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
            Refresh Books
          </button>
        </div>
      </div>
   <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-20'>
    {books.map((book)=>(
        <div key={book._id} className="flex flex-col bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition-shadow duration-200">
            <div className="h-48 w-full overflow-hidden flex items-center justify-center bg-gray-100">
                <img
                    src={book.image}
                    alt={book.title}
                    className="object-contain h-full w-full"
                />
            </div>
            <div className="flex-1 flex flex-col p-5">
                <h2 className="text-xl font-semibold mb-1 text-gray-900">{book.title}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  by {book.author}
                  {book.userEmail && (
                    <span className="ml-2 text-xs text-gray-400">(author email: {book.userEmail})</span>
                  )}
                </p>
                <p className="text-xs text-gray-400 mb-1">
                  Added on {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "Unknown date"}
                </p>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">{book.description.slice(0,50)}...</p>
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">{book.genre}</span>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">{book.year}</span>
                </div>
                <div className="flex items-center justify-start mt-5 -ml-2">
                    {/* <span className="text-lg font-bold text-green-600">${book.price.toFixed(2)}</span> */}
                    <button
                        className="ml-2 px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium shadow"
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
