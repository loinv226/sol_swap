use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, SetAuthority, Token, TokenAccount, Transfer};

// init and deposit token into pool
#[derive(Accounts)]
#[instruction(deposit_amount: u64)]
pub struct InitializePool<'info> {
    #[account(mut)]
    pub initializer: Signer<'info>,
    pub mint: Account<'info, Mint>,
    #[account(
        init,
        seeds = [b"pool"],
        bump,
        payer = initializer,
        token::mint = mint,
        token::authority = initializer,
    )]
    pub pool_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = deposit_token_account.amount >= deposit_amount
    )]
    pub deposit_token_account: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub from: Signer<'info>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub receive_token_account: Box<Account<'info, TokenAccount>>,
    #[account(mut)]
    pub pool_token_account: Account<'info, TokenAccount>,
    /// CHECK: Only use in transfer authority
    pub pool_authority: AccountInfo<'info>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

impl<'info> InitializePool<'info> {
    pub fn transfer_to_pool_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.deposit_token_account.to_account_info(),
            to: self.pool_token_account.to_account_info(),
            authority: self.initializer.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }

    pub fn set_authority_context(&self) -> CpiContext<'_, '_, '_, 'info, SetAuthority<'info>> {
        let cpi_accounts = SetAuthority {
            account_or_mint: self.pool_token_account.to_account_info(),
            current_authority: self.initializer.to_account_info(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}

impl<'info> Swap<'info> {
    pub fn transfer_to_taker_context(&self) -> CpiContext<'_, '_, '_, 'info, Transfer<'info>> {
        let cpi_accounts = Transfer {
            from: self.pool_token_account.to_account_info(),
            to: self.receive_token_account.to_account_info(),
            authority: self.pool_authority.clone(),
        };
        CpiContext::new(self.token_program.to_account_info(), cpi_accounts)
    }
}
