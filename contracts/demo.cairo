%lang starknet

from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.cairo_builtins import HashBuiltin

from starkware.cairo.common.math import unsigned_div_rem
from starkware.cairo.common.math import assert_in_range

// Stores the address of the owner of the contract
@storage_var
func owner() -> (owner_address : felt) {
}

// Maps the address of a user to the number of answers they have correct
@storage_var
func winsByAddr(address : felt) -> (numCorrect : felt) {
}

// Last winning address of the game
@storage_var
func lastWinner() -> (address : felt) { 
}

// Stores the current number to be solved
@storage_var
func currNumber() -> (res : felt) {
}

// Stores whether the current number is active
@storage_var
func isActive() -> (res : felt) {
}

// Constructor for the contract that is called when the contract is deployed
// Argument owner_address Address of the owner of the contract
// Set isActive and currNumber to be solved
@constructor
func constructor{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}(owner_address : felt) {
    owner.write(value=owner_address);
    isActive.write(1);
    currNumber.write(1234);
    return ();
}

@view
func getOwner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (ownerAddr : felt) {
    let (ownerAddr) = owner.read();
    return (ownerAddr=ownerAddr);
}

// Gets the current number to guess
// Return currNumber
@view
func getCurrNumber{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (currNum : felt) {
    let (currNum) = currNumber.read();
    return (currNum=currNum);
}

// Gets whether the game is active
// Return isActive - 1 if true, 0 if false
@view
func getIsActive{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (isActiveBool : felt) {
    let (isActiveBool) = isActive.read();
    return (isActiveBool=isActiveBool);
}

// Gets the last winning address
// Return lastWinner
@view
func getLastWinner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (lastWinningAddr : felt) {
    let (lastWinningAddr) = lastWinner.read();
    return (lastWinningAddr=lastWinningAddr);
}

// Gets the number of wins a user's addr has
// Return number of wins a user has
@view
func getNumberWins{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(address : felt)  -> (numWins : felt) {
    let (numWins) = winsByAddr.read(address);
    return (numWins=numWins);
}

// Check a user's answer
// Argument userAnswer the sum of the digits as added by the user
// Return whether the answer is correct, if correct return 1, else 0
@external
func verifySum{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(userAnswer : felt) -> (isCorrect : felt) {
    alloc_locals;
    //Ensure the game is active, if not assertion will fail
    let (activeBool) = isActive.read();
    with_attr error_message("This game is not active") {
        assert activeBool = 1;
    }
    //Get the current number and the result of finding sum of the digits
    let (currNum) = currNumber.read();
    let (res) = findSumDigits(currNum, 0);
    //If userAnswer = res, then that address has won the round and the game is no longer active
    if (res == userAnswer) {
        let (caller) = get_caller_address();
        isActive.write(0);
        let (currAddrWins) = winsByAddr.read(caller);
        winsByAddr.write(caller, currAddrWins+1);
        lastWinner.write(caller);
        return (isCorrect=1);
    }
    //If the user did not win the round return 0 as a false value to the front end
    return (isCorrect=0);
}

// Update the current number that users will try to sum the digits	
// Argument updatedNum the new number for users to work with	
@external	
func updateCurrNum{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(updatedNum : felt) {
    let (ownerBool) = isOwner();
    with_attr error_message("This game is not active") {	
        assert ownerBool = 1;
    }	
    isActive.write(1);
    currNumber.write(updatedNum);
    return ();
}	

// Gets whether the calling address is the owner of the contract	
// Return 1 if true, 0 otherwise
@view
func isOwner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (isOwner : felt) {
    let (caller) = get_caller_address();
    let (ownerAddr) = owner.read();
    if (caller == ownerAddr) {
        return (isOwner=1);
    }
    return (isOwner=0);
}

//Recursively find the sum of the digits
func findSumDigits{range_check_ptr}(inputNum : felt, currSum : felt) -> (res : felt) {
    //create base case
    if (inputNum == 0) {
        return (res=currSum);
    }
    //get your unsigned remainder of dividing by 10, this is the ones digit
    let (q,r) = unsigned_div_rem(inputNum, 10);
    //add the ones digit to the sum
    let updatedCurrSum = currSum + r;
    //update the input to knock off the ones digit and recurse
    let updatedInput = (inputNum-r)/10;
    let (res) = findSumDigits(updatedInput, updatedCurrSum);
    return (res=res);
}