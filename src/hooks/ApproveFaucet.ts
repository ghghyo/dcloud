
import { useEffect} from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"
import Faucet from "../chain-info/contracts/Faucet.json"

// convert contract so that it approves downloads and uploads

export const ApproveFaucet = () => {
    // address
    // abi
    // chainId
    const { chainId } = useEthers()
    
    const { abi } = Faucet
    const FaucetAddress = chainId ? networkMapping[String(chainId)]["Faucet"][0] : constants.AddressZero

    const FaucetInterface = new utils.Interface(abi)
    const FacuetContract = new Contract(FaucetAddress, FaucetInterface)


    
    // approve
    const { send: approvefaucetRequest, state: approveFaucetState, resetState: reset2 } =
        useContractFunction(FacuetContract, "send", {
            transactionName: "Approve the faucet",
        })
    const approveFaucet = () => {
   
        return (approvefaucetRequest())


    }
    
    useEffect(() => {

    if(approveFaucetState.status==="Success"){
        console.log(approveFaucetState)
        
    }
    else if (approveFaucetState.status==="Exception"){
        console.log("You either denied the transaction or do not have the correct permissions")
        return reset2()

    }
    }, [approveFaucetState])

    return { approveFaucet, approveFaucetState, reset2 }
    
}