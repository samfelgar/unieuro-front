import React, {useEffect, useState} from 'react'
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button"
import api from "../../../services/api";
import Paper from "@material-ui/core/Paper"
import SnackAlert from "../../../components/SnackAlert";
import {useHistory, useParams} from 'react-router-dom'
import './styles.css'

const EditUser = () => {

    const [roles, setRoles] = useState([])
    const [username, setUsername] = useState('')
    const [selectedRole, setSelectedRole] = useState('')
    const [email, setEmail] = useState('')
    const [openSnack, setOpenSnack] = useState(false)
    const [snackMessage, setSnackMessage] = useState('')
    const [severity, setSeverity] = useState('success')
    const {id} = useParams()
    const history = useHistory()

    useEffect(() => {
        api.get(`/users/${id}`)
            .then(response => {
                setUsername(response.data.username)
                setEmail(response.data.email)
                setSelectedRole(response.data.role_id)
            })
            .catch(error => {
                setSnackMessage(`Houve um erro em sua solicitação. Status [${error.response.status}]`)
                setSeverity('error')
                setOpenSnack(true)
            })
        api.get('/roles')
            .then(response => {
                setRoles(response.data)
            })
            .catch(error => {
                setSnackMessage(`Houve um erro em sua requisição. Status: [${error.response.status}]`)
                setSeverity('error')
                setOpenSnack(true)
            })
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault()

        const data = {
            id,
            username,
            email,
            role_id: selectedRole
        }

        api.put(`/users/${id}`, data)
            .then(response => {
                setSnackMessage(`O usuário "${response.data.username}" foi alterado com sucesso.`)
                setSeverity('success')
                setOpenSnack(true)
            })
            .catch(error => {
                setSnackMessage(`Houve um erro em sua requisição. Status: [${error.response.status}]`)
                setSeverity('error')
                setOpenSnack(true)
            })
    }

    const handleSnackClose = () => {
        if (severity === 'success') {
            history.push('/users')
        }
        setOpenSnack(false)
    }

    return (
        <Container>
            <h1>Novo usuário</h1>
            <Paper>
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <TextField label="Nome" required onChange={(event) => setUsername(event.target.value)}
                                   value={username}
                                   className={'input-field'}
                        />
                        <TextField label="E-mail" type="email" required onChange={event => setEmail(event.target.value)}
                                   value={email}
                                   className={'input-field'}
                        />
                    </div>
                    <div className="form-row">
                        <TextField label="Perfil" select value={selectedRole}
                                   onChange={event => setSelectedRole(event.target.value)}
                                   required
                                   className={'input-field'}
                        >
                            <MenuItem value="">Selecione</MenuItem>
                            {roles.map(role => (
                                <MenuItem key={role.id} value={role.id}>{role.description}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className="buttons-row">
                        <Button variant="contained" color="primary" type="submit">Salvar</Button>
                        <Button variant="contained" color="default" onClick={() => history.goBack()}>Voltar</Button>
                    </div>
                </form>
            </Paper>
            <SnackAlert snackMessage={snackMessage} severity={severity} openSnack={openSnack}
                        onClose={handleSnackClose}/>
        </Container>
    )
}

export default EditUser