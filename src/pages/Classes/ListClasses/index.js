import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import {useHistory} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SnackAlert from '../../../components/SnackAlert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../../services/api';
import AddCircleIcon from '@material-ui/icons/AddCircle';


const ListClasses = () => {
    const history = useHistory()
    const [classes, setClasses] = useState([])
    const [severity, setSeverity] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [openSnack, setOpenSnack] = useState(false)
    const [selectedClass, setSelectedClass] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)

    useEffect(() => {
        fetchCourses()
    }, [])

    const fetchCourses = () => {
        api.get('/classes')
            .then(response => {
                setClasses(response.data)
            })
            .catch(error => {
                setFeedbackMessage('Houve um erro em sua solicitação.')
                setSeverity('error')
                setOpenSnack(true)
            })
    }
    const handleSnackClose = () => {
        setOpenSnack(false)
    }

    const handleDialogClose = () => {
        setOpenDialog(false)
    }

    const handleDeleteButton = id => {
        api.delete(`classes/${id}`)
            .then(response => {
                fetchCourses()
                setOpenDialog(false)
                setFeedbackMessage('A turma foi excluída.')
                setSeverity('success')
                setOpenSnack(true)
            })
            .catch(error => {
                setFeedbackMessage('Não foi possível excluir a turma.')
                setSeverity('error')
                setOpenSnack(true)
            })
    }

    return (
        <Container>
            <h1>Turmas</h1>
            <Button
                onClick={() => {
                    history.push('/classes/new')
                }}
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon/>}
                style={{marginBottom: 20}}
            >
                Nova turma
            </Button>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Curso</TableCell>
                            <TableCell>Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes.map((classObj) => (
                            <TableRow key={classObj.id}>
                                <TableCell>
                                    {classObj.description}
                                </TableCell>
                                <TableCell>
                                    {classObj.course.description}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon/>}
                                        onClick={() => {
                                            history.push('/classes/edit/' + classObj.id)
                                        }}
                                        size="small"
                                        style={{marginRight: 5}}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon/>}
                                        onClick={() => {
                                            setSelectedClass(classObj.id)
                                            setOpenDialog(true)
                                        }}
                                        size="small"
                                    >
                                        Excluir
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <SnackAlert openSnack={openSnack} onClose={handleSnackClose} severity={severity}
                        snackMessage={feedbackMessage}/>
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
            >
                <DialogTitle>{"Apagar turma?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja realmente excluir esta turma?
                        <strong> Não é possível desfazer esta ação.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>
                        Cancelar
                    </Button>
                    <Button onClick={() => handleDeleteButton(selectedClass)} color="secondary">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ListClasses;
