/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { useMemo, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "next/router";
import { RAFFLES, TOKENS } from "../../utils/demo";
import { ArrowDownIcon, VerifiedIcon } from "../../components/SvgIcons";
import Link from "next/link";
import { NextPage } from "next";

const CreateNew: NextPage = () => {
  const router = useRouter();
  const { mint } = router.query;

  const [ticketCount, setTicketCount] = useState(30);
  const [ticketPrice, setTicketPrice] = useState(0);

  const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketCount(e.target.value as unknown as number);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicketPrice(e.target.value as unknown as number);
  };

  const raffleData = useMemo(() => {
    return RAFFLES.find((item) => item.mint === mint);
  }, [mint]);

  const [token, setToken] = useState("SOL");
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
                <div className="bg-[#18262d] p-6 rounded-2xl mt-4">
                  <div className="flex flex-row flex-wrap gap-2">
                    <div className="flex flex-col w-[calc(50%-4px)]">
                      <label className="text-[#ccc] uppercase text-sm ">
                        Ticket count
                      </label>
                      <input
                        value={ticketCount}
                        onChange={handleCountChange}
                        type="number"
                        placeholder="Enter the number of tickets"
                        className="px-2 py-1 text-xl text-left mt-2 w-full border border-[#ddd] rounded-lg text-white h-12 bg-[#ffffff20] value-box"
                      />
                    </div>
                    <div className="flex flex-col w-[calc(50%-4px)]">
                      <label className="text-[#ccc] uppercase text-sm ">
                        End Date
                      </label>
                      <input
                        type="datetime-local"
                        className="px-2 py-1 text-sm text-left mt-2 w-full border border-[#ddd] rounded-lg text-white h-12 bg-[#ffffff20] placeholder:text-md value-box"
                      />
                    </div>
                    <div className="flex flex-col w-[calc(50%-4px)] mt-1">
                      <label className="text-[#ccc] uppercase text-sm ">
                        ticket price
                      </label>
                      <input
                        value={ticketPrice}
                        onChange={handlePriceChange}
                        type="number"
                        placeholder="Enter price"
                        className="px-2 py-1 text-xl text-left mt-2 w-full border border-[#ddd] rounded-lg text-white h-12 bg-[#ffffff20] placeholder:text-md value-box"
                      />
                    </div>

                    <div className="flex flex-col w-[calc(50%-4px)] mt-1">
                      <label className="text-[#ccc] uppercase text-sm ">
                        Select token
                      </label>
                      <div className="group px-2 py-1 text-xl text-left mt-2 w-full relative border border-[#ddd] rounded-lg text-white h-12 bg-[#ffffff20]">
                        <div className="relative text-right pr-7 flex items-center justify-end h-full text-[16px] uppercase">
                          {token}
                          <span className="absolute right-0 top-4">
                            <ArrowDownIcon />
                          </span>
                        </div>
                        <div className="group-hover:flex absolute w-full hidden flex-col left-0 top-12 bg-[#354147] rounded-lg overflow-hidden border border-[#ddd]">
                          {TOKENS.map((token, key) => (
                            <button
                              className="text-right border-t border-[#aaa] w-full py-2 px-8 text-[16px] hover:text-purple-300"
                              onClick={() => setToken(token.tokenSymbol)}
                              key={key}
                            >
                              {token.tokenSymbol}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      type="submit"
                      className="bg-white uppercase h-[48px] rounded-full px-10 mt-5 text-lg font-bold hover:bg-[#ddd] transition-all duration-300"
                    >
                      create raffle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default CreateNew;
