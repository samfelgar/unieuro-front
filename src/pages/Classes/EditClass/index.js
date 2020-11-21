import React, {useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import {useHistory, useParams} from 'react-router-dom';
import Paper from "@material-ui/core/Paper";
import Container from '@material-ui/core/Container';
import api from '../../../services/api';
import ErrorMessageDialog from '../../../components/ErrorMessageDialog';
import SnackAlert from '../../../components/SnackAlert';
import {Box, FormControl} from "@material-ui/core";
import styles from './styles.module.css'
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const EditClass = () => {

    const history = useHistory()
    const {classId} = useParams()
    const [classObj, setClassObj] = useState({id: classId, description: ''});
    const [selectedCourse, setSelectedCourse] = useState(0);
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState('');
    const [snackMessage, setSnackMessage] = useState('');

    useEffect(() => {
        api.get(`/classes/${classId}`)
            .then(response => {
                setClassObj(response.data)
                setSelectedCourse(response.data.course_id)
                console.log(response.data.course_id)
            })
            .catch(error => {
                setSnackMessage('Houve um erro em sua solicitação.')
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [classId])

    useEffect(() => {
        api.get('courses')
            .then(response => {
                setCourses(response.data)
            })
            .catch(error => {
                setSnackMessage('Não foi possível obter os cursos.')
                setSeverity('error')
                setOpenSnack(true)
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
            'description': classObj.description,
            'course': selectedCourse,
        };
        let returnFlag = false
        if (!data.description) {
            setErrorMessages(errorMessages => errorMessages.concat("O campo descrição deve estar preenchido."));
            returnFlag = true
        }
        if (returnFlag) {
            return
        }
        api.put(`/classes/${classId}`, data)
            .then(response => {
                setSeverity('success')
                setSnackMessage(`A turma "${response.data.description}" foi alterada com sucesso!`)
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
            <h1>Editar turma</h1>
            <Paper>
                <Box p={2}>
                    <form onSubmit={handleSubmit}>
                        <Box mr={1} component="span">
                            <TextField
                                label="Descrição"
                                value={classObj.description}
                                onChange={(event) => setClassObj({
                                    ...classObj,
                                    description: event.target.value
                                })}
                                required
                                className={styles.formField}
                            />
                            <FormControl style={{ marginLeft: 10 }}>
                                <InputLabel>Curso</InputLabel>
                                <Select
                                    onChange={(event) => setSelectedCourse(event.target.value)}
                                    value={selectedCourse}
                                    required
                                    className={styles.formField}
                                >
                                    {courses.map(course => (
                                        <MenuItem value={course.id}>{course.description}</MenuItem>
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
export default EditClass;