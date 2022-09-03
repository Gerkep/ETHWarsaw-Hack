import Navbar from "../components/layout/Navbar";
import Link from "next/link"
import AddStay from "../components/popups/AddStay";
import React, { useState, useEffect } from "react";
import Footer from "../components/layout/Footer";
import { FileUploader } from "react-drag-drop-files";
import { HiOutlinePhotograph } from "react-icons/hi";
import Dropdown from "../components/layout/Dropdown";
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css';
import { DateRange } from 'react-date-range';
import Image from "next/image";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { db } from "../firebase/clientApp";
import Loading from "../components/Loading";
const fileTypes = ["JPG", "PNG"];

const eventsList = ["ETHBogota", "ETHSanFrancisco"];

type EventDetails = {
  organizer: string,
  name: string,
  dateRange: string, 
  imageURL: string
}
type Event = {
  id: string,
  data: EventDetails
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  let events: object[] = []
  const querySnapshot = await getDocs(query(collection(db, "Events")));
  querySnapshot.forEach((doc) => {
    events.push({id: doc.id, data: doc.data()})
  });
  return {
    props: {
      events
    }
  }
}

export default function Home({ events }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState("");
  const [price, setPrice] = useState("");
  const [eventName, setEventName] = useState("");
  const [spots, setSpots] = useState("");
  const [image, setImage] = useState<any>(null);
  const [dateRange, setDateRange] = useState({startDate: new Date(), endDate: new Date(), key: 'selection'})
  const [showCallendar, setShowCallendar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (image: File) => {
    setImage(image);
  };

  const submitStay = (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    setShowModal(true);
    setLoading(false);
  }

  const handleDateSelect = (ranges:any) => {
    console.log(ranges);
    setDateRange({startDate: ranges.selection.startDate, endDate: ranges.selection.endDate, key: 'selection'})
  }
  const displayCallendar = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setShowCallendar(true)
  }

  const renderEvents = () => {
    const eventList = events.map((event: Event) => {
      return (
        <Link key={event.data.name} href={`/events/${event.id}`}>
          <div className="w-11/12 lg:w-4/12 h-64 bg-white shadow-[12px_15px_0_rgba(0,0,0,1)] border-4 lg:ml-12 lg:mr-12 mt-16 border-black rounded-xl hover:scale-105 hover:shadow-[20px_20px_0_rgba(0,0,0,1)] transition ease-in duration-180 cursor-pointer">
              <div className={`w-full h-40 rounded-xl overflow-hidden relative`}>
                <Image alt="stayImage" layout='fill' objectFit='cover'  src={event.data.imageURL}></Image>
              </div>
              <div className="w-full grid grid-cols-2 grid-rows-2 items-center">
                <h3 className="text-2xl ml-2 mt-2 font-bold text-gray-900">{event.data.name}</h3>
                <p className="text-right mt-2 text-lg leading-6 font-medium text-gray-500 mr-2 mt-2">{event.data.dateRange}</p>
                <p className="ml-2 text-lg leading-6 font-medium text-gray-500">{event.data.organizer}</p>
                <p> </p>
              </div>
          </div>
          </Link>
      )
    })
    return (
      <div className="w-full justify-center flex flex-wrap">
        {eventList}
      </div>
    )
  }

  return (
    <div onClick={() => setShowCallendar(false)}>
      <Loading />
      <Navbar style="dark" showNav={false}/>
      <div className="lg:w-1/2 fixed mt-36 lg:mt-48">
          <h1 className="text-5xl lg:text-7xl text-center lg:text-left lg:ml-8 font-black"><span className="text-indigo-600">Book a stay</span> for <br/> your next hack.</h1>
          <p className="w-full px-2 lg:px-0 lg:pr-8 lg:w-4/6 lg:ml-8 mt-10 text-xl text-center lg:text-left lg:text-2xl lg:font-bold text-gray-500 lg:text-black">
          Because all hackers deserve a great place to stay during hackathon!</p>
          <div className="w-full lg:w-auto flex lg:block justify-center">
          <a href="#upcoming "><button className="border-4 border-black text-black shadow-[12px_12px_0_rgba(0,0,0,1)] font-black rounded-xl 
          px-16 lg:px-24 py-6 text-black text-xl lg:ml-8  mt-20 hover:scale-105 transition ease-in duration-240 hover:scale-105 hover:shadow-[20px_20px_0_rgba(0,0,0,1)] transition ease-in duration-180">
            Upcoming Events
          </button></a>
          </div>
        </div>
      {showModal ? <AddStay onCloseModal={() => setShowModal(false)} link={link} price={price} dates={dateRange} eventName={eventName} spots={spots} image={image}/> : '' }
      <div className="polygon h-screen w-8/12 hidden lg:block bg-stay2 bg-cover bg-right z-0 shadow-[0px_20px_0_rgba(0,0,0,1)] fixed right-0 top-0 flex items-center">
      <div className="mt-20 absolute right-20 shadow-[20px_20px_0_rgba(0,0,0,1)] border-4 border-black rounded-2xl overflow-hidden">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 ">
            <h2 className="text-center text-3xl font-bold">Add <span className="text-indigo-600">new stay</span></h2>
            <form className="space-y-6 py-6" onSubmit={(e) => submitStay(e)}>
              <div>
                <label htmlFor="link" className="block text-sm font-medium text-gray-700">
                  Offer link
                </label>
                <div className="mt-1">
                  <input
                    id="link"
                    name="link"
                    onChange={(e) => setLink(e.target.value)}
                    value={link}
                    type="text"
                    placeholder='https://...'
                    autoComplete="link"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="grid w-full grid-cols-2">
              <div>
                  <label htmlFor="dates" className="block text-sm font-medium text-gray-700">
                    Dates
                  </label>
                  <div className="mt-1" onClick={(e) => displayCallendar(e)}>
                    <div  className="appearance-none cursor-pointer block w-5/6 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                      {(dateRange.startDate).getDate() !== (dateRange.endDate).getDate() ?
                      <div>
                        {(dateRange.startDate).getDate()}/{(dateRange.startDate).getMonth() + 1}-
                        {(dateRange.endDate).getDate()}/{(dateRange.endDate).getMonth() + 1}
                      </div>
                      :
                      <div className="text-gray-400">
                        Choose
                      </div>
                      }
                    </div>
                    <div className="absolute z-50 w-5/6">
                      {showCallendar &&
                        <DateRange
                        rangeColors={["#4f45e4"]}
                        minDate={new Date}
                        ranges={[dateRange]}
                        onChange={handleDateSelect}
                        showMonthAndYearPickers={false}
                        showDateDisplay={false}
                        />                      
                      }
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                    Total price $
                  </label>
                  <div className="mt-1">
                    <input
                      id="price"
                      name="price"
                      onChange={(e) => setPrice(e.target.value)}
                      value={price}
                      type="number"
                      autoComplete="price"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="grid w-full grid-cols-2">
                <div>
                  <label htmlFor="event" className="block text-sm font-medium text-gray-700">
                    Event
                  </label>
                  <div className="mt-1 w-5/6">
                    <Dropdown values={eventsList} onChange={setEventName}/>
                  </div>
                </div>
                <div>
                  <label htmlFor="spots" className="block text-sm font-medium text-gray-700">
                    Spots
                  </label>
                  <div className="mt-1">
                    <input
                      id="spots"
                      name="spots"
                      onChange={(e) => setSpots(e.target.value)}
                      value={spots}
                      min={1}
                      type="number"
                      autoComplete="spots"
                      required
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <label htmlFor="spots" className="block text-sm font-medium text-gray-700">
                    Image <span className="text-gray-400 font-light">optional</span>
              </label>
              <FileUploader handleChange={handleChange} name="file" types={fileTypes} multiple={false} label="Drop an image" >
                {image ? 
                <div className=" w-full border-4 border-gray-200 border-dashed rounded-xl mt-2 pt-4 pb-6 cursor-pointer">
                  <div className="w-full text-center text-gray-500">{image.name} <br />Uploaded sccessfully ✅</div>
                </div>   
                :
                <div className=" w-full border-4 border-gray-200 border-dashed rounded-xl mt-2 pt-4 pb-6 cursor-pointer">
                  <div className="w-full flex justify-center">
                    <HiOutlinePhotograph className="w-10 h-10 text-gray-300"/>
                  </div>
                  <div className="w-full text-center text-gray-500">Drop an image</div>
                </div>             
                }
              </FileUploader>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black"
                >
                {loading ? 
                <div className='spinner-white'></div>
                :
                <p>
                  Add Stay
                </p>
                }
                </button>
              </div>
            </form>
          </div>
          </div>
      </div>
      <div style={{marginTop: "100vh"}} className="z-40 bg-white w-full absolute border-t-8 border-black ">
      <div className="pt-12 sm:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl tracking-tight font-black lg:font-bold text-gray-900 sm:tracking-tight">
            Trusted by devs from 5 continents
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            First ever crypto booking service designed to book accommodation for your next web3 event.
          </p>
        </div>
      </div>
      <div className="mt-10 pb-12 bg-white sm:pb-24 ">
        <div className="relative">
          <div className="absolute inset-0 h-1/2" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto flex justify-center w-full">
              <dl className="w-10/12 rounded-lg bg-white shadow-[12px_15px_0_rgba(0,0,0,1)] hover:scale-105 hover:shadow-[20px_20px_0_rgba(0,0,0,1)] transition ease-in duration-180 border-4 border-black sm:grid sm:grid-cols-3">
                <div className="flex flex-col border-b border-gray-100 p-6 text-center sm:border-0 sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Refund Guarantee</dt>
                  <dd className="order-1 text-5xl tracking-tight font-bold text-indigo-600 ">100%</dd>
                </div>
                <div className="flex flex-col border-t border-b border-gray-100 p-6 text-center sm:border-0 sm:border-l sm:border-r">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Response Time</dt>
                  <dd className="order-1 text-5xl tracking-tight font-bold text-indigo-600">5 min</dd>
                </div>
                <div className="flex flex-col border-t border-gray-100 p-6 text-center sm:border-0 sm:border-l">
                  <dt className="order-2 mt-2 text-lg leading-6 font-medium text-gray-500">Support</dt>
                  <dd className="order-1 text-5xl tracking-tight font-bold text-indigo-600">24/7</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style={{backgroundColor: "#F0EFF4"}} className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl tracking-tight font-black lg:font-bold text-gray-900 sm:tracking-tight">
           How can I do it?
          </h2>
          <p className="mt-3 text-xl text-gray-500 sm:mt-4">
            Find accommodation on your favorite booking service and book with us for crypto.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap lg:mt-8 justify-center py-12 items-center">
        <div className="w-72 h-96 bg-white shadow-[12px_15px_0_rgba(0,0,0,1)] border-4 border-black rounded-xl flex flex-wrap justify-center ml-10 mr-10 hover:scale-105 hover:shadow-[20px_20px_0_rgba(0,0,0,1)] transition ease-in duration-180">
          <div className="w-full h-40 bg-backblur bg-center bg-cover rounded-md"></div>
          <div className="w-20 h-20 bg-createIcon bg-center bg-contain bg-no-repeat absolute mt-8"></div>
          <h3 className="text-center font-black text-3xl ">Add stay</h3>
          <p className="text-center font-medium text-l w-5/6">Find a stay on service like Airbnb, copy the link and add new offer to our platform.</p>
        </div>
        <div className="w-20 h-10 hidden lg:block bg-arrow bg-center bg-contain bg-no-repeat ml-6">
        </div>
        <div className="w-72 h-96 mt-20 lg:mt-8 bg-white shadow-[12px_15px_0_rgba(0,0,0,1)] border-4 border-black rounded-xl flex flex-wrap justify-center ml-10 mr-10 hover:scale-105 hover:shadow-[20px_20px_0_rgba(0,0,0,1)] transition ease-in duration-180 ">
          <div className="w-full h-40 bg-backblur bg-center bg-cover rounded-md"></div>
          <div className="w-20 h-20 bg-sendIcon bg-center bg-contain bg-no-repeat absolute mt-8"></div>
          <h3 className="text-center font-black text-3xl">Fund it</h3>
          <p className="text-center font-medium text-l w-5/6">You can book alone or with frens. All funds will be safely stored on a smart contract.</p>
        </div>
        <div className="w-20 h-10 hidden lg:block bg-arrow bg-center bg-contain bg-no-repeat ml-6">
        </div>
        <div className="w-72 h-96 mt-20 lg:mt-8 bg-white shadow-[12px_15px_0_rgba(0,0,0,1)] border-4 border-black rounded-xl flex flex-wrap justify-center ml-10 mr-10 hover:scale-105 hover:shadow-[20px_20px_0_rgba(0,0,0,1)] transition ease-in duration-180" >
          <div className="w-full h-40 bg-backblur bg-center bg-cover rounded-md"></div>
          <div className="w-20 h-20 bg-checkIcon bg-center bg-contain bg-no-repeat absolute mt-8"></div>
          <h3 className="text-center font-black text-3xl">Book it</h3>
          <p className="text-center font-medium text-l w-5/6">Once the price target is met you confirm booking and receive details within 24h.</p>
        </div>
      </div>
    </div>
  
    <div className="pt-24 pb-12" id="upcoming">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl tracking-tight font-black lg:font-bold text-gray-900 sm:tracking-tight">
           Upcoming web3 events
          </h2>
          <p className="mt-4 font-bold text-indigo-500 text-lg">YOU DO NOT WANT TO MISS</p>
        </div>
      </div>
        {renderEvents()}
      </div>
      <Footer />
      </div>
    </div>
  )
}