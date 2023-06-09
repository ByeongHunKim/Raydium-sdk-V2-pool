import fetch from 'isomorphic-fetch';
import {
    jsonInfo2PoolKeys,
    LiquidityPoolKeysV4,
} from "@raydium-io/raydium-sdk";

import {
    TEST1_TEST2_LP_V4_POOL_KEY,
    RAYDIUM_LIQUIDITY_JSON, SOLANA_RPC,
} from '../constant';


import { getTokenAccountsByOwner, calcAmountOut } from '../utils/utils';
import {Connection} from "@solana/web3.js";
const getPoolInfo = async () => {

    const connection = new Connection(SOLANA_RPC);
    const liquidityJsonResp = await fetch(RAYDIUM_LIQUIDITY_JSON);
    if (!(await liquidityJsonResp).ok) return []
    const liquidityJson = await liquidityJsonResp.json();
    const allPoolKeysJson = [...(liquidityJson?.official ?? []), ...(liquidityJson?.unOfficial ?? [])]
    const poolKeysJson: LiquidityPoolKeysV4 = allPoolKeysJson.filter((item) => item.lpMint === TEST1_TEST2_LP_V4_POOL_KEY)?.[0] || null;
    console.log(poolKeysJson)
    const tokenPk = jsonInfo2PoolKeys(poolKeysJson);
    console.log('4 tokenPk', tokenPk)
    const { executionPrice } = await calcAmountOut(connection, tokenPk, 1, true);
    const rate = executionPrice?.toFixed() || '0';
    console.log('5. rate', rate)
}
getPoolInfo()