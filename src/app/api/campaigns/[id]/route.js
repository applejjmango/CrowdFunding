import { NextResponse } from "next/server";
import connectBlockchain from "@/utils/connectBlockchain";

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { contract } = connectBlockchain();

    console.log("id ", id);
    const result = await contract.closeCampaign(id, { gasLimit: 1000000 });
    console.log("result =>  ", result);

    return NextResponse.json(
      {},
      { status: 200, statusText: "Campaign closed successfully." }
    );
  } catch (error) {
    NextResponse.json(
      {},
      { status: 500, statusText: "Somethings went wrong." }
    );
  }
}
