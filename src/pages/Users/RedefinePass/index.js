import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import SnackAlert from "../../../components/SnackAlert";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button"
import api from "../../../services/api";
import './styles.css'

const RedefinePass = () => {

    const _user = {
        username: ''
    }
    const [user, setUser] = useState(_user)
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [passwordError, setPasswordError] = useState(false)
    const [openSnack, setOpenSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [severity, setSeverity] = useState('success')
    const {id} = useParams()
    const history = useHistory()

    useEffect(() => {
        api.get(`/users/${id}`)
            .then(response => {
                setUser(response.data)
            })
            .catch(error => {
                setSnackMessage(`Não foi possível concluir sua solicitação. Status [${error.response.status}]`)
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [])

    const handleCloseSnack = () => {
        if (severity === 'success') {
            history.push('/users')
        }
        setOpenSnack(false)
    }

    const checkPasswordConfirmation = event => {
        const newPassword = event.target.value
        if (newPassword !== password) {
            setPasswordError(true)
        } else {
            setPasswordError(false)
        }
        setPasswordConfirmation(newPassword)
    }

    const handleSubmit = event => {
        event.preventDefault()
        if (password !== passwordConfirmation) {
            setSnackMessage('As senhas devem ser iguais.')
            setSeverity('error')
            setOpenSnack(true)
            return null
        }
        const data = {
            id,
            password
        }

        api.put(`/users/${id}/redefine`, data)
            .then(response => {
                setSnackMessage('Senha alterada!')
                setSeverity('success')
                setOpenSnack(true)
            })
            .catch(error => {
                setSnackMessage(`Houve um erro em sua solicitação. Status [${error.response.status}]`)
                setSeverity('error')
                setOpenSnack(true)
            })
    }

    return (
        <Container>
            <h1>Redefinir senha</h1>
            <Typography variant="subtitle2">Atenção! Esta funcionalidade deve ser utilizada apenas a pedido do usuário
                e, preferencialmente, em sua presença.</Typography>
            <Paper>
                <form onSubmit={handleSubmit}>
                    <TextField label="Nome do usuário" value={user.username} InputProps={{readOnly: true}}/>
                    <TextField label="Nova senha" value={password} inputProps={{autoComplete: 'password'}}
                               onChange={event => setPassword(event.target.value)}
                               type="password"
                    />
                    <TextField label="Confirme a nova senha" value={passwordConfirmation} inputProps={{autoComplete: 'password'}}
                               onChange={checkPasswordConfirmation}
                               error={passwordError}
                               helperText={passwordError ? 'As senhas estão diferentes' : ''}
                               type="password"
                    />
                    <div className="button-row">
                        <Button variant="contained" color="primary" type="submit">Salvar</Button>
                        <Button variant="contained" onClick={() => history.goBack()}>Voltar</Button>
                    </div>
                </form>
            </Paper>
            <SnackAlert onClose={handleCloseSnack} openSnack={openSnack} severity={severity} snackMessage={snackMessage} />
        </Container>
    )
}

export default RedefinePass