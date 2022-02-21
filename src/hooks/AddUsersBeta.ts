
import { useEffect} from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"
import DetermineUser from "../chain-info/contracts/DetermineUser.json"

// currently adds one user to each of the user types so beta testers can use this

export const AddUsersBeta = () => {
    // address
    // abi
    // chainId
    const { chainId } = useEthers()
    
    const { abi } = DetermineUser
    const DetermineUserAddress = chainId ? networkMapping[String(chainId)]["DetermineUser"][0] : constants.AddressZero
    const DetermineUserInterface = new utils.Interface(abi)
    const DetermineUserContract = new Contract(DetermineUserAddress, DetermineUserInterface)
    


    // approve
    const { send: approvechangeKeys, state: approvechangeKeysState, resetState: reset3 } =
        useContractFunction(DetermineUserContract, "changePrivateKeys", {
            transactionName: "Add a Beta Tester",
        })
    const approvechange = (NRO: string, CIA: string, NSA: string, AWS: string) => {
        const NRO_address= utils.getAddress(NRO)
        const CIA_address= utils.getAddress(CIA)
        const NSA_address= utils.getAddress(NSA)
        const AWS_address= utils.getAddress(AWS)
        return approvechangeKeys([NRO_address],[CIA_address],[NSA_address],[AWS_address])
    }
    useEffect(() => {

    if(approvechangeKeysState.status==="Success"){
        console.log(approvechangeKeysState)
        
    }
    else if (approvechangeKeysState.status==="Exception"){
        console.log("You either denied the transaction or do not have the correct permissions")
        return reset3()

    }
    }, [approvechangeKeysState])

    return { approvechange, approvechangeKeysState, reset3}
    
}