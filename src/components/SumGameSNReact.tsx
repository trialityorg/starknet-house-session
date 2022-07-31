import { useStarknet, useStarknetCall, useStarknetExecute, useStarknetInvoke } from "@starknet-react/core";
import React, { useEffect, useState } from "react";
import { GET_CURR_NUMBER_ENTRYPOINT, GET_IS_ACTIVE_ENTRYPOINT, GET_LAST_WINNER_ENTRYPOINT, GET_NUM_WINS_ENTRYPOINT, SUM_GAME_CONTRACT_ADDRESS, VERIFY_SUM_ENTRYPOINT } from "src/constants";
import { useSumGameContract } from "~/hooks/sumgame";

const SumGameSNReact = () => {

    const [myAnswer, setMyAnswer] = useState<string>('');
    const { account } = useStarknet();
    const { contract: sumGameContract } = useSumGameContract();

    /* These are read from the contract */
    const [currNumber, setCurrNumber] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(false);
    const [lastWinner, setLastWinner] = useState<string>('0x0');
    const [myWins, setMyWins] = useState<number>(0);

    /* Read values from the contract, in watch mode */
    const { data: currNumResult } = useStarknetCall(getCallObject(GET_CURR_NUMBER_ENTRYPOINT, []));
    const { data: isActiveResult } = useStarknetCall(getCallObject(GET_IS_ACTIVE_ENTRYPOINT, []));
    const { data: lastWinnerResult } = useStarknetCall(getCallObject(GET_LAST_WINNER_ENTRYPOINT, []));
    const { data: myWinsResult } = useStarknetCall(getCallObject(GET_NUM_WINS_ENTRYPOINT, [account]));

    function getCallObject(method: string, args: any[]) {
        return {
            contract: sumGameContract,
            method,
            args,
            options: { watch: true }
        };
    }

    /* Runs when the values have been read from the contract */
    useEffect(() => {
        if (currNumResult && currNumResult.length > 0)
            setCurrNumber(currNumResult[0].toNumber());
    }, [currNumResult]);

    useEffect(() => {
        if (isActiveResult && isActiveResult.length > 0)
            setIsActive(isActiveResult[0].toNumber() === 1);
    }, [isActiveResult]);

    useEffect(() => {
        if (lastWinnerResult && lastWinnerResult.length > 0)
            setLastWinner('0x' + lastWinnerResult[0].toString(16));
    }, [lastWinnerResult]);

    useEffect(() => {
        if (myWinsResult && myWinsResult.length > 0)
            setMyWins(myWinsResult[0].toNumber());
    }, [myWinsResult]);

    /* Write to the contract to verify the sum */
    const { invoke } = useStarknetInvoke({
        contract: sumGameContract,
        method: VERIFY_SUM_ENTRYPOINT
    });
    // create another hook for updateCurrNumber to show that you define again for another function

    function verifySum() {
        invoke({
            args: [myAnswer],
            metadata: {
                method: VERIFY_SUM_ENTRYPOINT,
                message: `verify that sum is ${myAnswer}`
            },
        });

        setMyAnswer('');
    }

    // send multiple transactions at once (multicall)
    const calls: any[] = [];

    const { execute } = useStarknetExecute({
        calls,
        metadata: {
            method: VERIFY_SUM_ENTRYPOINT,
            message: `Guess the world`,
        },
    });

    function verifySumMulticall() {
        for (let i = 1; i <= 12; i += 1) {
            calls.push({
                contractAddress: SUM_GAME_CONTRACT_ADDRESS,
                entrypoint: VERIFY_SUM_ENTRYPOINT,
                calldata: [i]
            })
        }

        execute();
        setMyAnswer('');
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
                <button onClick={verifySumMulticall}>Guess the world</button>
        </>
    );
}

export default SumGameSNReact;