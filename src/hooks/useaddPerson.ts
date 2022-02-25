
import { useEffect, useState } from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"
import DetermineUser from "../chain-info/contracts/DetermineUser.json"
import { useNavigate} from "react-router-dom";



export const UseaddPerson = () => {
    // address
    // abi
    // chainId
    const { chainId } = useEthers()
    
    const { abi } = DetermineUser
    const DetermineUserAddress = chainId ? networkMapping[String(chainId)]["DetermineUser"][0] : constants.AddressZero
    const DetermineUserInterface = new utils.Interface(abi)
    const DetermineUserContract = new Contract(DetermineUserAddress, DetermineUserInterface)
    const [userType, setuserType] =useState<number>(0)
    const [path, setPath] =useState("/")


    // approve
    const { send: approveaddPerson, state: approveandaddPersonState, resetState: reset } =
        useContractFunction(DetermineUserContract, "addPerson", {
            transactionName: "Add a Person to list",
        })
    const approvePerson = (name: string, userType: number, org: number) => {
        setuserType(userType)
        return approveaddPerson(name,userType,org)
    }
    
    let navigate=useNavigate()
    useEffect(() => {
    if(userType===1){
        localStorage.setItem("isAuthenticatedUser", "true");
        setPath('/users');
    }
    else if(userType!=0 && userType!=1){
        localStorage.setItem("isAuthenticatedProvider", "true");
        setPath('/providers');
    }
    if(approveandaddPersonState.status==="Success"){
        console.log(approveandaddPersonState)
        navigate(path,{replace:true})
        
    }
    else if (approveandaddPersonState.status==="Exception"){
        console.log("You either denied the transaction or do not have the correct permissions")
        return reset()

    }
    }, [approveandaddPersonState, userType])

    return { approvePerson, approveandaddPersonState, reset }
    
}