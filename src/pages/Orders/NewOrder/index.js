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
import {tableIcons, localization} from "../../../utils/materialTableUtils";
import {makeStyles} from "@material-ui/core";
import {Switch, Route, Link as RouterLink, useHistory, useRouteMatch} from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from "@material-ui/core/DialogTitle";
import SnackAlert from "../../../components/SnackAlert";
import Box from "@material-ui/core/Box";
import MenuItem from "@material-ui/core/MenuItem";
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns';
import ptBRLocale from "date-fns/locale/pt-BR";

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
    inputField: {
        marginLeft: 10,
        width: '30ch'
    },
    selectFields: {
        width: '30ch'
    }
}));

const SelectQuantities = ({selectedItems, calculateQtd}) => {

    const [items, setItems] = useState([]);

    const [labs, setLabs] = useState([])
    const [selectedLab, setSelectedLab] = useState('')

    const [courses, setCourses] = useState([])
    const [classesObj, setClassesObj] = useState([]);
    const [subjects, setSubjects] = useState([])

    const [selectedCourse, setSelectedCourse] = useState('')
    const [selectedClass, setSelectedClass] = useState('')
    const [selectedSubject, setSelectedSubject] = useState('')

    const [dueDate, setDueDate] = useState(new Date());
    const [dueTime, setDueTime] = useState('')

    const classes = useStyles();
    const history = useHistory();

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');
    const [openSnack, setOpenSnack] = useState(false);
    const [severity, setSeverity] = useState('success');
    const [snackMessage, setSnackMessage] = useState('');

    useEffect(() => {
        api.get('/labs')
            .then(response => {
                setLabs(response.data)
            })
            .catch(error => {
                setSnackMessage('Nao foi possivel carregar os laboratorios.')
                setSeverity('error')
                setOpenSnack(true)
            })

        api.get('/courses')
            .then(response => {
                setCourses(response.data)
            })
            .catch(error => {
                setSnackMessage('Nao foi possivel carregar os cursos.')
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [])

    const handleChangeCourse = (event) => {
        const newCourse = event.target.value;
        setSelectedCourse(newCourse);
        api.get(`/courses/${newCourse}/classes`)
            .then(response => {
                setClassesObj(response.data);
            })
            .catch(error => {
                setSnackMessage('Nao foi possivel carregar as turmas.')
                setSeverity('error')
                setOpenSnack(true)
            })
    }

    const handleChangeClasses = (event) => {
        const newClass = event.target.value;
        setSelectedClass(newClass);
        api.get(`/classes/${newClass}/subjects`)
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => {
                setSnackMessage('Nao foi possivel carregar as disciplinas.')
                setSeverity('error')
                setOpenSnack(true)
            })
    }

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
                'due_time': dueTime,
                'lab_id': selectedLab,
                'course_id': selectedCourse,
                'subject_id': selectedSubject,
                items
            }

            if (!data.lab_id) {
                setDialogMessage('Selecione um laboratório.')
                setOpenDialog(true)
                return
            }

            if (!data.course_id) {
                setDialogMessage('Selecione um curso.')
                setOpenDialog(true)
                return
            }

            if (!data.subject_id) {
                setDialogMessage('Selecione uma disciplina.')
                setOpenDialog(true)
                return
            }

            if (!data.due_date) {
                setDialogMessage('Selecione uma data de entrega.')
                setOpenDialog(true)
                return
            }

            if (!data.due_time) {
                setDialogMessage('Selecione um horário de entrega.')
                setOpenDialog(true)
                return
            }

            if (data.items.length < 1 || data.items.length !== selectedItems.length) {
                setDialogMessage('Você deve definir quantidades para os itens selecionados.')
                setOpenDialog(true)
                return
            }

            let errorFlag = false
            data.items.forEach(item => {
                if (!item.qtd || item.qtd <= 0) {
                    errorFlag = true
                }
            })
            if (errorFlag) return

            api.post('/orders', data)
                .then(response => {
                    setSnackMessage(`O pedido #${response.data.id} foi incluído com successo.`)
                    setSeverity('success')
                    setOpenSnack(true)
                })
                .catch(error => {
                    setSnackMessage(`Houve um erro em sua requisição. ${error.response.data.error || error.response.status}`)
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
            history.push('/users/myorders')
        }
        setOpenSnack(false)
    }

    const handleKeyPress = event => {
        if (event.key === 'Enter') {
            handleSave()
        }
    }

    const getHours = () => {
        const hours = []
        for (let i = 0, j = 8; i < 15; i++, j++) {
            const hour = `${j}:00`
            hours.push(<MenuItem key={i} value={hour}>{hour}</MenuItem>)
        }
        return hours
    }

    return (
        <>
            <Box mb={2}>
                <Box mb={2}>
                    <TextField
                        label="Laboratório"
                        value={selectedLab}
                        onChange={event => setSelectedLab(event.target.value)}
                        select
                        className={classes.selectFields}
                    >
                        {labs.map(lab => (
                            <MenuItem key={lab.id} value={lab.id}>{lab.description} - {lab.comment}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Curso"
                        value={selectedCourse}
                        onChange={handleChangeCourse}
                        select
                        className={[classes.inputField, classes.selectFields].join(' ')}
                    >
                        {courses.map(course => (
                            <MenuItem key={course.id} value={course.id}>{course.description}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Turma"
                        value={selectedClass}
                        onChange={handleChangeClasses}
                        select
                        className={[classes.inputField, classes.selectFields].join(' ')}
                    >
                        {classesObj.map(classObj => (
                            <MenuItem key={classObj.id} value={classObj.id}>{classObj.description}</MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Disciplina"
                        value={selectedSubject}
                        onChange={event => setSelectedSubject(event.target.value)}
                        select
                        className={[classes.inputField, classes.selectFields].join(' ')}
                    >
                        {subjects.map(subject => (
                            <MenuItem key={subject.id} value={subject.id}>{subject.description}</MenuItem>
                        ))}
                    </TextField>
                </Box>
                <Box>
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
                    <TextField
                        label="Hora de entrega"
                        value={dueTime}
                        onChange={event => setDueTime(event.target.value)}
                        select
                        className={classes.inputField}
                    >
                        {getHours()}
                    </TextField>
                </Box>
                <Box mt={2}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                    >
                        Salvar
                    </Button>
                </Box>
            </Box>
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
