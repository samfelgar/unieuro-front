import React, {useState, useEffect} from "react";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import api from "../../../services/api";
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import ptBRLocale from "date-fns/locale/pt-BR";
import {tableIcons, localization} from "../../../utils/materialTableUtils";
import {makeStyles} from "@material-ui/core";
import {Switch, Route, Link as RouterLink, useHistory, useRouteMatch} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import SnackAlert from "../../../components/SnackAlert";

const useStyles = makeStyles((theme) => ({
    continueButton: {
        marginBottom: 10,
    },
    goBackButton: {
        marginTop: 10,
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
    },
}));

const SelectQuantities = ({selectedItems, calculateQtd}) => {
    const [items, setItems] = useState([]);
    const [dueDate, setDueDate] = useState(null);

    const classes = useStyles();
    const history = useHistory();

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [snackMessage, setSnackMessage] = useState('');

    const handleChangeQuantity = (changedItem) => {
        let newItems = items
        const index = newItems.findIndex(item => item.id === changedItem.id)
        if (index < 0) {
            newItems.push(changedItem)
        } else {
            newItems[index] = changedItem
        }
        setItems(newItems)
    };

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const handleSave = () => {
        try {
            const currentUser = sessionStorage.getItem('userId')
            const data = {
                'user_id': currentUser,
                'due_date': dueDate,
                items
            }

            if (!data.due_date) {
                throw new Error('Selecione uma data de entrega.')
            }

            if (data.items.length < 1 || data.items.length !== selectedItems.length) {
                throw new Error('Você deve definir quantidades para os itens selecionados.')
            }

            data.items.forEach(item => {
                if (!item.qtd || item.qtd <= 0) {
                    throw new Error('Você deve definir quantidades para todos os itens selecionados.')
                }
            })

            api.post('/orders', data)
                .then(response => {
                    setSnackMessage(`O pedido #${response.data.id} foi incluído com successo.`)
                    setSeverity('success')
                    setOpenSnack(true)
                })
                .catch(error => {
                    setSnackMessage(`Houve um erro em sua requisição. STATUS ${error.response.status}`)
                    setSeverity('error')
                    setOpenSnack(true)
                })
        } catch (error) {
            setDialogMessage(error)
            setOpenDialog(true)
        }
    }

    const handleCloseSnackBar = () => {
        if (severity === 'success') {
            history.push('/orders')
        }
        setOpenSnack(false)
    }

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSave()
        }
    }

    return (
        <>
            <p>Defina a quantidade desejada</p>
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBRLocale}>
                <KeyboardDatePicker
                    label="Data de entrega"
                    format="dd/MM/yyyy"
                    onChange={(date) => setDueDate(date)}
                    value={dueDate}
                    variant="inline"
                    disableToolbar
                    disablePast
                    autoOk
                />
            </MuiPickersUtilsProvider>
            <span className={classes.buttonContainer}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.continueButton}
                    onClick={handleSave}
                >
                    Salvar
                </Button>
            </span>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Quantidade disponível</TableCell>
                            <TableCell>Unidade</TableCell>
                            <TableCell>Quantidade desejada</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{calculateQtd(item.lots)}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        inputProps={{
                                            min: 0.1,
                                            step: 0.1,
                                        }}
                                        onChange={(event) =>
                                            handleChangeQuantity({
                                                id: item.id,
                                                qtd: event.target.value,
                                            })
                                        }
                                        onKeyPress={handleKeyPress}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Button
                variant="contained"
                className={classes.goBackButton}
                onClick={() => history.goBack()}
            >
                Voltar
            </Button>
            <SnackAlert
                openSnack={openSnack}
                onClose={handleCloseSnackBar}
                severity={severity}
                snackMessage={snackMessage}
            />
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{'Atenção'}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant="contained" color="primary">Fechar</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const NewOrder = ({match}) => {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const classes = useStyles();
    const {path} = useRouteMatch()

    useEffect(() => {
        api.get("items/all").then((response) => {
            setItems(response.data);
        });
    }, []);

    const calculateQtd = (lots) => {
        if (lots.length < 1) {
            return 0;
        }
        let qtd = 0;
        lots.forEach((lot) => {
            qtd += Number(lot.qtd);
        });
        return qtd;
    };

    return (
        <Container>
            <h1>Novo pedido</h1>
            <Switch>
                <Route path={`${path}/quantity`}>
                    <SelectQuantities selectedItems={selectedItems} calculateQtd={calculateQtd}/>
                </Route>
                <Route exact path={`${path}`}>
                    <p>
                        Selecione os itens desejados abaixo e clique em
                        continuar
                    </p>
                    <div className={classes.buttonContainer}>

                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.continueButton}
                            component={RouterLink}
                            to={"/orders/new/quantity"}
                        >
                            Continuar
                        </Button>
                    </div>
                    <form>
                        <MaterialTable
                            columns={[
                                {title: "Item", field: "name"},
                                {
                                    title: "Quantidade disponível",
                                    field: "qtd",
                                    render: rowData => calculateQtd(rowData.lots),
                                    searchable: false,
                                },
                                {
                                    title: "Unidade",
                                    field: "unit",
                                    searchable: false,
                                },
                            ]}
                            data={items}
                            title="Itens disponíveis"
                            icons={tableIcons}
                            localization={localization}
                            options={{
                                selection: true,
                                sorting: false,
                                draggable: false,
                            }}
                            onSelectionChange={(rows) =>
                                setSelectedItems(rows)
                            }
                        />
                    </form>
                </Route>
            </Switch>
        </Container>
    );
};

export default NewOrder;
