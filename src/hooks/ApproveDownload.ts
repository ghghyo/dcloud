import { useEffect} from "react"
import { useEthers, useContractFunction } from "@usedapp/core"
import { constants, utils } from "ethers"
import { Contract } from "@ethersproject/contracts"
import networkMapping from "../chain-info/deployments/map.json"
import UploadDownload from "../chain-info/contracts/UploadDownload.json"

// convert contract so that it approves downloads and uploads

export const ApproveDownload = () => {
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
    const { send: approvedownloadRequest, state: approvedownloadState, resetState: resetdownload } =
        useContractFunction(UploadDownloadContract, "DownloadApproved", {
            transactionName: "Approve the download",
        })
    const approvedownload = (ProviderName: number) => {
        if (ProviderName===1){
            return (approvedownloadRequest(Amazon, "AWS"))

        } 
        else{
            return (approvedownloadRequest(Amazon2, "AWS 2"))
        }
    }
    
    useEffect(() => {

    if(approvedownloadState.status==="Success"){
        console.log(approvedownloadState)
        
    }
    else if (approvedownloadState.status==="Exception"){
        console.log("You either denied the transaction or do not have the correct permissions")
        return resetdownload()

    }
    }, [approvedownloadState])

    return { approvedownload, approvedownloadState, resetdownload }
    
}