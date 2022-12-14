import Link from "next/link"
import Image from 'next/image'
import logo from '../../public/img/staverse-long-white.png'
import blackLogo from '../../public/img/staverse-long.png'
import { RampInstantSDK } from "@ramp-network/ramp-instant-sdk";
import {  AddIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/router'
import { useState } from "react"
import Create from "../popups/Create"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import MobileMenu from "../popups/MobileMenu"
import { HiX } from "react-icons/hi";
import { useAccount } from "wagmi";

const Navbar: React.FC<{style:string, landing: boolean}> = ({style, landing}) => {
  const router = useRouter()
  const [showCreationModal, setShowCreationModal] = useState(false);
  const { address } = useAccount()
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  //we tried integrating ramp with Goerli, but unfortunately there was some error. 
  // It was late at night and we couldn't ask anyone for help :(
  const openRamp = () => {
    new RampInstantSDK({
      hostAppName: 'Your App',
      hostLogoUrl: 'https://rampnetwork.github.io/assets/misc/test-logo.png',
      userAddress: address,
      // url: 'https://ri-widget-staging-goerli2.firebaseapp.com/' 
    }).show()
  }

    return (
      <>
      <div className="absolute top-0">
      {showCreationModal ? <Create onCloseModal={() => setShowCreationModal(false)}/> : '' }
      {showMobileMenu ? <MobileMenu onCloseModal={() => setShowMobileMenu(false)}/> : ''}
      </div>
      <div className={!landing ? "fixed z-40 lg:z-40 top-0 right-0 w-full backdrop-blur flex items-center justify-end py-7 pb-16 lg:pb-2" : "fixed z-40 lg:z-40 top-0 right-0 w-full flex items-center justify-end py-7 pb-16 lg:pb-2"}>
      <div>
      {landing ? 
      <div className="z-20 top-0 w-full hidden lg:flex items-center justify-end">
          <button onClick={() => openRamp()} className="px-8 py-2 rounded-xl text-white mr-6 z-30 
            bg-indigo-600 flex items-center text-base hover:scale-105 transition ease-in duration-180 shadow-[2px_2px_10px_rgba(0,0,0,0.25)] font-bold">
            <AddIcon className="h-4 w-4 mr-2"/>Buy Crypto
          </button>
          <div className="mr-6 z-50">
            <ConnectButton chainStatus="icon"/>
          </div>
      </div>
      :
      <div className="z-20 top-0 w-full hidden lg:flex items-center justify-end">
      {style === "light" ? 
      <Link href="/profile"><p className="mr-10 text-white text-xl font-base cursor-pointer hover:scale-105 transition ease-in duration-180">Profile</p></Link>
      :
      <Link href="/profile"><p className="mr-10 text-black text-xl font-base  cursor-pointer hover:scale-105 transition ease-in duration-180">Profile</p></Link>
      }
        <button onClick={() => setShowCreationModal(true)} className="px-8 py-2 rounded-xl text-white mr-6 z-30 
          bg-indigo-600 flex items-center text-base hover:scale-105 transition ease-in duration-180 shadow-[2px_2px_10px_rgba(0,0,0,0.25)] font-bold">
          <AddIcon className="h-4 w-4 mr-2"/>Add Stay
        </button>
        <div className="mr-6 z-50">
          <ConnectButton chainStatus="icon"/>
        </div>
    </div>
      }

      {showMobileMenu ?
      <div className="w-full z-50 top-0 lg:hidden">
        <div className="space-y-2 mr-6 mt-2 cursor-pointer absolute right-0" onClick={() => setShowMobileMenu(false)}>
          <HiX className={style === "light" ? " text-white w-10 h-10" : "w-10 h-10"} />
        </div>   
      </div>   
      :
      <div className="w-full z-50 lg:hidden">
        <div className="space-y-2 mr-6 mt-2 lg:hidden cursor-pointer absolute right-0" onClick={() => setShowMobileMenu(true)}>
          <div className={style === "light" ? "w-10 h-1 bg-white rounded" : "w-10 h-1 bg-gray-900 rounded"}></div>
          <div className={style === "light" ? "w-10 h-1 bg-white rounded" : "w-10 h-1 bg-gray-900 rounded"}></div>
          <div className={style === "light" ? "w-10 h-1 bg-white rounded" : "w-10 h-1 bg-gray-900 rounded"}></div>
        </div>   
      </div>  
      }
      </div>
      </div>
      </>
    )
  }
  
  export default Navbar;