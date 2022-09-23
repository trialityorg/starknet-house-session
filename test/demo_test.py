import os
import pytest
import pytest_asyncio

from starkware.starknet.testing.starknet import Starknet
from starkware.starkware_utils.error_handling import StarkException


from starkware.starknet.compiler.compile import compile_starknet_files


ADDRESS = 0x123456
OWNER_ADDRESS = 0x654321

# The path to the contract source code.
CONTRACT_FILE = os.path.join(
    os.path.dirname(__file__), "../contracts/demo.cairo")	

def invoke_with_address(call, addr=OWNER_ADDRESS):
    return call.execute(caller_address=addr)


# Initializes the fake starknet and deploys the contract on it
# This runs before all the other tests
@pytest_asyncio.fixture
async def contract():
    # Create a new Starknet class that simulates the StarkNet
    # system.
    starknet = await Starknet.empty()

    # Deploy the contract.
    contract = await starknet.deploy(
        source=CONTRACT_FILE,
        constructor_calldata=[OWNER_ADDRESS],
    )

    return contract

# Tests that ondeploy the currNum and isActive are set correctly	
@pytest.mark.asyncio
async def test_get_currNumber(contract):
    isActive = await contract.getIsActive().call()
    currNum = await contract.getCurrNumber().call()
    assert currNum.result == (1234,)
    assert isActive.result == (1,)


# Tests that the digit addition function works
@pytest.mark.asyncio
async def test_check_guess_correct(contract):
    isCorrect = await invoke_with_address(contract.verifySum(10))
    isActive = await contract.getIsActive().call()
    lastWinner = await contract.getLastWinner().call()
    numWins = await contract.getNumberWins(OWNER_ADDRESS).call()
    assert isCorrect.result == (1,)
    assert isActive.result == (0,)
    assert numWins.result == (1,)
    assert lastWinner.result == (OWNER_ADDRESS,)



# Tests that the digit addition function works
@pytest.mark.asyncio
async def test_check_guess_incorrect(contract):
    isCorrect = await invoke_with_address(contract.verifySum(11))
    isActive = await contract.getIsActive().call()
    assert isCorrect.result == (0,)
    assert isActive.result == (1,)


# Tests that update works if you are calling as the Owner
@pytest.mark.asyncio
async def test_set_num_with_owner(contract):
    isActive = await contract.getIsActive().call()
    currNum = await contract.getCurrNumber().call()
    assert currNum.result == (1234,)
    assert isActive.result == (1,)

   #update the number
    await invoke_with_address(contract.updateCurrNum(101))
    isActive = await contract.getIsActive().call()
    currNum = await contract.getCurrNumber().call()
    assert currNum.result == (101,)
    assert isActive.result == (1,)


# Tests that update does not work if you are not calling as the Owner
@pytest.mark.asyncio
async def test_set_num_with_nonowner(contract):
    isActive = await contract.getIsActive().call()
    currNum = await contract.getCurrNumber().call()
    assert currNum.result == (1234,)
    assert isActive.result == (1,)

    #update the number
    with pytest.raises(StarkException):
        await invoke_with_address(contract.updateCurrNum(101), ADDRESS)


# Tests getting the answer correctly, updating the number and another user	
# getting the next answer correctly
@pytest.mark.asyncio
async def test_check_guess_two_correct(contract):
    isCorrect = await invoke_with_address(contract.verifySum(10))
    isActive = await contract.getIsActive().call()
    lastWinner = await contract.getLastWinner().call()
    numAdminWins = await contract.getNumberWins(OWNER_ADDRESS).call()
    assert isCorrect.result == (1,)
    assert isActive.result == (0,)
    assert numAdminWins.result == (1,)
    assert lastWinner.result == (OWNER_ADDRESS,)
        
    await invoke_with_address(contract.updateCurrNum(101))
    isCorrect = await invoke_with_address(contract.verifySum(2), ADDRESS)
    numWinsAddr = await contract.getNumberWins(ADDRESS).call()
    assert numWinsAddr.result == (1,)
    numAdminWins = await contract.getNumberWins(OWNER_ADDRESS).call()
    assert numAdminWins.result == (1,)
    lastWinner = await contract.getLastWinner().call()
    assert lastWinner.result == (ADDRESS,)