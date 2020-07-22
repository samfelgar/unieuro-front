import React, { useState, useEffect } from "react";
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
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Button from "@material-ui/core/Button";
import SnackAlert from "../../components/SnackAlert";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import api from "../../services/api";

const Items = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [previousPage, setPreviousPage] = useState("");
    const [nextPage, setNextPage] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(0);
    const [openSnack, setOpenSnack] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [severity, setSeverity] = useState("");
    const history = useHistory();

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = () => {
        api.get("/items")
            .then((response) => {
                setItems(response.data.data);
                setCurrentPage(response.data.current_page);
                setTotalItems(response.data.total);
                setPreviousPage(response.data.prev_page_url);
                setNextPage(response.data.next_page_url);
                setRowsPerPage(response.data.per_page);
            })
            .catch((error) => {
                setFeedbackMessage("Não foi possível acessar os itens.");
                setSeverity("error");
                setOpenSnack(true);
            });
    };

    const handleChangePage = (event, page) => {
        let url;
        if (page > currentPage - 1) {
            url = nextPage;
        } else {
            url = previousPage;
        }
        api.get(url)
            .then((response) => {
                setItems(response.data.data);
                setCurrentPage(response.data.current_page);
                setPreviousPage(response.data.prev_page_url);
                setNextPage(response.data.next_page_url);
            })
            .catch((error) => {
                setFeedbackMessage("Não foi possível acessar os itens.");
                setSeverity("error");
                setOpenSnack(true);
            });
    };

    const handleSnackClose = () => {
        setOpenSnack(false);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleDeleteButton = (id) => {
        console.log(id);
        api.delete(`items/${id}`)
            .then((response) => {
                fetchItems();
                setOpenDialog(false);
                setFeedbackMessage("O item foi excluído.");
                setSeverity("success");
                setOpenSnack(true);
            })
            .catch((error) => {
                setFeedbackMessage("Não foi possível excluir o item.");
                setSeverity("error");
                setOpenSnack(true);
            });
    };

    const calculateQtd = (lots) => {
        if (lots.length < 1) {
            return 0;
        }
        let qtd = 0;
        lots.map((lot) => {
            qtd += Number(lot.qtd);
        });
        return qtd;
    };

    return (
        <Container>
            <h1>Itens</h1>
            <Button
                onClick={() => {
                    history.push("/items/new");
                }}
                variant="contained"
                color="primary"
                startIcon={<AddCircleIcon />}
                style={{ marginBottom: 20 }}
            >
                Novo item
            </Button>
            <TableContainer component={Paper} style={{ width: "80%" }}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Unidade</TableCell>
                            <TableCell>Fórmula Química</TableCell>
                            <TableCell>Peso Molecular</TableCell>
                            <TableCell>Concentração</TableCell>
                            <TableCell>Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{calculateQtd(item.lots)}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.formula}</TableCell>
                                <TableCell>{item.molecular_weight}</TableCell>
                                <TableCell>{item.concentration}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => {
                                            history.push(
                                                "/items/edit/" + item.id
                                            );
                                        }}
                                        size="small"
                                        style={{ marginRight: 5 }}
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => {
                                            setSelectedItem(item.id);
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
                    <TableFooter>
                        <TableRow>
                            <TablePagination
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
                            />
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
    );
};

export default Items;
