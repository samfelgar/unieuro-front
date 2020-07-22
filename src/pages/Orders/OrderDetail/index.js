import React, {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import Container from "@material-ui/core/Container";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'
import api from '../../../services/api'
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom'

const OrderDetail = () => {
    const [order, setOrder] = useState({})
    const {id} = useParams()
    const history = useHistory()

    useEffect(() => {
        api.get(`/orders/${id}`)
            .then(response => {
                console.log(response.data)
                setOrder(response.data)
            })
            .catch(error => {
                console.log(error.response.data)
            })
    }, [])

    return (
        <Container>
            <h1>Pedido #{order.id}</h1>
            <p><strong>Data de entrega:</strong> {order.due_date}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nome</TableCell>
                                <TableCell>Marca</TableCell>
                                <TableCell>Unidade</TableCell>
                                <TableCell>Quantidade solicitada</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!order.items ? '' : order.items.map(item => (
                                <TableRow key={item.id} hover>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.brand}</TableCell>
                                    <TableCell>{item.unit}</TableCell>
                                    <TableCell>{item.pivot.qtd}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Button onClick={() => history.goBack()} variant="contained" style={{ marginTop: 10 }}>Voltar</Button>
        </Container>
    )

}

export default OrderDetail