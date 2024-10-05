import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../Loader/Loader';
import { useParams } from 'react-router-dom';
import { GrLanguage } from 'react-icons/gr';
import { FaHeart, FaCartArrowDown, FaEdit } from 'react-icons/fa';
import { MdDeleteSweep } from 'react-icons/md';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ViewBookDetails = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [Data, setData] = useState();
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);


    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(
                `https://bookapp-jeec.onrender.com/api/v1/get-book-by-id/${id}`
            );
            setData(response.data.data);
        };
        fetch();
    }, [id]);

    const headers = {
        id: localStorage.getItem("id"),
        authorization: `Bearer ${localStorage.getItem("token")}`,
        bookid: id,
    }
    const handleFavourite = async () => {
        const token = localStorage.getItem("token");
        const id = localStorage.getItem("id");

        if (!token || !id) {
            console.error("Authentication token or ID is missing");
            alert("Please log in to add favourites.");
            return;
        }

        const headers = {
            id: id,
            authorization: `Bearer ${token}`,
        };

        try {
            const response = await axios.get(
                "https://bookapp-backed.onrender.com/api/v1/favourites",
                { headers }
            );

            console.log("Response data:", response.data); // Log full response
            alert(response.data.message || "Successfully added to favourites"); // Check if message exists

        } catch (error) {
            console.error("Error adding to favourites", error);
            alert("Failed to add to favourites");
        }
    };


    const handleCart = async () => {
        const response = await axios.put(
            "https://bookapp-backed.onrender.com/api/v1/add-to-cart", {}, { headers }
        )
        alert(response.data.message)
    }

    const deleteBook = async () => {
        const response = await axios.delete(
            "https://bookapp-backed.onrender.com/api/v1/delete-book",
            { headers }
        )
        alert(response.data.message)
        navigate("/all-books")
    }
    return (
        <>
            {Data && (
                <div className=" relative px-4 md:px-10 py-3 bg-zinc-900 flex gap-8 flex-col lg:flex-row">
                    <div className="bg-zinc-800 rounded px-4 py-12 h-[45vh] lg:h-[88vh] w-full lg:w-1/2 flex justify-center relative">
                        <img
                            src={Data.url}
                            alt={Data.title}
                            className="object-contain h-[50vh] lg:h-[74vh] w-full rounded"
                        />


                        {isLoggedIn === true && role === 'user' && (
                     <div className="absolute bottom-4 left-4 right-4 lg:left-auto lg:right-1 flex flex-col items-center justify-center gap-2 space-y-3">
                     <button 
                         className=" bg-zinc-600 rounded-full text-lg p-2 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 w-full lg:w-30 h-12 lg:h-12"
                         onClick={handleFavourite}
                     >
                         <FaHeart className="text-3xl" />
                         <span className="ml-2 text-sm"></span>
                     </button>
                     
                     <button 
                         className="bg-zinc-600 rounded-full text-lg p-1 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-300 w-full lg:w-40 h-12 lg:h-12"
                         onClick={handleCart}
                     >
                         <FaCartArrowDown className="text-3xl" />
                         <span className="ml-2 text-sm"></span>
                     </button>
                 </div>
                 
                 
                 
                  
                    
                       
                       
                        )}

                        {isLoggedIn === true && role === 'admin' && (
                            <div className="absolute  bottom-4 left-4 right-4 lg:left-auto lg:right-4 flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6">
                                <Link to={`/updateBook/${id}`} className="bg-white rounded-full text-base lg:text-lg px-4 py-2 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-300 w-full lg:w-auto">
                                    <FaEdit />
                                    <span className=" ml-2 lg:ml-3 text-sm lg:text-base">Edit</span>
                                </Link>
                                <button
                                    className="bg-white rounded-full text-base lg:text-lg px-4 py-2 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all duration-300 w-full lg:w-auto"
                                    onClick={deleteBook}
                                >
                                    <MdDeleteSweep />
                                    <span className="ml-2 lg:ml-3 text-sm lg:text-base">Delete</span>
                                </button>
                            </div>
                        )}

                    </div>

                    <div className="p-4 mt-16 w-full lg:w-1/2" >
                        <h1 className="text-4xl text-zinc-300 font-semibold">
                            {Data.title}
                        </h1>
                        <p className="text-zinc-400 mt-1">by {Data.author}</p>
                        <p className="text-zinc-500 mt-4 text-xl">{Data.desc}</p>

                        <div className="flex mt-4 items-center justify-start text-zinc-300">
                            <GrLanguage className="mr-5 text-3xl" />
                            {Data.language}
                        </div>

                        <p className="mt-4 text-zinc-100 text-3xl font-semibold">
                            Price: ₹ {Data.price}
                        </p>
                    </div>
                </div>
            )}

            {!Data && (
                <div className="h-screen bg-zinc-900 flex items-center justify-center">
                    <Loader />
                </div>
            )}
        </>
    );
};

export default ViewBookDetails;














