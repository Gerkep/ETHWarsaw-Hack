import React, { useEffect, useState } from 'react';
import Booker from '../../artifacts/contracts/Booker.sol/Booker.json';
import { Booker as BookerType } from '../../typechain-types';
import { ethers } from 'ethers'
import { useSigner } from 'wagmi'
import { CloseIcon } from '@chakra-ui/icons';
import { doc, collection, addDoc} from "firebase/firestore"; 
import { db } from "../../firebase/clientApp";
import Link from 'next/link';
import { HiOutlinePhotograph, HiOutlineCheckCircle } from 'react-icons/hi';
import { create, CID, IPFSHTTPClient } from "ipfs-http-client";
import { useAccount, useNetwork, useSendTransaction } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractFunction } from '@usedapp/core';

const fileTypes = ["JPG", "PNG"];
const projectId = process.env.NEXT_PUBLIC_IPFS_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_IPFS_API_KEY;
const auth = `Basic ${Buffer.from(`${projectId}:${projectSecret}`).toString('base64')}`;
const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});
 
type DateRange = {
  startDate: Date, 
  endDate: Date, 
  key: string
}
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Dec"]

export default function Signin(props: {onCloseModal: any, link: string, price: string, dates: DateRange, eventName: string, spots: string, image: string}){

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [step, setStep] = useState(1);
  const [stayId, setStayId] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { address, isConnected: isWagmiConnected } = useAccount();
  const { data: signer } = useSigner();
  const { chain, chains } = useNetwork()
  const contractInterface = new ethers.utils.Interface(Booker.abi);
  const contractAddress = chain?.id == 77 ? '0xb1339D62a1129c9aB146AdA1cEb9760feA24a811' : '0x9f8DE00b6CdAaAE4bF33AD7b66042b9944110408';
  const contract = new ethers.Contract(contractAddress, contractInterface, signer!);
  // const { state, send } = useContractFunction(contract, 'addStay', { transactionName: 'addStay' })

    const handleCloseClick = () => {
        props.onCloseModal();
    };

    const addStay = async (e: React.FormEvent<HTMLFormElement>) => {
      setLoading(true);
      e.preventDefault();
      if(!signer) return;
      const subdomain = 'https://staverse.infura-ipfs.io';
      const date = `${(props.dates.startDate).getDate()} ${months[(props.dates.startDate).getMonth()]}-${(props.dates.endDate).getDate()} ${months[(props.dates.endDate).getMonth()]}`
      let URL = "";
      if(props.image){
        try {
          const added = await client.add({ content: props.image });
          URL = `${subdomain}/ipfs/${added.path}`;
        } catch (error) {
          console.log('Error uploading file to IPFS.');
        }
      }
      await addDoc(collection(db, "Stays"), {
        link: props.link,
        price: props.price,
        eventName: props.eventName,
        spots: props.spots,
        fullName: fullName,
        email: email,
        image: URL,
        date: date
      }).then(async (docRef) => {
        setStayId(docRef.id);
        const costPerPerson = (parseInt(props.price)/parseInt(props.spots)*1000000).toFixed(0);
        try{
          // send(docRef.id, costPerPerson, props.spots, URL);
          const addTx = await contract.addStay(docRef.id, costPerPerson, props.spots,URL);
          await addTx.wait();
          setStep(2);
        }catch{
          console.log("Smart contract tx error");
        }
        setLoading(false);
      });
    }

    const stepOne = () => {
      return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md rounded-xl border-4 border-black shadow-[20px_20px_0_rgba(0,0,0,1)] cursor-auto">
        <div className="bg-white py-8 pb-16 px-4  shadow sm:rounded-lg sm:px-10 cursor-auto v" onClick={(e) => e.stopPropagation()}>
          <h1 className=' text-center font-bold text-3xl'>Who is booking?</h1>
          <div className='flex pb-8 w-full justify-center'>
                  <p className='text-center mt-8 text-gray-500'>Note: We need your email to add you to bookings and send details on your reservations.</p>
              </div>
          <form className="space-y-6" onSubmit={(e) => addStay(e)} method="POST">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  onChange={(e) => setFullName(e.target.value)}
                  value={fullName}
                  type="text"
                  autoComplete="current-name"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Book only for me
                </label>
            </div>
            <div>
              {address ?
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
              :
              <div className='w-full flex justify-center mt-12'>
                  <ConnectButton />   
              </div>
              }
            </div>
          </form>
        </div>
        </div>
      )
    }

    const stepTwo = () => {
      return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md sm:rounded-lg border-4 rounded-xl border-black shadow-[20px_20px_0_rgba(0,0,0,1)] cursor-auto">
        <div className="bg-white py-8 pb-16 px-4 shadow sm:rounded-lg sm:px-10 cursor-auto" onClick={(e) =>  e.stopPropagation()}>
          <div className='w-full flex justify-center'>
            <HiOutlineCheckCircle className='w-36 h-36 text-light-green' />
          </div>
          <h1 className=' text-center font-bold text-3xl mt-8'>Success!</h1>
          <div className='flex pb-8 w-full justify-center'>
                  <p className='text-center mt-4 text-gray-500'>Your stay offer was successfully added to our platform! You can now share it with your frens!</p>
          </div>
          <Link href={`/stays/${stayId}`}>
            <button
              className="w-full flex justify-center py-4 px-4 border mt-8 border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black"
              onClick={() => handleCloseClick()}
            >
              View my offer
            </button>
          </Link>
        </div>
        </div>
      )
    }

  return(
    <div className='fixed z-50 w-full h-screen flex justify-center items-center  backdrop-blur-lg cursor-pointer' onClick={handleCloseClick}>
      {step === 1 && stepOne()}
      {step === 2 && stepTwo()}
    </div>
  )
};