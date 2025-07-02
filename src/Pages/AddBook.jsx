import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext, useAuth } from '../context/Authcontext';
import { BooksContext } from '../context/BooksContext';
import axiosapiurl from '../Components/axios';
import { FaBook, FaUser, FaCalendarAlt, FaTag, FaFilePdf, FaImage, FaUpload } from 'react-icons/fa';

const AddBook = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [price] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfUploading, setPdfUploading] = useState(false);
  
  const { user } = useAuth();
  const { setBooks } = useContext(BooksContext);
  console.log('user from auth context:', user);
  // console.log(user)
  // console.log(user)

  const navigate = useNavigate();

  // Cloudinary details
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

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!imageUrl) {
      toast.error('Please upload an image before submitting.');
      return;
    }
   
    console.log('Sending book data to backend:', { title, author, year, description, genre, user, price, image: imageUrl });
    axios.post(`${axiosapiurl}/add-book`, { title, author, year, description, genre, user, price, image: imageUrl, pdf: pdfUrl }, { withCredentials: true })
      .then(res => {
        setBooks(prevBooks => [res.data.book, ...prevBooks]);
        toast.success('Book added successfully');
        navigate('/')
      })
      .catch(err => {
        console.log('err add book', err.message)
        toast.error('Failed to add book');
      });
  };

  // PDF upload handler (Cloudinary)

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-50 px-2 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-lg w-full border border-gray-100">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-700 text-center flex items-center justify-center gap-2">
          <FaBook className="inline-block text-green-500" /> Add a New Book
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="title">
              <FaBook className="text-blue-400" /> Title
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="author">
              <FaUser className="text-blue-400" /> Author
            </label>
            <input
              id="author"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              value={author}
              onChange={e => setAuthor(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="genre">
              <FaTag className="text-blue-400" /> Genre
            </label>
            <input
              id="genre"
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              value={genre}
              onChange={e => setGenre(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="year">
              <FaCalendarAlt className="text-blue-400" /> Year
            </label>
            <input
              id="year"
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              value={year}
              onChange={e => setYear(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="image">
              <FaImage className="text-blue-400" /> Image
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed border-blue-300 rounded-lg cursor-pointer hover:border-blue-500 transition p-4">
                <FaUpload className="text-2xl text-blue-400 mb-2" />
                <span className="text-xs text-gray-500 mb-1">Click or drag to upload</span>
                <input
                  id="image"
                  type="file"
                  className="hidden"
                  onChange={handleImageUpload}
                  required
                />
              </label>
              {imagePreview && (
                <div className="mt-2 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 shadow">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1 flex items-center gap-2" htmlFor="pdf">
              <FaFilePdf className="text-blue-400" /> PDF Link or Upload
            </label>
            <input
              id="pdf"
              type="url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-2 text-base"
              value={pdfUrl}
              onChange={e => setPdfUrl(e.target.value)}
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
          {!pdfUrl && (
            <div className="text-red-500 text-sm mb-2">
              Please upload a PDF before submitting.
            </div>
          )}
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="description">Description</label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-lg shadow mb-2 flex items-center justify-center gap-2">
            <FaBook className="inline-block text-white" /> Add Book
          </button>
        </form>
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-gray-300 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-400 transition mt-2"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default AddBook; 