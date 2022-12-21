require("dotenv").config();
import {
  PublicKey,
  SystemProgram,
  Transaction,
  Commitment,
} from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  mintTo,
  getAccount,
  getOrCreateAssociatedTokenAccount,
} from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";
import swapProgram, { provider } from "./swap_program";
import * as bs58 from "bs58";
import { KMath } from "./math.helper";

// const provider = anchor.AnchorProvider.env();
// process.env.ANCHOR_PROVIDER_URL = ""

const swapRate = 10; // 1 sol - 10 token
const tokenDecimal = 0;

const tokenDepositAmount = 10000 * Math.pow(10, tokenDecimal);
const swapLamportAmount = KMath.mul(
  process.env.SWAP_SOL_AMOUNT ?? "0.1",
  1e9
).toNumber();

const takerAirdropAmount = swapLamportAmount + 10_000_000;
const expectReceiveTokenAmount = KMath.mul(swapRate, swapLamportAmount)
  .multipliedBy(Math.pow(10, tokenDecimal))
  .div(1e9)
  .toNumber();
// accounts
const payer =
  process.env.PAYER_WALLET_PRIVATE_KEY?.length > 0
    ? anchor.web3.Keypair.fromSecretKey(
        bs58.decode(process.env.PAYER_WALLET_PRIVATE_KEY)
      )
    : anchor.web3.Keypair.generate();
const initializer =
  process.env.INITIALIZER_POOL_WALLET_PRIVATE_KEY?.length > 0
    ? anchor.web3.Keypair.fromSecretKey(
        bs58.decode(process.env.INITIALIZER_POOL_WALLET_PRIVATE_KEY)
      )
    : anchor.web3.Keypair.generate(); //initializer pool

const taker =
  process.env.TAKER_WALLET_PRIVATE_KEY?.length > 0
    ? anchor.web3.Keypair.fromSecretKey(
        bs58.decode(process.env.TAKER_WALLET_PRIVATE_KEY)
      )
    : anchor.web3.Keypair.generate(); // only init when env not set
const mintAuthority = anchor.web3.Keypair.generate();

let moveToken =
  process.env.MOVE_TOKEN_ADDRESS?.length > 0
    ? new PublicKey(process.env.MOVE_TOKEN_ADDRESS)
    : null;
let depositTokenAccount = null as PublicKey;
let receiveTokenAccount = null as PublicKey;

// seeds
const poolSeed = "pool";
const authoritySeed = "authority";

// pda account
const poolKey = PublicKey.findProgramAddressSync(
  [Buffer.from(anchor.utils.bytes.utf8.encode(poolSeed))],
  swapProgram.programId
)[0];
const poolAuthorityKey = PublicKey.findProgramAddressSync(
  [Buffer.from(anchor.utils.bytes.utf8.encode(authoritySeed))],
  swapProgram.programId
)[0]; // pda acc, authority of pool

const commitment: Commitment = "confirmed";
const isInited = process.env.MOVE_TOKEN_ADDRESS?.length > 0;

// call by initializer to init pool
async function init() {
  if (isInited) {
    await prepare();
    return;
  }

  const payerBalance = await provider.connection.getBalance(payer.publicKey);
  console.log("payerBalance: ", payerBalance / 1e9);
  if (payerBalance / 1e9 < 1) {
    console.log("Airdrop 1 sol to payer");
    const signature = await provider.connection.requestAirdrop(
      payer.publicKey,
      1000_000_000
    );
    const latestBlockhash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction(
      {
        signature,
        ...latestBlockhash,
      },
      commitment
    );
  }

  // fund initializer + taker
  const fundingTx = new Transaction();
  fundingTx.add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: initializer.publicKey,
      lamports: 100_000_000,
    }),
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: taker.publicKey,
      lamports: takerAirdropAmount,
    })
  );
  await provider.sendAndConfirm(fundingTx, [payer]);

  // create MOVE token
  console.log("Create move token");
  moveToken =
    process.env.MOVE_TOKEN_ADDRESS?.length > 0
      ? new PublicKey(process.env.MOVE_TOKEN_ADDRESS)
      : await createMint(
          provider.connection,
          payer,
          mintAuthority.publicKey,
          null,
          0
        );
  console.log("Created move token: ", moveToken);

  // create token account for taker
  console.log("Create receive token account");
  receiveTokenAccount =
    process.env.SWAP_RECEIVE_TOKEN_ACCOUNT?.length > 0
      ? new PublicKey(process.env.SWAP_RECEIVE_TOKEN_ACCOUNT)
      : (
          await getOrCreateAssociatedTokenAccount(
            provider.connection,
            taker,
            moveToken,
            taker.publicKey
          )
        ).address;

  // create token accounts for init pool
  console.log("Create deposit token account");
  depositTokenAccount = await createAccount(
    provider.connection,
    initializer,
    moveToken,
    initializer.publicKey
  );

  // mint token to initializer to init pool, may be minto Pool token account
  await mintTo(
    provider.connection,
    initializer,
    moveToken,
    depositTokenAccount,
    mintAuthority,
    tokenDepositAmount
  );

  const accountRes = await getAccount(provider.connection, depositTokenAccount);
  if (Number(accountRes.amount) < tokenDepositAmount) {
    throw Error("Mint to deposit token account error");
  }
  // init swap pool
  console.log("Init swap pool");
  await swapProgram.methods
    .initialize(new anchor.BN(tokenDepositAmount))
    .accounts({
      initializer: initializer.publicKey,
      poolTokenAccount: poolKey,
      mint: moveToken,
      depositTokenAccount,
      systemProgram: anchor.web3.SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
    })
    .signers([initializer])
    .rpc();
}

async function prepare() {
  console.log("moveToken: ", moveToken.toString());
  receiveTokenAccount =
    process.env.SWAP_RECEIVE_TOKEN_ACCOUNT?.length > 0
      ? new PublicKey(process.env.SWAP_RECEIVE_TOKEN_ACCOUNT)
      : (
          await getOrCreateAssociatedTokenAccount(
            provider.connection,
            taker,
            moveToken,
            taker.publicKey
          )
        ).address;
  // console.log("receiveTokenAccount: ", receiveTokenAccount);
  // const receiveTokenAccountRes = await getAccount(
  //   provider.connection,
  //   receiveTokenAccount
  // );
  // console.log("receiveTokenAccountRes: ", receiveTokenAccountRes.amount);

  const poolTokenAccountRes = await getAccount(provider.connection, poolKey);
  console.log("Pool token amount: ", poolTokenAccountRes.amount);

  let balance = await provider.connection.getBalance(taker.publicKey);
  console.log(`taker balance: ${taker.publicKey}-${balance / 1e9}`);
  if (balance < takerAirdropAmount) {
    console.log(`Airdrop for taker with amount ${takerAirdropAmount}`);
    const signature = await provider.connection.requestAirdrop(
      taker.publicKey,
      takerAirdropAmount
    );
    const latestBlockhash = await provider.connection.getLatestBlockhash();
    await provider.connection.confirmTransaction(
      {
        signature,
        ...latestBlockhash,
      },
      commitment
    );
  }
}

async function swap() {
  console.log("swap......");
  await swapProgram.methods
    .swap(new anchor.BN(swapLamportAmount))
    .accounts({
      from: taker.publicKey,
      mint: moveToken,
      poolAuthority: poolAuthorityKey,
      poolTokenAccount: poolKey,
      receiveTokenAccount,
      tokenProgram: TOKEN_PROGRAM_ID,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([taker])
    .rpc();

  let receiveTokenAccountRes = await getAccount(
    provider.connection,
    receiveTokenAccount
  );
  const currentBalance = Number(receiveTokenAccountRes.amount);
  if (currentBalance >= expectReceiveTokenAmount) {
    console.log(
      `Swap success to ${receiveTokenAccount}. Token balance: ${currentBalance}`
    );
  } else {
    console.error("Something went wrong!");
  }
}

async function main() {
  await init();
  // await swap();
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(-1);
  })
  .then(() => process.exit());
