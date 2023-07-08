import React, { useMemo, useState } from "react";
import Head from "next/head";
import Header from "../components/Header";
import { RAFFLES } from "../utils/demo";
import RaffleCard from "../components/RaffleCard";
import TabBar from "../components/TabBar";

export default function Home() {
  const [tab, setTab] = useState("featured");
  const visibleRaffles = useMemo(() => {
    if (tab === "featured") {
      return RAFFLES.filter(
        (item) => item.endTimeStamp > new Date().getTime()
      ).sort((a, b) => b.endTimeStamp - a.endTimeStamp);
    } else if (tab === "past") {
      return RAFFLES.filter(
        (item) => item.endTimeStamp <= new Date().getTime()
      ).sort((a, b) => b.endTimeStamp - a.endTimeStamp);
    } else {
      return RAFFLES.sort((a, b) => b.endTimeStamp - a.endTimeStamp);
    }
  }, [tab]);
  return (
    <>
      <Head>
        <title>KIZ Raffle</title>
        <meta name="description" content="Solan NFT Raffle Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-[#0b1418] min-h-screen">
        <Header />
        <div className="max-w-[1536px] mx-auto px-6 py-[140px]">
          <TabBar tab={tab} setTab={setTab} />
          <div className="flex flex-wrap ">
            {visibleRaffles.map((item, key) => (
              <RaffleCard raffle={item} className="" key={key} tab={tab} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
