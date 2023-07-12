import { Program,  web3 } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import {
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
} from '@solana/web3.js';
import fs from 'fs';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

import { RafflePool } from './types';
import { IDL as RaffleIDL } from "../target/types/raffle";
import { TOKEN_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token';
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';

const GLOBAL_AUTHORITY_SEED = "global-authority";

const PROGRAM_ID = "HYpCYwetRSXdjVuvbZi9g4mTz2Ng2XSrdcPx1fpwHnto";
const APE_TOKEN_MINT = new PublicKey("AsACVnuMa5jpmfp3BjArmb2qWg5A6HBkuXePwT37RrLY");
const ADMIN_WALLET = new PublicKey("AsACVnuMa5jpmfp3BjArmb2qWg5A6HBkuXePwT37RrLY");
const RAFFLE_SIZE = 32936;
const DECIMALS = 1000000000;
const APE_DECIMALS = 1000000000;



// Set the initial program and provider
let program: Program = null;
let provider: anchor.Provider = null;

// Address of the deployed program.
let programId = new anchor.web3.PublicKey(PROGRAM_ID);

anchor.setProvider(anchor.AnchorProvider.local(web3.clusterApiUrl("devnet")));
provider = anchor.getProvider();

let solConnection = anchor.getProvider().connection;

// Generate the program client from IDL.
program = new anchor.Program(RaffleIDL as anchor.Idl, programId);
console.log('ProgramId: ', program.programId.toBase58());


const main = async () => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );
    console.log('GlobalAuthority: ', globalAuthority.toBase58());

    console.log(provider.publicKey.toBase58());
    try {
        // const key = await getRaffleKey(new PublicKey("HYX4tS54K7d5SEtTRvwsFD5h8EamtiQqdfewX8ixQeDa"));
        // const poolInfo = await getStateByKey(key);
        // console.log(await getAllData());
        // await updateRafflePeriod(provider.publicKey, new PublicKey("6jQaq4t97KjghTcfZWMXZoimNNCtSGikeaTtCktDm5aK"), 1689099000)
        // console.log(poolInfo.whitelisted.toNumber())
        // console.log(await getStateByKey(key));
        // await initProject();
        // await createRaffle(new PublicKey("HYX4tS54K7d5SEtTRvwsFD5h8EamtiQqdfewX8ixQeDa"), 0.1, 0, 1688973200, 100)
        await buyTicket(new PublicKey("AUsoMM58XTRMxeoUAfSy28gyJdA1ErLSMdFP5KQD7Ydz"), 2)
        // console.log(await getDataFromSignature('2FHN7zfuFPzTByeH9FVnnAc393AtipiuVwQfSXxyKSGvsCq1KjtqZBnw55fN6fPDvrxRr6xW1DHb4XSBpfAEyzpv'));
        // await withdrawNft(new PublicKey("BMMSTccRXEwJXs8eeKjgVHgMZRtP9oR7rUQGwuXeAHi8"))
        // await revealWinner(new PublicKey("HYX4tS54K7d5SEtTRvwsFD5h8EamtiQqdfewX8ixQeDa"));
        // await claimReward(new PublicKey("HYX4tS54K7d5SEtTRvwsFD5h8EamtiQqdfewX8ixQeDa"));
    } catch (e) {
        console.log(e);
    }
};

export const setClusterConfig = async (cluster: web3.Cluster, keypair: string, rpc?: string) => {
    if (!rpc) {
        solConnection = new web3.Connection(web3.clusterApiUrl(cluster));
    } else {
        solConnection = new web3.Connection(rpc);
    }

    const walletKeypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(fs.readFileSync(keypair, 'utf-8'))), { skipValidation: true });
    const wallet = new NodeWallet(walletKeypair);

    // Configure the client to use the local cluster.
    anchor.setProvider(new anchor.AnchorProvider(solConnection, wallet, { skipPreflight: true, commitment: 'confirmed' }));

    console.log('Wallet Address: ', wallet.publicKey.toBase58());

    // Generate the program client from IDL.
    program = new anchor.Program(RaffleIDL as anchor.Idl, programId);
    console.log('ProgramId: ', program.programId.toBase58());
    
}

export const initProject = async (
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let tx = new Transaction();

    tx.add(program.instruction.initialize(
        {
        accounts: {
            admin: provider.publicKey,
            globalAuthority,
            systemProgram: SystemProgram.programId,
            // rent: SYSVAR_RENT_PUBKEY,
        },
        signers: [],
    }));
   
    const txId = await provider.sendAndConfirm(tx, [], {
        commitment: "confirmed",
    });
    
    console.log("txHash =", txId);

    return true;
}

/**
 * @dev CreateRaffle function
 * @param userAddress The raffle creator's address
 * @param nft_mint The nft_mint address
 * @param ticketPriceSol The ticket price by SOL 
 * @param ticketPriceApe The ticket price by SOLAPE token
 * @param endTimestamp The raffle end timestamp
 * @param max The max entrants of this raffle
 */
export const createRaffle = async (
    nft_mint: PublicKey,
    ticketPriceSol: number,
    ticketPriceApe: number,
    endTimestamp: number,
    max: number
) => {
    const tx = await createRaffleTx(
        provider.publicKey,
        nft_mint,
        ticketPriceSol,
        ticketPriceApe,
        endTimestamp,
        1,
        max
    );
    const txId = await provider.sendAndConfirm(tx, [], {
        commitment: "confirmed",
    });
    
    console.log("txHash =", txId);
}

/**
 * @dev BuyTicket function
 * @param userAddress The use's address
 * @param nft_mint The nft_mint address
 * @param amount The amount of ticket to buy
 */
export const buyTicket = async (
    nft_mint: PublicKey,
    amount: number
) => {
    const tx = await buyTicketTx(
        provider.publicKey,
        nft_mint,
        amount
    );
    const txId = await provider.sendAndConfirm(tx, [], {
        commitment: "confirmed",
    });
    
    console.log("txHash =", txId);  
}

/**
 * @dev RevealWinner function
 * @param nft_mint The nft_mint address
 */
export const revealWinner = async (
    nft_mint: PublicKey,
) => {
    const tx = await revealWinnerTx(
        provider.publicKey,
        nft_mint,
    );
    const txId = await provider.sendAndConfirm(tx, [], {
        commitment: "confirmed",
    });
    
    console.log("txHash =", txId);  
}

/**
 * @dev ClaimReward function
 * @param nft_mint The nft_mint address
 */
export const claimReward = async (
    nft_mint: PublicKey,
) => {
    const tx = await claimRewardTx(
        provider.publicKey,
        nft_mint,
    );
    const txId = await provider.sendAndConfirm(tx, [], {
        commitment: "confirmed",
    });
    
    console.log("txHash =", txId);  
}

/**
 * @dev WithdrawNFT function
 * @param nft_mint The nft_mint address
 */
export const withdrawNft = async (
    nft_mint: PublicKey,
) => {
    const tx = await withdrawNftTx(
        provider.publicKey,
        nft_mint,
    );
    const txId = await provider.sendAndConfirm(tx, [], {
        commitment: "confirmed",
    });
    
    console.log("txHash =", txId);  
}

export const createRaffleTx = async (
    userAddress: PublicKey,
    nft_mint: PublicKey,
    ticketPriceSol: number,
    ticketPriceApe: number,
    endTimestamp: number,
    whitelisted: number,
    max: number
) => {

    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    let ownerNftAccount = await getAssociatedTokenAccount(userAddress, nft_mint);

    let ix0 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        globalAuthority,
        [nft_mint]
    );
    console.log("Dest NFT Account = ", ix0.destinationAccounts[0].toBase58());


    let ix1 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [APE_TOKEN_MINT]
    );

    let raffle;
    let i;

    for (i = 10; i > 0; i--) {
        raffle = await PublicKey.createWithSeed(
            userAddress,
            nft_mint.toBase58().slice(0, i),
            program.programId,
        );
        let state = await getStateByKey(raffle);
        if (state === null) {
            console.log(i);
            break;
        }
    }
    let ix = SystemProgram.createAccountWithSeed({
        fromPubkey: userAddress,
        basePubkey: userAddress,
        seed: nft_mint.toBase58().slice(0, i),
        newAccountPubkey: raffle,
        lamports: await solConnection.getMinimumBalanceForRentExemption(RAFFLE_SIZE),
        space: RAFFLE_SIZE,
        programId: program.programId,
    });
    
    let tx = new Transaction();
    
    tx.add(ix);
    if (ix0.instructions.length > 0) tx.add(...ix0.instructions)
    if (ix1.instructions.length > 0) tx.add(...ix1.instructions)
    tx.add(program.instruction.createRaffle(
        new anchor.BN(ticketPriceApe * APE_DECIMALS),
        new anchor.BN(ticketPriceSol * DECIMALS),
        new anchor.BN(endTimestamp),
        new anchor.BN(whitelisted),
        new anchor.BN(max),
        {
            accounts: {
                admin: userAddress,
                globalAuthority,
                raffle,
                ownerTempNftAccount: ownerNftAccount,
                destNftTokenAccount: ix0.destinationAccounts[0],
                nftMintAddress: nft_mint,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
            instructions: [],
            signers: [],
        }));
   
    
    return tx;
}


/**
 * @dev Update Raffle Period
 * @param userAddress The user's address
 * @param raffleKey The nft_mint address
 * @param endTimestamp The new endtimestamp
 */
export const updateRafflePeriod = async (
    userAddress: PublicKey,
    raffleKey: PublicKey,
    endTimestamp: number
) => {
    const tx = await program.rpc.updateRafflePeriod(
        new anchor.BN(endTimestamp), {
        accounts: {
            admin: userAddress,
            raffle: raffleKey,
        },
        instructions: [],
        signers: [],
    });
    await solConnection.confirmTransaction(tx, "confirmed");

    console.log("txHash =", tx);
}


export const buyTicketTx = async (
    userAddress: PublicKey,
    nft_mint: PublicKey,
    amount: number
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    const raffleKey = await getRaffleKey(nft_mint);
    let raffleState = await getStateByKey(raffleKey);

    const creator = raffleState.creator;
    
    let ix1 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [APE_TOKEN_MINT]
    );
    let ix2 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        creator,
        [APE_TOKEN_MINT]
    );

    

    let tx = new Transaction();
    if (ix1.instructions.length > 0) tx.add(...ix1.instructions);
    if (ix2.instructions.length > 0) tx.add(...ix2.instructions);

    console.log(ix1.destinationAccounts[0].toBase58());
    console.log(ix2.destinationAccounts[0].toBase58());
    tx.add(program.instruction.buyTickets(
        new anchor.BN(amount),
        {
            accounts: {
                buyer: userAddress,
                raffle: raffleKey,
                globalAuthority,
                creator,
                creatorTokenAccount: ix2.destinationAccounts[0],
                userTokenAccount: ix1.destinationAccounts[0],
                tokenProgram: TOKEN_PROGRAM_ID,
                systemProgram: SystemProgram.programId,
            },
            instructions: [],
            signers: [],
        }));
        
    return tx;

}

export const revealWinnerTx = async (
    userAddress: PublicKey,
    nft_mint: PublicKey,
) => {
    const raffleKey = await getRaffleKey(nft_mint);
    let tx = new Transaction();

    tx.add(program.instruction.revealWinner(
        {
            accounts:{
                buyer: userAddress,
                raffle: raffleKey
            },
            instructions: [],
            signers: []
        }
    ));

    return tx;
}

export const claimRewardTx = async (
    userAddress: PublicKey,
    nft_mint: PublicKey,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    const raffleKey = await getRaffleKey(nft_mint);
    const srcNftTokenAccount = await getAssociatedTokenAccount(globalAuthority, nft_mint);

    let ix0 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [nft_mint]
    );
    console.log("Claimer's NFT Account: ", ix0.destinationAccounts[0]);

    let tx = new Transaction();
    if (ix0.instructions.length > 0) tx.add(...ix0.instructions);
    tx.add(program.instruction.claimReward(
        bump,
        {
            accounts: {
                claimer: userAddress,
                globalAuthority,
                raffle: raffleKey,
                claimerNftTokenAccount: ix0.destinationAccounts[0],
                srcNftTokenAccount,
                nftMintAddress: nft_mint,
                tokenProgram: TOKEN_PROGRAM_ID,
            },
            instructions: [],
            signers: [],
        }));

    return tx;

}

export const withdrawNftTx = async (
    userAddress: PublicKey,
    nft_mint: PublicKey,
) => {
    const [globalAuthority, bump] = await PublicKey.findProgramAddress(
        [Buffer.from(GLOBAL_AUTHORITY_SEED)],
        program.programId
    );

    const raffleKey = await getRaffleKey(nft_mint);
    const srcNftTokenAccount = await getAssociatedTokenAccount(globalAuthority, nft_mint);

    let ix0 = await getATokenAccountsNeedCreate(
        solConnection,
        userAddress,
        userAddress,
        [nft_mint]
    );

    let tx = new Transaction();
    if (ix0.instructions.length === 0) {
        tx.add(program.instruction.withdrawNft(
            bump,
            {
                accounts: {
                    claimer: userAddress,
                    globalAuthority,
                    raffle: raffleKey,
                    claimerNftTokenAccount: ix0.destinationAccounts[0],
                    srcNftTokenAccount,
                    nftMintAddress: nft_mint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                signers: [],
            }));
    } else {
        if (ix0.instructions.length > 0) tx.add(...ix0.instructions);
        tx.add(program.instruction.withdrawNft(
            bump,
            {
                accounts: {
                    claimer: userAddress,
                    globalAuthority,
                    raffle: raffleKey,
                    claimerNftTokenAccount: ix0.destinationAccounts[0],
                    srcNftTokenAccount,
                    nftMintAddress: nft_mint,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                instructions: [],
                signers: [],
            }));
    }
    return tx;

}

export const getAllData = async () => {
    let poolAccounts = await solConnection.getProgramAccounts(
        program.programId,
        {
            filters: [
                {
                    dataSize: RAFFLE_SIZE
                },
            ]
        }
    );

    let result = [];
    for (let i = 0; i < poolAccounts.length; i ++) {
        const data = poolAccounts[i].account.data;

        const creator = new PublicKey(data.slice(8, 40));
        const nftMint = new PublicKey(data.slice(40, 72));
        
        let buf = data.slice(72, 80).reverse();
        const count = new anchor.BN(buf).toNumber();

        buf = data.slice(80, 88).reverse();
        const noRepeat = new anchor.BN(buf).toNumber();

        buf = data.slice(88, 96).reverse();
        const maxEntrants = new anchor.BN(buf).toNumber();

        buf = data.slice(96, 104).reverse();
        const startTimestamp = new anchor.BN(buf).toNumber();

        buf = data.slice(104, 112).reverse();
        const endTimestamp = new anchor.BN(buf).toNumber();

        buf = data.slice(112, 120).reverse();
        const ticketPriceApe = new anchor.BN(buf).toNumber();

        buf = data.slice(120, 128).reverse();
        const ticketPriceSol = new anchor.BN(buf).toNumber();

        buf = data.slice(128, 136).reverse();
        const whitelisted = new anchor.BN(buf).toNumber();

        const winner = new PublicKey(data.slice(136, 168)).toBase58();

        let entrants = [];

        for (let j = 0; j < count; j ++) {
            const entrant = new PublicKey(data.slice(168+j*32, 200+j*32));
            entrants.push(entrant.toBase58());
        }

        result.push({
            raffleKey: poolAccounts[i].pubkey.toBase58(),
            creator: creator.toBase58(),
            nftMint: nftMint.toBase58(),
            count: count,
            noRepeat: noRepeat,
            maxEntrants: maxEntrants,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            ticketPriceApe: ticketPriceApe,
            ticketPriceSol: ticketPriceSol,
            whitelisted: whitelisted,
            winner: winner,
            entrants: entrants
        });

    }

    return result;
}




export const getRaffleKey = async (
    nft_mint: PublicKey
): Promise<PublicKey | null> => {
    let poolAccounts = await solConnection.getProgramAccounts(
        program.programId,
        {
            filters: [
                {
                    dataSize: RAFFLE_SIZE
                },
                {
                    memcmp: {
                        "offset": 40,
                        "bytes": nft_mint.toBase58()
                    }
                }
            ]
        }
    );
    if (poolAccounts.length !== 0) {
        let maxId = 0;
        let used = 0;
        for (let i = 0; i < poolAccounts.length; i++) {
            const data = poolAccounts[i].account.data;
            const buf = data.slice(128, 136).reverse();
            if ((new anchor.BN(buf)).toNumber() === 1) {
                maxId = i;
                used = 1;
            }

        }
        let raffleKey: PublicKey = PublicKey.default;

        if (used === 1) raffleKey = poolAccounts[maxId].pubkey;

        console.log(raffleKey.toBase58())
        return raffleKey;
    } else {
        return null;
    }
}
  
export const getStateByKey = async (
    raffleKey: PublicKey
): Promise<RafflePool | null> => {
    try {
        let rentalState = await program.account.rafflePool.fetch(raffleKey);
        return rentalState as unknown as RafflePool;
    } catch {
        return null;
    }
}
const getAssociatedTokenAccount = async (ownerPubkey: PublicKey, mintPk: PublicKey): Promise<PublicKey> => {
    let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
        [
            ownerPubkey.toBuffer(),
            TOKEN_PROGRAM_ID.toBuffer(),
            mintPk.toBuffer(), // mint address
        ],
        ASSOCIATED_TOKEN_PROGRAM_ID
    ))[0];
    return associatedTokenAccountPubkey;
}

export const getATokenAccountsNeedCreate = async (
    connection: anchor.web3.Connection,
    walletAddress: anchor.web3.PublicKey,
    owner: anchor.web3.PublicKey,
    nfts: anchor.web3.PublicKey[],
) => {
    let instructions = [], destinationAccounts = [];
    for (const mint of nfts) {
        const destinationPubkey = await getAssociatedTokenAccount(owner, mint);
        let response = await connection.getAccountInfo(destinationPubkey);
        if (!response) {
            const createATAIx = createAssociatedTokenAccountInstruction(
                destinationPubkey,
                walletAddress,
                owner,
                mint,
            );
            instructions.push(createATAIx);
        }
        destinationAccounts.push(destinationPubkey);
        // if (walletAddress != owner) {
        //     const userAccount = await getAssociatedTokenAccount(walletAddress, mint);
        //     response = await connection.getAccountInfo(userAccount);
        //     if (!response) {
        //         const createATAIx = createAssociatedTokenAccountInstruction(
        //             userAccount,
        //             walletAddress,
        //             owner,
        //             mint,
        //         );
        //         instructions.push(createATAIx);
        //     }
        // }
    }
    return {
        instructions,
        destinationAccounts,
    };
}

export const createAssociatedTokenAccountInstruction = (
    associatedTokenAddress: anchor.web3.PublicKey,
    payer: anchor.web3.PublicKey,
    walletAddress: anchor.web3.PublicKey,
    splTokenMintAddress: anchor.web3.PublicKey
) => {
    const keys = [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: associatedTokenAddress, isSigner: false, isWritable: true },
        { pubkey: walletAddress, isSigner: false, isWritable: false },
        { pubkey: splTokenMintAddress, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        {
            pubkey: anchor.web3.SYSVAR_RENT_PUBKEY,
            isSigner: false,
            isWritable: false,
        },
    ];
    return new anchor.web3.TransactionInstruction({
        keys,
        programId: ASSOCIATED_TOKEN_PROGRAM_ID,
        data: Buffer.from([]),
    });
}

main();