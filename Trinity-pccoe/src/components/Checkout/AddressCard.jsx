import React from 'react';

const AddressCard = () => {
  return (
    <div className='bg-gray-50 space-y-1 rounded-lg p-4 relative'>
      <input type="radio" name="address" value="bale bale" className="absolute top-2 right-2 w-5 h-5 appearance-none border border-gray-300 rounded-full text-black checked:bg-black checked:border-transparent focus:outline-none focus:ring-0" required/>
      <div className="">
        <p className='font-semibold'>Ram Kapoor</p>
        <p className='text-gray-600'>Gokul Dham Society Powder Gali, Film City Road, Mumbai, Maharashtra, 444905</p>
        <div className='space-y-1'>
          <p>Phone: 9356407507</p>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
