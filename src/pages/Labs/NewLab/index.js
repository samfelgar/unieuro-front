import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import {useHistory} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import Container from '@material-ui/core/Container';
import api from '../../../services/api';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';
import SnackAlert from '../../../components/SnackAlert';
import {Box} from "@material-ui/core";
import styles from './styles.module.css'

const NewLab = () => {

    const history = useHistory()
    const [description, setDescription] = useState('');
    const [comment, setComment] = useState('');
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
            description,
            comment
        };
        let returnFlag = false
        if (!data.description) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo descrição deve estar preenchido."));
            returnFlag = true
        }
        if (returnFlag) {
            return
        }
        api.post('/labs', data)
            .then(response => {
                setSeverity('success')
                setSnackMessage(`O laboratório "${response.data.description}" foi criado com sucesso!`)
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
            <h1>Novo laboratório</h1>
            <Paper>
                <Box p={2}>
                    <form onSubmit={handleSubmit}>
                        <Box mr={1} component="span">
                            <TextField
                                label="Descrição"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                required
                            />
                        </Box>
                        <Box mr={1} component="span">
                            <TextField
                                label="Comentário"
                                value={comment}
                                onChange={(event) => setComment(event.target.value)}
                                className={styles.formField}
                            />
                        </Box>
                        <Box mt={2}>
                            <Box mr={1} component="span">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    style={{marginBottom: 20}}
                                >
                                    Salvar
                                </Button>
                            </Box>
                            <Box component="span">
                                <Button
                                    onClick={() => {
                                        history.goBack();
                                    }}
                                    variant="contained"
                                    style={{marginBottom: 20}}
                                >
                                    Voltar
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Paper>
            <ErrorMessageDialog toggle={error} handleClose={handleCloseDialog} errors={errorMessages}/>
            <SnackAlert openSnack={openSnack} onClose={handleCloseSnackBar} severity={severity}
                        snackMessage={snackMessage}/>
        </Container>
    );
}
export default NewLab;