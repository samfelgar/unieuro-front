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
        brand: '',
        unit: '',
        formula: '',
        molecular_weight: '',
        concentration: ''
    })
    const units = ["ML", "L", "UN", "G", "KG", "M", "CM", "MOL"];
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [snackMessage, setSnackMessage] = useState('')
    const [error, setError] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])

    useEffect(() => {
        api.get(`items/${id}`)
            .then(response => {
                setItem(response.data)
            })
            .catch(error => {
                setSnackMessage(error.response.data.error)
                setSeverity('error')
                setOpenSnack(true)
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
        if (!item.unit) {
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

    const handleInputChange = event => {
        const {name, value} = event.target
        setItem({
            ...item,
            [name]: value
        })
    }

    return (
        <Container>
            <h1>Editar item</h1>
            <Paper>
                <form className={classes.root} onSubmit={handleSubmit}>
                    <TextField
                        label="Nome"
                        name="name"
                        value={item.name}
                        onChange={handleInputChange}
                        required
                    />
                    <TextField
                        label="Marca"
                        name="brand"
                        value={item.brand}
                        onChange={handleInputChange}
                    />
                    <TextField
                        name="unit"
                        select
                        label="Unidade"
                        value={item.unit}
                        onChange={handleInputChange}
                        required
                    >
                        {units.map((unit) => (
                            <MenuItem key={unit} value={unit}>
                                {unit}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Fórmula Química"
                        name="formula"
                        value={item.formula}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Peso molecular"
                        name="molecular_weight"
                        value={item.molecular_weight}
                        onChange={handleInputChange}
                    />
                    <TextField
                        label="Concentração"
                        name="concentration"
                        value={item.concentration}
                        onChange={handleInputChange}
                    />
                    <div className={classes.buttons}>
                        <Button
                            type="submit"
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