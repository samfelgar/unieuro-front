import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import AddCircleIcon from '@material-ui/icons/AddCircle'
import Button from '@material-ui/core/Button'
import api from '../../services/api'

const Items = () => {

    const [ items, setItems ] = useState([])
    const [ errorMessage, setErrorMessage ] = useState('')
    const history = useHistory()

    useEffect(() => {
        api.get('/items')
            .then(response => {
                setItems(response.data)
            })
            .catch(error => {
                setErrorMessage(error)
            })
    }, [])

    return (
        <Container>
            <h1>Itens</h1>
            <Button 
                onClick={() => { history.push('/items/new') }}
                variant="contained" 
                color="primary" 
                startIcon={<AddCircleIcon />} 
                style={{ marginBottom: 20 }}
            >
                Novo item
            </Button>
            <TableContainer component={Paper} style={{width: '80%'}}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Unidade</TableCell>
                            <TableCell>Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.qtd}</TableCell>
                                <TableCell>{item.unity}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => { history.push('/items/edit/' + item.id)}}
                                        size="small"
                                        style={{ marginRight: 5}}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => { history.push('/items/delete/' + item.id)}}
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
        </Container>
    )
}

export default Items