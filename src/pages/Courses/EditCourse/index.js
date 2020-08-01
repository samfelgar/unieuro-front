import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import {useHistory, useParams} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import Container from '@material-ui/core/Container';
import api from '../../../services/api';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';
import SnackAlert from '../../../components/SnackAlert';
import {Box} from "@material-ui/core";
import styles from './styles.module.css'

const EditCourse = () => {

    const history = useHistory()
    const {courseId} = useParams()
    const [course, setCourse] = useState({id: courseId, description: ''});
    const [error, setError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState('');
    const [snackMessage, setSnackMessage] = useState('');

    useEffect(() => {
        api.get(`/courses/${courseId}`)
            .then(response => {
                setCourse(response.data)
            })
            .catch(error => {
                setSnackMessage('Houve um erro em sua solicitação.')
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [courseId])

    useEffect(() => {
        if (errorMessages.length > 0) {
            setError(true)
        }
    }, [errorMessages])

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            description: course.description,
        };
        let returnFlag = false
        if (!data.description) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo descrição deve estar preenchido."));
            returnFlag = true
        }
        if (returnFlag) {
            return
        }
        api.put(`/courses/${courseId}`, data)
            .then(response => {
                setSeverity('success')
                setSnackMessage(`O curso "${response.data.description}" foi alterado com sucesso!`)
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
            <h1>Editar curso</h1>
            <Paper>
                <Box p={2}>
                    <form onSubmit={handleSubmit}>
                        <Box mr={1} component="span">
                            <TextField
                                label="Descrição"
                                value={course.description}
                                onChange={(event) => setCourse({
                                    ...course,
                                    description: event.target.value
                                })}
                                required
                                className={styles.formField}
                            />
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
export default EditCourse;