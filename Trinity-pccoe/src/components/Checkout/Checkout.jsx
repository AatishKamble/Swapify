import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import AddressCard from './AddressCard';

const Checkout = () => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isSave, setIsSave] = useState(false);

    const onSubmit = (data) => {
        
        console.log(data);
    };

    const handleRefresh = () => {
        reset(); // Reset the form fields and clear validation errors
    };

    return (
        <div>
            <div className="font-[sans-serif] bg-gray-50">
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 h-full">
                    <div className="bg-[#3f3f3f] lg:h-screen lg:sticky lg:top-0">
                        <div className="relative h-full">
                            <div className=" px-4 py-8 h-[400px] overflow-auto lg:h-[calc(100vh-0px)]">
                                <h2 className="text-2xl font-bold text-white">Address</h2>
                                <form>
                                    <div className="space-y-6 mt-10">
                                        <AddressCard />
                                        <AddressCard />

                                        
                                    </div>
                                    <div className='text-center'>
                                        <button type='submit' className='bg-white text-black p-2 mt-5 w-full font-semibold rounded-lg'>continue</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-2 h-max rounded-md p-8 sticky top-0">
                        <h2 className="text-2xl font-bold text-[#333]">Complete your order</h2>
                        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <h3 className="text-lg font-bold text-[#333] mb-6">Personal Details</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <div className="relative flex items-center">
                                            <input type="text" placeholder="First Name"
                                                className="px-4 py-3.5 focus:ring-0 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
                                                {...register('firstName', { required: 'First Name is required' })} />
                                            <PersonIcon className="w-[18px] h-[18px] absolute right-4 text-gray-400" />
                                        </div>
                                        {errors.firstName && <p className="text-red-500 text-sm font-thin">{errors.firstName.message}</p>}
                                    </div>
                                    <div>
                                        <div className="relative flex items-center">
                                            <input type="text" placeholder="Last Name"
                                                className=" px-4 py-3.5 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] focus:ring-0"
                                                {...register('lastName', { required: 'Last Name is required' })}
                                            />
                                            <PersonIcon className="w-[18px] h-[18px] absolute right-4 text-gray-400" />
                                        </div>
                                        {errors.lastName && <p className="text-red-500 text-sm font-thin">{errors.lastName.message}</p>}
                                    </div>

                                    <div>
                                        <div className="relative flex items-center">
                                            <input type="number" placeholder="Phone No."
                                                className="px-4 py-3.5 focus:ring-0 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
                                                {...register('phoneNumber', { required: 'Phone Number is required' })}
                                            />
                                            <PhoneIcon className="w-[18px] h-[18px] absolute right-4 text-gray-400" />
                                        </div>
                                        {errors.phoneNumber && <p className="text-red-500 text-sm font-thin">{errors.phoneNumber.message}</p>}
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h3 className="text-lg font-bold text-[#333] mb-6">Shipping Address</h3>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <input type="text" placeholder="Address Line"
                                            className="px-4 py-3.5 focus:ring-0 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
                                            {...register('Address', { required: 'Address is required' })}
                                            />
                                       {errors.Address && <p className="text-red-500 text-sm font-thin">{errors.Address.message}</p>}
                                    </div>
                                    <div>
                                        <input type="text" placeholder="City"
                                            className="px-4 py-3.5 focus:ring-0 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
                                            {...register('City', { required: 'City is required' })}
                                            />
                                          {errors.City && <p className="text-red-500 text-sm font-thin">{errors.City.message}</p>}  
                                    </div>
                                    <div>
                                        <input type="text" placeholder="State"
                                            className="px-4 py-3.5 focus:ring-0 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none" 
                                            {...register('State', { required: 'State is required' })}
                                            />
                                        {errors.State && <p className="text-red-500 text-sm font-thin">{errors.State.message}</p>}
                                    </div>
                                    <div>
                                        <input type="text" placeholder="Zip Code"
                                            className="px-4 py-3.5 focus:ring-0 bg-white text-[#333] w-full text-sm border-b-2 focus:border-[#333] outline-none"
                                            {...register('Zipcode', { required: 'Zipcode is required' })}
                                        />
                                        {errors.Zipcode && <p className="text-red-500 text-sm font-thin">{errors.Zipcode.message}</p>}
                                    </div>
                                </div>
                                <div>
                                    <div className="mt-5">
                                        <label className="flex ">
                                            <input
                                                type="checkbox"
                                                className="mr-2 size-4 text-black focus:border-0 focus:ring-0"
                                                checked={isSave}
                                                onChange={() => setIsSave(!isSave)}
                                            />
                                            <span className="text-black text-sm">
                                                Save this Address..
                                            </span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex gap-6 max-sm:flex-col mt-10">
                                    <button type="button" className="rounded-md px-6 py-3 w-full text-sm font-semibold bg-transparent hover:bg-gray-100 border-2 text-[#333] "onClick={handleRefresh}>Refresh</button>
                                    <button type="submit" className="rounded-md px-6 py-3 w-full text-sm font-semibold bg-[#333] text-white hover:bg-[#222]">Complete Purchase</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
