import algosdk from 'algosdk'
import {Mutex} from "async-mutex";

const fetchMutex = new Mutex();

export const baseServer = 'https://xna-mainnet-api.algonode.cloud'
export const port = 443
export const token = ''

export const algod = new algosdk.Algodv2(
    token,
    baseServer,
    port
)


export function getAccountInformation(address: string) {
    return algod.accountInformation(address).do()
}

// export const algod = new algosdk.Algodv2(
//     'e707e234bcb9f575ab3685718d84631019e73044372b3abeb5efb81bd787ea5e',
//     'http://192.168.101.24',
//       8080
// )

//
// Computes a transaction id from a transaction in a block.
//
export function computeTransactionId(stib: any) {
    const t = stib.txn as algosdk.EncodedTransaction;

    const stxn = {
        txn: algosdk.Transaction.from_obj_for_encoding(t),
    } as algosdk.SignedTransaction;

    if ("sig" in stib) {
        stxn.sig = stib.sig;
    }

    if ("lsig" in stib) {
        stxn.lsig = stib.lsig;
    }

    if ("msig" in stib) {
        stxn.msig = stib.msig;
    }

    if ("sgnr" in stib) {
        stxn.sgnr = stib.sgnr;
    }

    return stxn.txn.txID();
}
