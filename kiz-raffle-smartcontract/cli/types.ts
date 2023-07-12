import * as anchor from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export interface GlobalPool {
    superAdmin: PublicKey,
}

export interface RafflePool {
    creator: PublicKey,
    nftMint: PublicKey,
    count: anchor.BN,
    noRepeat: anchor.BN,
    maxEntrants: anchor.BN,
    startTimestamp: anchor.BN,
    endTimestamp: anchor.BN,
    ticketPriceApe: anchor.BN,
    ticketPriceSol: anchor.BN,
    whitelisted: anchor.BN,
    winner: PublicKey,
    entrants: PublicKey[],
}