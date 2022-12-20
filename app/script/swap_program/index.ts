require("dotenv").config();
import * as anchor from "@project-serum/anchor";
import { SolSwap, IDL } from "./sol_swap";
import { Connection, PublicKey } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
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

// export const PROGRAM_ID = new PublicKey(sol_swap.metadata.address);
const swapProgram = anchor.workspace.SolSwap as Program<SolSwap>;
// console.log("swapProgram: ", swapProgram.programId);
export default swapProgram;
// console.log("provider: ", provider.connection.rpcEndpoint);
// export { anchor, provider };

// export async function getProgram() {
//   const network = process.env.RPC_URL ?? "http://127.0.0.1:8899";
//   const provider = await getProvider(network);
//   // const program = new Program(IDL, "", provider);
//   anchor.setProvider(provider);
//   const program = anchor.workspace.SolSwap as Program<SolSwap>;
//   return { program, provider };
// }

// export async function getProvider(networkUrl: string) {
//   const connection = new Connection(networkUrl, "processed");
//   const provider = new anchor.AnchorProvider(
//     connection,
//     new anchor.Wallet(
//       anchor.web3.Keypair.fromSecretKey(
//         new Uint8Array(
//           process.env.SWAP_WALLET_PRIVATE_KEY.split(",").map(Number)
//         )
//       )
//     ),
//     {
//       commitment: "processed",
//     }
//   );
//   return provider;
// }
