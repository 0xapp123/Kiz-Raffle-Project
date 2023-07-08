/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useMemo, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "next/router";
import { RAFFLES } from "../../utils/demo";
import { MinusIcon, PlusIcon, VerifiedIcon } from "../../components/SvgIcons";
import Link from "next/link";
import Countdown from "../../components/Countdown";
import { NextPage } from "next";
import moment from "moment";

const RaffleDetail: NextPage = () => {
  const router = useRouter();
  const { raffleKey } = router.query;

  const [tickets, setTickets] = useState(3);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTickets(e.target.value as unknown as number);
  };

  const raffleData = useMemo(() => {
    return RAFFLES.find((item) => item.raffleKey === raffleKey);
  }, [raffleKey]);

  const isEnd =
    raffleData?.endTimeStamp && raffleData.endTimeStamp < new Date().getTime();

  const properties = [1, 2, 3, 4, 5, 6];

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
        <div className="mx-auto max-w-[1024px] px-6">
          {raffleData && (
            <div className="py-[80px] lg:py-[140px] flex gap-4 lg:gap-6 flex-col md:flex-row">
              <div className="w-full md:w-[300px] lg:w-[400px]">
                <img
                  src={raffleData.image}
                  className="rounded-xl w-[300px] lg:w-[400px] h-[300px] lg:h-[400px] object-cover mx-auto"
                  alt=""
                />
                <div className="w-full bg-[#18262d] p-4 md:p-6 rounded-2xl mt-4 lg:mt-6">
                  <h5 className="text-xl font-bold text-white">Propeties</h5>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {properties.map((item, key) => (
                      <div
                        className="relative px-4 py-3 border border-[#ffffff30] rounded-xl text-md text-right text-white"
                        key={key}
                      >
                        <span className="text-xs text-[#aaa] uppercase absolute left-2 top-1">
                          head
                        </span>
                        Hat
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[calc(100%-316px)] lg:w-[calc(100%-424px)]">
                <h5 className="text-[#eee] text-md font-500 flex gap-2 items-center">
                  <span title={raffleData.verified ? "Verified" : "Unverified"}>
                    <VerifiedIcon
                      color={raffleData.verified ? "#86098d" : "#9E9E9E"}
                    />
                  </span>
                  {raffleData.collection}
                </h5>
                <h1 className="text-[#eee] text-3xl font-500 flex gap-2 items-center text-[32px] leading-[1.5] font-bold">
                  {raffleData.name}
                </h1>
                <Link
                  href={`https://solscan.io/token/${raffleData.mint}`}
                  passHref
                >
                  <a
                    target="_blank"
                    className="underline text-[#fff] text-sm md:text-md"
                    title="View on Solscan"
                  >
                    {raffleData.mint}
                  </a>
                </Link>
                <div className=" bg-[#18262d] p-6 rounded-2xl mt-4">
                  {!isEnd && (
                    <div className="text-center">
                      <button className="h-[52px] px-8 bg-[#fff] font-bold rounded-full w-full md:w-auto text-lg md:text-xl transition-all duration-300 hover:bg-[#ddd]">
                        Buy {tickets} ticket{tickets === 1 ? "" : "s"} for{" "}
                        {(tickets * raffleData.price).toLocaleString()}{" "}
                        {raffleData.token}
                      </button>
                    </div>
                  )}
                  <div className="flex flex-col items-center justify-between mt-4 md:flex-row">
                    {!isEnd ? (
                      <div className="flex items-center justify-between w-full h-12 gap-4 md:w-2/5">
                        <button
                          className="grid w-6 h-6 place-content-center"
                          onClick={() =>
                            setTickets((prev) => (prev > 1 ? prev - 1 : prev))
                          }
                        >
                          <MinusIcon color="#fff" />
                        </button>
                        <input
                          value={tickets}
                          onChange={handleChange}
                          min={1}
                          max={
                            raffleData.totalTickets -
                            raffleData.purchasedTickets
                          }
                          className="px-2 w-[120px] py-1 text-2xl text-center border border-[#ddd] rounded-full text-white h-full bg-[#ffffff20] "
                          type="number"
                        />
                        <button
                          className="grid w-6 h-6 place-content-center"
                          onClick={() =>
                            setTickets((prev: number) =>
                              prev <
                              raffleData.totalTickets -
                                raffleData.purchasedTickets
                                ? (prev as unknown as number) + 1
                                : prev
                            )
                          }
                        >
                          <PlusIcon color="#fff" />
                        </button>
                      </div>
                    ) : (
                      <p className="flex items-center w-full h-12 text-white md:justify-start md:w-3/5">
                        Tickets sold :&nbsp;
                        <span className="ml-2 text-3xl font-bold">
                          {raffleData.purchasedTickets}/
                          {raffleData.totalTickets}
                        </span>
                      </p>
                    )}
                    <p className="flex items-center justify-center w-full h-12 text-white md:justify-end md:w-3/5">
                      Ticket Price:&nbsp;
                      <span className="ml-2 text-3xl font-bold">
                        {raffleData.price} {raffleData.token}
                      </span>
                    </p>
                  </div>
                </div>
                <div className=" bg-[#18262d] p-6 rounded-2xl mt-4">
                  <div className="flex flex-wrap justify-between">
                    <div className="">
                      <h5 className="text-xl font-bold text-white">Details</h5>
                      {!isEnd ? (
                        <div className="flex items-center gap-2 text-xl text-white">
                          End time:
                          <Countdown
                            endTimestamp={raffleData.endTimeStamp}
                            className="inline-flex gap-2 text-xl text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xl text-white">
                          Ended in:
                          <span className="inline-flex gap-2 text-xl text-white">
                            {moment(raffleData.endTimeStamp).format(
                              "yyyy-M-DD HH:MM"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                    {!isEnd && (
                      <div className="flex flex-col items-end text-left text-white lg:text-right">
                        <h5 className="text-xl font-bold text-left lg:text-right">
                          Tickets Sold
                        </h5>
                        <div className="flex items-center gap-2 text-xl">
                          {raffleData.purchasedTickets}/
                          {raffleData.totalTickets}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className=" bg-[#18262d] p-6 rounded-2xl mt-4">
                  <h5 className="text-xl font-bold text-white">
                    Participants (5)
                  </h5>
                  <div className="flex flex-col items-center mt-2 text-2xl text-white">
                    {[1, 2, 3, 4, 5].map((item, key) => (
                      <div
                        className="flex items-center justify-between w-full text-sm py-3 border-t border-[#999]"
                        key={key}
                      >
                        <p className="">
                          A8rgsJecHutEamvb7e8p1a14LQH3vGRPr796CDaESMeu
                        </p>
                        <p>10</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className=" bg-[#18262d] p-6 rounded-2xl mt-4">
                  <h5 className="text-xl font-bold text-white">
                    Terms & Conditions
                  </h5>
                  <ul className="pl-6 text-sm text-[#ddd] list-decimal flex flex-col gap-2 mt-2">
                    <li>Here&#39;s a guide to buy into raffles.</li>
                    <li>
                      All NFT prizes are held by rafffle in escrow and can be
                      claimed by the winner or creator once the draw is done.
                    </li>
                    <li>Raffle tickets cannot be refunded once bought.</li>
                    <li>
                      Raffle tickets will not be refunded if you did not win the
                      raffle.
                    </li>
                    <li>You can only buy 20% of total tickets.</li>
                    <li>
                      You&#39;ll be charged 1% fees for swapping through
                      Jupiter.
                    </li>
                    <li>
                      FFF receives a portion of the fees generated for anyone
                      utilizing the Raven services through our website.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default RaffleDetail;
