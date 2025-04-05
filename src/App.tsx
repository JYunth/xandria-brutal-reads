
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
//import SplashScreen from "./components/SplashScreen";
import { AuthProvider } from "./context/AuthContext";
import { BookProvider } from "./context/BookContext";
import BookstorePage from "./pages/BookstorePage";
import LandingPage from "./pages/LandingPage";
import LibraryPage from "./pages/LibraryPage";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";
import ProfilePage from "./pages/ProfilePage";
import ReaderPage from "./pages/ReaderPage";

const queryClient = new QueryClient();



function App() {
    // const [loading, setLoading] = useState(true)

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setLoading(false)
    //     }, 2000)
        
    //     return () => clearTimeout(timer)
    // }, [])

    // if (loading) {
    //     return (
    //         <SplashScreen />
    //     )
    // }

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BookProvider>
                    <TooltipProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/onboarding" element={<OnboardingPage />} />
                                <Route element={<Layout />}>
                                    <Route
                                        path="/bookstore"
                                        element={
                                            <ProtectedRoute>
                                                <BookstorePage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/library"
                                        element={
                                            <ProtectedRoute>
                                                <LibraryPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/read/:bookId"
                                        element={
                                            <ProtectedRoute>
                                                <ReaderPage />
                                            </ProtectedRoute>
                                        }
                                    />
                                    <Route
                                        path="/profile"
                                        element={
                                            <ProtectedRoute>
                                                <ProfilePage />
                                            </ProtectedRoute>
                                        }
                                    />
                                </Route>
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </BrowserRouter>
                    </TooltipProvider>
                </BookProvider>
            </AuthProvider>
        </QueryClientProvider>
    )
}

export default App;
