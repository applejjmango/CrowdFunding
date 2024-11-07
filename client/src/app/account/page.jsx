"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Card } from "@/components";
import Logo from "/public/Logo.png";
import { useEthersContext } from "@/contexts/EthersContext";

const Account = () => {
  const { signer } = useEthersContext();
  const [campaigns, setCampaigns] = useState(null);
  const [totalCollected, setTotalCollected] = useState(0);
  const [totalWithdrawn, setTotalWithdrawn] = useState(0);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns?owner=${signer?.address}`
      );
      const data = await res.json();
      var campaigns = data.campaigns;

      if (!campaigns) campaigns = [];

      const totalCollected = campaigns.reduce(
        (acc, campaign) => acc + Number(campaign.collectedAmount),
        0
      );
      const totalWithdrawn = campaigns.reduce(
        (acc, campaign) => acc + Number(campaign.withdrawedAmount),
        0
      );

      setCampaigns(campaigns);
      setTotalCollected(totalCollected);
      setTotalWithdrawn(totalWithdrawn);
    };

    signer?.address && fetchCampaigns();
  }, [signer?.address]);

  if (!signer?.address || campaigns === null)
    return (
      <div className="w-full h-[90%] flex justify-center items-center z-10">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <Image src={Logo} alt="pawfund" width={112} height={112} />
          <p className="text-2xl text-emerald-500 text-center font-bold mt-2">
            로딩 중..
          </p>
        </div>
      </div>
    );

  return (
    <main>
      <div className="bg-neutral-800 rounded-lg w-full p-4">
        <h1 className="text-2xl font-semibold">계정</h1>
        <div className="flex flex-col my-4">
          <span className="text-neutral-400">주소:</span>
          <span className="text-neutral-300 truncate">{signer?.address}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-neutral-400">캠페인 수:</span>
            <span className="text-neutral-300">{campaigns?.length ?? 0}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-neutral-400">총 모금액:</span>
            <span className="text-neutral-300">{totalCollected}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-neutral-400">총 출금액:</span>
            <span className="text-neutral-300">{totalWithdrawn}</span>
          </div>
        </div>
      </div>
      <div className="mt-4">
        {campaigns?.length === 0 ? (
          <div className="flex flex-col  justify-center gap-4 mt-10">
            <h1 className="text-xl">캠페인을 찾을 수 없습니다</h1>
            <p className="text-lg text-neutral-400">
              새로 생성된 캠페인은 즉시 표시되지 않을 수 있습니다.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 mt-8">
              <h1 className="text-xl">내 캠페인 ({campaigns?.length ?? 0})</h1>
              <p className="text-lg text-neutral-400">
                새로 생성된 캠페인은 즉시 표시되지 않을 수 있습니다.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {campaigns?.map((campaign) => (
                <Card
                  campaign={campaign}
                  key={campaign.id}
                  user={signer?.address}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Account;
