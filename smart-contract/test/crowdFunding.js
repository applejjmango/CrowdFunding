const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdFunding Contract", () => {
  let CrowdFunding;
  let crowdFunding;
  let creator;
  let donor;
  let campaignId;

  // 모금 활동을 생성하는 헬퍼 함수
  const createCampaign = async () => {
    const createCampaignTx = await crowdFunding.createCampaign(
      "Campaign Title",
      "Campaign Description",
      "Campaign Image",
      ethers.parseEther("100"),
      Math.floor(Date.now() / 1000) + 3600 // 1시간 후에 종료
    );

    await createCampaignTx.wait(1);
    return 0; // 모금 활동 ID를 반환 (첫 모금 활동은 0번)
  };

  beforeEach(async () => {
    [creator, donor] = await ethers.getSigners(); // 계정 배열에서 creator와 donor 설정
    CrowdFunding = await ethers.getContractFactory("CrowdFunding");
    crowdFunding = await CrowdFunding.deploy(); // CrowdFunding 컨트랙트 배포
    await crowdFunding.waitForDeployment(); // 배포 완료될 때까지 대기
    campaignId = await createCampaign(); // 테스트마다 새 모금 활동 생성
  });

  it("should create a campaign", async () => {
    const campaign = await crowdFunding.campaigns(campaignId);
    expect(campaign.creator).to.equal(creator.address);
    expect(campaign.title).to.equal("Campaign Title");
    expect(campaign.description).to.equal("Campaign Description");
    expect(campaign.imageUrl).to.equal("Campaign Image");
    expect(campaign.goalAmount).to.equal(ethers.parseEther("100"));
    expect(campaign.deadline).to.equal(Math.floor(Date.now() / 1000) + 3600);
  });

  it("should donate to a campaign", async () => {
    await crowdFunding
      .connect(donor)
      .donateToCampaign(campaignId, { value: ethers.parseEther("100") });
    const campaign = await crowdFunding.campaigns(campaignId);
    expect(campaign.raisedAmount).to.equal(ethers.parseEther("100"));
  });

  it("should close a campaign", async () => {
    await crowdFunding.connect(creator).closeCampaign(campaignId);
    const campaign = await crowdFunding.campaigns(campaignId);
    expect(campaign.deadline).to.be.lte(Math.floor(Date.now()));
  });

  it("should withdraw from a campaign", async () => {
    await crowdFunding
      .connect(donor)
      .donateToCampaign(campaignId, { value: ethers.parseEther("50") });
    await crowdFunding
      .connect(creator)
      .withdrawFunds(campaignId, ethers.parseEther("30"));
    const campaign = await crowdFunding.campaigns(campaignId);
    expect(campaign.withdrawnAmount).to.equal(ethers.parseEther("30"));
  });

  it("should get a list of campaigns", async () => {
    await createCampaign();
    const allCampaigns = await crowdFunding.getAllCampaigns();
    expect(allCampaigns.length).to.equal(2);
    expect(allCampaigns[0].title).to.equal("Campaign Title");
    expect(allCampaigns[1].title).to.equal("Campaign Title");
  });

  it("should get donations for a campaign", async () => {
    await crowdFunding
      .connect(donor)
      .donateToCampaign(campaignId, { value: ethers.parseEther("50") });
    await crowdFunding
      .connect(donor)
      .donateToCampaign(campaignId, { value: ethers.parseEther("30") });
    const donations = await crowdFunding.getCampaignDonations(campaignId);
    expect(donations.length).to.equal(2);
    expect(donations[0].donor).to.equal(donor.address);
    expect(donations[0].amount).to.equal(ethers.parseEther("50"));
    expect(donations[1].amount).to.equal(ethers.parseEther("30"));
  });
});
