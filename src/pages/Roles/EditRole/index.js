import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import ErrorMessageDialog from '../../../components/ErrorMessageDialog'
import SnackAlert from '../../../components/SnackAlert'
import api from '../../../services/api'

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "40ch",
        },
    },
    buttons: {
        "& > *": {
            margin: 5,
        },
        width: "100%",
    },
}));

const EditRole = () => {

    const history = useHistory()
    const { id } = useParams()
    const classes = useStyles()
    const [role, setRole] = useState({
        id: 0,
        description: ''
    })
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [snackMessage, setSnackMessage] = useState('')
    const [error, setError] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    useEffect(() => {
        api.get(`roles/${id}`)
            .then(response => {
                setRole(role => setRole(response.data))
            })
    }, [id])
    
    useEffect(() => {
        if (errorMessages.length > 0) {
            setError(true)
        }
    }, [errorMessages])

    const handleSubmit = event => {
        event.preventDefault()
        let returnFlag = false
        if (!role.description) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo nome deve estar preenchido."));
            returnFlag = true
        }
        if (returnFlag) {
            return
        }
        api.put(`roles/${role.id}`, role)
            .then(response => {
                setSeverity('success')
                setSnackMessage(`O Perfil "${response.data.description}" foi salvo com sucesso!`)
                setOpenSnack(true)
            })
            .catch(error => {
                setSeverity('error')
                setSnackMessage('Ocorreu um erro em sua solicitação.')
                setOpenSnack(true)
            })
    }

    const handleCloseDialog = () => {
        setError(false)
        setErrorMessages([])
    }

    const handleCloseSnackBar = () => {
        if (severity === 'success') {
            history.goBack()
        }
        setOpenSnack(false)
    }

    return (
        <Container>
            <h1>Editar Perfil</h1>
            <Paper>
                <form className={classes.root} onSubmit={handleSubmit}>
                    <TextField
                        label="Nome"
                        value={role.description}
                        onChange={(event) => setRole({
                            ...role,
                            description: event.target.value
                        })}
                        required
                    />
                    <div className={classes.buttons}>
                        <Button
                            onClick={(event) => handleSubmit(event)}
                            variant="contained"
                            color="primary"
                            style={{ marginBottom: 20 }}
                        >
                            Salvar
                        </Button>
                        <Button
                            onClick={() => {
                                history.goBack();
                            }}
                            variant="contained"
                            style={{ marginBottom: 20 }}
                        >
                            Voltar
                        </Button>
                    </div>
                </form>
            </Paper>
            <ErrorMessageDialog toggle={error} handleClose={handleCloseDialog} errors={errorMessages} />
            <SnackAlert openSnack={openSnack} onClose={handleCloseSnackBar} severity={severity} snackMessage={snackMessage} />
        </Container>
    );
}

export default EditRole;