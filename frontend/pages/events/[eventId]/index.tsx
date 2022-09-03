import { IoLogoTwitter, IoLogoDiscord, IoDesktop } from "react-icons/io5";
import { useEffect, useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import Create from "../../../components/popups/Create";
import Booker from '../../../artifacts/contracts/Booker.sol/Booker.json';
import { Booker as BookerType } from '../../../typechain-types';
import { ethers } from 'ethers'
import Link from "next/link";
import Image from "next/image";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { db } from "../../../firebase/clientApp";
import {HiOutlinePhotograph} from "react-icons/hi";
import Footer from "../../../components/layout/Footer";
import Loading from "../../../components/Loading";

type StayData = {
  email: string
  eventName: string
  fullName: string
  image?: string
  link: string
  price: string
  spots: string
  date: string
};

type Stay = {
  id: string;
  data: StayData;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const eventId = context.params?.eventId
  let event = {};
  if(typeof eventId == "string"){
    const docRef = doc(db, "Events", eventId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("exist")
      event = docSnap.data();
    } else {
      console.log("No such document!");
    }
  }
  return {
    props: {
      event
    }
  }
}

export default function Event({ event }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const getStays = async () => {
      const provider = ethers.getDefaultProvider('goerli')
      const contract = new ethers.Contract('0xc44a1A274F81dA3651568aD43C19109f834B88Ea', Booker.abi, provider) as BookerType;
      const querySnapshot = await getDocs(query(collection(db, "Stays")));
      const stays: Stay[] = [];
      querySnapshot.forEach((doc) => {
        stays.push({id: doc.id, data: doc.data() as StayData})
      });
      setStays(stays);
    }

    getStays();
    setLoading(false);
  }, [])

  const renderStays = () => {
    const staysList = stays.map(stay => {
      return(
        <div key={stay.id}>
        {stay.data.eventName === event.name &&
        <div  className="w-80 ml-12 mr-12 rounded-xl relative">
          <div className="w-full h-80 rounded-md shadow-[1px_1px_25px_rgba(0,0,0,0.24)] hover:scale-105 transition ease-in duration-180 cursor-pointer overflow-hidden relative">
            {stay.data.image ? 
            <Link href={`/stays/${stay.id}`}><Image alt="stayImage" layout='fill' objectFit='cover'  src={stay.data.image}></Image></Link>
            :
            <Link href={`/stays/${stay.id}`}><div className="w-full h-full flex justify-center items-center"><HiOutlinePhotograph className="w-16 h-16 text-gray-200"/></div></Link>
            }
          </div>
          <div className="w-full grid grid-cols-2 grid-rows-2 items-center mt-3">
          <p className="text-left  text-xl">${(parseInt(stay.data.price)/parseInt(stay.data.spots)).toFixed(2)}</p>

          <div className="flex justify-end ml-2">
          {/* {Array(stay.data.spots)
            .fill('')
            .map((x, idx) => (
              <div key={idx} className="h-6 w-6 bg-light-green rounded-full ml-1 mr-1"></div>
            ))} */}
          </div>
          <p className="text-left text-gray-500 text-md mr-2">{stay.data.date}</p>
          </div>
        </div>
        }
        </div>
      )
    })
    return (
      <div className="flex flex-wrap mt-4 justify-center py-8 pb-0 items-center z-10 bg-white">
        {staysList}
      </div>
    )
  }
  return (
    <>
      <Loading />
      <Navbar style="dark" showNav={true}/>
      <div className="w-full h-full pt-2 bg-[#F0EFF4] pb-20 top-0 lg:fixed">
        <div className="w-10/12 lg:w-11/12 ml-8 lg:py-4 lg:h-72 bg-gray-100 overflow-hidden flex flex-wrap border-4 border-black shadow-[12px_15px_0_rgba(0,0,0,1)] rounded-xl mt-28 ">
          <div className="grid lg:grid-cols-3 w-full">
            <div className="col-span-2">
              <div className="w-full lg:w-1/3 lg:h-1/4 rounded-r-xl lg:shadow-[4px_4px_8px_rgba(0,0,0,0.15)] relative">
              <Image alt="stayImage" layout='fill' objectFit='cover'  src={event.imageURL}></Image>
              </div>
              <div className="flex">
                <h1 className="mt-6 ml-8 text-2xl lg:text-5xl text-gray-900 font-black">{event.name}</h1>
                <p className="mt-8 ml-4 lg:mt-10 lg:ml-10 text-base lg:text-xl text-gray-500">{event.dateRange}</p>
              </div>
              <p className="w-10/12 lg:w-auto ml-8 mt-4 text-gray-500">{event.description}</p>
            </div>
            <div className="flex justify-end w-full">
              <IoLogoTwitter className="text-gray-900 h-8 w-8 mr-8 lg:mr-12 mt-8 ml-8 lg:ml-0 mb-6 lg:mt-0 cursor-pointer hover:text-indigo-600 transition ease-in duration-180"></IoLogoTwitter>
              <IoLogoDiscord className="text-gray-900 h-8 w-8 mr-8 lg:mr-12 mt-8 mb-6 lg:mt-0 cursor-pointer hover:text-indigo-600 transition ease-in duration-180"></IoLogoDiscord>
              <IoDesktop className="text-gray-900 h-8 w-8 mr-8 lg:mr-12 mt-8 mb-6 lg:mt-0 cursor-pointer hover:text-indigo-600 transition ease-in duration-180"></IoDesktop>
            </div>
          </div>
        </div>
      </div>
      <div className="z-30 lg:mt-30rem absolute bg-white w-full py-8 border-4 border-gray-200 ">
        {loading ? 
        <div className="w-full flex justify-center mt-10">
          <div className="spinner"></div>
        </div>
        :
        <div>
          {renderStays()}
        </div>
        }
        <Footer />
      </div>
    </>
  )
}