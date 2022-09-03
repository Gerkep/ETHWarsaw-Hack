import Link from "next/link"
import Image from 'next/image'
import logo from '../../public/img/staverse-house-black.png'

const navigation = [{name: "Privacy policy", href: "#"}, {name: "Twitter", href: "#"}, {name: "Contact us", href: "#"}]

export default function Navbar() {
    return (
      <footer className="bg-white mt-24">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8 border-t-4 border-gray-200">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
        <div className="w-full h-24 flex justify-center ">
          <Link href="/" >
            <div className="h-24 w-14 mt-0 ml-4 z-10 cursor-pointer hover:scale-105 transition ease-in duration-180">
                        <Image
                            src={logo}
                            alt="logo"
                            layout="responsive"
                        />
              </div>
          </Link>
          </div>
          {navigation.map((item) => (
            <div key={item.name} className="px-5 py-2">
              <a href={item.href} className="text-base text-gray-500 hover:text-gray-900">
                {item.name}
              </a>
            </div>
          ))}
        </nav>
        <p className="mt-8 text-center text-base text-gray-400">&copy; 2022 Staverse, All rights reserved.</p>
      </div>
    </footer>
    )
  }
  