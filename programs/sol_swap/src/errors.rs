use anchor_lang::error_code;

#[error_code]
pub enum SwapError {
    #[msg("Pool Not enough balance")]
    PoolNotEnoughBalance,
    #[msg("Not enough balance")]
    NotEnoughBalance,
}
