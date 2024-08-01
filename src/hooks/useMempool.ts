import {useEffect} from "react";
import {computeTransactionId} from "../api.ts";
import {useStore} from "../store.ts";
import algosdk from "algosdk";

type MemPoolTxn = {txn: {type: string}}
export function useMempool(algod: algosdk.Algodv2 | null, heartbeat: number){
    const updateTransaction = useStore((state) => state.updateTransaction)
    useEffect(() => {
        if(!algod) return
        algod.pendingTransactionsInformation().do().then((res: Record<string, MemPoolTxn[]>)=>{
            const txns = res['top-transactions'];
            if(txns.length !== 0 ){
                txns.forEach((txn: {txn: {type: string}})=>{
                    updateTransaction({
                        id: computeTransactionId(txn),
                        round: heartbeat,
                        status: 'unknown',
                        type: txn.txn.type,
                        startedAt: Date.now(),
                    })
                })
            }
        })
    }, [algod, heartbeat, updateTransaction]);
}
