import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCart from '../BookCard/BookCart';

const Favourites = () => {
  const [FavouriteBooks, setFavouriteBooks] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavourites = async () => {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      if (!token || !id) {
        console.error("Authentication token or ID is missing");
        return;
      }

      const headers = {
        id: id,
        authorization: `Bearer ${token}`,
      };

      try {
        const response = await axios.get(
          "https://bookapp-jeec.onrender.com/api/v1/favourites",
          { headers }
        );

        const favouriteBookIds = response.data.data; 
        const bookDetails = await Promise.all(
          favouriteBookIds.map(async (bookId) => {
            const bookResponse = await axios.get(
              `https://bookapp-jeec.onrender.com/api/v1/get-book-by-id/${bookId}`
            );
            return bookResponse.data.data; 
          })
        );
        
        setFavouriteBooks(bookDetails); 
        setLoading(false);
      } catch (error) {
        setLoading(false); 
      }
    };

    fetchFavourites();
  }, []); 

  const deleteBook = async (bookId) => {
    const token = localStorage.getItem("token");

    const headers = {
      id: localStorage.getItem("id"),
      authorization: `Bearer ${token}`,
      bookid: bookId
    };

    try {
      const response = await axios.delete(
        "https://bookapp-jeec.onrender.com/api/v1/delete-book",
        { headers }
      );
      alert(response.data.message);
      setFavouriteBooks(FavouriteBooks.filter(book => book._id !== bookId)); // Remove the book from the state after deletion
    } catch (error) {
      console.error("Error deleting book", error);
    }
  };

  if (loading) {
    return <p>Loading your favourite books...</p>;
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-1'>
      {FavouriteBooks.length > 0 ? ( 
        FavouriteBooks.map((book, i) => (
          <div key={i} className='p-2'>
            {/* Ensure that book object is not null */}
            {book && book._id && (
              <>
                <BookCart data={book} /> {/* Pass valid book data */}

                <button 
                  onClick={() => deleteBook(book._id)} // Pass the book ID to delete
                  className="bg-red-500 text-white p-2 mt-2 rounded"
                >
                  Delete Favourite
                </button>
              </>
            )}
          </div>
        ))
      ) : (
        <p>You have no favourite books yet.</p>
      )}
    </div>
  );
};

export default Favourites;
