import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Loading() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = (url: string) => (url !== router.asPath) && setLoading(true);
        const handleComplete = (url:string) => (url === router.asPath) && setLoading(false);

        router.events.on('routeChangeStart', handleStart)
        router.events.on('routeChangeComplete', handleComplete)
        router.events.on('routeChangeError', handleComplete)

        return () => {
            router.events.off('routeChangeStart', handleStart)
            router.events.off('routeChangeComplete', handleComplete)
            router.events.off('routeChangeError', handleComplete)
        }
    })
    
    return  (
    <div>
        {loading &&
            <div className="w-full h-full fixed z-50 bg-white text-black">
                <div className="w-full h-full flex justify-center items-center">
                    <div className="spinner"></div>
                </div>
            </div>
        }
    </div>
    );
}