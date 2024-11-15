import { Card } from "@/components";

const fetchCampaigns = async (sort) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/campaigns`, {
    method: "GET",
    cache: "no-cache",
  });
  const data = await res.json();
  var campaigns = data.campaigns;

  if (!campaigns) campaigns = [];

  if (sort === undefined || sort === null) return campaigns;
  else if (sort === "newest") return campaigns.slice(-9).reverse();

  campaigns.sort((a, b) => b.collectedAmount - a.collectedAmount);
  const tops = campaigns.slice(0, 9);
  return tops;
};

const Campaigns = async ({ searchParams }) => {
  const campaigns = await fetchCampaigns(searchParams.sort);

  return (
    <div>
      <h1 className="text-xl mb-4">
        {!searchParams.sort
          ? `모든 모금 활동 (${campaigns?.length ?? 0})`
          : searchParams.sort === "newest"
          ? `최신 모금 활동 (${campaigns?.length ?? 0})`
          : `상위 모금 활동 (${campaigns?.length ?? 0})`}
      </h1>
      {campaigns?.length === 0 ? (
        <div className="flex flex-col justify-center gap-4 mt-10">
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

export default Campaigns;
