import React, {useEffect, useState} from 'react'
import Container from "@material-ui/core/Container";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from '@material-ui/core/Button'
import api from '../../services/api'
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {useHistory} from 'react-router-dom'
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import Paper from '@material-ui/core/Paper'
import AddCircleIcon from "@material-ui/icons/AddCircle";
import LockIcon from "@material-ui/icons/Lock"

const Users = () => {
    const [users, setUsers] = useState([])
    const [selectedItem, setSelectedItem] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)
    const history = useHistory()

    const fetchData = () => {
        let _isMounted = true
        api.get('/users')
            .then(response => {
                if (_isMounted) {
                    setUsers(response.data)
                }
            })
            .catch(error => {
                console.log(error.response)
            })
        return () => _isMounted = false
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleDialogClose = () => {
        setOpenDialog(false)
    }

    const handleDeleteButton = () => {
        api.delete(`/users/${selectedItem}`)
            .then(response => {
                fetchData()
                setOpenDialog(false)
            })
    }

    return (
        <Container>
            <h1>Usuários</h1>
            <Button
                onClick={() => {
                    history.push("/users/new");
                }}
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                style={{ marginBottom: 20 }}
            >
                Novo usuário
            </Button>
            <TableContainer component={Paper}>
                <Table>

                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>E-mail</TableCell>
                            <TableCell>Perfil</TableCell>
                            <TableCell>Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id} hover>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role.description}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="default"
                                        startIcon={<EditIcon />}
                                        onClick={() => {
                                            history.push(`users/edit/${user.id}`);
                                        }}
                                        size="small"
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        startIcon={<LockIcon />}
                                        style={{ marginRight: 5, marginLeft: 5 }}
                                        onClick={() => history.push(`/users/${user.id}/redefine`)}
                                    >
                                        Redefinir senha
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => {
                                            setSelectedItem(user.id);
                                            setOpenDialog(true);
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
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{"Apagar item?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja realmente excluir este item?
                        <strong> Não é possível desfazer esta ação.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancelar</Button>
                    <Button
                        onClick={() => handleDeleteButton(selectedItem)}
                        color="secondary"
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default Users