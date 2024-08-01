import { create } from 'zustand'

export type TransactionType = 'pay' | 'axfer' | 'acfg'  | 'afrz' | 'appl' | 'stpf' | 'keyreg'

export type PendingTxn = {
    id: string
    round: number
    status: string,
    heartbeat?: number
    startedAt?: number
    finishedAt?: number
    confirmed?: number
    failed?: string
    type?: TransactionType
}

type TxnLookup = {
    [k: string]: PendingTxn
}

const BLOCK_MEMORY = 40;

type StoreState = {
    dictionary: TxnLookup
    round: number
    setRound: (round: number) => void
    updateTransaction: (txn: PendingTxn) => void
}
export const useStore = create<StoreState>((set) => ({
    dictionary: {},
    round: 0,
    setRound: (round: number) => {
        console.log('Set Round')
        set((state)=>{
            return {...state, round}
        })
    },
    updateTransaction: (txn: PendingTxn) => {
        set((state) => {
            state.dictionary[txn.id] = {...state.dictionary[txn.id], ...txn}
            return {...state}
        })
    }
}))

let interval;
if(typeof interval === 'undefined'){
    interval = setInterval(async () => {
        const state = useStore.getState()
        const {dictionary, round} = state
        Object.keys(dictionary).forEach(async (k) => {
          const txn = dictionary[k]
          if(txn.round < round - BLOCK_MEMORY){
            delete dictionary[k]
          }
        })
        useStore.setState(state)
    }, 2000)
}
