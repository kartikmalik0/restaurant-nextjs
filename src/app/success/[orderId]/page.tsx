"use client"
import PageLoader from "@/components/PageLoader";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SuccessPage = ({ params }: { params: { orderId: string } }) => {
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;
  const router = useRouter()
  // const {orderId} = params
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const makeRequest = async () => {
      console.log(params?.orderId,"orderid")
      try {
        await fetch(`${base_url}/api/confirm/${params?.orderId}`, {
          method: "PUT",
        });
        setTimeout(() => {
          router.push("/orders");
        }, 5000);
      } catch (err) {
        console.log(err);
      }
    };

    makeRequest();
  }, [params?.orderId, router,base_url]);

   
 

  return (
    <>
      {isLoading && (
        <div className="bg-gray-100 flex h-[calc(100vh-14rem)]   ">
        <div className="bg-gray-100 p-6 my-auto  mx-auto">
          <svg viewBox="0 0 24 24" className="text-green-600 w-16 h-16 mx-auto my-6">
              <path fill="currentColor"
                  d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z">
              </path>
          </svg>
          <div className="text-center">
              <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">Payment Done!</h3>
              <p className="text-gray-600 my-2">Redirecting to Orders...</p>
              <p> Have a great day!  </p>
              
          </div>
      </div>
    </div>        
      )}
      {error && (
        <div className="min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-15rem)] flex items-center justify-center text-center text-red-500 text-2xl">
          <p className="max-w-[600px]">{error}</p>
        </div>
      )}
      {/* <h2>Success</h2> */}
    </>
  );
};

export default SuccessPage;
