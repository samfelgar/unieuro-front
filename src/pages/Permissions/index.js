import React, {useState, useEffect} from 'react'
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import api from "../../services/api";
import styles from './styles.module.css'
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";

const PermissionsList = ({selectedRole}) => {
    const [menus, setMenus] = useState([])
    const [selectedMenus, setSelectedMenus] = useState([])

    useEffect(() => {
        api.get('/menus')
            .then(response => {
                setMenus(response.data)
            })
        api.get(`/roles/${selectedRole}/menus`)
            .then(response => {
                setSelectedMenus(response.data.menus)
            })
    }, [selectedRole])

    const handleChange = id => {
        const selectedMenuIndex = selectedMenus.findIndex(menu => menu.id === id)
        if (selectedMenuIndex < 0) {
            const menuIndex = menus.findIndex(menu => menu.id === id)
            setSelectedMenus([
                ...selectedMenus,
                menus[menuIndex]
            ])
        } else {
            const newSelectedMenus = [...selectedMenus]
            newSelectedMenus.splice(selectedMenuIndex, 1)
            setSelectedMenus(newSelectedMenus)
        }
    }

    const checkBoxes = (id) => {
        const index = selectedMenus.findIndex(menu => menu.id === id)
        return index >= 0;
    }

    const handleSaveClick = () => {
        const data = {
            menus: selectedMenus.map(menu => menu.id)
        }
        api.put(`/roles/${selectedRole}/menus`, data)
            .then(response => {
                console.log(`Os acessos do perfil ${response.data.description} foram salvos.`)
            })
    }

    return (
        <Grid item className={styles.menusGrid}>
            <Paper>
                <List dense component="div" role="list">
                    {menus.map(menu => {
                        const labelId = `menu-${menu.id}`
                        const check = checkBoxes(menu.id)
                        return (
                            <label key={menu.id} htmlFor={labelId}>
                                <ListItem button>
                                    <ListItemIcon>
                                        <Checkbox id={labelId} checked={check}
                                                  onChange={() => handleChange(menu.id)}/>
                                    </ListItemIcon>
                                    <ListItemText primary={menu.name}/>
                                </ListItem>
                            </label>
                        )
                    })}
                </List>
            </Paper>
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleSaveClick}>Salvar</Button>
            </Box>
        </Grid>
    )

}

const Permissions = () => {
    const [roles, setRoles] = useState([])
    const [selectedRole, setSelectedRole] = useState('')
    const [openDialog, setOpenDialog] = useState(false)
    const [dialogText, setDialogText] = useState('')
    const [continuing, setContinuing] = useState(false)

    useEffect(() => {
        api.get('/roles')
            .then(response => {
                setRoles(response.data)
            })
            .catch(error => {
                console.log(error.response.data)
            })
    }, [])

    const handleSubmit = event => {
        event.preventDefault()
        if (selectedRole === '') {
            setDialogText('Você deve selecionar um perfil antes de continuar.')
            setOpenDialog(true)
        } else {
            setContinuing(true)
        }
    }

    const handleDialogClose = () => {
        setOpenDialog(false)
    }

    return (
        <Container>
            <h1>Acessos</h1>
            <form onSubmit={handleSubmit}>
                <Grid container>
                    <Grid>
                        <Box>
                            <TextField
                                label="Perfil"
                                value={selectedRole}
                                onChange={event => setSelectedRole(event.target.value)}
                                select
                                required
                                className={styles.select}
                                helperText="Selecione um perfil para continuar"
                            >
                                {roles.map(role => (
                                    <MenuItem key={role.id} value={role.id}>{role.description}</MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box mt={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >Continuar</Button>
                        </Box>
                    </Grid>
                    {continuing ? (
                        <Grid>
                            <Box ml={3}>
                                <PermissionsList selectedRole={selectedRole}/>
                            </Box>
                        </Grid>
                    ) : null}
                </Grid>
            </form>
            <Dialog onClose={handleDialogClose} open={openDialog}>
                <DialogContent>
                    <DialogContentText>{dialogText}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="primary" onClick={handleDialogClose}>Fechar</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default Permissions