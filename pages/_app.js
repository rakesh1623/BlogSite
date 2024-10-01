import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {

  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');

  const logout = () => {
    // Clear token and email from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    
    // Clear email cookie
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
    // Reset the state
    setUserEmail('');
    
    // Optional: Redirect the user after logout
    router.push('/login'); 
    // Redirect to login page after logout
  }

  useEffect(() => {
    const email = localStorage.getItem('email');
    console.log(email);
    if (email) {
      setUserEmail(email);
    }
  }, [router.query]);

  return (
    <>
      <Navbar mail={userEmail} logout={logout} />
      <Component logout={logout} {...pageProps} />
      <Footer />
    </>
  );
}
