import React, {useState, useEffect} from "react";
import {useHistory, useParams} from 'react-router-dom'
import api from "../../../services/api";
import SnackAlert from "../../../components/SnackAlert";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button";
import {getFormattedDate} from "../../../utils/formatDate";
import styles from './styles.module.css'

const Row = ({item, onChange}) => {

    const handleChange = event => {
        const lot = {
            id: event.target.dataset.id,
            qtySubtracted: event.target.value
        }
        onChange(lot)
    }

    return (
        <>
            <TableRow hover>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.formula}</TableCell>
                <TableCell>{item.molecular_weight}</TableCell>
                <TableCell>{item.concentration}</TableCell>
                <TableCell>{item.pivot.qtd}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={7}>
                    <p><strong>Lotes disponíveis ({item.name})</strong></p>
                    <Paper elevation={3}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>Descrição</TableCell>
                                    <TableCell>Validade</TableCell>
                                    <TableCell>Disponível</TableCell>
                                    <TableCell>Quantidade</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {item.lots.map((lot, index) => (
                                    <TableRow key={lot.id}>
                                        {index === 0 ? <TableCell rowSpan={item.lots.length} /> : null}
                                        <TableCell>{lot.description}</TableCell>
                                        <TableCell>{getFormattedDate(lot.expiration)}</TableCell>
                                        <TableCell>{lot.qtd}</TableCell>
                                        <TableCell>
                                            <TextField onChange={handleChange}
                                                       inputProps={{ 'data-id': lot.id, max: lot.qtd, min: 0}}
                                                       type="number"
                                                       required={index === 0 ? true : false}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </TableCell>
            </TableRow>
        </>
    )
}

const DispatchOrder = () => {

    const [order, setOrder] = useState({})
    const [qtyPerLot, setQtyPerLot] = useState([])
    const [severity, setSeverity] = useState('error')
    const [openSnack, setOpenSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const {orderId} = useParams()
    const history = useHistory()

    useEffect(() => {
        api.get(`orders/${orderId}/items/lots`)
            .then(response => {
                setOrder(response.data)
            })
            .catch(error => {
                setSnackMessage(`Houve um erro sua solicitação. Status: [${error.response.status}]`)
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [orderId])

    const handleCloseSnack = () => {
        if (severity === 'success') {
            history.push('/orders')
        }
        setOpenSnack(false)
    }

    const handleChange = changedLot => {
        let qtyPerLotsCopy = qtyPerLot
        const index = qtyPerLotsCopy.findIndex(lot => lot.id === changedLot.id)
        if (index < 0) {
            qtyPerLotsCopy.push(changedLot)
        } else {
            qtyPerLotsCopy[index] = changedLot
        }
        setQtyPerLot(qtyPerLotsCopy)
    }

    const handleSubmit = event => {
        event.preventDefault()
        const data = {
            lotsInformation: qtyPerLot
        }
        api.put(`/orders/dispatch/${orderId}`, data)
            .then(response => {
                setSnackMessage('O pedido foi liberado com sucesso!')
                setSeverity('success')
                setOpenSnack(true)
            })
            .catch(error => {
                setSnackMessage(error.response.data.error)
                setSeverity('error')
                setOpenSnack(true)
            })
    }

    return (
        <Container>
            <h1>Liberar pedido #{order.id}</h1>
            <Typography>Data do
                pedido: {order.hasOwnProperty('created_at') ? getFormattedDate(order.created_at) : ''}</Typography>
            <Typography>Data de
                entrega: {order.hasOwnProperty('due_date') ? getFormattedDate(order.due_date) : ''}</Typography>
            <h2>Itens</h2>
            <form onSubmit={handleSubmit}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell>Unidade</TableCell>
                                <TableCell>Marca</TableCell>
                                <TableCell>Fórmula</TableCell>
                                <TableCell>Peso molecular</TableCell>
                                <TableCell>Concentração</TableCell>
                                <TableCell>Quantidade solicitada</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.hasOwnProperty('items') ? order.items.map(item => (
                                <Row item={item} key={item.id} onChange={handleChange} />
                            )) : <TableRow><TableCell colSpan={7}>{'Sem resultados.'}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className={styles['button-row']}>
                    <Button variant="contained" color="primary" type="submit">Liberar</Button>
                    <Button variant="contained" onClick={() => history.goBack()}>Voltar</Button>
                </div>
            </form>
            <SnackAlert snackMessage={snackMessage} severity={severity} openSnack={openSnack}
                        onClose={handleCloseSnack}/>
        </Container>
    )
}

export default DispatchOrder