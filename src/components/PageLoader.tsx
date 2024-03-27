import React from 'react'

const PageLoader = () => {
    return (
        <div className='flex space-x-2 justify-center items-center h-[calc(100vh-11rem)]  '>
            <span className='sr-only'>Loading...</span>
            <div className='h-5 w-5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]'></div>
            <div className='h-5 w-5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]'></div>
            <div className='h-5 w-5 bg-red-500 rounded-full animate-bounce'></div>
        </div>
    )
}

export default PageLoader
