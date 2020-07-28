import React, {useState, useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import api from "../../../services/api";
import DateFnsUtils from "@date-io/date-fns";
import ptBRLocale from "date-fns/locale/pt-BR";
import {KeyboardDatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import styles from './styles.module.css'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SnackAlert from "../../../components/SnackAlert";

const EditLot = () => {

    const initialLotState = {
        id: 0,
        description: '',
        expiration: new Date(),
        qtd: 0,
        item_id: 0
    }

    const initialItemState = {
        name: ''
    }

    const {lotId} = useParams()
    const [item, setItem] = useState(initialItemState)
    const [lot, setLot] = useState(initialLotState)
    const [snackMessage, setSnackMessage] = useState('')
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('success')
    const history = useHistory()

    useEffect(() => {
        api.get(`/lots/${lotId}`)
            .then(response => {
                setLot(response.data)
                api.get(`/items/${response.data.item_id}`)
                    .then(response => {
                        setItem(response.data)
                    })
                    .catch(error => {
                        setSnackMessage(error.response.data.error)
                        setSeverity('error')
                        setOpenSnack(true)
                    })
            })
            .catch(error => {
                setSnackMessage(error.response.data.error)
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [lotId])

    const handleCloseSnack = () => {
        if (severity === 'success') {
            history.push(`/items/${lot.item_id}/lots`)
        }
        setOpenSnack(false)
    }

    const handleChange = event => {
        const {name, value} = event.target
        setLot({...lot, [name]: value})
    }

    const handleSubmit = event => {
        event.preventDefault()
        api.put(`/lots/${lot.id}`, lot)
            .then(response => {
                setSnackMessage(`O lote #${response.data.id} foi alterado com sucesso.`)
                setSeverity("success")
                setOpenSnack(true)
            })
            .catch(error => {
                setSnackMessage(error.response.data.error)
                setSeverity("error")
                setOpenSnack(true)
            })
    }

    return (
        <Container>
            <h1>Editar lote</h1>
            <Box mb={2}>
                <Typography><strong>Item:</strong> {item.name.toUpperCase()}</Typography>
                <Typography><strong>Marca:</strong> {item.brand}</Typography>
                <Typography><strong>Unidade:</strong> {item.unit}</Typography>
                <Typography><strong>Fórmula:</strong> {item.formula ? item.formula : 'Não se aplica'}</Typography>
                <Typography><strong>Peso
                    molecular:</strong> {item.molecular_weight ? item.molecular_weight : 'Não se aplica'}</Typography>
                <Typography><strong>Concentração:</strong> {item.concentration ? item.concentration : 'Não se aplica'}
                </Typography>
            </Box>
            <form onSubmit={handleSubmit}>
                <Box className={styles.formRow}>
                    <TextField label="Descrição" value={lot.description}
                               onChange={handleChange}
                               required
                               className={styles.descriptionField}
                               name="description"
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ptBRLocale}>
                        <KeyboardDatePicker
                            label="Validade"
                            views={['month', 'year']}
                            format="MM/yyyy"
                            onChange={date => setLot({...lot, expiration: date})}
                            value={lot.expiration}
                            variant="inline"
                            disableToolbar
                            autoOk

                        />
                    </MuiPickersUtilsProvider>
                    <TextField label="Quantidade" value={lot.qtd} onChange={handleChange}
                               type="number"
                               required
                               name="qtd"
                               inputProps={{
                                   min: 0.1,
                                   step: 0.1
                               }}
                    />
                </Box>
                <Box mt={2} className={styles.buttonsRow}>
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                    >Salvar</Button>
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={() => history.goBack()}
                    >Voltar</Button>
                </Box>
            </form>
            <SnackAlert onClose={handleCloseSnack} openSnack={openSnack} severity={severity} snackMessage={snackMessage} />
        </Container>
    )
}

export default EditLot