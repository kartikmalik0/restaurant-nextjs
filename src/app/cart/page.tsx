"use client";

import EmptyCart from "@/components/EmptyCart";
import LoadingSpinner from "@/components/LoadingSpinner";
import PaymentDetailModal from "@/components/PaymentDetailModal";
import { getAuthSession } from "@/utils/auth";
import { useCartStore } from "@/utils/store";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ScrollArea } from "@/components/ui/scroll-area"

const CartPage = () => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;
  const [addressError , setAddressError]  = useState(false)
  const [addressForDeliveryCharges,setAddressForDeliveryCharges] = useState(false)
  const [name, setName] = useState("")
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("")
  const { data: session } = useSession();
  const router = useRouter();
  const { products, totalItems, totalPrice, removeFromCart, loading } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);


  const buyNow = async () => {
    if (name === "" || address == "" || pincode == "" || phoneNumber == "") {
      return toast.error("All fields are required", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    }

    const addressInfo = {
      name,
      address,
      pincode,
      phoneNumber,
      date: new Date().toLocaleString(
        "en-US",
        {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }
      )
    }
    var options = {
      key: process.env.NEXT_PUBLIC_RZP_KEY,
      key_secret: process.env.NEXT_PUBLIC_RZP_SECRET ,
      amount: (totalPrice < 500 ? (totalPrice + (addressForDeliveryCharges ? 20 : 50)) *100 : (totalPrice+0) * 100 ),
      currency: "INR",
      order_receipt: 'order_rcptid' + name,
      name: "MS RESTAURANT",
      description: "for testing purpose",
      handler: function (response: any) {
        toast.success('Payment Successful')

        const paymentId = response.razorpay_payment_id

        const orderInfo = [{
          addressInfo,
          date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          }),
          email: session?.user?.email || "",
          userid: session?.user?.name || "",
          paymentId,
        }];
        const handleCheckout = async () => {
          if (!session) {
            router.push("/login");
          } else {
            try {
              const res = await fetch(`${base_url}/api/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  price: totalPrice,
                  products,
                  status: "Not Paid!",
                  userEmail: session.user.email,
                  orderInfo,
                }),
              });
              const data = await res.json();
              if (res.ok) {
                router.push(`${base_url}/success/${data.id}`); // Redirect to success page
              } else {
                console.error("Failed to create order:", data);
                // Handle error, show error message, etc.
              }
            } catch (err) {
              console.error("Checkout Error:", err);
              // Handle fetch error, show error message, etc.
            }
          }
        };
        handleCheckout()
      }
    }
    var pay = new (window as any).Razorpay(options);
    pay.open();
  }

  return (
    <div className="h-[calc(100vh-3rem)]  md:h-[calc(100vh-6rem)] flex flex-col md:items-center text-red-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      {/* Cart Products */}
      {loading ?
        (<LoadingSpinner />) :
        products.length > 0 ?
          (
            <ScrollArea className=" h-[45%] md:w-full lg:full xl:full md:h-[70%] lg:h-[70%]">
              <div className="  px-5 lg:h-full xl:w-full lg:w-full md:w-full  lg:px-20 xl:px-40">
            {/* SINGLE ITEM */}
            {products.map((item) => (
              <div className="flex items-center justify-between mb-4 mt-4" key={item.id}>
                {item.img && (
                  <Image src={item.img} alt="" width={100} height={100} />
                )}
                <div className="">
                  <h1 className="uppercase text-sm font-bold">
                    {item.title} x {item.quantity}
                  </h1>
                  <span>{item.optionTitle}</span>
                </div>
                <h2 className="font-bold">₹{item.price}</h2>
                <span
                  className="cursor-pointer font-bold"
                  onClick={() => removeFromCart(item)}
                >
                  X
                </span>
              </div>
            ))}
          </div>
            </ScrollArea>
          ) :
          <EmptyCart />
      }
      {/* PAYMENT CONTAINER */}
      {
        products.length > 0 ?
          <div className="h-[69%] p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center md:w-full lg:h-full lg:w-[40%] 2xl:w-[40%] lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
            <div className="flex justify-between">
              <span className="">Subtotal ({totalItems} items)</span>
              <span className="">₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="">Delivery For Nimriwali</span>
              <span className="text-green-500">₹20</span>
            </div>
            <div className="flex justify-between">
              <span className="">Delivery For Others</span>
              <span className="text-green-500">₹{50}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span className="">TOTAL(Without Delivery)</span>
              <span className="font-bold">₹{totalPrice}</span>
            </div>
            <PaymentDetailModal
              name={name}
              address={address}
              pincode={pincode}
              phoneNumber={phoneNumber}
              setName={setName}
              setAddress={setAddress}
              setPincode={setPincode}
              setPhoneNumber={setPhoneNumber}
              buyNow={buyNow}
              setAddressError={setAddressError}
              addressError= {addressError}
              setAddressForDeliveryCharges={setAddressForDeliveryCharges}
            />
          </div> : <></>
      }
    </div>
  );
};

export default CartPage;

