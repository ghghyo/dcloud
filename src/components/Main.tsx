import { useEthers} from "@usedapp/core"
import React, { useState,useEffect, useRef } from "react"
import { Button,Box, makeStyles, TextField } from "@material-ui/core"
import { UseaddPerson, AddUsersBeta } from "../hooks"
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import { TabContext, TabList, TabPanel } from "@material-ui/lab"
import { Tab} from "@material-ui/core"




const useStyles = makeStyles((theme) => ({

    box: {
        height: 100,
        marginBottom:"2vw",
        display: "flex",
        border: "1px solid black", 
        padding: 8,
        gap: theme.spacing(),
        borderStyle: "dashed",
        borderColor: "orange",
        margin:"auto"
      },
    box2: {
        marginBottom:"2vw",
        padding: 18,
        gap: theme.spacing(4),
        display: "flex",
        borderStyle: "dashed",
        borderColor: "orange",
        margin:"auto",
        flexDirection: 'column',
        backgroundColor: "GhostWhite",
      },
    topLeftBox: {
        justifyContent: "center",
        alignItems: "center"
    },
    button:{
 
        borderRadius: "1vw",
        backgroundColor: "#21b6ae",
        padding: "1vw 1vw",
        fontSize: "1vw",
        
    }
}))


export const Main = () => {

    const validEthereum = new RegExp(
        '^0x[a-fA-F0-9]{40}$'
     );


    const classes = useStyles()
    const {account}= useEthers()
    const isConnected = account !== undefined

    const [showUserButtons, setshowUserButtons] = useState(false)
    const [showOrgNamesProvider, setshowOrgNamesProvider] = useState(false)
    const [showOrgNames, setshowOrgNames] = useState(false)
    const [userType, setuserType] =useState<number>(0)
    const [orgNum, setorgNum] =useState<number>(0)
    const { approvePerson, approveandaddPersonState } = UseaddPerson() ?? []
    const [alertCode, setalertCode] = useState(0);
    const [wrongInput,setwrongInput] = useState(false);
    const {approvechange, approvechangeKeysState} = AddUsersBeta() ?? []

    const AddBetaTesters = () => {
        if (validEthereum.test(NRO.current["value"]) && validEthereum.test(NSA.current["value"]) && validEthereum.test(CIA.current["value"]) && validEthereum.test(AWS.current["value"])) {
            
            setwrongInput(false)
            approvechange(NRO.current['value'],CIA.current['value'],NSA.current['value'], AWS.current['value'])
         }
        else{
            setwrongInput(true)
        }
       
    }
    
    const activateUserOrganizations = (userTypegiven: number) => {
        setuserType(userTypegiven)
        setshowOrgNames(true)

    }
    
    
    const SendtoDetermineUser = (orgNumgiven: number) => {
        const enteredName = prompt('Please enter your name')!.toString() ?? "noname"
        setorgNum(orgNumgiven)
        console.log(orgNum,userType)
        approvePerson(enteredName,userType,orgNumgiven)


    }

    const activateProvidersOrganizations = (userTypegiven: number) => {
        setshowOrgNamesProvider(true)
        setuserType(userTypegiven)
    }



    useEffect(() => {
        if (isConnected===true){
            setshowUserButtons(true)
            
        }
        else {
            setshowUserButtons(false)
            setshowOrgNames(false)
            setshowOrgNamesProvider(false)
            
        }
        if (showOrgNamesProvider===true){
            setshowUserButtons(false)
            setshowOrgNames(false)
        }
        if (showOrgNames===true){
            setshowUserButtons(false)
            setshowOrgNamesProvider(false)
        }
        if (approveandaddPersonState.status==="Exception" ){
            setalertCode(1)
        }
        if (approveandaddPersonState.status==="Mining" || approvechangeKeysState.status==="Mining"){
            setalertCode(2)
        }
        if (approvechangeKeysState.status==="Success"){
            setalertCode(3)
        }

    }, [isConnected,showOrgNames, showOrgNamesProvider,userType,approveandaddPersonState, approvechangeKeysState])

    const [value, setValue] = React.useState('1');

    const handleChange = (event: any, newValue: React.SetStateAction<string>) => {
        setValue(newValue);
    }
    const NSA = useRef(''); const NRO= useRef(""); const CIA=useRef(""); const AWS= useRef("")

    if (isConnected) return(
        
        <>

        <TabContext value={value}>
        <Box sx={{ borderBottom: 1 ,borderColor: 'divider', bgcolor:"FloralWhite", borderRadius: "25px" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="Sign In" value="1" />
            <Tab label="Sign Up" value="2" />
          </TabList>
        </Box>
        <TabPanel value="2">

        <Box
             component="span"
             m={1} //margin
             className={classes.box2}
        >
            <h1 style={{color: "black", fontSize: "2vw", margin: 'auto', alignItems: 'center', justifyContent: 'center'}}> If you would like to test this prototype, you must fill out the form below. </h1>
            <div style={{ color: "black" }}> Usually, only the owner of the contract can add the wallet addresses of authorized users/providers. However, for the purposes of testing, you may add one wallet address for each user/provider type. This will effectively authorize that account to sign in as that user/provider type.</div>
            
            <div style={{ color: "blue" }}>FYSA: you may have multiple wallet addresses within your metamask wallet on Rinkeby testnet.</div>

            
            <TextField label={'NRO authorized account'} id="filled-basic1"  variant="filled" placeholder="0x0000000000000000000000000000000000000000" inputRef={NRO}/>
            <TextField label={'CIA authorized account'} id="filled-basic2" variant="filled"  placeholder="0x0000000000000000000000000000000000000000" inputRef={CIA}/>
            <TextField  label={'NSA authorized account'} id="filled-basic3"  variant="filled" placeholder="0x0000000000000000000000000000000000000000" inputRef={NSA}/>
            <TextField  label={'AWS authorized account'} id="filled-basic4"  variant="filled" placeholder="0x0000000000000000000000000000000000000000" inputRef={AWS}/>
            
            {wrongInput ? (<p style= {{fontWeight:"bold", textAlign:"center", color:"red"}}> YOU ENTERED INCORRECT ADDRESSES </p>):
            (null)}
            
        <Button
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={() => AddBetaTesters()}
            >
            Authorize Accounts
        </Button>

        </Box>
        { alertCode === 2 ? <Alert severity="info">
            <AlertTitle>Mining</AlertTitle>
            <strong>Your transaction is mining ... Please wait</strong>
            </Alert> : alertCode === 3 ? <Alert onClose={() => {setalertCode(0)}} severity="success">
            <AlertTitle>Congratulations!</AlertTitle>
            <strong>You now have authorized accounts</strong>
            </Alert> : null }
        </TabPanel>

        <TabPanel value="1">
        
        

        <Box
            component="span"
            m={1} //margin
            className={`${classes.topLeftBox} ${classes.box}`}

        >
                <div style={{ color: "white" }}> Choose User Type: </div>


                <Button
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    disabled={!showUserButtons}
                    onClick={() => activateUserOrganizations(1)}
                >
                    User
                </Button>

                <Button
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    disabled={!showUserButtons}
                    onClick={() => activateProvidersOrganizations(2)}
                >
                    Storager Provider
                </Button>
                <Button
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    disabled={!showUserButtons}
                    onClick={() => activateProvidersOrganizations(3)}
                >
                    Cloud Provider
                </Button>
                <Button
                    className={classes.button}
                    color="primary"
                    variant="contained"
                    disabled={!showUserButtons}
                    onClick={() => activateProvidersOrganizations(4)}
                >
                    Both
                </Button>

            </Box>

            <div>
            {showOrgNames || showOrgNamesProvider ? (
                <><Box
                        component="span"
                        padding={1} //margin
                        className={`${classes.topLeftBox} ${classes.box}`}

                    >
                        <div style={{ color: "white" }}> Choose Organization: </div>

                        <Button
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            disabled={!showOrgNames}
                            onClick={() => SendtoDetermineUser(1)}
                        >
                            NRO
                        </Button>

                        <Button
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            disabled={!showOrgNames}
                            onClick={() => SendtoDetermineUser(2)}
                        >
                            NSA
                        </Button>
                        <Button
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            disabled={!showOrgNames}
                            onClick={() => SendtoDetermineUser(3)}
                        >
                            CIA
                        </Button>

                        <Button
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            disabled={!showOrgNamesProvider}
                            onClick={() => SendtoDetermineUser(4)}
                        >
                            AWS
                        </Button>

                        
                        <Button
                            className={classes.button}
                            color="primary"
                            variant="contained"
                            disabled={!showOrgNamesProvider}
                            onClick={() => SendtoDetermineUser(0)}
                        >
                            None
                        </Button>

                    </Box></>   
            ) : (null) }

        {alertCode === 1 ? <Alert onClose={() => {setalertCode(0)}} severity="error">
            <AlertTitle>Error</AlertTitle>
            <strong>You either denied the transaction or do not have the correct permissions</strong>
            </Alert> : 
            
            alertCode === 2 ? <Alert severity="info">
            <AlertTitle>Mining</AlertTitle>
            <strong>Your transaction is mining ... Please wait</strong>
            </Alert> :<></> }
            
        </div>

        </TabPanel>
        </TabContext>

            </>

        
    );
    return <Alert style={{marginTop:"5vw"}} severity="info">
    <AlertTitle style={{fontWeight:"bold"}}>Prototype Description</AlertTitle>
    Welcome to the prototype! This prototype is designed for an organization which relies on companies like AWS for its storage and computing needs. This interface is
        specifically designed for the Intelligence Community with the intent of authorizing users, connecting them with their parent organization, and then allowing them to upload and download data,
        as well as, send their machine learning models to a powerful computing node that can run their models on GPU and return the results. This prototype takes advantage of the blockchain architecture
        and utilizes decentralized distributed storage/cloud computing where any provider can join as a node and get paid based on how much they store or compute. Say bye to AWS management and protocols,
        distributed storage apps are here to stay. 
        <br></br> 
    <strong>
        NOTE: this wrapper specifically uses PINATA, IPFS and GOLEM within the pages. IF YOU DO NOT HAVE A METAMASK WALLET YOU WILL NOT BE ABLE TO CONTINUE. This contract is deployed on Rinkeby Testnet.
    </strong>
    </Alert> ;

    
}
