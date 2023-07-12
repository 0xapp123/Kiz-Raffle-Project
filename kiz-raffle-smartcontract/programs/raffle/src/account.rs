use anchor_lang::prelude::*;
use std::clone::Clone;

use crate::constants::*;

#[account]
#[derive(Default)]
pub struct GlobalPool {
    pub super_admin: Pubkey, // 32
}

#[account(zero_copy)]
pub struct RafflePool {
    // 8 + 96 + 8*8 + 32*1024= 32936
    pub creator: Pubkey,                    //32
    pub nft_mint: Pubkey,                   //32
    pub count: u64,                         //8
    pub no_repeat: u64,                     //8
    pub max_entrants: u64,                  //8
    pub start_timestamp: i64,               //8
    pub end_timestamp: i64,                 //8
    pub ticket_price_ape: u64,              //8
    pub ticket_price_sol: u64,              //8
    pub whitelisted: u64,                   //8
    pub winner: Pubkey,                     //32
    pub entrants: [Pubkey; MAX_ENTRANTS],   //32*1024
}

impl Default for RafflePool {
    #[inline]
    #[warn(unused_must_use)]
    fn default() -> RafflePool {
        RafflePool {
            creator: Pubkey::default(),
            nft_mint: Pubkey::default(),
            count: 0,
            no_repeat: 0,
            max_entrants: 0,
            start_timestamp: 0,
            end_timestamp: 0,
            ticket_price_ape: 0,
            ticket_price_sol: 0,
            whitelisted: 0,
            winner: Pubkey::default(),
            entrants: [Pubkey::default(); MAX_ENTRANTS],
        }
    }
}
impl RafflePool {
    pub fn append(&mut self, buyer: Pubkey) {
        self.entrants[self.count as usize] = buyer;
        self.count += 1;
    }
}