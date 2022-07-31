import React from "react";
import { SUM_GAME_CONTRACT_ADDRESS } from "src/constants";
import { ConnectWallet } from '~/components/ConnectWallet';
import SumGameSNReact from "~/components/SumGameSNReact";
import { TransactionList } from "~/components/TransactionList";

const StarknetReact = () => {

    const contractLink = `https://goerli.voyager.online/contract/${SUM_GAME_CONTRACT_ADDRESS}#readContract`;
    return (
        <div>
            <h1>Using Starknet React</h1>
            <div>Contract <a target='_blank' href={contractLink}>{SUM_GAME_CONTRACT_ADDRESS}</a></div>
            <h3>Wallet</h3>
            <ConnectWallet />
            <SumGameSNReact/>
            <h2>My Transactions</h2>
            <TransactionList/>
        </div>
    );
}

export default StarknetReact;