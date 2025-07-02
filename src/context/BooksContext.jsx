import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import axiosapiurl from '../Components/axios';

export const BooksContext = createContext();

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios
    .get(`${axiosapiurl}/get-books`, { withCredentials: true })
    .then((res) => {
      setBooks(res.data);
      console.log('Fetched books:', res.data);
    })
    .catch((err) => {
      console.log('Error fetching books:', err.message);
    });
}, []);

  return (
    <BooksContext.Provider value={{ books, setBooks }}>
      {children}
    </BooksContext.Provider>
  );
};

const useBook = () => useContext(BooksContext);
