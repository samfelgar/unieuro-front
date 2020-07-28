import React, {useState, useEffect} from 'react'
import {useLocation, useHistory} from 'react-router-dom'
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

const NewLot = () => {

    const initialItemState = {
        name: ''
    }

    const [item, setItem] = useState(initialItemState)
    const [description, setDescription] = useState('')
    const [expiration, setExpiration] = useState(new Date())
    const [qtd, setQtd] = useState(0)
    const itemId = new URLSearchParams(useLocation().search).get('item')

    const [snackMessage, setSnackMessage] = useState('')
    const [openSnack, setOpenSnack] = useState(false)
    const [severity, setSeverity] = useState('success')
    const history = useHistory()

    useEffect(() => {
        api.get(`/items/${itemId}`)
            .then(response => {
                setItem(response.data)
            })
            .catch(error => {
                setSnackMessage(error.response.data.error)
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [itemId])

    const handleCloseSnack = () => {
        if (severity === 'success') {
            history.push(`/items/${itemId}/lots`)
        }
        setOpenSnack(false)
    }

    const handleSubmit = event => {
        event.preventDefault()
        const data = {
            description,
            expiration,
            qtd,
            'item_id': itemId
        }
        api.post('/lots', data)
            .then(response => {
                setSnackMessage(`O lote #${response.data.id} foi criado com sucesso.`)
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
            <h1>Novo lote</h1>
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
                    <TextField label="Descrição" value={description}
                               onChange={event => setDescription(event.target.value)}
                               required
                               className={styles.descriptionField}
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
                    <TextField label="Quantidade" value={qtd} onChange={event => setQtd(event.target.value)}
                               type="number"
                               required
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

export default NewLot