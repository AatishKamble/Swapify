import { Dvr } from '@mui/icons-material'
import React from 'react'

const OrderCard = () => {
  return (
    <div className='lg:mx-10 border-b border-black pb-3 relative'>
         <p>order number:1</p>
         <p className='text-blue-900 absolute top-0 right-1 cursor-pointer'>view</p>
      <div className='space-y-3 sm:flex sm:space-x-7 text-sm font-semibold opacity-50 mt-2'>
        <div className=''>
          <p>Status:</p>
          <p>Ready for Delivery</p>
        </div>
        <div>
          <p>Expected Delivery Time:</p>
          <p>23rd March 2021</p>
        </div>
      </div>
      <div className='grid space-x-4 w-full'>
        <div className=' space-x-4 w-full h-auto overflow-x-scroll scroll whitespace-nowrap scroll-smooth scrollbar-hide'>
          <div className='mt-3 mr-4 w-[rem] h-fit inline-block'>
            <div className=''>
              <img className='w-[7rem] h-[7rem] rounded-md object-cover object-top' src="https://fashionisers.com/wp-content/uploads/2015/03/7-Pieces-You-Need-to-Embrace-the-1970s-Fashion-Trend-woman-in-trendy-suede-skirt.jpg" alt="" />
              <p className='text-xs font-semibold opacity-50'>Premium Quality Model</p>
              <p className='text-xs font-semibold opacity-50'>drtydtyh</p>
            </div>
          </div>
          <div className='mt-3 w-[8rem] h-fit inline-block'>
            <div>
              <img className='w-[7rem] h-[7rem] rounded-md object-cover object-top' src="https://fashionisers.com/wp-content/uploads/2015/03/7-Pieces-You-Need-to-Embrace-the-1970s-Fashion-Trend-woman-in-trendy-suede-skirt.jpg" alt="" />
              <p className='text-xs font-semibold opacity-50'>Premium Quality Model</p>
              <p className='text-xs font-semibold opacity-50'>drtydtyh</p>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-2'>
         <p className='text-sm font-semibold opacity-65'>Rs.5000</p>
      </div>
    </div>
  )
}

export default OrderCard