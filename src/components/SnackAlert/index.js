import React from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'

const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const SnackAlert = ({ openSnack, onClose, severity, snackMessage }) => {

    return (
        <Snackbar open={openSnack} autoHideDuration={2000} onClose={onClose}>
            <Alert severity={severity}>{snackMessage}</Alert>
        </Snackbar>
    )
}

export default SnackAlert