import React, { useEffect, useState } from "react";
import { connect, IStarknetWindowObject } from "get-starknet";
import { GET_CURR_NUMBER_ENTRYPOINT, GET_IS_ACTIVE_ENTRYPOINT, GET_LAST_WINNER_ENTRYPOINT, GET_NUM_WINS_ENTRYPOINT, SUM_GAME_CONTRACT_ADDRESS, VERIFY_SUM_ENTRYPOINT } from "src/constants";
import { toBN } from 'starknet/dist/utils/number';

let starknet : IStarknetWindowObject | undefined;

const SumGameSNJS = () => {

    // these are read from the contract
    const [currNumber, setCurrNumber] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(false);
    const [lastWinner, setLastWinner] = useState<string>('');
    const [myWins, setMyWins] = useState<number>(0);

    const [myAnswer, setMyAnswer] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [myTransactions, setMyTransactions] = useState<string[]>([]);
    let readGameStateInterval: any;

    /* Check if a wallet has already been connected */
    useEffect(() => { connectWallet(false) }, []);

    /* Connect a wallet */
    async function connectWallet(showPopup: boolean) {
        starknet = await connect({ showList: showPopup });
        if (starknet) {
            await starknet.enable();
            if (starknet.isConnected)
                setAddress(starknet.account.address);
        }
    }

    /* Interval to read the game state every 10 seconds */
    useEffect(() => {
        if (starknet && !readGameStateInterval) {
            readGameStateInterval = setInterval(readGameState, 10 * 1000);
            readGameState();
        }

        return () => {
            clearInterval(readGameStateInterval);
        };
    }, [starknet]);

    /* Helper function to call a view function in the contract */
    async function callContract(entrypoint: string, calldata?: any[]) {
        return await starknet?.account.callContract({
            contractAddress: SUM_GAME_CONTRACT_ADDRESS,
            entrypoint,
            calldata
        }, { blockIdentifier: 'latest' });
    }

    /* Call the contract to read the current game state */
    async function readGameState() {
        // read the current number
        const currNumResp = await callContract(GET_CURR_NUMBER_ENTRYPOINT);
        if (currNumResp)
            setCurrNumber(parseInt(currNumResp.result[0]).toString());

        // read if the game is active
        const isActiveResp = await callContract(GET_IS_ACTIVE_ENTRYPOINT);
        if (isActiveResp)
            setIsActive(parseInt(isActiveResp.result[0]) !== 0);

        // read the last winner
        const lastWinnerResp = await callContract(GET_LAST_WINNER_ENTRYPOINT);
        if (lastWinnerResp)
            setLastWinner(lastWinnerResp.result[0]);

        // read my number of wins
        // TODO: hit this error
        const addrBase10 = toBN(address).toString(10);
        const myWinsResp = await callContract(GET_NUM_WINS_ENTRYPOINT, [addrBase10]);
        if (myWinsResp)
            setMyWins(parseInt(myWinsResp.result[0]));
    }

    async function postAnswer() {
        const tx = {
            contractAddress: SUM_GAME_CONTRACT_ADDRESS,
            entrypoint: VERIFY_SUM_ENTRYPOINT,
            calldata: [myAnswer]
        };

        execute(tx);
    }

    async function postAnswerMulticall() {
        const transactionList: any = [];
        for (let i = 1; i <= 10; i += 1) {
            transactionList.push({
                contractAddress: SUM_GAME_CONTRACT_ADDRESS,
                entrypoint: VERIFY_SUM_ENTRYPOINT,
                calldata: [i]
            })
        }

        execute(transactionList);
    }

    // execute a txn or list of txns
    async function execute(tx: any) {
        const res = await starknet?.account.execute(tx);
        console.log('res', res);
        // append to the list of my transactions
        if (res && res.transaction_hash) {
            myTransactions.push(res.transaction_hash);
            setMyTransactions(myTransactions);
            setMyAnswer('');
        }
    }

    function getWalletJSX() {
        if (address) {
            return (
                <div>
                    <div>
                        Account: {address}
                    </div>
                    <button onClick={() => connectWallet(true)}>Change provider</button>
                </div>
            );
        }

        return (
            <div>
                <button onClick={() => connectWallet(true)}>Connect wallet</button>
            </div>
        )
    }

    function getGameJSX() {
        if (!address)
            return <div>Connect wallet to play!</div>;

        return (
            <>
                <h2>Number Sum Game</h2>
                <div>Is game active: {isActive.toString()}</div>
                <div>Number: {currNumber}</div>
                <div>Last winner: {lastWinner}</div>
                <div>My wins: {myWins}</div>
                <input onChange={(e) => setMyAnswer(e.target.value)} value={myAnswer}/>
                <button onClick={postAnswer}>Verify sum</button>
                <button onClick={postAnswerMulticall}>Guess the world</button>
            </>
        );
    }

    function getTransactionListJSX() {
        return myTransactions.map((t: string, index: number) => {
            const txnLink = `https://goerli.voyager.online/tx/${t}`;
            return (
                <div>
                    <a target="_blank" key={index} href={txnLink}>{t}</a>
                </div>
            );
        });
    }

    return (
        <>
            {getWalletJSX()}
            {getGameJSX()}
            <h2>My Transactions</h2>
            {getTransactionListJSX()}
        </>
    );
}

export default SumGameSNJS;