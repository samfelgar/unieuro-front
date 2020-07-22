import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
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
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Button from '@material-ui/core/Button'
import SnackAlert from '../../../components/SnackAlert'
import api from "../../../services/api";

const ListOrders = () => {
    const [orders, setOrders] = useState([]);
    const [openSnack, setOpenSnack] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [severity, setSeverity] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState('')

    const history = useHistory();

    useEffect(() => {
        api.get("orders").then((response) => {
            setOrders(response.data);
        });
    }, []);

    const handleDialogClose = () => {
        setOpenDialog(false)
    }

    const handleSnackClose = () => {
        setOpenSnack(false)
    }

    return (
        <Container>
            <h1>Pedidos</h1>
            <TableContainer component={Paper} >
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
                                    {new Date(order.due_date).getDate()}/
                                    {new Date(order.due_date).getMonth() + 1}/
                                    {new Date(order.due_date).getFullYear()}
                                </TableCell>
                                <TableCell>
                                    {order.status ? "A liberar" : "Liberada"}
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
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>{"Apagar item?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Deseja realmente excluir este item?
                        <strong> Não é possível desfazer esta ação.</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button>Cancelar</Button>
                    <Button
                        color="secondary"
                    >
                        Excluir
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ListOrders;
