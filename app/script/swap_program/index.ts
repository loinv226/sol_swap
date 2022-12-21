require("dotenv").config();
import * as anchor from "@project-serum/anchor";
import { SolSwap } from "./sol_swap";
import { Connection } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import * as bs58 from "bs58";

const connection = new Connection(
  process.env.RPC_URL ?? "http://127.0.0.1:8899",
  "confirmed"
);

const providerWallet =
  process.env.PAYER_WALLET_PRIVATE_KEY?.length > 0
    ? new anchor.Wallet(
        anchor.web3.Keypair.fromSecretKey(
          bs58.decode(process.env.PAYER_WALLET_PRIVATE_KEY)
        )
      )
    : process.env.TAKER_WALLET_PRIVATE_KEY?.length > 0
    ? new anchor.Wallet(
        anchor.web3.Keypair.fromSecretKey(
          bs58.decode(process.env.TAKER_WALLET_PRIVATE_KEY)
        )
      )
    : new anchor.Wallet(anchor.web3.Keypair.generate());
// console.log("providerWallet: ", providerWallet.publicKey);
export const provider = new anchor.AnchorProvider(connection, providerWallet, {
  commitment: "confirmed",
});
anchor.setProvider(provider);

const swapProgram = anchor.workspace.SolSwap as Program<SolSwap>;
export default swapProgram;
