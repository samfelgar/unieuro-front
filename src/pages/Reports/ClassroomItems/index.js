import React, {useEffect, useRef, useState} from 'react';
import api from "../../../services/api";
import {Container, FormControl} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import DateFnsUtils from "@date-io/date-fns";
import ptBRLocale from "date-fns/locale/pt-BR";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import SnackAlert from "../../../components/SnackAlert";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import ReactToPrint from "react-to-print";

const ClassroomItems = () => {

    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [classrooms, setClassrooms] = useState([])
    const [selectedClassroom, setSelectedClassroom] = useState('')
    const printableContent = useRef(null)

    const [feedback, setFeedback] = useState('')
    const [severity, setSeverity] = useState('error')
    const [openSnack, setOpenSnack] = useState(false)

    useEffect(() => {
        api.get('classes')
            .then(response => {
                setClassrooms(response.data)
            })
            .catch(error => {
                setFeedback('Não foi possível obter as turmas.');
                setSeverity('error');
                setOpenSnack(true);
            })
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            setDisplayData(true);
        }
    }, [data])

    const handleSubmit = () => {
        const postData = {
            'start_date': startDate,
            'end_date': endDate,
            'classroom': selectedClassroom
        }
        api.post('reports/items/classroom', postData)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                setFeedback(`Não foi possível obter o relatório. [${error.response.data.message}]`);
                setSeverity('error');
                setOpenSnack(true);
            })
    }

    const report = () => {
        return (
            <TableContainer style={{marginTop: 20}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Item</TableCell>
                            <TableCell>Marca</TableCell>
                            <TableCell>Unidade</TableCell>
                            <TableCell>Quantidade</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.brand}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>{item.qtd}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <Container component={Paper} style={{paddingBottom: 50}} ref={printableContent}>
            <h1>Itens solicitados por turma</h1>
            <ReactToPrint
                content={() => printableContent.current}
                trigger={() => <Button variant="contained" color="primary">Imprimir</Button>}
            />
            <p>Preencha os campos abaixo e clique em continuar:</p>
            <Grid container justify="space-around">
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBRLocale}>
                    <KeyboardDatePicker
                        label="Data de início"
                        format="dd/MM/yyyy"
                        onChange={(date) => setStartDate(date)}
                        value={startDate}
                        variant="inline"
                        disableToolbar
                        autoOk
                    />
                    <KeyboardDatePicker
                        label="Data de fim"
                        format="dd/MM/yyyy"
                        onChange={(date) => setEndDate(date)}
                        value={endDate}
                        variant="inline"
                        disableToolbar
                        autoOk
                    />
                </MuiPickersUtilsProvider>
                <FormControl>
                    <InputLabel>Turma</InputLabel>
                    <Select
                        value={selectedClassroom}
                        onChange={(event) => setSelectedClassroom(event.target.value)}
                        required
                        style={{width: 300}}
                    >
                        {classrooms.map(classroom => (
                            <MenuItem value={classroom.id} key={classroom.id}>{classroom.description}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >Continuar</Button>
                </Box>
            </Grid>
            <SnackAlert
                openSnack={openSnack}
                onClose={() => setOpenSnack(false)}
                severity={severity}
                snackMessage={feedback}
            />
            {displayData ? report() : null}
        </Container>
    );

}

export default ClassroomItems;