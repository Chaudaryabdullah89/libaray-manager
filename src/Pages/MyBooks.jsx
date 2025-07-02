import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import axiosapiurl from '../Components/axios';
import toast from 'react-hot-toast';

const MyBooks = () => {
  const { userId } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBookData, setEditBookData] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
        const [delect, setDelect] = useState(false);
        const [confirm ,setConfirm] = useState(false)
        const [pdfUrl, setPdfUrl] = useState('');
        const [pdfUploading, setPdfUploading] = useState(false);
  const navigate = useNavigate();
  const CLOUD_NAME = "dwrukwox4";
  const UPLOAD_PRESET = "iamges";

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImagePreview(URL.createObjectURL(file));

    const sigRes = await axios.post(`${axiosapiurl}/cloudinary-signature`);
    const { signature, timestamp, cloudName, apiKey } = sigRes.data;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );
      setImageUrl(response.data.secure_url);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Image upload failed");
      console.error("Upload error:", error);
    }
  };  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);
    const formData = new FormData();
    formData.append('pdf', file);
    setPdfUploading(true);
    try {
      console.log('Uploading to backend /api/upload-pdf...');
      const response = await fetch('http://localhost:500/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      console.log('Raw response:', response);
      const data = await response.json();
      console.log('Response JSON:', data);
      if (data.link) {
        setPdfUrl(data.link);
        toast.success('PDF uploaded to Dropbox!');
      } else {
        toast.error('No link returned from backend');
      }
    } catch (error) {
      toast.error('PDF upload failed');
      console.error('PDF upload error:', error);
    } finally {
      setPdfUploading(false);
    }
  };
  const handleDeleteBook = async (bookId) => {
    if (!bookId) {
      toast.error("No book id found for deletion.");
      return;
    }
    if (!delect === true) {
      
      if(confirm === true){
  
        try {
          await axios.delete(`${axiosapiurl}/delete-book/${bookId}`);
          setBooks(prevBooks => prevBooks.filter(b => b._id !== bookId));
          setSelectedBook(null);
          toast.success("Book deleted successfully!");
        } catch (error) {
          toast.error("Failed to delete book.");
          console.error("Delete error:", error);
        }
      }
      else{
        console.log('permission not granted')
        
      }
    }
  }
  const handleEditSubmit = async (e) => {
    
    e.preventDefault();

    axios.post(`${axiosapiurl}/edit-my-book`, {
      ...editBookData,
      user: userId,
      _id: editBookData._id ,
      image : imageUrl
    })
    .then(res => {
      setBooks(prevBooks =>
        prevBooks.map(b => 
          b._id === editBookData._id 
            ? { ...b, ...editBookData, image: imageUrl || editBookData.image || b.image }
            : b
        )
        
      );
      navigate(`/admin/my-books/${userId}`);
      setEditBookData({});
      setSelectedBook(null);
      toast.success('Book updated successfully!');
    })
    .catch(err => {
      setEditBookData({});
      setSelectedBook(null);
      toast.error('Failed to update book.');
    });
  }

  console.log('userId from URL:', userId);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`${axiosapiurl}/get-my-books?user=${userId}`)
      .then(res => {
        console.log('Books fetched:', res.data);
        setBooks(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log('Error fetching books:', err);
        setBooks([]);
        setLoading(false);
      });
  }, [userId]);

  if (!userId) return <div className="text-center mt-10">Loading user info...</div>;
  if (loading) return <div className="text-center mt-10">Loading your books...</div>;

  return (
    <div>
      {/* Caution Popup for Deleting Book */}
 

      <h1 className="text-4xl mt-10 font-bold text-center">My Books</h1>
      <div className="flex justify-center mt-6">
        <div className="flex justify-end mr-20 w-full">
          <button
            className="bg-green-600 cursor-pointer text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            onClick={() => {
              setLoading(true);
              axios.get(`${axiosapiurl}/get-my-books?user=${userId}`)
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
      {delect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-center text-red-600">Caution</h2>
            <p className="mb-6 text-center text-gray-700">
              Are you sure you want to <span className="font-semibold text-red-600">delete</span> the book <span className="font-semibold">{books.title}</span>?<br />
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                onClick={() => {
                  // Remove the _deleteConfirm flag to close the popup
                  setDelect(false);
                }}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                onClick={() => {
                 
                  setDelect(false);
                  setConfirm(true)

                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {books.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">You have not added any books yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-20">
          {books.map(book => (
            <div
              key={book._id}
              className="flex flex-col bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-shadow duration-200 group relative"
            >
              {/* Book Image */}
              <div className="h-56 w-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={book.image || "/placeholder-book.png"}
                  alt={book.title}
                  className="object-contain h-full w-full transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {/* Book Details */}
              <div className="flex-1 flex flex-col p-6">
                <h2 className="text-2xl font-bold mb-1 text-gray-900 truncate">{book.title}</h2>
                <p className="text-sm text-gray-500 mb-2 italic">by {book.author}</p>
                <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                  {book.description?.length > 70
                    ? `${book.description.slice(0, 70)}...`
                    : book.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded">{book.genre}</span>
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">{book.year}</span>
                  {book.price && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                      ${parseFloat(book.price).toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-start mt-auto gap-3">
                  <button
                    className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => navigate(`/book/${book._id}`)}
                  >
                    Read Book
                  </button>
                  <button
                    className="px-4 py-2 cursor-pointer bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold shadow focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    onClick={() => {
                      setSelectedBook(book);
                      setEditBookData(book);
                    }}
                  >
                    Edit Book
                  </button>
                <button
                  onClick={() =>{
 
                    handleDeleteBook(book._id)
                    setDelect(true)
                  
                  }
                  } 
                  className="ml-2 px-4 py-2 cursor-pointer bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm font-medium shadow"
                >
                  Delete Book
                </button>
            
                </div>
              </div>
              
            </div>
          ))}
        </div>
      )}

    {/* Edit Book Popup */}
    {selectedBook && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-30">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            onClick={() => {
              setSelectedBook(null);
              setEditBookData({});
            }}
            aria-label="Close"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4 text-center">Edit Book</h2>
          <form
            onSubmit={handleEditSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="edit-title">Title</label>
              <input
                id="edit-title"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editBookData.title}
                onChange={e => setEditBookData({ ...editBookData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="edit-author">Author</label>
              <input
                id="edit-author"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editBookData.author}
                onChange={e => setEditBookData({ ...editBookData, author: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="edit-genre">Genre</label>
              <input
                id="edit-genre"
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editBookData.genre}
                onChange={e => setEditBookData({ ...editBookData, genre: e.target.value })}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="image">Image</label>
              <input
                id="image"
                type="file"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={handleImageUpload}
                required
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="w-full h-auto rounded-lg" />
                </div>
              )}
            </div>
            

          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2" htmlFor="pdf">PDF Link or Upload</label>
            <input
              id="pdf"
              type="url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2"
              value={editBookData.pdf || pdfUrl || ""}
              onChange={e => {
                setEditBookData({ ...editBookData, pdf: e.target.value });
                setPdfUrl(e.target.value);
              }}
              placeholder="https://example.com/your-book.pdf"
            />
            <div className="flex items-center gap-2 mb-2">
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                className="block"
              />
              <span className="text-xs text-gray-500">or paste a PDF link above</span>
            </div>
            {pdfUrl && pdfUrl.match(/^https?:\/\/.+\.pdf$/i) && (
              <div className="mt-2">
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                  title="PDF Preview"
                  className="w-full h-64 border rounded-lg"
                  frameBorder="0"
                />
                <div className="text-xs text-gray-500 mt-1">PDF preview (via Google Docs Viewer)</div>
              </div>
            )}
          </div>



            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="edit-year">Year</label>
              <input
                id="edit-year"
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editBookData.year}
                onChange={e => setEditBookData({ ...editBookData, year: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="edit-description">Description</label>
              <textarea
                id="edit-description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={editBookData.description}
                onChange={e => setEditBookData({ ...editBookData, description: e.target.value })}
                rows={3}
                required
              />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                disabled={!imageUrl}
                onClick={() => {
                  setSelectedBook(null);
                  setEditBookData({});
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};

export default MyBooks; 