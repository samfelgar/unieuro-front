import React, {useEffect, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
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
import Typography from "@material-ui/core/Typography";
import {getFormattedDate} from "../../../utils/formatDate";

const OrderDetail = () => {
    const [order, setOrder] = useState({})
    const [user, setUser] = useState({})
    const [grant, setGrant] = useState(false)
    const currentRoleId = sessionStorage.getItem('roleId')
    const {id} = useParams()
    const history = useHistory()

    useEffect(() => {
        api.get(`/roles/${currentRoleId}`)
            .then(response => {
                if (response.data.description === 'Administração') {
                    setGrant(true)
                }
            })
            .catch(error => {
                console.log(error.response)
            })
        api.get(`/orders/${id}`)
            .then(response => {
                setOrder(response.data)
                api.get(`/users/${response.data.user_id}`)
                    .then(response => {
                        setUser(response.data)
                    })
                    .catch(error => {
                        console.log(error.response.data)
                    })
            })
            .catch(error => {
                console.log(error.response.data)
            })
    }, [currentRoleId, id])

    const dispatchButton = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10}}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push(`/orders/${order.id}/items/lots`)}
                >
                    Liberar pedido
                </Button>
            </div>
        )
    }

    return (
        <Container>
            <h1>Pedido #{order.id}</h1>
            <Typography><strong>Solicitante:</strong> {user.username} ({user.email})</Typography>
            <Typography><strong>Data de
                entrega:</strong> {order.hasOwnProperty('due_date') ? getFormattedDate(order.due_date) : ''}
            </Typography>
            <Typography><strong>Liberada:</strong> {order.dispatched ? 'Sim' : 'Não'}</Typography>
            {grant && !order.dispatched ? dispatchButton() : null}
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
                            {!order.items ? null : order.items.map(item => (
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
            <Button onClick={() => history.goBack()} variant="contained" style={{marginTop: 10}}>Voltar</Button>
        </Container>
    )

}

export default OrderDetail