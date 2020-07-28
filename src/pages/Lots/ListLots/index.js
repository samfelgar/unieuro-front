import React, {useEffect, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import api from "../../../services/api";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {getFormattedDate} from "../../../utils/formatDate";
import Button from "@material-ui/core/Button";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import styles from './styles.module.css'

const Lots = () => {
    const {itemId} = useParams()
    const [item, setItem] = useState({})
    const [lots, setLots] = useState([])
    const history = useHistory()

    useEffect(() => {
        api.get(`/items/${itemId}`)
            .then(response => {
                setItem(response.data)
            })
            .catch(error => {
                console.log(error.response.data)
            })

        api.get(`/lots/item/${itemId}`)
            .then(response => {
                setLots(response.data)
            })
            .catch(error => {
                console.log(error.response.data)
            })
    }, [itemId])

    return (
        <Container>
            <h1>Lotes do item: {item.hasOwnProperty('name') ? item.name.toUpperCase() : null}</h1>
            <div className={styles.addButton}>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={() => history.push(`/lots/new?item=${itemId}`)}
                >Novo lote</Button>
            </div>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Validade</TableCell>
                            <TableCell>Quantidade</TableCell>
                            <TableCell>Opções</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {lots.map(lot => (
                            <TableRow key={lot.id}>
                                <TableCell>{lot.description}</TableCell>
                                <TableCell>{getFormattedDate(lot.expiration)}</TableCell>
                                <TableCell>{lot.qtd}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="small"
                                        onClick={() => history.push(`/lots/edit/${lot.id}`)}
                                    >Editar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    )
}

export default Lots