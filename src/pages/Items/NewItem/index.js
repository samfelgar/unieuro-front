import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ptBRLocale from "date-fns/locale/pt-BR";
import ErrorMessageDialog from "../../../components/ErrorMessageDialog";
import SnackAlert from "../../../components/SnackAlert";
import api from "../../../services/api";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
        },
    },
    formHeader: {
        paddingTop: 10,
    },
    buttons: {
        "& > *": {
            margin: 5,
        },
        width: "100%",
    },
}));

const NewItem = () => {
    const history = useHistory();
    const classes = useStyles();

    // Item fields
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [unit, setUnit] = useState("");
    const [formula, setFormula] = useState("");
    const [molecular_weight, setMolecularWeight] = useState("");
    const [concentration, setConcentration] = useState("");

    // Lot fields
    const [lotDescription, setLotDescription] = useState("");
    const [expiration, setExpiration] = useState(null);
    const [qtd, setQtd] = useState(1);

    // Feedback
    const [error, setError] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState("");
    const [snackMessage, setSnackMessage] = useState("");

    const unities = ["ML", "L", "UN", "G", "KG", "M", "CM", "MOL"];

    useEffect(() => {
        if (errorMessages.length > 0) {
            setError(true);
        }
    }, [errorMessages]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = {
            name,
            brand,
            unit,
            formula,
            molecular_weight,
            concentration,
            lot: {
                description: lotDescription,
                expiration,
                qtd,
            }
        };

        let returnFlag = false;
        if (!data.name) {
            setErrorMessages((errorMessages) =>
                errorMessages.concat("O campo nome deve estar preenchido.")
            );
            returnFlag = true;
        }
        if (!data.brand) {
            setErrorMessages((errorMessages) =>
                errorMessages.concat("O campo marca deve estar preenchido.")
            );
            returnFlag = true;
        }
        if (data.lot.qtd <= 0) {
            setErrorMessages((errorMessages) =>
                errorMessages.concat(
                    "O campo quantidade deve ser maior que zero."
                )
            );
            returnFlag = true;
        }
        if (!data.unit) {
            setErrorMessages((errorMessages) =>
                errorMessages.concat("Selecione uma unidade.")
            );
            returnFlag = true;
        }
        if (returnFlag) {
            return;
        }

        api.post("/items", data)
            .then((response) => {
                setSeverity("success");
                setSnackMessage(
                    `O item "${response.data.name}" foi criado com sucesso!`
                );
                setOpenSnack(true);
            })
            .catch((error) => {
                setSeverity("error");
                setSnackMessage("Ocorreu um erro em sua solicitação.");
                setOpenSnack(true);
            });
    };

    const handleCloseDialog = () => {
        setError(false);
        setErrorMessages([]);
    };

    const handleCloseSnackBar = () => {
        if (severity === "success") {
            history.goBack();
        }
        setOpenSnack(false);
    };

    return (
        <Container>
            <h1>Novo item</h1>
            <form onSubmit={handleSubmit}>
                <Paper className={classes.root}>
                    <h3 className={classes.formHeader}>Dados do item</h3>
                    <TextField
                        label="Nome"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                    <TextField
                        label="Marca"
                        value={brand}
                        onChange={(event) => setBrand(event.target.value)}
                        required
                    />
                    <TextField
                        id="unit-label"
                        select
                        label="Unidade"
                        value={unit}
                        onChange={(event) => setUnit(event.target.value)}
                        style={{ width: "20ch" }}
                        required
                    >
                        {unities.map((un) => (
                            <MenuItem key={un} value={un}>
                                {un}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Fórmula Química"
                        value={formula}
                        onChange={(event) => setFormula(event.target.value)}
                    />
                    <TextField
                        label="Peso Molecular"
                        value={molecular_weight}
                        onChange={(event) => setMolecularWeight(event.target.value)}
                    />
                    <TextField
                        label="Concentração"
                        value={concentration}
                        onChange={(event) => setConcentration(event.target.value)}
                    />
                    <h3 className={classes.formHeader}>Dados do lote</h3>
                    <TextField
                        label="Descrição do lote"
                        value={lotDescription}
                        onChange={(event) =>
                            setLotDescription(event.target.value)
                        }
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBRLocale}>
                        <KeyboardDatePicker
                            label="Validade"
                            views={['month', 'year']}
                            format="MM/yyyy"
                            onChange={(date) => setExpiration(date)}
                            value={expiration}
                            variant="inline"
                            disableToolbar
                            autoOk
                        />
                    </MuiPickersUtilsProvider>
                    <TextField
                        label="Quantidade"
                        value={qtd}
                        onChange={(event) => setQtd(event.target.value)}
                        type="number"
                        inputProps={{ min: 1, step: 0.1 }}
                        required
                    />
                    <div className={classes.buttons}>
                        <Button
                            onClick={(event) => handleSubmit(event)}
                            variant="contained"
                            color="primary"
                            style={{ marginBottom: 20 }}
                        >
                            Salvar
                        </Button>
                        <Button
                            onClick={() => {
                                history.goBack();
                            }}
                            variant="contained"
                            style={{ marginBottom: 20 }}
                        >
                            Voltar
                        </Button>
                    </div>
                </Paper>
            </form>
            <ErrorMessageDialog
                toggle={error}
                handleClose={handleCloseDialog}
                errors={errorMessages}
            />
            <SnackAlert
                openSnack={openSnack}
                onClose={handleCloseSnackBar}
                severity={severity}
                snackMessage={snackMessage}
            />
        </Container>
    );
};

export default NewItem;
