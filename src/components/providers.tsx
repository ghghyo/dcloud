import { Button, makeStyles } from "@material-ui/core"
import { useNavigate} from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import React, { Component }  from 'react';

const useStyles = makeStyles((theme) => ({
    button:{
 

        backgroundColor: "white",
        padding: "1vw 1vw",
        fontSize: "0.6vw",
        bottom: 10,
        left: "10%",
        marginLeft: -100,
        position: "absolute"
        
    },

}))

function Providers() {
    
    const classes = useStyles()
    let navigate=useNavigate()
    function Goback(){
        navigate("/",{replace:true})
    }

  return (
    
    <div style={{ color: "white" }}>
        <Button
                    className={classes.button}
                    color="primary"
                    
                    onClick={() => Goback()}
                >
                    Go Back
        </Button>
        <div>
        &nbsp;&nbsp;&nbsp;&nbsp;
        </div>

        <Alert severity="info">
            <AlertTitle>TBC</AlertTitle>
            <strong>Hello Providers! Although this is a prototype, you can expect instructions for how to connect to our API here in the future. So next time you are in the area,
                bring your computing power and storage and hop on over for a visit!
            </strong>
        </Alert> <></> 

        
    </div>
  )
}

export default Providers