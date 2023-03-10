import * as anchor from "@project-serum/anchor";
import { IDL } from "./sol_swap";
import { Connection } from "@solana/web3.js";
import { Program } from "@project-serum/anchor";
import idl from "./idl.json";

export default function getProgram(wallet: anchor.Wallet) {
  const provider = getProvider(
    wallet
    // new anchor.Wallet(anchor.web3.Keypair.generate())
  );
  anchor.setProvider(provider);
  // const program = anchor.workspace.SolSwap as Program<SolSwap>;
  const program = new Program(IDL, idl.metadata.address, provider);
  return { program, provider };
}

export function getProvider(wallet: anchor.Wallet) {
  const network = process.env.NEXT_PUBLIC_RPC_URL ?? "http://127.0.0.1:8899";

  const connection = new Connection(network, "processed");
  const provider = new anchor.AnchorProvider(connection, wallet, {
    commitment: "processed",
  });
  return provider;
}
