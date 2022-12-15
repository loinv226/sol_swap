import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolSwap } from "../target/types/sol_swap";

describe("sol_swap", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SolSwap as Program<SolSwap>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
