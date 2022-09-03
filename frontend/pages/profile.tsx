import Navbar from "../components/layout/Navbar";
import Loading from "../components/Loading";

export default function Profile() {
  return (
    <>
      <Loading />
      <Navbar style="light" showNav={false}/>
      <div className="w-full h-80 bg-dimmedBackground bg-cover bg-bottom bg-no-repeat fixed top-0 z-0">
      </div>
      <div className="w-full flex justify-center">
        <div className="absolute top-44 rounded-xl  border-4 border-black shadow-[12px_15px_0_rgba(0,0,0,1)] h-2/3 w-11/12 lg:w-8/12 bg-white">
          <h2 className="text-4xl font-black mt-6 ml-8">Hello Piotr</h2>
          <div className="w-full flex justify-center h-full mt-8">
            <div className="w-11/12 h-3/4 bg-gray-200 mx-0-auto rounded-xl">
              <h3 className="mt-4 ml-4 text-xl text-gray-400">Here are your stays:</h3>
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
