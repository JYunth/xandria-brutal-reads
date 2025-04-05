import { Button } from '@/components/ui/button';
import SplitText from '@/components/ui/splittext';
import WalletConnectModal from '@/components/WalletConnectModal';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion'; // Import motion
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { isConnected, isNewUser } = useAuth();
    const navigate = useNavigate();
    const [showFloatingText, setShowFloatingText] = useState(false);
    const [showDivs, setShowDivs] = useState(false);

    const handleGetStarted = () => {
        if (isConnected) {
            navigate(isNewUser ? '/onboarding' : '/bookstore');
        } else {
            setIsModalOpen(true);
        }
    };

    const handleDecentralizedComplete = () => {
        // When “Decentralized” finishes animating, show rest of text
        setShowFloatingText(true);
    };

    return (
        <div className="relative bg-[#fff0db] snap-y snap-mandatory overflow-y-auto">
            {/* Hero Section */}
            <section className="min-h-screen snap-start flex flex-col">
                <header className="p-6 flex items-center justify-between">
                    <h1 className="font-almendra text-2xl font-bold text-accent">XANDRIA</h1>
                    <div>
                        {isConnected ? (
                            <Button onClick={() => navigate('/bookstore')}>
                                {isNewUser ? 'Complete Setup' : 'Enter Library'}
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                                Connect Wallet
                            </Button>
                        )}
                    </div>
                </header>

                {/* Animated Videos Container */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="absolute inset-0 overflow-hidden -z-10" // Position behind content
                >
                    {/* Secure Data Video (Bottom-Left) */}
                    <motion.video
                        src="/827962945958Secure_Data.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline // Important for mobile playback
                        className="absolute bottom-0 left-0 w-1/3 md:w-1/4 lg:w-1/5 pointer-events-none" // Adjust size as needed
                        variants={{
                            hidden: { opacity: 0, y: '100%', x: '-100%' },
                            visible: { opacity: 1, y: 0, x: 0, transition: { duration: 1, delay: 0.5, ease: 'easeOut' } }
                        }}
                    />

                    {/* Rating Video (Bottom-Right) */}
                    <motion.video
                        src="/406625022993Rating.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute bottom-0 right-0 w-1/3 md:w-1/4 lg:w-1/5 pointer-events-none" // Adjust size as needed
                        variants={{
                            hidden: { opacity: 0, y: '100%', x: '100%' },
                            visible: { opacity: 1, y: 0, x: 0, transition: { duration: 1, delay: 0.7, ease: 'easeOut' } }
                        }}
                    />

                    {/* Third Video (Fade In - Example: Top Center) */}
                    <motion.video
                        src="/21I986M3zV1jNr0j2M.mp4"
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-1/4 md:w-1/5 lg:w-1/6 pointer-events-none" // Adjust size and position
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 0.6, transition: { duration: 1.5, delay: 1 } } // Fade in slowly, slightly transparent
                        }}
                    />
                </motion.div>


                <main className="relative flex flex-1 flex-col items-center justify-center px-4 text-center z-10"> {/* Add relative and z-10 */}
                    <div className="max-w-fit mx-auto flex flex-col items-center justify-center">
                        <SplitText
                            text="The World's Knowledge"
                            className="font-almendra font-medium text-7xl text-center"
                            delay={80}
                            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                            easing={(t: number) => t * t * (3.0 - 2.0 * t)} // cubic easing function
                            threshold={0.1}
                            rootMargin="-50px"
                            onLetterAnimationComplete={() => console.log('Knowledge animation done')}
                        />

                        <SplitText
                            text="Decentralized"
                            className="font-almendra text-7xl font-medium text-center text-accent"
                            delay={80}
                            animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                            animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                            easing={(t: number) => t * t * (3.0 - 2.0 * t)}
                            threshold={0.2}
                            rootMargin="-50px"
                            onLetterAnimationComplete={handleDecentralizedComplete}
                        />

                        <p
                            className={
                                "font-space text-xl my-8 max-w-2xl mx-auto transition-all duration-700 ease-out " +
                                (showFloatingText
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-5")
                            }
                        >
                            Xandria reinvents the library for the digital age. Own your books truly and forever, with AI-enhanced reading experiences.
                        </p>

                        <Button
                            size="lg"
                            onClick={handleGetStarted}
                            className={
                                "text-lg px-8 py-6 font-notoserif max-w-fit transition-all duration-700 ease-out " +
                                (showFloatingText
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-5")
                            }
                        >
                            Begin Your Journey
                        </Button>
                    </div>
                </main>
            </section>

            {/* Additional Content */}
            <section className="min-h-screen snap-start flex flex-col items-center justify-center px-8 space-y-10">
                <SplitText
                    text="Your books are accessible anywhere in the world, anytime. Build your personal digital library with books you truly own, organized and accessible across all your devices."
                    className="font-space text-4xl max-w-5xl text-center mb-20"
                    delay={20}
                    animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
                    animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                    threshold={0.2}
                    rootMargin="-50px"
                    onLetterAnimationComplete={() => setShowDivs(true)} // Show the grid once the paragraph completes
                />

                <div
                    className={
                        "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto transition-all duration-700 ease-out " +
                        (showDivs ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5")
                    }
                >
                    <div className="brutalist-container">
                        <h3 className="font-almendra text-2xl font-medium mb-2">True Ownership</h3>
                        <p className="text-muted-foreground font-space font-semibold text-lg">
                            All books are stored on decentralized networks, giving you permanent, verifiable ownership.
                        </p>
                    </div>

                    <div className="brutalist-container">
                        <h3 className="font-almendra text-2xl font-medium mb-2">AI Enhancement</h3>
                        <p className="text-muted-foreground font-space font-semibold text-lg">
                            Intelligent assistant to help you understand, analyze and connect ideas within your texts.
                        </p>
                    </div>

                    <div className="brutalist-container">
                        <h3 className="font-almendra text-2xl font-medium mb-2">Knowledge Graph</h3>
                        <p className="text-muted-foreground font-space font-semibold text-lg">
                            Track your reading journey and visualize connections between texts and concepts.
                        </p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="font-space p-8 text-center text-sm font-medium text-muted-foreground snap-end">
                <p>© 2025 Xandria - Reviving the Library of Alexandria for the Web3 Era</p>
            </footer>

            <WalletConnectModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
        </div>
    );
};

export default LandingPage;
