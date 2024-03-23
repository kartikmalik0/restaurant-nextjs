"use client"
import PageLoader from "@/components/PageLoader";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const SuccessPage = ({ params }: { params: { orderId: string } }) => {
 
  const router = useRouter()
  // const {orderId} = params
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const makeRequest = async () => {
      console.log(params?.orderId,"orderid")
      try {
        await fetch(`http://localhost:3000/api/confirm/${params?.orderId}`, {
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
  }, [params?.orderId, router]);

   
 

  return (
    <>
      {isLoading && (
        <div>
            <PageLoader/>
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
