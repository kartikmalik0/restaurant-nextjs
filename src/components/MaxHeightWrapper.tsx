import { ReactNode } from "react"

const MaxHeightWrapper = ({children}:any) => {
  return (
    <div className=" mt-12 md:mt-24 lg:mt-24 xl:mt-24 min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-6rem)]">
      {children}
    </div>
  )
}

export default MaxHeightWrapper
