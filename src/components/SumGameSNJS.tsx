import React, { useEffect, useState } from "react";
import { connect, IStarknetWindowObject } from "get-starknet";
import { GET_CURR_NUMBER_ENTRYPOINT, GET_IS_ACTIVE_ENTRYPOINT, GET_LAST_WINNER_ENTRYPOINT, GET_NUM_WINS_ENTRYPOINT, SUM_GAME_CONTRACT_ADDRESS, VERIFY_SUM_ENTRYPOINT } from "src/constants";
import { toBN } from 'starknet/dist/utils/number';

let starknet : IStarknetWindowObject | undefined;

const SumGameSNJS = () => {

    /* User's connected wallet address */
    const [address, setAddress] = useState<string>('');
    const [myAnswer, setMyAnswer] = useState<string>('');
    const [myTransactions, setMyTransactions] = useState<string[]>([]);

    /* State variables read from the contract */
    const [currNumber, setCurrNumber] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(false);
    const [lastWinner, setLastWinner] = useState<string>('');
    const [myWins, setMyWins] = useState<number>(0);

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

    /* Call the contract to read the current game state */
    async function readGameState() {
        
    }

    /* Interval to read the game state every 10 seconds */
    let readGameStateInterval: any;
    useEffect(() => {
        
    }, [starknet]);

    /* Solve the puzzle, post the sum to the contract */
    async function verifySum() {

    }

    /* Solve the puzzles with multiple guesses at once */
    async function verifySumMulticall() {
        
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
        return (
            <>
                <h2>Number Sum Game</h2>
                <div>Number: {currNumber}</div>
                <div>Is game active: {isActive.toString()}</div>
                <div>Last winner: {lastWinner}</div>
                <div>My wins: {myWins}</div>
                <input onChange={(e) => setMyAnswer(e.target.value)} value={myAnswer}/>
                <button onClick={verifySum} disabled={!isActive}>Verify sum</button>
                <button onClick={verifySumMulticall} disabled={!isActive}>Guess the world</button>
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