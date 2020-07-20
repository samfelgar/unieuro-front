import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import SnackAlert from '../../components/SnackAlert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import api from '../../services/api';
import AddCircleIcon from '@material-ui/icons/AddCircle';



const Roles = () => {
    const history = useHistory()
    const [roles, setRoles] = useState([])
    const [severity, setSeverity] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [openSnack, setOpenSnack] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });
    const classes = useStyles();




    function createData(name,) {
        return { name };
    }
    useEffect(() => {
        fetchRoles()
    }, [])

    const fetchRoles = () => {
        api.get('/roles')
            .then(response => {
                setRoles(response.data)
                console.log(response.data);
            })
            .catch(error => {
                setFeedbackMessage('Não foi possível acessar os perfis.')
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
        console.log(id)
        api.delete(`roles/${id}`)
            .then(response => {
                fetchRoles()
                setOpenDialog(false)
                setFeedbackMessage('O perfil foi excluído.')
                setSeverity('success')
                setOpenSnack(true)
            })
            .catch(error => {
                setFeedbackMessage('Não foi possível excluir o perfil.')
                setSeverity('error')
                setOpenSnack(true)
            })
    }
    return (

        <Container>
            <h1>Perfils</h1>
            <Button
                onClick={() => { history.push('/roles/new') }}
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                style={{ marginBottom: 20 }}
            >
                Novo Perfil
           </Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {roles.map((role) => (
                            <TableRow key={role.id}>
                                <TableCell component="th" scope="row">
                                    {role.description}
                                </TableCell>
                                <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    onClick={() => { history.push('/roles/edit/' + role.id) }}
                                    size="small"
                                    style={{ marginRight: 5 }}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => {
                                        setSelectedRoles(role.id)
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
            <SnackAlert openSnack={openSnack} onClose={handleSnackClose} severity={severity} snackMessage={feedbackMessage} />
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
            >
                <DialogTitle>{"Apagar Perfil?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja realmente excluir este perfil?
                        <strong> Não é possível desfazer esta ação.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>
                        Cancelar
                    </Button>
                    <Button onClick={() => handleDeleteButton(selectedRoles)} color="secondary">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Roles;
