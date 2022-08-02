import { useStarknet, useStarknetCall, useStarknetExecute, useStarknetInvoke } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { GET_CURR_NUMBER_ENTRYPOINT, GET_IS_ACTIVE_ENTRYPOINT, GET_LAST_WINNER_ENTRYPOINT, GET_NUM_WINS_ENTRYPOINT, SUM_GAME_CONTRACT_ADDRESS, VERIFY_SUM_ENTRYPOINT } from "src/constants";
import { useSumGameContract } from "~/hooks/sumgame";

const SumGameSNReact = () => {

    /* User's connected wallet address */
    const [myAnswer, setMyAnswer] = useState<string>('');
    const { account } = useStarknet();

    /* State variables read from the contract */
    const [currNumber, setCurrNumber] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(false);
    const [lastWinner, setLastWinner] = useState<string>('');
    const [myWins, setMyWins] = useState<number>(0);

    /* Read values from the contract, in watch mode */
    function getCallObject(method: string, args: any[]) {
       
    }

    /* Update the state when the values have been read from the contract */

    /* Solve the puzzle, post the sum to the contract */
    function verifySum() {
        
    }

    /* Solve the puzzles with multiple guesses at once */
    function verifySumMulticall() {

    }

    return (
        <>
                <h2>Number Sum Game</h2>
                <div>Is game active: {isActive.toString()}</div>
                <div>Number: {currNumber}</div>
                <div>Last winner: {lastWinner}</div>
                <div>My wins: {myWins}</div>
                <input onChange={(e) => setMyAnswer(e.target.value)} value={myAnswer}/>
                <button onClick={verifySum} disabled={!isActive}>Verify sum</button>
                <button onClick={verifySumMulticall} disabled={!isActive}>Guess the world</button>
        </>
    );
}

export default SumGameSNReact;