import React, {useEffect, useState} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import Container from "@material-ui/core/Container";
import Paper from '@material-ui/core/Paper'
import Button from "@material-ui/core/Button";

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