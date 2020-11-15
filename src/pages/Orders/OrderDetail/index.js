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
import SnackAlert from "../../../components/SnackAlert";

const OrderDetail = () => {
    const initialOrder = {
        id: null,
        due_date: null,
        due_time: null,
        user: {
            username: '',
            email: ''
        },
        lab: {
            description: ''
        },
        course: {
            description: ''
        },
        items: []
    }
    const [order, setOrder] = useState(initialOrder)
    const [grant, setGrant] = useState(false)
    const currentRoleId = sessionStorage.getItem('roleId')
    const {id} = useParams()
    const history = useHistory()

    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [snackMessage, setSnackMessage] = useState('');

    useEffect(() => {
        api.get(`/roles/${currentRoleId}`)
            .then(response => {
                if (response.data.description === 'Almoxarifado') {
                    setGrant(true)
                }
            })
            .catch(error => {
                console.log(error.response)
            })
        api.get(`/orders/${id}`)
            .then(response => {
                setOrder(response.data)
            })
            .catch(error => {
                console.log(error.response.data)
            })
    }, [currentRoleId, id])

    const dispatchButton = () => {
        return (
            <Button
                variant="contained"
                color="primary"
                onClick={() => history.push(`/orders/${order.id}/items/lots`)}
            >
                Liberar pedido
            </Button>
        )
    }

    const handleProcessingButtonClick = () => {
        api.put(`/orders/processing/${order.id}`)
            .then(response => {
                setSnackMessage('Operação concluída com sucesso!')
                setSeverity('success')
                setOpenSnack(true)
            })
            .catch(error => {
                setSnackMessage(error.response.data.message)
                setSeverity('error')
                setOpenSnack(true)
            })
    }

    const processingButton = () => {
        return (
            <div style={{ marginLeft: 10 }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleProcessingButtonClick}
                >
                    Marcar como "em processamento"
                </Button>
            </div>
        )
    }

    const handleCloseSnackBar = () => {
        setOpenSnack(false);
    }

    return (
        <Container>
            <h1>Pedido #{order.id}</h1>
            <Typography><strong>Solicitante:</strong> {order.user.username} {`(${order.user.email})`}</Typography>
            <Typography><strong>Data de
                entrega:</strong> {order.hasOwnProperty('due_date') ? getFormattedDate(order.due_date) : ''}
            </Typography>
            <Typography><strong>Hora de entrega:</strong> {order.due_time}</Typography>
            <Typography><strong>Curso:</strong> {order.course.description}</Typography>
            <Typography><strong>Laboratório:</strong> {order.lab.description}</Typography>
            <Typography><strong>Liberada:</strong> {order.dispatched !== 'created' ? 'Sim' : 'Não'}</Typography>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 10}}>
                {grant && order.dispatched === 'created' ? dispatchButton() : null}
                {grant && order.dispatched === 'created' ? processingButton() : null}
            </div>
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
            <SnackAlert
                openSnack={openSnack}
                onClose={handleCloseSnackBar}
                severity={severity}
                snackMessage={snackMessage}
            />
        </Container>
    )

}

export default OrderDetail