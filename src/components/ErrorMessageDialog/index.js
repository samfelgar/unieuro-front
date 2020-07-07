import React from 'react'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'

const ErrorMessageDialog = ({ toggle, errors, handleClose }) => {
    return (
        <Dialog open={toggle} onClose={handleClose}>
            <DialogTitle>Erro!</DialogTitle>
            <DialogContent>
                <DialogContentText>Foram encontrados os seguintes erros:</DialogContentText>
                {errors.map((error, index) => (
                    <DialogContentText key={index} style={{ color: 'red' }}>
                        {error}
                    </DialogContentText>
                ))}
            </DialogContent>
        </Dialog>
    )
}

export default ErrorMessageDialog
