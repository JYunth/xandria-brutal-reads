import { useEffect, useState } from "react";
import CountUp from "./ui/countup";


export default function SplashScreen() {
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingProgress((prev) => {
                if (prev < 100) return prev + 10
                clearInterval(interval)
                return 100
            })
        }, 300)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (loadingProgress === 100) {
            const timeout = setTimeout(() => {
                setShowSplash(false)
            }, 1500)

            return () => clearTimeout(timeout)
        }
    }, [loadingProgress])

    if (!showSplash) {
        return null
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-xandria-brown">
            <CountUp
                from={0}
                to={100}
                separator=","
                direction="up"
                duration={loadingProgress / 50}
                className="count-up-text text-beige text-3xl"
            />
        </div>
    )
}