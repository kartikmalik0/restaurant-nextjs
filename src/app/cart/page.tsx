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

const CartPage = () => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;
  const { products, totalItems, totalPrice, removeFromCart, loading } = useCartStore();
  useEffect(() => {
    // Code to run whenever loading state changes
    console.log('Loading state changed:', loading);
  }, [loading]);
  const [name, setName] = useState("")
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const { data: session } = useSession();
  const router = useRouter();

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
      key: "rzp_test_izSt8Am4W62A1o",
      key_secret: "rzp_test_izSt8Am4W62A1o",
      amount: totalPrice * 100,
      currency: "INR",
      order_receipt: 'order_rcptid' + name,
      name: "MS RESTAURANT",
      description: "for testing purpose",
      handler: function (response: any) {
        console.log(response, "response")
        toast.success('Payment Successful')

        const paymentId = response.razorpay_payment_id

        const orderInfo = [{
          // userCart: buySingleItem ? [singleCartItem] : userCart,
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
              console.log()
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
              console.log("Checkout Response:", data); // Log the response for debugging
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
    console.log(pay)

  }

  return (
    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col text-red-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      {/* Cart Products */}
      {loading ?
        (<LoadingSpinner />) :
        products.length > 0 ?
          (<div className="h-1/2 p-4 flex flex-col justify-center overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40">
            {/* SINGLE ITEM */}
            {products.map((item) => (
              <div className="flex items-center justify-between mb-4" key={item.id}>
                {item.img && (
                  <Image src={item.img} alt="" width={100} height={100} />
                )}
                <div className="">
                  <h1 className="uppercase text-xl font-bold">
                    {item.title} x {item.quantity}
                  </h1>
                  <span>{item.optionTitle}</span>
                </div>
                <h2 className="font-bold">${item.price}</h2>
                <span
                  className="cursor-pointer"
                  onClick={() => removeFromCart(item)}
                >
                  X
                </span>
              </div>
            ))}
          </div>) :
          <EmptyCart />
      }
      {/* PAYMENT CONTAINER */}
      {
        products.length > 0 ?
          <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-20 xl:px-40 2xl:text-xl 2xl:gap-6">
            <div className="flex justify-between">
              <span className="">Subtotal ({totalItems} items)</span>
              <span className="">${totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span className="">Service Cost</span>
              <span className="">$0.00</span>
            </div>
            <div className="flex justify-between">
              <span className="">Delivery Cost</span>
              <span className="text-green-500">FREE!</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between">
              <span className="">TOTAL(INCL. VAT)</span>
              <span className="font-bold">${totalPrice}</span>
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
            // buySingleItem={buySingleItem}
            // setBuySingleItem={setBuySingleItem}
            />
          </div> : <></>
      }
    </div>
  );
};

export default CartPage;

