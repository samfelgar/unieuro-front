import React, {useState} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import api from '../../services/api'
import { useHistory } from 'react-router-dom'

const Login = ({ login }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory()

    const handleSubmit = event => {
        event.preventDefault()
        const data = {
            email,
            password
        }
        api.get('csrf-cookie')
            .then(response => {
                api.post('login', data)
                    .then(response => {
                        login()
                        history.push('/')
                    })
            })
    }

    return (
        <form onSubmit={handleSubmit}>
            <CssBaseline/>
            <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <h1>Gestão de materiais</h1>
                <p style={{width: '25%'}}>Para acessar o sistema, informe seu email e senha.</p>
                <div style={{width: '25%'}}>
                    <div>
                        <TextField label="Usuário" type="email" value={email}
                                   onChange={event => setEmail(event.target.value)}
                                   style={{width: '100%'}}
                                   required
                        />
                    </div>
                    <div style={{marginTop: 10}}>
                        <TextField label="Senha" type="password" value={password}
                                   onChange={event => setPassword(event.target.value)}
                                   style={{width: '100%'}}
                                   required
                        />
                    </div>
                    <div style={{marginTop: 20, width: '100%'}}>
                        <Button variant="contained" color="primary" type="submit"
                                style={{width: '100%'}}>Entrar</Button>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default Login