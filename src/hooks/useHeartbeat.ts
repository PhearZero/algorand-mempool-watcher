import {useEffect} from "react";
import algosdk from "algosdk";
import {useStore} from "../store.ts";

/**
 * Watches the blockchain for new blocks and updates the round number.
 *
 * @param algod - The Algodv2 client to use
 */
export function useHeartbeat(algod: algosdk.Algodv2 | null){
    const [round, setRound] = useStore((state) => [state.round, state.setRound])
    // TODO: use Mutex and react-query
    useEffect(() => {
        if(!algod) return
        algod
            .statusAfterBlock(round)
            .do()
            .then((b) => {
                setRound(round === 0 ? b["last-round"] : round + 1)
            });
    }, [algod, round, setRound]);

    return round
}
