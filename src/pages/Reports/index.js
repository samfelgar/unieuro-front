import React, {useEffect, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import Container from "@material-ui/core/Container";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper'
import api from './../../services/api'
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const Reports = () => {

    const history = useHistory();

    return (
        <Container component={Paper} style={{paddingBottom: 50}}>
            <h1>Relatórios</h1>
            <p>Selecione um relatório para continuar:</p>
            <Button
                color="primary"
                variant="contained"
                onClick={() => history.push('/reports/classroom-items')}
            >Itens por turma</Button>
        </Container>
    );
}

export default Reports;