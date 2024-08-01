import algosdk from 'algosdk'

const algod = new algosdk.Algodv2('','https://xna-mainnet-api.algonode.cloud',443);

const a = algod.status()
const b = await a.do()
