import { useContract } from '@starknet-react/core'
import { SUM_GAME_CONTRACT_ADDRESS } from 'src/constants'
import { Abi } from 'starknet'

import SumGameAbi from '~/abi/sumgame.json'

export function useSumGameContract() {
  return useContract({
    abi: SumGameAbi as Abi,
    address: SUM_GAME_CONTRACT_ADDRESS,
  })
}
