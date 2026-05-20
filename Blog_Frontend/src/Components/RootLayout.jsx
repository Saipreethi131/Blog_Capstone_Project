import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import {useEffect} from 'react'
import { useAuth } from "../store/authStore";



function RootLayout() {

  //import check checkAuth
  let checkAuth=useAuth(state=>state.checkAuth)

  useEffect(()=>{
    checkAuth()
  },[])


  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;