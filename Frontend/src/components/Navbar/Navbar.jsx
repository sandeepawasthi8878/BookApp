import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaGripLines } from "react-icons/fa";
import { useSelector } from 'react-redux';

const Navbar = () => {
    const initialLinks = [
        {
            title: "Home",
            link: "/",
        },
        {
            title: "All Books",
            link: "/all-books",
        },
        {
            title: "Cart",
            link: "/cart",
        },
        {
            title: "Profile",
            link: "/profile",
        },
        {
            title: "Admin Profile",
            link: "/profile",
        },
    ];
   
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const role = useSelector((state) => state.auth.role);
    const [mobileNav, setMobileNav] = useState(false);

    const filteredLinks = initialLinks.filter((item, index) => {
        if (!isLoggedIn && index >= 2) return false; 
        if (isLoggedIn && role === "user" && item.title === "Admin Profile") return false; 
        if (isLoggedIn && role === "admin" && item.title === "Profile") return false; 
        if (isLoggedIn && role === "admin" && item.title === "Cart") return false; 
        return true; 
    });
    

    return (
        <>
        <nav className='z-50 relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between'>
            <div className='flex items-center'>
                <img
                    className='h-10 me-4'
                    src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
                    alt="logo"
                />
                <h1 className='text-2xl font-semibold'>BookHeaven</h1>
            </div>

            {/* Desktop navigation */}
            <div className='nav-links-bookheaven hidden md:flex items-center gap-4'>
                {filteredLinks.map((item, i) => (
                    <Link
                        key={i}
                        to={item.link}
                        className='hover:text-blue-500 transition-all duration-300 cursor-pointer'
                    >
                        {item.title}
                    </Link>
                ))}
                {!isLoggedIn && 
                   <div className='flex gap-4'>
                   <Link to="/login" className='px-4 py-1 border border-blue-500 rounded hover:bg-white hover:text-zinc-800 duration-300'>
                       Login
                   </Link>
                   <Link to="/signup" className='px-4 py-1 border bg-blue-500 rounded hover:text-zinc-800 duration-300'>
                       SignUp
                   </Link>
               </div>
                }
            </div>

            {/* Mobile menu toggle button */}
            <button 
                className='block md:hidden text-white text-2xl hover:text-zinc-400 md:hidden' 
                onClick={() => setMobileNav(!mobileNav)}
            >
                <FaGripLines />
            </button>
        </nav>

       {/* Mobile navigation menu */}
<div className={`${mobileNav ? 'flex' : 'hidden'} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex-col items-center justify-center`}>
  {filteredLinks.map((item, i) => (
        <Link
            key={i}
            to={item.link}
            className='text-white text-4xl font-semibold mb-8 hover:text-blue-500 transition-all duration-300 cursor-pointer'
            onClick={() => setMobileNav(false)} // Close menu after click
        >
            {item.title}
        </Link>
    ))}
   {!isLoggedIn && (
    <>
     <Link 
        to="/login" 
        className='px-4 text-3xl font-semibold mb-8 py-2 border border-blue-500 rounded text-white hover:bg-white hover:text-zinc-800 duration-300'
        onClick={() => setMobileNav(false)}
    >
        Login
    </Link>
    <Link 
        to="/signup" 
        className='px-4 text-3xl font-semibold mb-8 py-2 border bg-blue-500 rounded text-white hover:text-zinc-800 duration-300'
        onClick={() => setMobileNav(false)}
    >
        SignUp
    </Link>
    </>
   )}
</div>

        </>
    );
};

export default Navbar;

