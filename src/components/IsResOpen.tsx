"use client"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify";


const IsResOpen = () => {
    const queryClient = useQueryClient()
    const { data: session } = useSession()
    const mutation = useMutation({
        mutationFn: (shopStatus: string) => {
            return fetch(`/api/isresopen`, {
                method: "PUT",
                body: JSON.stringify(shopStatus),
            })
        },
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ["shopstatus"] });
        },
    })
    const handleChange = (shopStatus: string) => {
        mutation.mutate(shopStatus.toUpperCase())
        toast.success("Shop staus updated")

    }


    const { data, isLoading } = useQuery({
        queryKey: ['shopstatus'],
        queryFn: async () => {
            const res = await fetch("/api/isresopen")
            return res.json()
        },
        staleTime: 0
    })


    return (
        <div>
            {
                session?.user.isAdmin ?
                    <Select onValueChange={(shopStatus) => handleChange(shopStatus)}  >
                        <SelectTrigger className=" min-w-28 w-full  z-[1500]">
                            <SelectValue placeholder={isLoading ? "Loading..." : data[0]?.shopStatus} />
                        </SelectTrigger>
                        <SelectContent className=" z-[1500]">
                            <SelectGroup >
                                <SelectItem value="open" className=" cursor-pointer" >OPEN</SelectItem>
                                <SelectItem value="close" className=" cursor-pointer" >CLOSE</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    : <></>
            }
        </div>
    )
}

export default IsResOpen
