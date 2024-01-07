import HomeLayout from "../HomeLayout/HomeLayout";
import React from "react";
import homePageMainImage from "../assets/7560147_3708716.svg";
import Card from "../components/Card";
import video from "../assets/group-of-people.svg";
import camera from "../assets/video-camera.svg";
import screenShare from "../assets/screen-share.svg";
const LandingPage = () => {
  const cardContent = [
    {
      title: "Video Conferencing Solutions",
      image: video,
      text: "Elevate your meetings with Telefaces Video Conference Solutions. Experience seamless, secure, and crystal-clear communication. Connect globally, collaborate effortlessly, and achieve more. Welcome to the future of video conferencing.",
    },
    {
      title: "Webinar Solutions",
      image: camera,
      text: "Transform your webinars with Telefaces Webinar Solutions. Engage your audience seamlessly with our interactive platform. Deliver impactful presentations, foster collaboration, and build meaningful connections. Elevate your online events with Telefaces—where webinars become extraordinary",
    },
    {
      title: "Screen-Sharing",
      image: screenShare,
      text: "Empower your presentations with Telefaces Screen Sharing. Share your content seamlessly, captivate your audience, and enhance collaboration . Elevate your communication—experience the simplicity of sharing screens with Telefaces",
    },
  ];
  return (
    <HomeLayout>
      <div className="">
        <div className="pt-5 text-black flex flex-col-reverse items-center justify-center gap-6 mx-8 min-h-[70vh] md:flex-row md:px-32 sm:flex-col-reverse md:items-start sm:items-center">
          <div className="w-full sm:w-1/2 sm:px-6 text-center md:py-12 md:text-left flex flex-col items-center justify-center md:justify-center md:items-start">
            <h1 className="text-xl font-bold text-wrap md:text-4xl text-black tracking-wide">
              Telefaces is the easiest way to start team meetings and host
              online webinars
            </h1>
            <br />
            <p className="font-semibold tracking-wide sm:text-sm text-wrap md:text-lg text-blue-800 w-[80%]">
              TeleFaces is an interactive video conferencing and interactive
              webinar platform that helps you meet, discuss & build
              relationships from anywhere on the go.
            </p>
            <div className="w-full flex justify-center sm:justify-start sm:items-center">
              <button className="btn btn-primary bg-blue-900 text-white mt-4 w-1/2 tracking-wide sm:text-sm">
                {" "}
                Get Started - It's free
              </button>
            </div>
          </div>
          <div className="md:w-1/2 pt-12 flex justify-center items-center md:items-start ">
            <img
              src={homePageMainImage}
              alt="home page"
              className="w-full md:w-[80%] shadow-blue-300 shadow-md rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row gap-x-10 flex-wrap p-3 xl:px-36 justify-center items-center">
      {cardContent.map((card , i)=><Card content={card} key={i}/>)}
      </div>
    </HomeLayout>
  );
};

export default LandingPage;
