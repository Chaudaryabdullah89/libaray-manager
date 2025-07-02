import { useState } from "react";
import { Toaster } from "react-hot-toast";

import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Navbar from "./Components/Navbar";
import axios from "axios";
import ReadBook from "./Pages/ReadBook";
import AddBook from "./Pages/AddBook";
import MyBooks from "./Pages/MyBooks";
import Protected from "./Pages/Protected";
import Footer from "./Components/Footer";

// axios.defaults.withCredentials = true;

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/book/:bookId" element={<ReadBook />} />
        
        <Route
          path="/add-book"
          element={
            <Protected>
              <AddBook />
            </Protected>
          }
        />

        <Route path="/admin/my-books/:userId" element={<MyBooks />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
