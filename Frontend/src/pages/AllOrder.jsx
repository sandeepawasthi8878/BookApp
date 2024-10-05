import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../components/Loader/Loader';
import { Link } from 'react-router-dom';
import { FaCheck, FaUserAlt } from 'react-icons/fa';
import { IoOpenOutline } from 'react-icons/io5';
import SetUserData from './SetUserData';

const AllOrder = () => {
  const [AllOrders, setAllOrders] = useState([]);
  const [Options, setOptions] = useState(-1); // To track which order is being edited
  const [Values, setValues] = useState({ status: '' });

  const [userDiv, setuserDiv] = useState('hidden');
  const [userDivData, setuserDivData] = useState(null);

  const headers = {
    id: localStorage.getItem('id'),
    authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          'https://bookapp-jeec.onrender.com/api/v1/get-all-orders',
          { headers }
        );
        // Filter out any null or undefined orders
        const validOrders = response.data.data.filter(order => order && order.book);
        setAllOrders(validOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []); // Empty dependency array ensures it runs once

  const handleChange = (e) => {
    const { value } = e.target;
    setValues({ status: value });
  };

  const submitChanges = async (i) => {
    const order = AllOrders[i];
    if (!order || !order._id) {
      console.error('Invalid order at index:', i);
      return;
    }
    const id = order._id;
    try {
      const response = await axios.put(
        `https://bookapp-jeec.onrender.com/api/v1/update-status/${id}`,
        Values,
        { headers }
      );
      alert(response.data.message);
      // Update the status locally without re-fetching
      const updatedOrders = [...AllOrders];
      updatedOrders[i].status = Values.status;
      setAllOrders(updatedOrders);
      setValues({ status: '' });
      setOptions(-1); // Reset select dropdown after submission
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  const openUserDiv = (userData) => {
    setuserDiv('fixed');
    setuserDivData(userData);
  };

  const closeUserDiv = () => {
    setuserDiv('hidden');
    setuserDivData(null);
  };

  return (
    <>
      {AllOrders.length === 0 ? (
        <div className='h-screen flex items-center justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='h-full p-4 text-zinc-100 overflow-x-auto'>
          <h1 className='text-3xl md:text-5xl font-semibold text-zinc-500 mb-8'>
            All Order History
          </h1>
          
          {/* Header Row */}
          <div className='hidden md:flex mt-4 bg-zinc-800 w-full rounded py-2 px-4'>
            <div className='w-1/12 text-center'>Sr.</div>
            <div className='w-3/12'>Books</div>
            <div className='w-4/12'>Description</div>
            <div className='w-2/12'>Price</div>
            <div className='w-3/12'>Status</div>
            <div className='w-1/12 flex justify-center'><FaUserAlt /></div>
          </div>

          {/* Orders List */}
          <div className='space-y-4'>
            {AllOrders.map((items, i) => (
              items?.book ? (
                <div
                  key={items._id} // Use a unique key
                  className='bg-zinc-800 w-full rounded py-4 px-4 flex flex-col md:flex-row items-start md:items-center gap-4 hover:bg-zinc-900 transition-all'
                >
                  {/* Mobile View: Card Layout */}
                  <div className='flex flex-col md:hidden space-y-2 w-full'>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Sr.:</span>
                      <span>{i + 1}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Book:</span>
                      <Link
                        to={`/view-book-details/${items.book._id}`}
                        className='text-blue-300 hover:underline'
                      >
                        {items.book.title}
                      </Link>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Description:</span>
                      <span>{items.book.desc ? items.book.desc.slice(0, 50) : 'No description available'}...</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>Price:</span>
                      <span>₹ {items.book.price}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='font-semibold'>Status:</span>
                      <div className='relative'>
                        <button
                          className='hover:scale-105 transition-all duration-300'
                          onClick={() => {
                            setOptions(Options === i ? -1 : i); // Toggle dropdown
                            setValues({ status: items.status }); // Initialize with current status
                          }}
                        >
                          {items.status === 'Order Placed' ? (
                            <span className='text-yellow-500'>{items.status}</span>
                          ) : items.status === 'Cancelled' ? (
                            <span className='text-red-500'>{items.status}</span>
                          ) : (
                            <span className='text-green-500'>{items.status}</span>
                          )}
                        </button>
                        {Options === i && (
                          <div className='absolute mt-2 bg-gray-800 p-2 rounded shadow-lg z-10'>
                            <select
                              name='status'
                              className='bg-gray-800 text-zinc-100 p-1 rounded'
                              onChange={handleChange}
                              value={Values.status}
                            >
                              {[
                                'Order Placed',
                                'Out Of Delivery',
                                'Delivered',
                                'Cancelled',
                              ].map((status, idx) => (
                                <option value={status} key={idx}>
                                  {status}
                                </option>
                              ))}
                            </select>
                            <button
                              className='text-green-500 hover:text-pink-600 ml-2'
                              onClick={() => {
                                submitChanges(i);
                                setOptions(-1);
                              }}
                            >
                              <FaCheck />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <span className='font-semibold'>User:</span>
                      <button
                        className='text-xl hover:text-orange-500'
                        onClick={() => openUserDiv(items.user)}
                      >
                        <IoOpenOutline />
                      </button>
                    </div>
                  </div>

                  {/* Desktop View: Row Layout */}
                  <div className='hidden md:flex w-full items-center gap-4'>
                    <div className='w-1/12 text-center'>{i + 1}</div>
                    <div className='w-3/12'>
                      <Link
                        to={`/view-book-details/${items.book._id}`}
                        className='text-blue-300 hover:underline'
                      >
                        {items.book.title}
                      </Link>
                    </div>
                    <div className='w-4/12'>
                      <span>{items.book.desc ? items.book.desc.slice(0, 50) : 'No description available'}...</span>
                    </div>
                    <div className='w-2/12'>₹ {items.book.price}</div>
                    <div className='w-3/12 relative'>
                      <button
                        className='hover:scale-105 transition-all duration-300'
                        onClick={() => {
                          setOptions(Options === i ? -1 : i); // Toggle dropdown
                          setValues({ status: items.status }); // Initialize with current status
                        }}
                      >
                        {items.status === 'Order Placed' ? (
                          <span className='text-yellow-500'>{items.status}</span>
                        ) : items.status === 'Cancelled' ? (
                          <span className='text-red-500'>{items.status}</span>
                        ) : (
                          <span className='text-green-500'>{items.status}</span>
                        )}
                      </button>
                      {Options === i && (
                        <div className='absolute mt-2 bg-gray-800 p-2 rounded shadow-lg z-10'>
                          <select
                            name='status'
                            className='bg-gray-800 text-zinc-100 p-1 rounded'
                            onChange={handleChange}
                            value={Values.status}
                          >
                            {[
                              'Order Placed',
                              'Out Of Delivery',
                              'Delivered',
                              'Cancelled',
                            ].map((status, idx) => (
                              <option value={status} key={idx}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <button
                            className='text-green-500 hover:text-pink-600 ml-2'
                            onClick={() => {
                              submitChanges(i);
                              setOptions(-1);
                            }}
                          >
                            <FaCheck />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className='w-1/12 flex justify-center'>
                      <button
                        className='text-xl hover:text-orange-500'
                        onClick={() => openUserDiv(items.user)}
                      >
                        <IoOpenOutline />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </div>
      )}

      {userDivData && (
        <SetUserData
          userDivData={userDivData}
          userDiv={userDiv}
          setuserDiv={closeUserDiv}
        />
      )}
    </>
  );
};

export default AllOrder;
