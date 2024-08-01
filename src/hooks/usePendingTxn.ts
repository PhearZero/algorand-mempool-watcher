import {useEffect, useState} from "react";
import {PendingTxn, useStore} from "../store.ts";
import {useQuery} from "@tanstack/react-query";
import {baseServer, port, token} from "../api.ts";
import {Mutex, Semaphore} from "async-mutex";

const fetchMutex = new Mutex();
const fetchSemaphore = new Semaphore(5);

export function fetchPendingTransactionInformation(txId: string, signal: AbortSignal) {
    return fetchSemaphore.runExclusive(async () =>  {
        const url = `${baseServer}:${port}/v2/transactions/pending/${txId}`
        const response = await fetch(url, {signal, headers: { 'X-Algo-API-Token': token }})
        return response.json()
    })

}
export function fetchPendingTransactionInformationSync(txId: string, signal: AbortSignal) {
    return fetchMutex.runExclusive(async () =>  {
        const url = `${baseServer}:${port}/v2/transactions/pending/${txId}`
        const response = await fetch(url, {signal, headers: { 'X-Algo-API-Token': token }})
        return response.json()
    })

}

/**
 * This hook is used to monitor the status of a pending transaction.
 * It will automatically update the transaction status in the store when the transaction is confirmed or fails.
 *
 * @param txn - The transaction to monitor
 * @param heartbeat - A value that changes when the transaction should be checked again
 * @param ratelimit - If true, the hook will use a Mutex. Otherwise, it will use a Semaphore
 */
export function usePendingTxn(txn: PendingTxn, heartbeat: number, ratelimit = true){
    const {id, round} = txn

    const [enabled, setEnabled] = useState(true)
    const updateTransaction = useStore((state) => state.updateTransaction)

    const query = useQuery({
        queryKey: [id],
        queryFn: ({signal})=>ratelimit ?
            fetchPendingTransactionInformationSync(id, signal) :
            fetchPendingTransactionInformation(id, signal),
        enabled
    })

    useEffect(()=>{
        if(enabled) query.refetch()
    }, [heartbeat])

    useEffect(()=>{
        if(!query.data) return
        if (query.data['confirmed-round'] || query.data['pool-error'] !== '') {
            setEnabled(false)
            const extras = query.data['confirmed-round'] !== undefined ? {finishedAt: Date.now(), confirmed: query.data['confirmed-round']} : {failed: query.data['pool-error']}
            updateTransaction({id, round, status: query.data['confirmed-round'] ? 'confirmed' : 'failed', ...extras})
        }
    }, [id, round, query.data, updateTransaction])
}
