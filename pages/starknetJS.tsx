import React from "react";
import { SUM_GAME_CONTRACT_ADDRESS } from "src/constants";
import SumGameSNJS from "~/components/SumGameSNJS";

const StarknetReact = () => {

    const contractLink = `https://goerli.voyager.online/contract/${SUM_GAME_CONTRACT_ADDRESS}#readContract`;
    return (
        <div>
            <h1>Using Starknet JS</h1>
            <div>Contract <a target='_blank' href={contractLink}>{SUM_GAME_CONTRACT_ADDRESS}</a></div>
            <h3>Wallet</h3>
            <SumGameSNJS/>
        </div>
    );
}

export default StarknetReact;