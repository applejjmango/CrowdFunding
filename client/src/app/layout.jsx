import { Epilogue } from "next/font/google";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";
import { Layout, Providers } from "@/components";

const epilogue = Epilogue({ subsets: ["latin"] });

export const metadata = {
  title: "PawFund",
  description:
    "PawFund는 동물 보호를 위한 블록체인 기반 크라우드 펀딩 플랫폼으로, 기부자들이 기부를 통해 동물들의 삶에 긍정적인 영향을 미치고, 그들의 발자취를 남기는 상징적인 의미를 담고 있습니다.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={epilogue.className}>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
