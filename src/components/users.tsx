import { Button, makeStyles } from "@material-ui/core"
import { useNavigate} from "react-router-dom";
import React, { useState, useEffect }  from 'react';
import axios from 'axios';
import { ApproveUpload, ApproveFaucet, ApproveDownload } from "../hooks"
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Popup from 'reactjs-popup';
import { useEthers} from "@usedapp/core"
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { Tab, Box, Grid, Paper,styled} from "@material-ui/core"


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: "ForestGreen",
    fontWeight: "bold"
  }));

const useStyles = makeStyles((theme) => ({
    fileBox:{
        marginTop:"2vw",
        marginBottom:"2vw",
        width:"30vw",
        position: 'absolute',
        border: '2px dashed FloralWhite',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        left:"35vw",
        padding: "0.5vw 0.5vw",
    },
    uploadBox:{
        marginTop:"6vw",
        marginBottom:"5vw",
        width:"70vw",
        left:"15vw",
        position: 'absolute',
        display: 'flex',
        flexDirection: 'column',
        padding: "0.5vw 0.5vw",
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    button:{
        backgroundColor: "white",
        padding: "0.5vw 0.5vw",
        fontSize: "0.6vw",
        bottom: 10,
        left: "10%",
        marginLeft: -100,
        position: "absolute"
        
    },
    button2:{
        backgroundColor: "DeepSkyBlue",
        padding: "0.5vw 10.5vw",
        fontSize: "0.7vw",
        alignItems: 'center',
        justifyContent: 'center',

    },
    button3:{
        backgroundColor: "black",
        padding: "0.5vw 0.5vw",
        fontSize: "0.7vw",
        alignItems: 'center',
        justifyContent: 'center',

    },
    button4:{
        backgroundColor: "orange",
        padding: "0.5vw 0.5vw",
        fontSize: "0.7vw",
        alignItems: 'center',
        justifyContent: 'center',

    },
    Modal:{
        fontSize:"1vw",
        backgroundColor: "AntiqueWhite",
        width:"100%",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: "10%",
        border: "0.5vw solid white;"

    },
    Header:{
        width:"50%",
        left: "40%",
        marginLeft: "25%",
        borderBottom:"0.3vw solid gray",
        fontSize: "1.5vw",
        textAlign: "center",
        padding:"0.3vw"
    },
    Content:{
        width:"100%",
        padding:"1vw 1vw",
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "center"
    },
    Action:{
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "center",
        color: "white"

    }
}))


function Users() {

    // upload a file

    const classes = useStyles()
    let navigate=useNavigate()
    function Goback(){
        navigate("/",{replace:true})
    }
    const {account}= useEthers()
    const isConnected = account !== undefined
    const [selectedFile, setSelectedFile] = useState<Buffer>()
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [fileName, setfileName] =useState("")
    const [currentResponse,setcurrentResponse] =useState(0)
    const [currentListContent,setcurrentListContent] =useState<string []>()
    const [isListRetrieved, setisListRetrieved] = useState(false)
    const [isScriptComplete, setisScriptComplete] = useState("")
    const [ProviderMeta, setProviderMeta]= useState(0)
    const [downloadnameofFile,setdownloadnameofFile] = useState("")
    const [downloadhash, setdownloadhash]= useState("")
    const { approveUpload, approveUploadState, reset } = ApproveUpload() ?? [];
    const { approveFaucet, approveFaucetState, reset2 } = ApproveFaucet() ?? []
    const { approvedownload, approvedownloadState, resetdownload } = ApproveDownload() ?? [];


    const sendFromFaucet = () =>{

        approveFaucet()

    }

    const retrievefileList = () =>{
        const url =  `https://api.pinata.cloud/data/pinList?status=pinned`;  //`https://api.pinata.cloud/data/pinList?status=pinned&ipfs_pin_hash=QmWix5g8PsQ2EnFQT4wzDHSc61EKxmDSAQFUiWdHi2C6bf`
        axios({
            url: url, //your url
            method: 'GET',
            headers: {
                pinata_api_key: '3690d2a0f90fee8104fc',
                pinata_secret_api_key: '28da108d51fc6c1bb66407d033043cc5b39d111d4bc2deb9aa917f55845fd39a'
            }
        }).then((response) => {
            console.log(response.data.rows.map((file: any) =>   
                file.ipfs_pin_hash
            ))
            console.log(response.data.rows[0]['metadata'].keyvalues["providerKey"])
            console.log(response.data.rows[0].ipfs_pin_hash)
            console.log(response.data.rows['length'])
            setcurrentListContent(response.data.rows)
            setisListRetrieved(true)
        });
        //render the current list
        
    }

	const downloadaFile = (hash:string, nameoffile:string, providerKey: number) => { 

        approvedownload(providerKey)
        setdownloadnameofFile(nameoffile)
        setdownloadhash(hash)

	};

    const hiddenFileInput = React.useRef(null);
    
    const handleClick = () => {
        
        
        //@ts-ignore
        hiddenFileInput.current.click();
        
      };

    // authenticate
    const changeHandler= (event : any) => {
    
        setIsFilePicked(true)
        
        setfileName(event.target.files[0].name)
        const reader = new FileReader();
        
        reader.onload =function(f) {
            const results = reader.result;
            //@ts-ignore
            const base64number= results?.replace("data","").replace(/^.+,/,"")     
            const buffer = Buffer.from(base64number,"base64")
            setSelectedFile(buffer);
            };
        reader.readAsDataURL(event.target.files[0]);
        event.target.value= null
        

    };
    function timeout(delay: number) {
        return new Promise( res => setTimeout(res, delay) );
    }

    const returnDate = async () => {
        await timeout(3000)
        setisScriptComplete(Date().toLocaleString())
    

    }

        
    useEffect(() => {

        if(approvedownloadState.status==="Success"){
            setcurrentResponse(10)
            const url = 'https://gateway.pinata.cloud/ipfs/' + downloadhash;

            //get a file using the hash
            axios
            .get(url, {responseType: 'blob'} // important
            ).then(function(response){
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', downloadnameofFile); //or any other extension
                document.body.appendChild(link);
                link.click();
            });
            
        }

        if(approveUploadState.status==="Success"){
            console.log(approveUploadState)

            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            //@ts-ignore
            var arrayBuffer= new Blob([selectedFile]);
            let data = new FormData();
            console.log(fileName)
            data.append('file', arrayBuffer,fileName);
            const metadata = JSON.stringify({
                name: fileName,
                keyvalues: {
                    providerKey: ProviderMeta
                }
            });
            data.append('pinataMetadata', metadata);
        
            setcurrentResponse(10)
            axios
            .post(url, data, {
                maxContentLength: Infinity,
                maxBodyLength: Infinity, //this is needed to prevent axios from erroring out with large files
                headers: {
                    pinata_api_key: '3690d2a0f90fee8104fc', //should usually be hidden but just for experimental purposes
                    pinata_secret_api_key: '28da108d51fc6c1bb66407d033043cc5b39d111d4bc2deb9aa917f55845fd39a'
                }
            })
            .then(function (response) {
                console.log(response.status);
                setcurrentResponse(response.status)
            })
            .catch(function (error) {
                console.log(error);
                setcurrentResponse(error.status)
            });
            return reset()
            
        }
        if (approveUploadState.status==="Exception" ||approveFaucetState.status==="Exception" || approvedownloadState.status==="Exception"){
            setcurrentResponse(30)
            return reset()
    
        }
        if (approveUploadState.status==="Mining" || approveFaucetState.status==="Mining" || approvedownloadState.status==="Mining"){
            setcurrentResponse(20)
        }
        if (approveFaucetState.status==="Success"){
            setcurrentResponse(11)
        }
        }, [approveUploadState, approveFaucetState, approvedownloadState])

   

	const handleSubmission = (choice:number) => {
        setProviderMeta(choice)
        approveUpload(choice)
        console.log(approveUploadState)
        setIsFilePicked(false)
        
	};

    const closeModal = () => setIsFilePicked(false);
    const providerbuttons = [{name: 'Amazon', number: 1}, {name: 'Amazon 2', number:2}, 
            {name: 'No Preference', number:1}]

    const [value, setValue] = React.useState('1');

    const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
        setValue(newValue);
    };

  
    
   if (isConnected) return (
    
    <>    
    <Button
              className={classes.button}
              color="primary"
              onClick={() => Goback()}
          >
              Go Back
    </Button>
    <Box sx={{ width: '100%' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1 ,borderColor: 'divider', bgcolor:"FloralWhite", borderRadius: "25px" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="Instructions" value="1" />
            <Tab label="Upload" value="2" />
            <Tab label="Download" value="3" />
            <Tab label="Cloud Computing" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
        <div style={{color:"white", fontWeight:"bold"}} className={classes.Header}> Instructions </div>
                <div style={{color:"white"}} className={classes.Content}>
                    {' '}
                    Since you will be using our custom GOV token, you must first add the following address to your wallet assets: 
                    
                    <Grid container spacing={2}>
                    <Grid item xs={12}>
                    <br />
                        <Item>0x150c4dc2ad9347e851fc2b845ca95553d482cf8b</Item>
                    </Grid>
                    </Grid>  
                    <br />
                    If you do not have any GOV token, you can get some from our Rinkeby Faucet by pressing "GET GOV" below. If you already have tokens please continue without using the faucet.
                </div>
                <div style={{color:"white"}} className={classes.Action}>
                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button4}
                    onClick={() => sendFromFaucet()}
                >
                    GET GOV
                </Button>
                </div>
    
                <div style={{ marginTop:"2vw" }}>
                
                {currentResponse===20? (
                  <Alert severity="info">
              <AlertTitle>Mining</AlertTitle>
              <strong>Your transaction is mining ... Please wait</strong>
              </Alert>   
              ) : currentResponse===30?(
                  <Alert onClose={() => {setcurrentResponse(0)}} severity="error">
              <AlertTitle>Error</AlertTitle>
              <strong>You either denied the transaction or just requested from the faucet</strong>
              </Alert>
              ) : currentResponse===11? (
                                                
                <Alert onClose={() => {setcurrentResponse(0)}} severity="success">
                <AlertTitle>Done</AlertTitle>
                <strong>Success you may begin!</strong>
                </Alert>) :(null)
          }
  
  
            </div>
        </TabPanel>

        <TabPanel value="2">
            
        <Button
              className={classes.button}
              color="primary"
              onClick={() => Goback()}
          >
              Go Back
          </Button>
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>Hello! Please choose the file you would like to upload and then submit. You can see your uploads on the download screen.</Item>
          </Grid>
          </Grid>  
    
        <div className={classes.fileBox}>
      
                <Button color="primary" variant="contained" className={classes.button4} onClick={handleClick}>Choose the file</Button>
              <input type="file" style={{display:'none'}} name="file" ref={hiddenFileInput} onChange={changeHandler} />
       
            
          {isFilePicked ? (
              <><>&nbsp;</>
              <Popup
                      trigger={<Button color="primary" variant="contained" className={classes.button4} > Submit </Button>} 
                      modal
                      nested
                      
                  >
                          <div className={classes.Modal}> 
                          <Button color="primary" variant="contained" className={classes.button3}
                          onClick={closeModal}> 
                                  &times; 
                    
                              </Button> 
                              <div className={classes.Header}> Choose your provider </div>
                              <div className={classes.Content}>
                                  {' '}
                                    You are given the ability to choose your provider.
                                  <br />
                                  If you click on no preference then one will be chosen for you.
                              </div>
                              <div className={classes.Action}>
                              {providerbuttons.map((provider, index) => {
                                  return(
                                    <React.Fragment key={index}><Button
                                      color="primary"
                                      variant="contained"
                                      className={classes.button3}
                                      onClick={() => handleSubmission(provider.number)}
                                      key={index}
                                  >
                                      {provider.name}
                                  </Button>&nbsp;</React.Fragment>
                                    )
                              })}
                                 
                              </div>
                          </div>
            
                  </Popup></>


              ) : (
                  <>
                  <div>&nbsp; </div><p  style={{ color: "white" }}>Select a file to upload</p></>
			)}


          </div>
          <div style={{ marginTop:"10vw" }}>
                
              {currentResponse===200 ? (
              
                <Alert onClose={() => {setcurrentResponse(0)}} severity="success">
            <AlertTitle>Success</AlertTitle>
            <strong>Your file has been uploaded!</strong>
            </Alert>
              ) : currentResponse===400? (
                                
                <Alert onClose={() => {setcurrentResponse(0)}} severity="error">
                <AlertTitle>Error</AlertTitle>
                <strong>Your file did not upload to Pinata!</strong>
                </Alert>
			) : currentResponse===10? (
                                                
                <Alert onClose={() => {setcurrentResponse(0)}} severity="info">
                <AlertTitle>In Progress</AlertTitle>
                <strong>Your file is uploading!</strong>
                </Alert>
            ) : currentResponse===20? (
                <Alert severity="info">
            <AlertTitle>Mining</AlertTitle>
            <strong>Your transaction is mining ... Please wait</strong>
            </Alert>   
            ) : currentResponse===30?(
                <Alert onClose={() => {setcurrentResponse(0)}} severity="error">
            <AlertTitle>Error</AlertTitle>
            <strong>You either denied the transaction or do not have the correct permissions</strong>
            </Alert>
            ) : (null)
        }


          </div>


        </TabPanel>
        <TabPanel value="3">
        
          <Button
              className={classes.button}
              color="primary"
              onClick={() => Goback()}
          >
              Go Back
          </Button>
          <Grid container spacing={2}>
          <Grid item xs={12}>
            <Item>Welcome to the download screen.</Item>
          </Grid>
          </Grid>
          
          <div className={classes.fileBox}>
                <Button color="primary" variant="contained" className={classes.button4} onClick={retrievefileList}>View all uploaded files</Button> 

                </div>
                {isListRetrieved ? (
                              <div className={classes.uploadBox}>
                              {currentListContent?.map((file, index) => {
                                  return(
                                    <React.Fragment key={index}>
                                        
                                        <Button
                                      color="primary"
                                      variant="contained"
                                      className={classes.button2}
                                      onClick={() => {downloadaFile(file["ipfs_pin_hash"],file["metadata"].name,file['metadata'].keyvalues["providerKey"])}}
                                      key={index}
                                  >
                                      {file["metadata"].name}
                                  </Button>&nbsp;</React.Fragment>
                                  
                                    )
                              })}
                            </div>
                    
                ) : (
                    null

                )}
            <div style={{ marginTop:"25vw" }}>
                
                {currentResponse===10? (
                                                  
                  <Alert onClose={() => {setcurrentResponse(0)}} severity="success">
                  <AlertTitle>Success</AlertTitle>
                  <strong>Your file will now download</strong>
                  </Alert>
              ) : currentResponse===20? (
                  <Alert severity="info">
              <AlertTitle>Mining</AlertTitle>
              <strong>Your transaction is mining ... Please wait</strong>
              </Alert>   
              ) : currentResponse===30?(
                  <Alert onClose={() => {setcurrentResponse(0)}} severity="error">
              <AlertTitle>Error</AlertTitle>
              <strong>You either denied the transaction or do not have the correct permissions</strong>
              </Alert>
              ) : (null)
          }
  
  
            </div>
       


        </TabPanel>
        <TabPanel value="4">

        <div style={{color:"white", fontWeight:"bold"}} className={classes.Header}> Instructions </div>
                <div style={{color:"white"}} className={classes.Content}>
                    {' '}
                    Here you will be able to spin up an instance on the golem network and run your python script on GPU.
                    Since connecting with the Golem network requires several different steps which can be found here:  
                    &nbsp;<a href="https://handbook.golem.network/introduction/requestor">GOLEM.</a>  We will be demoing this process by providing
                    a python script that already adheres to the Golem requirements. This python script will return the current time and date.
                </div>
                <div style={{color:"white"}} className={classes.Action}>
                <Button
                    color="primary"
                    variant="contained"
                    className={classes.button4}
                    onClick={() => returnDate()}
                >
                    Run Script
                </Button>
        </div>

        {isScriptComplete === "" ?(
            null

        ) : (<div style={{color:"white"}} className={classes.Content}> {isScriptComplete} </div>)

        }

        </TabPanel>
      </TabContext>
    </Box>
    
          
          </>
  );
  return  (   <Button
  className={classes.button}
  color="primary"
  onClick={() => Goback()}
>
  Go Back
</Button>);
}

export default Users
