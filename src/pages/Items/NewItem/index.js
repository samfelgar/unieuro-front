import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
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

const NewItem = () => {
    const history = useHistory();
    const classes = useStyles();

    const [name, setName] = useState("");
    const [qtd, setQtd] = useState(1);
    const [unity, setUnity] = useState("");
    const [error, setError] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [snackMessage, setSnackMessage] = useState('')

    const unities = ["ML", "L", "UN", "G", "KG", "M", "CM", "MOL"];

    useEffect(() => {
        if (errorMessages.length > 0) {
            setError(true)
        }
    }, [errorMessages])
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            name,
            qtd,
            unity,
        };

        let returnFlag = false
        if (!data.name) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo nome deve estar preenchido."));
            returnFlag = true
        }
        if (data.qtd <= 0) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo quantidade deve ser maior que zero."));
            returnFlag = true
        }
        if (!data.unity) {
            setErrorMessages(errorMessages => errorMessages.concat("Selecione uma unidade."));
            returnFlag = true
        }
        if (returnFlag) {
            return
        }

        api.post('/items', data)
            .then(response => {
                setSeverity('success')
                setSnackMessage(`O item "${response.data.name}" foi criado com sucesso!`)
                setOpenSnack(true)
            })
            .catch(error => {
                setSeverity('error')
                setSnackMessage('Ocorreu um erro em sua solicitação.')
                setOpenSnack(true)
            })
    };

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
            <h1>Novo item</h1>
            <Paper>
                <form className={classes.root} onSubmit={handleSubmit}>
                    <TextField
                        label="Nome"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    <TextField
                        label="Quantidade"
                        value={qtd}
                        onChange={(event) => setQtd(event.target.value)}
                        type="number"
                        inputProps={{ min: 1, step: 0.1 }}
                        required
                    />
                    <TextField
                        id="unity-label"
                        select
                        label="Unidade"
                        value={unity}
                        onChange={(event) => setUnity(event.target.value)}
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
};

export default NewItem;
