import React, {useEffect, useState} from 'react';
import Button from '@material-ui/core/Button';
import {useHistory} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import {makeStyles} from '@material-ui/core/styles';
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


const Menu = () => {
    const history = useHistory()
    const [menu, setMenu] = useState([])
    const [severity, setSeverity] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState('')
    const [openSnack, setOpenSnack] = useState(false)
    const [selectedMenu, setSelectedMenu] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)

    const useStyles = makeStyles({
        table: {
            minWidth: 650,
        },
    });
    const classes = useStyles();

    useEffect(() => {
        fetchMenus()
    }, [])

    const fetchMenus = () => {
        api.get('/menus')
            .then(response => {
                setMenu(response.data)
                console.log(response.data.name);
            })
            .catch(error => {
                setFeedbackMessage('Não foi possível acessar as opções do Menu.')
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
        api.delete(`menus/${id}`)
            .then(response => {
                fetchMenus()
                setOpenDialog(false)
                setFeedbackMessage('A opção do Menu foi excluída.')
                setSeverity('success')
                setOpenSnack(true)
            })
            .catch(error => {
                setFeedbackMessage('Não foi possível excluir esta opção.')
                setSeverity('error')
                setOpenSnack(true)
            })
    }
    return (
        <Container>
            <h1>Menu</h1>
            <Button
                onClick={() => {
                    history.push('/menus/new')
                }}
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon/>}
                style={{marginBottom: 20}}
            >
                Novo menu
            </Button>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Caminho</TableCell>
                            <TableCell>Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {menu.map((menus) => (
                            <TableRow key={menus.id}>
                                <TableCell component="th" scope="row">
                                    {menus.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {menus.path}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon/>}
                                        onClick={() => {
                                            history.push('/menus/edit/' + menus.id)
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
                                            setSelectedMenu(menus.id)
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
                <DialogTitle>{"Apagar Perfil?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja realmente excluir este menu?
                        <strong> Não é possível desfazer esta ação.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>
                        Cancelar
                    </Button>
                    <Button onClick={() => handleDeleteButton(selectedMenu)} color="secondary">
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default Menu;
