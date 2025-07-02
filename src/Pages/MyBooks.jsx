import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import axiosapiurl from '../Components/axios';
import toast from 'react-hot-toast';
import { FaBook, FaEdit, FaTrash, FaPlus, FaSyncAlt, FaTimes, FaUser, FaCalendarAlt, FaTag, FaFilePdf, FaImage, FaUpload, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const MyBooks = () => {
  const { userId } = useParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBookData, setEditBookData] = useState({});
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [delect, setDelect] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfUploading, setPdfUploading] = useState(false);
  const [bookIdToDelete, setBookIdToDelete] = useState(null);
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
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file);
    const formData = new FormData();
    formData.append('pdf', file);
    setPdfUploading(true);
    try {
      console.log('Uploading to backend /api/upload-pdf...');
      const response = await fetch(`${axiosapiurl}/upload-pdf`, {
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

        try {
          await axios.delete(`${axiosapiurl}/delete-book/${bookId}`);
          setBooks(prevBooks => prevBooks.filter(b => b._id !== bookId));
          setSelectedBook(null);
          toast.success("Book deleted successfully!");
        } catch (error) {
          toast.error("Failed to delete book.");
          console.error("Delete error:", error);
        }
     
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    axios.post(`${axiosapiurl}/edit-my-book`, {
      ...editBookData,
      user: userId,
      _id: editBookData._id,
      image: imageUrl
    })
    .then(() => {
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
    .catch(() => {
      setEditBookData({});
      setSelectedBook(null);
      toast.error('Failed to update book.');
    });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-2 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl mt-6 font-bold text-center text-blue-800 flex items-center justify-center gap-2">
        <FaBook className="inline-block text-green-500" /> My Books
      </h1>
      <div className="flex justify-center mt-4 sm:mt-6">
        <div className="flex justify-end w-full max-w-5xl">
          <button
            className="bg-green-600 cursor-pointer text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold hover:bg-green-700 transition text-sm sm:text-base shadow flex items-center gap-2"
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
            <FaSyncAlt /> Refresh Books
          </button>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <svg className="animate-spin h-10 w-10 sm:h-12 sm:w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span className="ml-4 text-base sm:text-lg text-gray-700">Loading your books...</span>
        </div>
      ) : books.length === 0 ? (
        <div className="text-center mt-10 text-gray-500 text-lg">You have not added any books yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
          {books.map(book => (
            <div
              key={book._id}
              className="flex flex-col bg-white shadow-lg hover:shadow-2xl rounded-2xl overflow-hidden border border-gray-100 transition-shadow duration-200 group relative min-h-[440px]"
            >
              <div className="w-full h-52 bg-gray-100 flex items-center justify-center overflow-hidden">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-t-2xl"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <FaBook />
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col px-6 py-5 gap-2">
                <h2 className="text-2xl font-bold text-gray-900 truncate mb-2">{book.title}</h2>
                <div className="flex items-center gap-2 text-base text-gray-700 mb-1"><FaUser className="text-blue-400 mr-1" /> <span className="font-medium">Author:</span> {book.author}</div>
                <div className="flex items-center gap-2 text-base text-gray-700 mb-1">
                  <FaCalendarAlt className="text-green-400 mr-1" />
                  <span className="font-medium">Year:</span>{" "}
                  {book.year ? new Date(book.year).toISOString().slice(0, 10) : ""}
                </div>
                <div className="flex items-center gap-2 text-base text-gray-700 mb-2"><FaTag className="text-purple-400 mr-1" /> <span className="font-medium">Genre:</span> {book.genre}</div>
                <div className="text-gray-600 text-base mb-4 line-clamp-2 min-h-[2.5em]">{book.description?.slice(0, 100) || ''}{book.description && book.description.length > 100 ? '...' : ''}</div>
                <div className="flex flex-row gap-3 mt-auto pt-4 border-t border-gray-100 px-0 pb-2 w-full overflow-x-auto">
                  <button
                    className="min-w-0 flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-semibold shadow flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                    onClick={() => navigate(`/book/${book._id}`)}
                  >
                    <FaBook /> Read
                  </button>
                  <button
                    className="min-w-0 flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-base font-semibold shadow flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                    onClick={() => {
                      setSelectedBook(book);
                      setEditBookData(book);
                    }}
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    className="min-w-0 flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-base font-semibold shadow flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                    onClick={() => {
                      setDelect(true);
                      setBookIdToDelete(book._id);
                    }}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {delect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => {
                setDelect(false);
                setBookIdToDelete(null);
              }}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <div className="flex flex-col items-center">
              <FaExclamationTriangle className="text-4xl text-red-500 mb-2" />
              <h2 className="text-xl font-bold mb-2 text-center text-red-600">Caution</h2>
              <p className="mb-6 text-center text-gray-700">
                Are you sure you want to <span className="font-semibold text-red-600">delete</span> this book?<br />
                This action cannot be undone.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition"
                  onClick={() => {
                    setDelect(false);
                    setBookIdToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                  onClick={() => {
                    setDelect(false);
                    setConfirm(true);
                    if (bookIdToDelete) {
                      handleDeleteBook(bookIdToDelete);
                      setBookIdToDelete(null);
                    }
                  }}
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Edit Book Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => {
                setSelectedBook(null);
                setEditBookData({});
              }}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center flex items-center justify-center gap-2"><FaEdit className="text-indigo-500" /> Edit Book</h2>
            <form
              onSubmit={handleEditSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="edit-title"><FaBook className="text-green-400" /> Title</label>
                <input
                  id="edit-title"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  value={editBookData.title}
                  onChange={e => setEditBookData({ ...editBookData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="edit-author"><FaUser className="text-blue-400" /> Author</label>
                <input
                  id="edit-author"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  value={editBookData.author}
                  onChange={e => setEditBookData({ ...editBookData, author: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="edit-genre"><FaTag className="text-blue-400" /> Genre</label>
                <input
                  id="edit-genre"
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  value={editBookData.genre}
                  onChange={e => setEditBookData({ ...editBookData, genre: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="image"><FaImage className="text-blue-400" /> Image</label>
                <input
                  id="image"
                  type="file"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  onChange={handleImageUpload}
                  required
                />
                {imagePreview && (
                  <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="pdf"><FaFilePdf className="text-blue-400" /> PDF Link or Upload</label>
                <input
                  id="pdf"
                  type="url"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 text-base"
                  value={editBookData.pdf || pdfUrl || ""}
                  onChange={e => {
                    setEditBookData({ ...editBookData, pdf: e.target.value });
                    setPdfUrl(e.target.value);
                  }}
                  placeholder="https://example.com/your-book.pdf"
                />
                <div className="flex items-center gap-2 mb-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <FaUpload className="text-blue-400" />
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfUpload}
                      className="hidden"
                      disabled={pdfUploading}
                    />
                    <span className="text-xs text-gray-500">Upload PDF</span>
                  </label>
                  {pdfUploading && (
                    <span className="text-blue-500 text-xs ml-2">Uploading PDF...</span>
                  )}
                  <span className="text-xs text-gray-500">or paste a PDF link above</span>
                </div>
                {pdfUrl && pdfUrl.match(/^https?:\/\/.+\.pdf$/i) && (
                  <div className="mt-2 border border-gray-200 rounded-lg overflow-hidden shadow bg-gray-50">
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
                      title="PDF Preview"
                      className="w-full h-64 border-0 rounded-b-lg"
                      frameBorder="0"
                    />
                    <div className="text-xs text-gray-500 mt-1 px-2 pb-2">PDF preview (via Google Docs Viewer)</div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="edit-year">Year</label>
                <input
                  id="edit-year"
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                  value={editBookData.year}
                  onChange={e => setEditBookData({ ...editBookData, year: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1" htmlFor="edit-description">Description</label>
                <textarea
                  id="edit-description"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                >
                  <FaEdit /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedBook && selectedBook.showDesc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-gray-200">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl"
              onClick={() => setSelectedBook(null)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <h2 className="text-xl font-bold mb-2 text-center text-blue-700 flex items-center justify-center gap-2"><FaInfoCircle /> Book Description</h2>
            <p className="text-gray-700 text-base text-center whitespace-pre-line">{selectedBook.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBooks; 