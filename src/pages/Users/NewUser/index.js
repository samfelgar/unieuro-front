import React, {useEffect, useState} from 'react'
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button"
import api from "../../../services/api";
import Paper from "@material-ui/core/Paper"
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import SnackAlert from "../../../components/SnackAlert";
import {useHistory} from 'react-router-dom'
import styles from './styles.module.css'

const NewUser = () => {

    const [roles, setRoles] = useState([])
    const [username, setUsername] = useState('')
    const [selectedRole, setSelectedRole] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [passwordCheck, setPasswordCheck] = useState(false)
    const [openDialog, setOpenDialog] = useState(false)
    const [openSnack, setOpenSnack] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [snackMessage, setSnackMessage] = useState('')
    const [severity, setSeverity] = useState('success')
    const history = useHistory()

    useEffect(() => {
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

    const handleDialogClose = () => {
        setOpenDialog(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (password !== passwordConfirmation) {
            setDialogMessage('As senhas devem ser iguais!')
            setOpenDialog(true)
            return
        }

        const data = {
            username,
            email,
            password,
            role_id: selectedRole
        }

        api.post('/users', data)
            .then(response => {
                setSnackMessage(`O usuário "${response.data.username}" foi incluído com sucesso.`)
                setSeverity('success')
                setOpenSnack(true)
            })
            .catch(error => {
                setSnackMessage(`Houve um erro em sua requisição. Status: [${error.response.status}]`)
                setSeverity('error')
                setOpenSnack(true)
            })
    }

    const resetForm = () => {
        setUsername('')
        setSelectedRole('')
        setEmail('')
        setPassword('')
        setPasswordConfirmation('')
    }

    const handleSnackClose = () => {
        if (severity === 'success') {
            history.push('/users')
        }
        setOpenSnack(false)
    }

    const checkPasswordConfirmation = event => {
        if (event.target.value !== password) {
            setPasswordCheck(true)
        } else {
            setPasswordCheck(false)
        }
        setPasswordConfirmation(event.target.value)
    }

    return (
        <Container>
            <h1>Novo usuário</h1>
            <Paper>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles['form-row']}>
                        <TextField label="Nome" required onChange={(event) => setUsername(event.target.value)}
                                   value={username}
                                   className={styles['input-field']}
                        />
                        <TextField label="E-mail" type="email" required onChange={event => setEmail(event.target.value)}
                                   value={email}
                                   className={styles['input-field']}
                        />
                    </div>
                    <div className={styles['form-row']}>
                        <TextField label="Senha" type="password" required
                                   onChange={event => setPassword(event.target.value)}
                                   value={password}
                                   className={styles['input-field']}
                                   inputProps={{
                                       autoComplete: 'current-password'
                                   }}
                        />
                        <TextField label="Confirme a senha" type="password" required
                                   onChange={checkPasswordConfirmation} value={passwordConfirmation}
                                   className={styles['input-field']}
                                   error={passwordCheck}
                                   helperText={passwordCheck ? 'As senhas estão diferentes' : ''}
                                   inputProps={{
                                       autoComplete: 'current-password'
                                   }}
                        />
                        <TextField label="Perfil" select value={selectedRole}
                                   onChange={event => setSelectedRole(event.target.value)}
                                   required
                                   className={styles['input-field']}
                        >
                            <MenuItem value="">Selecione</MenuItem>
                            {roles.map(role => (
                                <MenuItem key={role.id} value={role.id}>{role.description}</MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div className={styles["buttons-row"]}>
                        <Button variant="contained" color="primary" type="submit">Salvar</Button>
                        <Button variant="contained" color="default" onClick={resetForm}>Limpar</Button>
                    </div>
                </form>
            </Paper>
            <SnackAlert snackMessage={snackMessage} severity={severity} openSnack={openSnack}
                        onClose={handleSnackClose}/>
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
                <DialogContent>
                    <DialogContentText>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default NewUser