import { Button, makeStyles } from "@material-ui/core"
import { useEthers } from "@usedapp/core"
import React from 'react';


const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(4),
        display: "flex",
        justifyContent: "flex-end",
        gap: theme.spacing(1)
    },
title: {
        color: theme.palette.common.white,
        fontSize: "2vw",
        margin: 'auto',
        alignItems: 'center',
        justifyContent: 'center'
    }
}))


export const Header = () => {
    const classes = useStyles()

    const { account, activateBrowserWallet, deactivate } = useEthers()

    const isConnected = account !== undefined

    return (
        <><div className={classes.container}>
            <h1 className={classes.title}> Welcome to the future of storage and cloud computing!</h1>
            {isConnected ? (
                <Button  variant="contained" onClick={deactivate}>
                    Disconnect
                </Button>
            ) : (
                <Button
                    color="primary"
                    variant="contained"
                    onClick={() => activateBrowserWallet()}
                >
                    Connect
                </Button>
            )}
        </div><div style={{color: "red", display:"flex" ,justifyContent:"right", marginInlineEnd:20}} >
                {isConnected ? (
                    <div>
                    
                    </div>
                ) : (
                    <div >
                        You must connect your wallet before we begin  
                    </div>
                )}

            </div></>
    )
}