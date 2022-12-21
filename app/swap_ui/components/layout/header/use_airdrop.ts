import { AnchorError } from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { useNotify } from "../../../hooks/use_notify";
import { getProvider } from "../../../utils/swap_program";

export default function useAirdrop() {
  const wallet = useWallet();
  const { success, handleError, handleAnchorError } = useNotify();
  const [loading, setLoading] = useState(false);

  async function airDrop() {
    if (!wallet.connected || !wallet.publicKey) {
      return;
    }
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      const provider = await getProvider(wallet as any);
      const signature = await provider.connection.requestAirdrop(
        new PublicKey(wallet.publicKey),
        1_000_000_000
      );
      const latestBlockhash = await provider.connection.getLatestBlockhash();
      await provider.connection.confirmTransaction(
        {
          signature,
          ...latestBlockhash,
        },
        "confirmed"
      );
      let balance = await provider.connection.getBalance(
        new PublicKey(wallet.publicKey)
      );
      if (balance > 0) {
        success("Airdrop 1 SOL success");
      }
    } catch (err) {
      console.error(err);
      if (err instanceof AnchorError) {
        handleAnchorError(err);
        return;
      }
      handleError(err);
    } finally {
      setLoading(false);
    }
  }

  return { wallet, airDrop, loading };
}
