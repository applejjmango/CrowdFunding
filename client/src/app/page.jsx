import Image from "next/image";
import { Card } from "@/components";
import Logo from "../../public/Logo.png";

const fetchCampaigns = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns`, {
    method: "GET",
    cache: "no-cache",
  });

  if (!res.ok) {
    console.error("Error fetching campaigns:", res.statusText);
    return { campaigns: [], donationCount: 0, campaignCount: 0 };
  }

  const data = await res.json();
  let campaigns = data.campaigns || [];

  campaigns.sort((a, b) => b.collectedAmount - a.collectedAmount);
  const tops = campaigns.slice(0, 9);
  const donationCount = campaigns.reduce(
    (total, campaign) => total + campaign.donations.length,
    0
  );

  return { campaigns: tops, donationCount, campaignCount: campaigns.length };
};

const fetchTotalCollected = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/total`, {
    method: "GET",
    cache: "no-cache",
  });
  const data = await res.json();
  return data.total || 0;
};

const Home = async () => {
  const totalCollected = await fetchTotalCollected();
  const { campaigns, campaignCount, donationCount } = await fetchCampaigns();

  return (
    <div>
      <div className="bg-neutral-800 rounded-lg p-4 md:p-8 w-full mb-8">
        <div className="flex">
          <div>
            <div className="flex items-end gap-4">
              <Image
                className="hidden md:block"
                src={Logo}
                alt="pawfund"
                width={50}
                height={50}
              />
              <h1 className="text-2xl md:text-4xl font-semibold">
                PawFund에 오신 것을 환영합니다
              </h1>
            </div>
            <p className="text-sm md:text-lg text-neutral-400 mb-8 mt-4">
              PawFund는 동물 보호를 위한 블록체인 기반 크라우드 펀딩 플랫폼으로,
              기부자들이 기부를 통해 동물들의 삶에 긍정적인 영향을 미치고,
              그들의 발자취를 남기는 상징적인 의미를 담고 있습니다.
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="bg-neutral-700 rounded-lg p-4 w-full">
            <h5 className="text-center mb-2">전체 모금 활동 수</h5>
            <p className="text-2xl font-semibold text-center">
              {campaignCount}
            </p>
          </div>
          <div className="bg-neutral-700 rounded-lg p-4 w-full">
            <h5 className="text-center mb-2">전체 기부 수</h5>
            <p className="text-2xl font-semibold text-center">
              {donationCount}
            </p>
          </div>
          <div className="bg-neutral-700 rounded-lg p-4 w-full">
            <h5 className="text-center mb-2">모금된 이더리움</h5>
            <p className="text-2xl font-semibold text-center">
              {totalCollected
                ? parseFloat(totalCollected).toFixed(4)
                : "0.0000"}
              ETH
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-xl mb-4">가장 인기 있는 모금 활동</h1>
      {campaigns?.length === 0 ? (
        <div className="flex flex-col  justify-center gap-4 mt-10">
          <h1 className="text-4xl font-semibold">
            모금 활동을 찾을 수 없습니다
          </h1>
          <p className="text-lg text-neutral-400">
            아직 생성된 모금 활동이 없는 것 같습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {campaigns?.map((campaign) => (
            <Card campaign={campaign} key={campaign.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
