import React from "react";

const Card = ({ content }) => {
  const { title, image, text } = content;
  return (
    <div className="card w-[19rem] sm:w-[23rem] bg-white shadow-lg shadow-blue-400 mt-9 p-8 flex flex-col gap-8">
      <div className="w-1/4 bg-blue-300 p-3 rounded-md">
        {" "}
        <img src={image} alt="Shoes" />
      </div>
      <h2 className="card-title text-wrap text-black ">{title}</h2>
      <p className="text-black"> {text}</p>
    </div>
  );
};

export default Card;
