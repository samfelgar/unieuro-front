import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import {useHistory} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import {makeStyles} from "@material-ui/core/styles";
import Container from '@material-ui/core/Container';
import api from '../../../services/api';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';
import SnackAlert from '../../../components/SnackAlert';
import {paths} from '../../../utils/routePaths'
import MenuItem from "@material-ui/core/MenuItem";

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

const NewMenu = () => {
    const history = useHistory()
    const classes = useStyles();
    const [name, setName] = useState('');
    const [path, setPath] = useState('');
    const [error, setError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState('');
    const [snackMessage, setSnackMessage] = useState('');

    useEffect(() => {
        if (errorMessages.length > 0) {
            setError(true)
        }
    }, [errorMessages])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            name,
            path
        };
        let returnFlag = false
        if (!data.name) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo nome deve estar preenchido."));
            returnFlag = true
        }
        if (!data.path) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo 'Caminho' deve estar preenchido."));
            returnFlag = true
        }
        if (returnFlag) {
            return
        }
        api.post('/menus', data)
            .then(response => {
                setSeverity('success')
                setSnackMessage(`O menu "${response.data.name}" foi criado com sucesso!`)
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
            <h1>Novo menu</h1>
            <Paper>
                <form className={classes.root} onSubmit={handleSubmit}>
                    <TextField
                        label="Nome"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    <TextField
                        label="Caminho"
                        value={path}
                        onChange={(event) => setPath(event.target.value)}
                        required
                        select
                    >
                        {paths.map(path => (
                            <MenuItem key={path.path} value={path.path}>{path.path}</MenuItem>
                        ))}
                    </TextField>
                </form>
                <div className={classes.buttons}>
                    <Button
                        onClick={(event) => handleSubmit(event)}
                        variant="contained"
                        color="primary"
                        style={{marginBottom: 20}}
                    >
                        Salvar
                    </Button>
                    <Button
                        onClick={() => {
                            history.goBack();
                        }}
                        variant="contained"
                        style={{marginBottom: 20}}
                    >
                        Voltar
                    </Button>
                </div>
            </Paper>
            <ErrorMessageDialog toggle={error} handleClose={handleCloseDialog} errors={errorMessages}/>
            <SnackAlert openSnack={openSnack} onClose={handleCloseSnackBar} severity={severity}
                        snackMessage={snackMessage}/>
        </Container>
    );
}
export default NewMenu;