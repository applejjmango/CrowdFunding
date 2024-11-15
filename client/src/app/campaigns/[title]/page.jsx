"use client";

import Image from "next/image";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEthereum } from "react-icons/fa";

import getDaysLeft from "@/utils/getDaysLeft";
import Logo from "../../../../public/Logo.png";
import { ClientButton, FormInput } from "@/components";
import { useEthersContext } from "@/contexts/EthersContext";

const CampaignDetails = () => {
  const router = useRouter();
  const { selectedCampaign: campaign, contract } = useEthersContext();
  const [amount, setAmount] = useState(0);
  const [topDonations, setTopDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campaign === null) return router.back();

    campaign.donations.sort((a, b) => b.amount - a.amount);
    const tops = campaign.donations.slice(0, 10);
    setTopDonations(tops);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount === 0) return toast.error("금액을 입력해주세요.");
    if (getDaysLeft(campaign.deadline) <= 0)
      return toast.error("모금 활동이 종료되었습니다.");

    setLoading(true);

    try {
      await contract.donate(campaign.id, {
        value: ethers.parseEther(amount),
        gasLimit: 1000000,
      });

      toast.success("기부가 성공적으로 완료되었습니다!");
    } catch (error) {
      toast.error("기부에 실패하였습니다.");
    }

    setAmount(0);
    setLoading(false);
  };

  return (
    <main>
      <div className="flex gap-4 md:flex-row flex-col">
        <div className="w-full h-full max-h-[300px] md:max-h-none md:h-[400px] xl:h-[500px]">
          <img
            className="rounded-lg w-full object-cover h-full max-h-[300px] md:max-h-none"
            src={campaign?.imageUrl}
            alt={campaign?.title}
            width={1400}
            height={800}
          />
        </div>
        <div className="flex flex-col sm:flex-row md:flex-col justify-between gap-4">
          <div className="rounded-lg bg-neutral-800 min-w-[124px] w-full">
            <p className="p-4 text-center text-2xl">
              {getDaysLeft(campaign?.deadline) > 0
                ? getDaysLeft(campaign?.deadline)
                : "종료됨"}
            </p>
            <p className="bg-neutral-700 w-full rounded-b-lg p-2 text-sm text-neutral-400 text-center">
              {getDaysLeft(campaign?.deadline) > 0 ? "남은 기간" : "상태"}
            </p>
          </div>
          <div className="rounded-lg bg-neutral-800 min-w-[124px] w-full">
            <p className="p-4 text-center text-2xl">
              {campaign?.collectedAmount ?? 0} ETH
            </p>
            <p className="bg-neutral-700 w-full rounded-b-lg p-2 text-sm text-neutral-400 text-center">
              목표 금액: {campaign?.target} ETH
            </p>
          </div>
          <div className="rounded-lg bg-neutral-800 min-w-[124px] w-full">
            <p className="p-4 text-center text-2xl">
              {campaign?.donations?.length ?? 0} 회
            </p>
            <p className="bg-neutral-700 w-full rounded-b-lg p-2 text-sm text-neutral-400 text-center">
              총 기부수
            </p>
          </div>
        </div>
      </div>
      <div
        className={`grid gap-4 ${
          getDaysLeft(campaign?.deadline) > 0
            ? "grid-cols-1 md:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        <div className="col-span-4 md:col-span-3">
          <div className="mt-8">
            <h4 className="text-xl font-semibold uppercase mb-2">
              모금 활동 주최자
            </h4>
            <div className="flex items-center gap-2">
              <Image
                className="p-3 bg-neutral-800 rounded-full"
                src={Logo}
                alt={campaign?.owner}
                width={48}
                height={48}
              />
              <a
                href={`https://sepolia.etherscan.io/address/${campaign?.owner}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-400 underline truncate"
              >
                {campaign?.owner}
              </a>
            </div>
          </div>
          <div className="mt-8">
            <h4 className="text-xl font-semibold uppercase mb-2">스토리</h4>
            <p className="text-neutral-400">{campaign?.description}</p>
          </div>
          <div className="mt-8">
            <h4 className="text-xl font-semibold uppercase mb-2">
              상위 기부자 목록
            </h4>
            <div className="flex flex-col gap-4">
              {topDonations?.length > 0 ? (
                topDonations.map((donation, index) => (
                  <div key={index} className="bg-neutral-800 p-4 rounded-lg">
                    <p className="text-neutral-400 flex items-center gap-2">
                      <FaEthereum className="text-2xl text-emerald-500" />{" "}
                      <b>
                        {donation.amount}{" "}
                        <span className="hidden md:inline">이더 (ETH)</span>
                      </b>{" "}
                      출처:{" "}
                      <a
                        href={`https://sepolia.etherscan.io/address/${donation.donator}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 underline truncate"
                      >
                        <span className="truncate">{donation.donator}</span>
                      </a>
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-neutral-400">아직 기부자가 없습니다.</p>
              )}
            </div>
          </div>
        </div>

        {getDaysLeft(campaign?.deadline) > 0 && (
          <div className="col-span-4 md:col-span-1 mt-8">
            <h4 className="text-xl font-semibold uppercase">기부하기</h4>
            <form
              onSubmit={handleSubmit}
              className="bg-neutral-800 rounded-lg p-4"
            >
              <FormInput
                label={"금액"}
                placeholder={"ETH 0.1"}
                type={"number"}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="bg-neutral-900 text-sm rounded-lg p-2 my-4">
                <p>이 프로젝트를 지지하는 마음으로 후원하세요.</p>
                <p className="text-neutral-500 text-sm mt-2">
                  리워드는 없지만 프로젝트의 메시지가 마음에 든다면
                  기부해주세요.
                </p>
              </div>
              <ClientButton
                type="submit"
                onClick={handleSubmit}
                className="w-full font-semibold p-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 transition-all duration-200"
                loading={loading}
              >
                기부하기
              </ClientButton>
            </form>
          </div>
        )}
      </div>
    </main>
  );
};

export default CampaignDetails;
