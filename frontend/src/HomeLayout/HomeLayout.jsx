import React from "react";
import logo from "../assets/tumblr-svgrepo-com.svg"
const Navbar = ({children}) => {
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-white sm:px-10 md:px-32">
          <div className="flex-none lg:hidden">
            <label
              htmlFor="my-drawer-3"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
          {/* Navbar */}
          <div className="flex justify-between items-center h-14 min-w-full">
            <div className=" px-2 mx-2 font-bold  text-blue-900 text-2xl flex gap-3">
                <img src={logo} alt="logo" className="h-8 w-10"/>
              <span>TeleFaces</span>
            </div>
            <div className=" hidden lg:flex  lg:w-[65%] lg:justify-between text-black lg:items-center">
            <ul className="menu menu-horizontal text-base font-bold flex gap-8 h-full ">
                {/* Navbar menu content here */}
                <li className="nav-hover ">Video Conferencing</li>
                <li className="nav-hover">Webinar</li>
                <li className="nav-hover">Pricing</li>
                
              </ul>
             <ul className="menu menu-horizontal  font-semibold text-base flex gap-8">
                <li className="">
                <button className="px-3 py-2 bg-blue-500 text-white hover:bg-blue-300 hover:text-blue-800">Login</button>
                </li>
                <li className="nav-hover">Get a Demo</li>
             </ul>
            
            </div>
          </div>
        </div>
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-3"
          aria-label="close sidebar"
          className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {/* Sidebar content here */}
          <li>Sidebar Item 1</li>
          <li>Sidebar Item 2</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
