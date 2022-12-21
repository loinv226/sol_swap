mod context;
mod errors;

use anchor_lang::{
    prelude::*,
    solana_program::{program::invoke, system_instruction},
};
use anchor_spl::token::{self, spl_token::instruction::AuthorityType};
use context::*;
use errors::*;

declare_id!("DJ7sVUp3VnB56PHiKkX8LTM8pUw8ghQ2yziQFbu2mygn");

#[program]
pub mod sol_swap {

    use super::*;

    const AUTHORITY_SEED: &[u8] = b"authority";
    const SWAP_RATE: u64 = 10;

    pub fn initialize(ctx: Context<InitializePool>, deposit_amount: u64) -> Result<()> {
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
        let to = ctx.accounts.pool_token_account.to_account_info();
        // send lamport to pool
        transfer_lamports(&from, &to, lamport_amount)?;

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

fn transfer_lamports<'info>(
    from_account: &AccountInfo<'info>,
    to_my_account: &AccountInfo<'info>,
    amount: u64,
) -> Result<()> {
    if **from_account.try_borrow_lamports()? < amount {
        return err!(SwapError::NotEnoughBalance);
    }
    // debit account to credit account
    // **from_account.lamports.borrow_mut() -= amount;
    // // **from_account.try_borrow_mut_lamports()? -= amount;
    // **to_account.try_borrow_mut_lamports()? += amount;

    // credit account to debit account
    invoke(
        &system_instruction::transfer(from_account.key, to_my_account.key, amount),
        &[from_account.clone(), to_my_account.clone()],
    )?;

    Ok(())
}
