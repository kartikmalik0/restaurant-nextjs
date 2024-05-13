"use client"
import { useCartStore } from '@/utils/store';
import { Dialog, Transition } from '@headlessui/react'
import { useQuery } from '@tanstack/react-query';
import { Fragment, useState } from 'react'
import { toast } from 'react-toastify';

interface PaymentDetailModalProps {
    name: string;
    address: string;
    pincode: string;
    phoneNumber: string;
    setName: (name: string) => void;
    setAddress: (address: string) => void;
    setPincode: (pincode: string) => void;
    setPhoneNumber: (phoneNumber: string) => void;
    buyNow: () => void;
    setAddressError:(address:boolean)=>void;
    addressError:boolean
    setAddressForDeliveryCharges:(isNimriwali:boolean)=>void
}

const PaymentDetailModal: React.FC<PaymentDetailModalProps> = ({ name, address, pincode, phoneNumber, setName, setAddress,setPincode, setPhoneNumber, buyNow ,setAddressError,addressError,setAddressForDeliveryCharges}) => {
    let [isOpen, setIsOpen] = useState(false)

    const { data , isLoading } = useQuery({
        queryKey: ['shopstatus'],
        queryFn: async () => {
            const res = await fetch("/api/isresopen")
            return res.json()
        },
        staleTime: 0
    })


    // console.log(data[0]?.shopStatus)

    const handleAddress = (address:any) => {
        const addressesToMatch = ['ajitpur', 'nimriwali', "pahladgarh", "rupgarh", "nandgaon", "jharwai","neemriwali","ajeetpur"]; // Array of addresses to match
        const lowercaseAddress = address.toLowerCase();
    
        // Loop through each address to match
        for (let i = 0; i < addressesToMatch.length; i++) {
            if (lowercaseAddress.includes(addressesToMatch[i])) {
                if (addressesToMatch[i] === "nimriwali" || addressesToMatch[i] === "neemriwali") {
                    setAddressForDeliveryCharges(true); // Set state to true if the address contains "nimriwali"
                } else {
                    setAddressForDeliveryCharges(false); // Set state to false for other addresses
                }
                setAddressError(false); // Set state to false if a match is found
                return;
            }
        }
        setAddressError(true); // Set state to true if no match is found
    }
    

    
    
    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        if(data[0]?.shopStatus === "CLOSE"){
            toast.error(<CustomToastContent />)
        }
        else if(data[0]?.shopStatus === "OPEN"){
            setIsOpen(true)
        }
    }
    const CustomToastContent = () => (
        <div>
          <h3>Shop Closed !</h3>
          <p>Try again later.</p>
        </div>
      );
    
    


    return (
        <>
            <div className="text-center rounded-lg text-white font-bold">
                <button
                    type="button"
                    // disabled={data[0]?.shopStatus === "CLOSE"}
                    onClick={openModal}
                    className="w-full  bg-violet-600 py-2 text-center rounded-lg text-white font-bold "
                >
                    Buy Now
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl p-2  text-left align-middle shadow-xl transition-all bg-gray-50">

                                    <section className="">
                                        <div className="flex flex-col items-center justify-center py-8 mx-auto  lg:py-0">

                                            <div className="w-full  rounded-lg md:mt-0 sm:max-w-md xl:p-0 ">
                                                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                                                    <form className="space-y-4 md:space-y-6" action="#">
                                                        <div>
                                                            <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Enter Full Name</label>
                                                            <input placeholder='Enter your name' value={name} onChange={(e) => setName(e.target.value)} type="name" name="name" id="name" className=" border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100" required />
                                                        </div>
                                                        <div>
                                                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">Enter Full Address</label>
                                                            <input placeholder='Village and Landmark near you' value={address} onChange={(e) => {
                                                                setAddress(e.target.value)
                                                            handleAddress(e.target.value)
                                                            }} type="text" name="address" id="address" className=" border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100" required />
                                                            {
                                                               addressError ?  <span className=' text-red-600'>Delivery is Not Avaible in this area</span> : <></>
                                                            }
                                                        </div>
                                                        <div>
                                                            <label htmlFor="pincode" className="block mb-2 text-sm font-medium text-gray-900">Enter Pincode</label>
                                                            <input placeholder='Your pincode (127309)' value={pincode} onChange={(e) => {
                                                                setPincode(e.target.value)
                                                                }} type="text" name="pincode" id="pincode" className=" border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100" required />
                                                                
                                                        </div>
                                                        <div>
                                                            <label htmlFor="mobileNumber" className="block mb-2 text-sm font-medium text-gray-900">Enter Mobile Number</label>
                                                            <input placeholder='Your active mobile number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} type="text" name="mobileNumber" id="mobileNumber" className=" border outline-0 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-gray-100" required />
                                                        </div>
                                                    </form>
                                                    <button onClick={() => { buyNow(); closeModal() }} type="button" disabled={addressError} className="focus:outline-none w-full text-white bg-violet-600 hover:bg-violet-800  outline-0 font-medium rounded-lg text-sm px-5 py-2.5 ">Order Now</button>

                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
export default PaymentDetailModal