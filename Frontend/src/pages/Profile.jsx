import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import Sidebar from '../components/Profile/Sidebar';
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import MobileNav from '../components/Profile/MobileNav';
import { useSelector } from 'react-redux';

const Profile = () => {
  const [Profile, setProfile] = useState();
  const headers = {
    id: localStorage.getItem("id"),
    authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/get-user-information",
          { headers }
        );
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetch();
  }, []);

  return (
    <div className='bg-zinc-900 px-4 md:px-8 flex flex-col md:flex-row h-screen py-4 md:py-8 gap-4 text-white overflow-x-auto'>
      {!Profile ? (
        <div className='w-full h-full flex items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <>
          <div className='w-full md:w-1/4 lg:w-1/5'>
            <Sidebar data={Profile} />
            {/* Uncomment if you need MobileNav */}
            {/* <MobileNav /> */}
          </div>
          <div className='w-full md:w-3/4 lg:w-4/5 overflow-x-auto'>
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
