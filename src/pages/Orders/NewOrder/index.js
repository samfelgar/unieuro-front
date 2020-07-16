import React, { useState, useEffect } from "react";
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
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import { tableIcons, localization } from "../../../utils/materialTableUtils";
import { makeStyles } from "@material-ui/core";
import {
    BrowserRouter,
    Switch,
    Route,
    Link as RouterLink,
    useHistory,
} from "react-router-dom";

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

const SelectQuantities = ({ selectedItems }) => {
    const [items, setItems] = useState([]);

    const classes = useStyles();
    const history = useHistory();

    const handleChangeQuantity = (item) => {
        let newItems = items
        let sameItem = false
        newItems.forEach(oldItem => {
            if (oldItem.id === item.id) {
                oldItem.qtd = item.qtd
                sameItem = true
            }
        })
        if (!sameItem) {
            newItems.push(item)
        }
        setItems(newItems)
    };

    const handleSave = () => {
        console.log(items)
    }

    return (
        <>
            <p>Defina a quantidade desejada</p>

            <div className={classes.buttonContainer}>
                <MuiPickersUtilsProvider utils={DateFnsUtils} >
                    <span style={{ marginRight: 10, alignItems: 'flex-end' }}>Escolha da data de entrega do pedido</span>
                    <KeyboardDatePicker
                        minDate={new Date()}
                        format="dd/MM/yyyy"
                        onChange={date => console.log(date)}
                        variant="inline"
                        style={{ marginRight: 10 }}
                    />
                </MuiPickersUtilsProvider>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.continueButton}
                    onClick={handleSave}
                >
                    Salvar
                </Button>
            </div>
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
                                <TableCell>{item.qtd}</TableCell>
                                <TableCell>{item.unity}</TableCell>
                                <TableCell>
                                    <TextField
                                        type="number"
                                        inputProps={{
                                            min: 1,
                                            step: 0.1,
                                        }}
                                        onChange={(event) =>
                                            handleChangeQuantity({
                                                id: item.id,
                                                qtd: event.target.value,
                                            })
                                        }
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
        </>
    );
};

const NewOrder = ({ match }) => {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);

    const classes = useStyles();

    useEffect(() => {
        api.get("items/all").then((response) => {
            setItems(response.data);
        });
    }, []);

    return (
        <Container>
            <h1>Novo pedido</h1>
            <BrowserRouter>
                <Switch>
                    <Route path={`${match.path}/quantity`}>
                        <SelectQuantities selectedItems={selectedItems} />
                    </Route>
                    <Route exact path={match.path}>
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
                                    { title: "Item", field: "name" },
                                    {
                                        title: "Quantidade disponível",
                                        field: "qtd",
                                        searchable: false,
                                    },
                                    {
                                        title: "Unidade",
                                        field: "unity",
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
            </BrowserRouter>
        </Container>
    );
};

export default NewOrder;
