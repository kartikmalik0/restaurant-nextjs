"use client"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "react-toastify";


const IsResOpen = () => {
    const queryClient = useQueryClient()
    const { data: session } = useSession()
    console.log(session)
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

        <>
            {
                session?.user.isAdmin ?
                    <Select onValueChange={(shopStatus) => handleChange(shopStatus)} >
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder={isLoading ? "Loading..." : data[0]?.shopStatus} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel></SelectLabel>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="close">Close</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                    : <></>
            }
        </>
    )
}

export default IsResOpen
