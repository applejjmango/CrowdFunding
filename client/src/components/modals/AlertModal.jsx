"use client";

import { toast } from "react-toastify";
import React, { useEffect, useRef } from "react";
import { BiSolidErrorCircle } from "react-icons/bi";

import { ClientButton } from "..";

const AlertModal = ({ setIsOpen, campaignId }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target))
        setIsOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);

  const handleClick = async (answer) => {
    if (answer === "yes") {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns/${campaignId}`,
        { method: "PUT" }
      );
      console.log("res => ", res);

      if (res.ok) toast.success("모금 활동이 성공적으로 종료되었습니다.");
      else toast.error("모금 활동 종료에 실패했습니다.");
    }

    setIsOpen(false);
  };

  return (
    <main className="bg-[rgba(0,0,0,.7)] h-[100vh] flex items-center justify-center w-full fixed z-50 top-0 left-0 p-4">
      <div
        ref={modalRef}
        className="bg-neutral-800 flex flex-col sm:flex-row justify-center sm:justify-start rounded-lg p-4 h-full sm:h-auto w-full md:w-2/3 lg:w-1/2 xl:w-1/3 items-center"
      >
        <div className="pr-4">
          <BiSolidErrorCircle className="mb-8 sm:mb-0 text-[148px] md:text-[164px] text-emerald-500" />
        </div>
        <div className="flex sm:block flex-col items-center gap-4 sm:gap-0">
          <h3 className="font-semibold text-2xl">정말 종료하시겠습니까?</h3>
          <p className="text-center sm:text-start">
            이 모금 활동을 종료하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="mt-4 flex justify-center md:justify-end gap-4 font-semibold">
            <ClientButton
              onClick={() => handleClick("yes")}
              className="bg-emerald-500 border-2 border-emerald-500 py-2 px-4 rounded-lg hover:border-emerald-600 hover:bg-emerald-600 transition-all duration-200"
            >
              네, 종료합니다.
            </ClientButton>
            <ClientButton
              onClick={() => handleClick("no")}
              className="border-2 border-emerald-500 text-emerald-500 py-2 px-4 rounded-lg hover:border-emerald-600 hover:bg-emerald-600 transition-all duration-200  hover:text-neutral-200"
            >
              아니요
            </ClientButton>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AlertModal;
