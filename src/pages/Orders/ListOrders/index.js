import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import Container from "@material-ui/core/Container";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableFooter from "@material-ui/core/TableFooter";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import Button from '@material-ui/core/Button'
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem"
import SnackAlert from '../../../components/SnackAlert'
import api from "../../../services/api";
import styles from './styles.module.css';
import {getFormattedDate} from "../../../utils/formatDate";

const ListOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('created')
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState('')

    const history = useHistory();

    useEffect(() => {
        const url = `/orders?filter=${filter}`
        api.get(url)
            .then((response) => {
                setOrders(response.data);
            })
            .catch(error => {
                setFeedbackMessage(`Houve um problema em sua solicitação. Status: [${error.response.status}]`)
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [filter]);

    const handleSnackClose = () => {
        setOpenSnack(false)
    }

    return (
        <Container>
            <h1>Pedidos</h1>
            <div className={styles['filter-row']}>
                <Typography component="span">Filtrar:</Typography>
                <TextField select value={filter} onChange={event => setFilter(event.target.value)}
                           className={styles['filter-field']}>
                    <MenuItem value="created">Não liberados</MenuItem>
                    <MenuItem value="dispatched">Liberados</MenuItem>
                    <MenuItem value="all">Todos</MenuItem>
                </TextField>
            </div>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Pedido</TableCell>
                            <TableCell>Data de criação</TableCell>
                            <TableCell>Data de entrega</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>

                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id} hover>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>
                                    {new Date(order.created_at).getDate()}/
                                    {new Date(order.created_at).getMonth() + 1}/
                                    {new Date(order.created_at).getFullYear()}
                                </TableCell>
                                <TableCell>
                                    {getFormattedDate(order.due_date)}
                                </TableCell>
                                <TableCell>
                                    {order.dispatched === 'created' ? "A liberar" : "Liberado"}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        size="small"
                                        color="primary"
                                        variant="contained"
                                        onClick={() => history.push(`/orders/detail/${order.id}`)}
                                    >
                                        Abrir pedido
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            {/* <TablePagination
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={[]}
                                colSpan={3}
                                page={currentPage - 1}
                                count={totalItems}
                                onChangePage={handleChangePage}
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} de ${
                                        count !== -1 ? count : `more than ${to}`
                                    }`
                                }
                            /> */}
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
            <SnackAlert
                openSnack={openSnack}
                onClose={handleSnackClose}
                severity={severity}
                snackMessage={feedbackMessage}
            />
        </Container>
    );
};

export default ListOrders;
