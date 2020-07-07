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

const EditItem = () => {

    const history = useHistory()
    const { id } = useParams()
    const classes = useStyles()
    const [item, setItem] = useState({
        id: 0,
        name: '',
        qtd: 0,
        unity: ''
    })
    const unities = ["ML", "L", "UN", "G", "KG", "M", "CM", "MOL"];
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [snackMessage, setSnackMessage] = useState('')
    const [error, setError] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    useEffect(() => {
        api.get(`items/${id}`)
            .then(response => {
                setItem(item => setItem(response.data))
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
        if (!item.name) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo nome deve estar preenchido."));
            returnFlag = true
        }
        if (item.qtd < 1) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo quantidade deve ser maior que zero."));
            returnFlag = true
        }
        if (!item.unity) {
            setErrorMessages(errorMessages => errorMessages.concat("Selecione uma unidade."));
            returnFlag = true
        }
        if (returnFlag) {
            return
        }

        api.put(`items/${item.id}`, item)
            .then(response => {
                setSeverity('success')
                setSnackMessage(`O item "${response.data.name}" foi salvo com sucesso!`)
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
            <h1>Editar item</h1>
            <Paper>
                <form className={classes.root} onSubmit={handleSubmit}>
                    <TextField
                        label="Nome"
                        value={item.name}
                        onChange={(event) => setItem({
                            ...item,
                            name: event.target.value
                        })}
                        required
                    />
                    <TextField
                        label="Quantidade"
                        value={item.qtd}
                        onChange={(event) => setItem({
                            ...item,
                            qtd: event.target.value
                        })}
                        type="number"
                        inputProps={{ min: 1, step: 0.1 }}
                        required
                    />
                    <TextField
                        id="unity-label"
                        select
                        label="Unidade"
                        value={item.unity}
                        onChange={(event) => setItem({
                            ...item,
                            unity: event.target.value
                        })}
                        required
                    >
                        {unities.map((un) => (
                            <MenuItem key={un} value={un}>
                                {un}
                            </MenuItem>
                        ))}
                    </TextField>
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

export default EditItem