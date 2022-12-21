import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNotify } from "../../../hooks/use_notify";
import { useStores } from "../../../stores";
import { KMath } from "../../../utils/math.helper";
import { formatNumber } from "../../../utils/number.utils";
import getProgram from "../../../utils/swap_program";
import { PublicKey } from "@solana/web3.js";
import {
  getAccount,
  TokenAccountNotFoundError,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorError } from "@project-serum/anchor";
import getOrCreateAssociatedTokenAccount from "../../../utils/swap_program/util";

const SWAP_RATE = 10;

export default function useSwap() {
  const wallet = useWallet();

  const _form = useForm();

  const amount: string = useWatch({ control: _form.control, name: "from" });
  const receiveAmount = useMemo(() => {
    return formatNumber(KMath.mul(amount, SWAP_RATE).toNumber());
  }, [amount]);
  const { userStore } = useStores();
  const { handleError, handleAnchorError, warning, success } = useNotify();

  async function swap() {
    if (!process.env.NEXT_PUBLIC_MOVE_TOKEN_ADDRESS) {
      console.error("NEXT_PUBLIC_MOVE_TOKEN_ADDRESS not set");
      return;
    }
    if (!wallet || !wallet.connected || !wallet.publicKey) {
      console.log("wallet not connected");
      return;
    }
    try {
      const { program, provider } = await getProgram(wallet as any);

      // seeds
      const poolSeed = "pool";
      const authoritySeed = "authority";
      const poolKey = PublicKey.findProgramAddressSync(
        [Buffer.from(anchor.utils.bytes.utf8.encode(poolSeed))],
        program.programId
      )[0];
      const poolAuthorityKey = PublicKey.findProgramAddressSync(
        [Buffer.from(anchor.utils.bytes.utf8.encode(authoritySeed))],
        program.programId
      )[0]; // pda acc, authority of pool

      let receiveTokenAccount = (
        await getOrCreateAssociatedTokenAccount(
          provider.connection,
          wallet.publicKey,
          new PublicKey(process.env.NEXT_PUBLIC_MOVE_TOKEN_ADDRESS),
          wallet.publicKey,
          wallet
        )
      ).address;
      console.log("receiveTokenAccount: ", receiveTokenAccount);

      await program.methods
        .swap(new anchor.BN(KMath.mul(amount, 1e9).toNumber()))
        .accounts({
          from: wallet.publicKey!,
          mint: process.env.NEXT_PUBLIC_MOVE_TOKEN_ADDRESS,
          poolAuthority: poolAuthorityKey,
          poolTokenAccount: poolKey,
          receiveTokenAccount,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        // .signers([wallet as any])
        .rpc();

      console.log("swap done");
      let receiveTokenAccountRes = await getAccount(
        provider.connection,
        receiveTokenAccount
      );
      const currentBalance = Number(receiveTokenAccountRes.amount);
      if (currentBalance >= 0) {
        console.log(
          `Swap success to ${receiveTokenAccount}. Token balance: ${currentBalance}`
        );
        success(
          `Swap success to ${receiveTokenAccount}. Your balance: ${currentBalance}`
        );
      } else {
        console.error("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      if (err instanceof AnchorError) {
        handleAnchorError(err);
        return;
      }
      if (err instanceof TokenAccountNotFoundError) {
        warning("Can't create token account");
        return;
      }

      handleError(err);
    }
  }

  return {
    swap,
    userStore,
    wallet,
    receiveAmount,
    _form,
  };
}
