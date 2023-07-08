import { NextPage } from "next";
import Header from "../components/Header";
import Head from "next/head";
import { RAFFLES } from "../utils/demo";
import RaffleCard from "../components/RaffleCard";

const CreatePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create | KIZ Raffle</title>
        <meta name="description" content="Solan NFT Raffle Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-[#0b1418] min-h-screen">
        <Header />

        <div className="py-[140px] max-w-[1536px] mx-auto px-6">
          <h1 className="text-3xl text-white font-bold my-2">
            Create New Raffle
          </h1>
          <p className="text-sm text-[#ddd] my-2">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis at
            tellus quis ex pretium semper sed vitae risus. Nulla aliquet
            pulvinar mattis. Donec ac mauris sem.
          </p>
          <div className="flex flex-wrap">
            {RAFFLES.map((item, key) => (
              <RaffleCard raffle={item} className="" key={key} isNew />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default CreatePage;
