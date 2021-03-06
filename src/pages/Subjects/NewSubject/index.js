import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import {useHistory} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Container from '@material-ui/core/Container';
import api from '../../../services/api';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';
import SnackAlert from '../../../components/SnackAlert';
import {Box, FormControl} from "@material-ui/core";
import styles from './styles.module.css'
import InputLabel from "@material-ui/core/InputLabel";

const NewSubject = () => {

    const history = useHistory()
    const [classes, setClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState('');
    const [snackMessage, setSnackMessage] = useState('');

    useEffect(() => {
        api.get('/classes')
            .then(response => {
                setClasses(response.data);
            })
            .catch(error => {
                setSnackMessage('Não foi possível obter os cursos.');
                setSeverity('error');
                setOpenSnack(true);
            })
    }, []);

    useEffect(() => {
        if (errorMessages.length > 0) {
            setError(true)
        }
    }, [errorMessages])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            description,
            'classroom': selectedClass,
        };
        let returnFlag = false
        if (!data.description) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo descrição deve estar preenchido."));
            returnFlag = true
        }
        if (!data.classroom) {
            setErrorMessages(errorMessages => errorMessages.concat("Você deve selecionar um curso."));
            returnFlag = true
        }
        if (returnFlag) {
            return
        }
        api.post('/subjects', data)
            .then(response => {
                setSeverity('success')
                setSnackMessage(`A disciplina "${response.data.description}" foi criada com sucesso!`)
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
            <h1>Nova disciplina</h1>
            <Paper>
                <Box p={2}>
                    <form onSubmit={handleSubmit}>
                        <Box mr={1} component="span">
                            <TextField
                                label="Descrição"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                required
                                className={styles.formField}
                            />
                            <FormControl style={{ marginLeft: 10 }}>
                                <InputLabel>Turma</InputLabel>
                                <Select
                                    onChange={(event) => setSelectedClass(event.target.value)}
                                    required
                                    className={styles.formField}
                                >
                                    {classes.map(classObj => (
                                        <MenuItem value={classObj.id}>{classObj.description}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box mt={2}>
                            <Box mr={1} component="span">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
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

export default NewSubject;