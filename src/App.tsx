import {useState} from 'react'
import algosdk from "algosdk";
import {PendingTxnCell} from "./components/PendingTxnCell.tsx";
import {useStore} from "./store.ts";
import {AppBar, Container, Grid, Toolbar, Typography} from "@mui/material";
import { ConnectWallet } from './components/ConnectWallet.tsx';
import {useHeartbeat} from "./hooks/useHeartbeat.ts";
import {useMempool} from "./hooks/useMempool.ts";
import {algod as testingAlgod} from './api.ts'
function App() {
    const [algod] = useState<algosdk.Algodv2 | null>(testingAlgod)
    const txnDict = useStore((state) => state.dictionary)
    const heartbeat = useHeartbeat(algod)
    useMempool(algod, heartbeat)

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Algorand Mempool
                    </Typography>
                    <ConnectWallet/>
                </Toolbar>
            </AppBar>
            <Container>
            <Grid container spacing={4} justifyContent="center">
            {Object.keys(txnDict).reduce((resultArray, item, index)=>{
                const chunkIndex = Math.floor(index/6)

                if(!resultArray[chunkIndex]) {
                    resultArray[chunkIndex] = [] // start a new chunk
                }

                resultArray[chunkIndex].push(item)

                return resultArray
            }, [] as Record<string, any>[]).map((chunk)=>{
                return (
                    <>
                        {chunk.map((k: string) => {
                            const {id, round: dictRound, status} = txnDict[k]
                            return (
                                <Grid item key={id}>
                                <PendingTxnCell
                                    key={`${id}-cell`}
                                    id={id}
                                    round={dictRound}
                                    status={status}
                                    heartbeat={heartbeat}
                                    startedAt={txnDict[k].startedAt}
                                    finishedAt={txnDict[k].finishedAt}
                                    confirmed={txnDict[k].confirmed}
                                    type={txnDict[k].type}
                                    failed={txnDict[k].failed}
                                />
                                </Grid>
                            )
                        })}
                    </>
                )
            })}
            </Grid>
            </Container>
        </>
    )
}

export default App
