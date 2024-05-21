"use client"
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="grid h-[calc(100vh-9rem)] place-content-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black text-gray-200 tracking-wider">Server Error</h1>

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">Uh-oh!</p>

        <p className="mt-4 text-gray-500">{"We can't find that page."}</p>

        <a
          onClick={() => {
            reset()
            window.location.reload()
          }}
          className="mt-6 inline-block rounded bg-red-500 px-5 py-3 text-sm font-medium text-white hover:bg-red-400 focus:outline-none focus:ring"
        >
          Try Again !
        </a>
      </div>
    </div>
  )
}