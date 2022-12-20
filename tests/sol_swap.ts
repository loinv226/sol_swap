import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolSwap } from "../target/types/sol_swap";
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
} from "@solana/spl-token";
import { assert } from "chai";
import { KMath } from "../app/script/math.helper";

describe("sol_swap", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.SolSwap as Program<SolSwap>;

  const swapLamportAmount = KMath.mul(0.1, 1e9).toNumber();
  const swapRate = 10; // 1 sol - 10 token
  const tokenDecimal = 0;
  const expectReceiveTokenAmount = KMath.mul(swapRate, swapLamportAmount)
    .multipliedBy(Math.pow(10, tokenDecimal))
    .div(1e9)
    .toNumber();
  const tokenDepositAmount = 1000 * Math.pow(10, tokenDecimal);
  const takerAirdropAmount = 200_000_000;

  // accounts
  const payer = anchor.web3.Keypair.generate();
  const initializer = anchor.web3.Keypair.generate(); //initializer pool
  const taker = anchor.web3.Keypair.generate();
  const mintAuthority = anchor.web3.Keypair.generate();

  let moveToken = null as PublicKey;
  let depositTokenAccount = null as PublicKey;
  let receiveTokenAccount = null as PublicKey;

  // seeds
  const poolSeed = "pool";
  const authoritySeed = "authority";

  // pda account
  const poolKey = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(poolSeed))],
    program.programId
  )[0];
  const poolAuthorityKey = PublicKey.findProgramAddressSync(
    [Buffer.from(anchor.utils.bytes.utf8.encode(authoritySeed))],
    program.programId
  )[0]; // pda acc, authority of pool

  const commitment: Commitment = "confirmed";

  it("Should initialize program success", async () => {
    // airdrop 1 SOL to payer
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
    moveToken = await createMint(
      provider.connection,
      payer,
      mintAuthority.publicKey,
      null,
      0
    );

    // create token accounts for init pool and swap
    depositTokenAccount = await createAccount(
      provider.connection,
      initializer,
      moveToken,
      initializer.publicKey
    );
    receiveTokenAccount = await createAccount(
      provider.connection,
      taker,
      moveToken,
      taker.publicKey
    );

    // mint token to initializer to init pool
    await mintTo(
      provider.connection,
      initializer,
      moveToken,
      depositTokenAccount,
      mintAuthority,
      tokenDepositAmount
    );

    const accountRes = await getAccount(
      provider.connection,
      depositTokenAccount
    );

    console.log("accountRes.amount: ", accountRes.amount);
    assert.ok(Number(accountRes.amount) == tokenDepositAmount);
  });

  it("Should initialize pool success", async () => {
    await program.methods
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

    let poolRes = await getAccount(provider.connection, poolKey);
    // check match new owner
    assert.ok(poolRes.owner.equals(poolAuthorityKey));
    // check pool amount
    console.log("poolRes.amount: ", poolRes.amount);
    assert.ok(Number(poolRes.amount) == tokenDepositAmount);
    // check deposit token account
    let depositTokenAccountRes = await getAccount(
      provider.connection,
      depositTokenAccount
    );
    assert.ok(Number(depositTokenAccountRes.amount) == 0);
  });

  it("Swap pool", async () => {
    await program.methods
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
    let poolRes = await getAccount(provider.connection, poolKey);

    // check receive token amount
    console.log(
      "receiveTokenAccountRes.amount: ",
      receiveTokenAccountRes.amount
    );
    assert.ok(
      Number(receiveTokenAccountRes.amount) == expectReceiveTokenAmount
    );
    // check pool amount
    assert.ok(
      Number(poolRes.amount) == tokenDepositAmount - expectReceiveTokenAmount
    );
    const takerLamport = await provider.connection.getBalance(
      taker.publicKey,
      "confirmed"
    );
    console.log("takerLamport: ", takerLamport);
    // swap amount + fee
    assert.ok(takerLamport < takerAirdropAmount);
  });
  //Todo: corner case
});
