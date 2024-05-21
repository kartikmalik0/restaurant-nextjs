import Link from "next/link";

const NoProducts = () => {
  return (
    <div className="flex flex-col items-center h-[82vh] justify-center w-full ">
      <h1 className=" text-red-500 text-3xl font-bold mb-4">No Products Found!</h1>
      <p className="text-sm w-full text-center text-gray-500 mb-8">Please check back later or explore other categories.</p>
      <Link href="/menu" className="bg-red-500 text-white py-3 px-6 rounded-md shadow-md hover:bg-red-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
        Back to Menu
      </Link>
    </div>
  );
};

export default NoProducts;
