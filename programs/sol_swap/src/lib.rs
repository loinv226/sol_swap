mod context;
mod errors;

use anchor_lang::prelude::*;
use anchor_spl::token::{self, spl_token::instruction::AuthorityType};
use context::*;
use errors::*;

declare_id!("8LRf1eAHEYiEStG1qGSdkFTDMpvhP6FZEBiSoDGLzYVk");

#[program]
pub mod sol_swap {

    use super::*;
    const AUTHORITY_SEED: &[u8] = b"authority";
    const SWAP_RATE: u64 = 10;

    pub fn initialize(ctx: Context<Initialize>, deposit_amount: u64) -> Result<()> {
        let (pool_authority, _) = Pubkey::find_program_address(&[AUTHORITY_SEED], ctx.program_id);

        token::set_authority(
            ctx.accounts.set_authority_context(),
            AuthorityType::AccountOwner,
            Some(pool_authority),
        )?;
        token::transfer(ctx.accounts.transfer_to_pool_context(), deposit_amount)?;

        Ok(())
    }

    pub fn swap(ctx: Context<Swap>, lamport_amount: u64) -> Result<()> {
        let receive_token_amount =
            lamport_amount * SWAP_RATE * 10_u64.pow(ctx.accounts.mint.decimals.into())
                / 10_u64.pow(9);
        // check balance of pool
        require!(
            ctx.accounts.pool_token_account.amount >= receive_token_amount,
            SwapError::PoolNotEnoughBalance
        );
        let from = ctx.accounts.from.to_account_info();
        require!(
            **from.try_borrow_mut_lamports()? >= lamport_amount,
            SwapError::NotEnoughBalance
        );
        // send lamport to pool
        let to = ctx.accounts.pool_token_account.to_account_info();
        **from.try_borrow_mut_lamports()? -= lamport_amount;
        **to.try_borrow_mut_lamports()? += lamport_amount;

        // send token to user
        let (_, pool_authority_bump) =
            Pubkey::find_program_address(&[AUTHORITY_SEED], ctx.program_id);
        let authority_seeds = &[&AUTHORITY_SEED[..], &[pool_authority_bump]];

        token::transfer(
            ctx.accounts
                .transfer_to_taker_context()
                .with_signer(&[&authority_seeds[..]]),
            receive_token_amount,
        )?;

        Ok(())
    }
}
