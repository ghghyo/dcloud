
import { useEffect} from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"
import UploadDownload from "../chain-info/contracts/UploadDownload.json"

// convert contract so that it approves downloads and uploads

export const ApproveUpload = () => {
    // address
    // abi
    // chainId
    const { chainId } = useEthers()
    
    const { abi } = UploadDownload
    const UploadDownloadAddress = chainId ? networkMapping[String(chainId)]["UploadDownload"][0] : constants.AddressZero

    const UploadDownloadInterface = new utils.Interface(abi)
    const UploadDownloadContract = new Contract(UploadDownloadAddress, UploadDownloadInterface)
    const Amazon = utils.getAddress("0xe7D90e39e8AD03b6a2912aDD69120FcAfD3C2E09")
    const Amazon2 = utils.getAddress("0x11AB7A7c6EfB64DcaCF1462990CA13407892A65c")

    
    // approve
    const { send: approveuploadRequest, state: approveUploadState, resetState: reset } =
        useContractFunction(UploadDownloadContract, "UploadApproved", {
            transactionName: "Approve the upload",
        })
    const approveUpload = (addressProvider: number) => {
        if (addressProvider===1){
            return (approveuploadRequest(Amazon))

        } 
        else{
            return (approveuploadRequest(Amazon2))
        }
    }
    
    useEffect(() => {

    if(approveUploadState.status==="Success"){
        console.log(approveUploadState)
        
    }
    else if (approveUploadState.status==="Exception"){
        console.log("You either denied the transaction or do not have the correct permissions")
        return reset()

    }
    }, [approveUploadState])

    return { approveUpload, approveUploadState, reset }
    
}