import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import MaterialTable from "material-table";
import api from "../../../services/api";
import { tableIcons, localization } from "../../../utils/materialTableUtils";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    textField: {
        margin: 0,
        padding: 0,
        width: "10ch",
    },
    search: {
        marginBottom: 20,
    },
}));

const NewOrder = () => {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        api.get("items").then((response) => {
            setItems(response.data.data);
        });
    }, []);

    const handleChangeQtd = (id, qtd) => {
        let alreadyExists = false;
        selectedItems.forEach((item) => {
            if (item.id === id) {
                if (qtd < 1 || !qtd) {
                    setSelectedItems(
                        selectedItems.filter((item) => item.id === id)
                    );
                    alreadyExists = true;
                    return;
                }
                item.qtd = qtd;
                alreadyExists = true;
                return;
            }
        });

        if (alreadyExists) {
            return;
        }

        if (qtd < 1) {
            return;
        }

        setSelectedItems([...selectedItems, { id, qtd }]);
    };

    return (
        <Container>
            <h1>Novo pedido</h1>
            <p>Selecione os itens desejados abaixo</p>
            <form>
                <MaterialTable
                    columns={[
                        { title: "Item", field: "name" },
                        {
                            title: "Quantidade disponível",
                            field: "qtd",
                            searchable: false,
                        },
                        { title: "Unidade", field: "unity", searchable: false },
                        {
                            title: "Quantidade desejada",
                            render: (rowData) => (
                                <TextField
                                    size="small"
                                    type="number"
                                    inputProps={{ min: 1, step: 0.1 }}
                                    onChange={(event) => {
                                        handleChangeQtd(
                                            rowData.id,
                                            event.target.value
                                        )
                                    }
                                    }
                                />
                            ),
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
                    onSelectionChange={rows => console.log(rows)}
                />
            </form>
        </Container>
    );
};

export default NewOrder;
