import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNotify } from "../../../hooks/use_notify";
import { useStores } from "../../../stores";
import { KMath } from "../../../utils/math.helper";
import { formatNumber } from "../../../utils/number.utils";
import getProgram from "../../../utils/swap_program";
import { PublicKey } from "@solana/web3.js";
import {
  getAccount,
  getOrCreateAssociatedTokenAccount,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { AnchorError } from "@project-serum/anchor";

const SWAP_RATE = 10;

export default function useSwap() {
  const wallet = useWallet();

  const _form = useForm();

  const amount: string = useWatch({ control: _form.control, name: "from" });
  const receiveAmount = useMemo(() => {
    return formatNumber(KMath.mul(amount, SWAP_RATE).toNumber());
  }, [amount]);
  const { userStore } = useStores();
  // const [submitting, setSubmitting] = useState(false);
  const { handleError, handleAnchorError, warning } = useNotify();

  //   const solInput = useInput();

  useEffect(() => {
    // if (!userStore.isLogedIn) {
    //   Router.push("/login");
    //   return;
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function swap() {
    if (!process.env.NEXT_PUBLIC_MOVE_TOKEN_ADDRESS) {
      console.error("NEXT_PUBLIC_MOVE_TOKEN_ADDRESS not set");
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

      const receiveTokenAccount = (
        await getOrCreateAssociatedTokenAccount(
          provider.connection,
          provider.wallet as any,
          new PublicKey(process.env.NEXT_PUBLIC_MOVE_TOKEN_ADDRESS),
          provider.wallet.publicKey
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
      } else {
        console.error("Something went wrong!");
      }
    } catch (err) {
      console.error(err);
      if (err instanceof AnchorError) {
        handleAnchorError(err);
        return;
      }
      handleError(err);
    }
    //  finally {
    //   setLoading(false);
    // }
  }

  //   async function fetchManga() {
  //     try {
  //       if (!isNaN(mangaId) && mangaId > 0) {
  //         // fetch manga if need
  //         if (!mangaStore.uploadingManga) {
  //           let result = await mangaStore.fetchManga(mangaId);
  //           if (!!result) {
  //             mangaStore.cacheMangaEdited(result);
  //           }
  //         }
  //         // if (mangaStore.uploadingManga) {
  //         //   fillDetail(mangaStore.uploadingManga);
  //         // }
  //       }
  //     } catch (err) {
  //       console.log("ERR_FETCH_DETAIL: ", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   async function upload(data: any) {
  //     if (isNaN(mangaId)) {
  //       console.warn("Manga id not found in query");
  //       return;
  //     }

  //     if (!iconInput.value || iconInput.value.length === 0) {
  //       warning("Please upload icon!");
  //       return;
  //     }
  //     // let _result = await imageSize(iconInput.previews[0].url);
  //     // if (_result.width !== 206 && _result.height !== 206) {
  //     //   warning(
  //     //     "Icon size must be 206x206. Only JPG, JPEG, and PNG formats are allowed."
  //     //   );
  //     //   return;
  //     // }

  //     if (!squareThumbInput.value || squareThumbInput.value.length === 0) {
  //       warning("Please upload square thumbnail!");
  //       return;
  //     }
  //     // _result = await imageSize(squareThumbInput.previews[0].url);
  //     // if (_result.width !== 306 && _result.height !== 306) {
  //     //   warning(
  //     //     "Square thumbnail size must be 306x306, image must be less than 500KB. Only JPG, JPEG, and PNG formats are allowed."
  //     //   );
  //     //   return;
  //     // }

  //     // if (!verticalThumbInput.value || verticalThumbInput.value.length === 0) {
  //     //   warning("Please upload vertical thumbnail!");
  //     //   return;
  //     // }
  //     // _result = await imageSize(verticalThumbInput.previews[0].url);
  //     // if (_result.width !== 345 && _result.height !== 210) {
  //     //   warning(
  //     //     "Vertical thumbnail size must be 345x210, image must be less than 500KB. Only JPG, JPEG, and PNG formats are allowed."
  //     //   );
  //     //   return;
  //     // }

  //     try {
  //       await mangaStore.createToken({
  //         manga_id: mangaId,
  //         name: data["name"],
  //         symbol: data["symbol"],
  //         description: data["description"],
  //         decimal_place: parseInt(data["decimal"]),
  //         total_supply: data["total_supply"],
  //         usd_rate: parseFloat(data["usd_rate"]),
  //         profit_sharing: parseFloat(data["profit_sharing"]),
  //         opening_time: new Date(data["open_time"]).toISOString(),
  //         icon: iconInput.value[0],
  //         square_thumbnail: squareThumbInput.value[0],
  //         regtangular_thumbnail:
  //           verticalThumbInput.value != null &&
  //           verticalThumbInput.value.length > 0
  //             ? verticalThumbInput.value[0]
  //             : null,
  //       });
  //       Router.push(`/dashboard`);
  //     } catch (err: any) {
  //       handleError(err);
  //     } finally {
  //       setSubmitting(false);
  //     }
  //   }

  return {
    // loading,
    swap,
    // submitting,
    userStore,
    wallet,
    receiveAmount,
    _form,
  };
}
