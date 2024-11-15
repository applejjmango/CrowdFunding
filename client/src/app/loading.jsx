import React from "react";
import Image from "next/image";

import Logo from "../../public/Logo.png";

const Loading = () => {
  return (
    <div className="w-full h-[90%] flex justify-center items-center z-10">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <Image src={Logo} alt="pawfund" width={112} height={112} />
        <p className="text-2xl text-emerald-500 text-center font-bold mt-2">
          잠시만 기다려주세요!
        </p>
      </div>
    </div>
  );
};

export default Loading;
