"use client";

import PageLoader from "@/components/PageLoader";
import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";


const OrdersPage = () => {

  const { data: session, status } = useSession()
  const router = useRouter()
  const base_url = process.env.NEXT_PUBLIC_BASE_URL!;
  console.log(base_url)
  if (status === "unauthenticated") {
    router.push("/")
  }
  const { isPending, error, data } = useQuery({
    queryKey: ['orders'],
    queryFn: () =>
      fetch(`${base_url}/api/orders`).then((res) =>
        res.json(),
      ),
  })

  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => {
      return fetch(`${base_url}/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      });
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const status = input.value;

    mutation.mutate({ id, status });
    toast.success("The order status has been changed!")

  };
  if (isPending || status === "loading") return <PageLoader />
  console.log(data)
  return (
    <div className="p-2 lg:px-8 xl:px-8">
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th className="hidden md:block">Payment ID</th>
            <th>Name</th>
            <th>Mobile No.</th>
            <th>Date</th>
            <th>Price</th>
            <th className="hidden md:block">Products</th>
            <th>Pincode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {
            data?.map((item: OrderType, index: any) => (
              <tr className={`text-sm md:text-base ${item?.status !== "delivered" && "bg-red-50"}`} key={index}>
                <td className="hidden md:block py-6 px-1">{item?.orderInfo[0]?.paymentId}</td>
                <td className="py-6 px-1">{item?.orderInfo[0]?.addressInfo?.name}</td>
                <td className="py-6 px-1">{item?.orderInfo[0]?.addressInfo?.phoneNumber}</td>
                <td className="py-6 px-1">{item?.cretedAt?.toString().slice(0, 10)}</td>
                <td className="py-6 px-1">{item?.price}</td>
                <td className="hidden md:block py-6 px-1">{`${item?.products[0]?.title} (${item?.products[0]?.optionTitle}) * ${item?.products[0]?.quantity}`}</td>
                <td className="py-6 px-1">{item?.orderInfo[0]?.addressInfo?.pincode}</td>
                {session?.user.isAdmin ? (
                  <td>
                    <form
                      className="flex items-center justify-center gap-4"
                      onSubmit={(e) => handleUpdate(e, item.id)}
                    >
                      <input
                        placeholder={item.status}
                        className="p-2 ring-1 ring-red-100 rounded-md"
                      />
                      <button className="bg-red-400 p-2 rounded-full">
                        <Image src={"/edit.png"} alt="" width={30} height={30} />
                      </button>
                    </form>
                  </td>
                ) : (
                  <td className="py-6 px-1">{item.status}</td>
                )}          </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;