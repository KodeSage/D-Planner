import { useState, useEffect } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Navmenu from "./Navmenu";
import { useAccount, useSignMessage, useNetwork } from 'wagmi';
// import { signIn, useSession } from 'next-auth/react';
import axios from 'axios'
export default function Navbar() {
  const [ mounted, setMounted ] = useState( false );
   const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  // const { status } = useSession()
  const { signMessageAsync } = useSignMessage()

// [...nextauth]
  useEffect(() => {
    setMounted( true );
    console.log("IsCOnnected", isConnected)
    const handleAuth = async () =>
    {
      const userData = { address, chain: chain.id, network: 'evm' }
      // const { data } = await axios.post('/api/request-message', userData, {
    const { data } = await axios.post('/api/auth/request-message', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const message = data.message

      const signature = await signMessageAsync({ message })
       await signIn('credentials', {
        message,
        signature,
        redirect: false,
        callbackUrl: '/user',
      })
    }
    if( isConnected) {
      handleAuth()
    }
  }, [isConnected]);

  const getName = async () =>
  {
    const response = await axios.get( './api/hello' );
    console.log( response );
  }

  return (
    mounted && (
      <header className="bg-white border-b-2 border-gray-100">
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="w-full py-6 flex flex-wrap items-center justify-between border-b border-indigo-500 lg:border-none">
            <div className="flex items-center">
              <Link href="/">
                <a>DPlanner</a>
              </Link>
            </div>
            <div className="ml-10 space-x-4 flex items-center">
              <Link href="/create-event">
                <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 border border-indigo-100 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Create Event
                </a>
              </Link>
                 <ConnectButton />
              {/* <ConnectButton />
              {address && (
                <Navmenu />
              ) } */}
            </div>
          </div>
        </nav>
      </header>
    )
  );
}
