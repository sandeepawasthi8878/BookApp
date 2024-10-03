import React, {useEffect, useState} from 'react'
import axios from "axios"
import BookCart from '../BookCard/BookCart';
import Loader from '../Loader/Loader';
const RecentlyAdded = () => {
    const [Data, setData] = useState();
    useEffect(() => {
        const fetch = async () => {
            const response = await axios.get(
                "http://localhost:5000/api/v1/get-recent-books"
            )
            setData(response.data.data)
        }
        fetch()
    },[])
  return (
    <div className='mt-8 px-4'>
      <h4 className='text-3xl text-yellow-100'>Recently book added</h4>
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

export default RecentlyAdded
