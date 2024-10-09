import React from 'react'
import { Link } from 'react-router-dom'

const BookCart = ({data}) => {
  return (
    <>
    <Link to={`/view-book-details/${data._id}`} >
       <div className='bg-zinc-800 rounded p-4 flex flex-col '>
          <div className='bg-zinc-900 rounded flex items-center justify-center'>
          <img src={data.url} alt={data.title} className='h-[25vh]' />
      </div>
      <h2 className='mt-4 text-xl  font-semibold text-zinc-100'>
        {data.title}
      </h2>
      <p className='mt-2 text-zinc-400 font-semibold'>By {data.author}</p>
      <p className='mt-2 text-zinc-200 font-semibold text-xl'>
        RS  {data.price}
      </p>
       </div>
    </Link>
    </>
  )
}

export default BookCart
