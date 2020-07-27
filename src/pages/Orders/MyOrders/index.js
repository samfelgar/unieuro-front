import React, {useEffect, useState} from 'react'
import Container from "@material-ui/core/Container";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button"
import SnackAlert from "../../../components/SnackAlert";
import Paper from "@material-ui/core/Paper";
import {getFormattedDate} from "../../../utils/formatDate";

import {useHistory} from 'react-router-dom'
import api from '../../../services/api'

const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [snackMessage, setSnackMessage] = useState('')
    const [severity, setSeverity] = useState('success')
    const [openSnack, setOpenSnack] = useState(false)
    const currentUser = sessionStorage.getItem('userId')
    const history = useHistory()

    const handleCloseSnackbar = () => {
        setOpenSnack(false)
    }

    useEffect(() => {
        api.get(`/user/${currentUser}/orders`)
            .then(response => {
                setOrders(response.data)
            })
            .catch(error => {
                setSnackMessage(error.response.data)
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [currentUser])

    return (
        <Container>
            <h1>Meus pedidos</h1>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Pedido</TableCell>
                            <TableCell>Data de entrega</TableCell>
                            <TableCell>Liberada?</TableCell>
                            <TableCell>Detalhes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map(order => (
                            <TableRow key={order.id} hover>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.hasOwnProperty('due_date') ? getFormattedDate(order.due_date) : ''}</TableCell>
                                <TableCell>{order.dispatched ? 'Sim' : 'Não'}</TableCell>
                                <TableCell>
                                    <Button variant="contained"
                                            onClick={() => history.push(`/orders/detail/${order.id}`)}
                                            color="primary"
                                            size="small"
                                    >Abrir pedido</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <SnackAlert onClose={handleCloseSnackbar} openSnack={openSnack} severity={severity}
                        snackMessage={snackMessage}/>
        </Container>
    )
}

export default MyOrders