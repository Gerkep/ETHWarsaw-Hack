import react from "react";
import Link from 'next/link';

export default function ErrorPage () {

    return(
        <div className="min-h-full pt-16 pb-12 flex flex-col bg-white">
        <main className="flex-grow flex flex-col justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-36">
            <div className="text-center">
              <p className="text-9xl font-semibold text-indigo-600 drop-shadow-[7px_7px_0px_rgba(0,0,0,1)]">404</p>
              <h1 className="mt-2 text-4xl font-bold text-gray-900 tracking-tight sm:text-5xl sm:tracking-tight">
                Page not found.
              </h1>
              <p className="mt-2 text-base text-gray-500">Sorry, we couldn’t find the page you’re looking for.</p>
              <div className="mt-6">
                  <Link href="/">
                    <p className="text-base font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                    Go back home<span aria-hidden="true"> &rarr;</span>
                    </p>
                </Link>
              </div>
            </div>
          </div>
        </main>
        <footer className="flex-shrink-0 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-center space-x-4">
            <p className="text-sm font-medium text-gray-500 hover:text-gray-600">
              Contact: piotr@staverse.app
            </p>
            <span className="inline-block border-l border-gray-300" aria-hidden="true" />
            <a href="https://twitter.com/staversum" className="text-sm font-medium text-gray-500 hover:text-gray-600">
              Twitter
            </a>
          </nav>
        </footer>
      </div>
    )
}