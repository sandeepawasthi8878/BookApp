import React, {useEffect, useState} from 'react'
import axios from 'axios';
import BookCart from '../components/BookCard/BookCart';
const AllBooks = () => {

    const [Data, setData] = useState();
    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(
                "https://bookapp-backed.onrender.com/api/v1/get-all-book"
            )
            setData(response.data.data)
        }
        fetch()
    },[])
  return (
    <div className='bg-zinc-900 h-auto px-12 py-8'>
      {" "}
    <h4 className='text-3xl text-yellow-100'>All Books</h4>
   {!Data && ( <div className='flex items-center justify-center my-8'> {" "} </div> )}
    <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8'>
      {
          Data && Data.map((items,i) => (
              <div key={i}>
                  <BookCart data={items}/>
                  </div>
          ))
      }

    </div>
    </div>
  )
}

export default AllBooks
