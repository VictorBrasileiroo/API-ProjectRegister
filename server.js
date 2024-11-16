const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let clients = require('./clients.json');

app.get('/', (req, res) => {
    res.send('API Backend rodando! Use /api/clients para acessar os projetos.');
});

app.get('/api/clients', (req, res) => {
    res.json(clients);
});

app.get('/api/clients/:id', (req, res) => {
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (!client) return res.status(404).send('Cliente não encontrado.');
    res.send(client);
});

app.put('/api/clients/:id', (req, res) => {
    const client = clients.find(c => c.id === parseInt(req.params.id));
    if (!client) return res.status(404).send('Cliente não encontrado.');

    client.nome = req.body.nome;
    client.produtos = req.body.produtos;
    client.valorTotal = req.body.valorTotal;
    client.valorPago = req.body.valorPago;
    client.valorRestante = req.body.valorRestante;

    fs.writeFileSync('./clients.json', JSON.stringify(clients, null, 2));
    res.send(client);
});

app.post('/api/clients', (req, res) => {
    const newId = clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1;
    const newClient = {
        id: newId,
        nome: req.body.nome,
        produtos: req.body.produtos,
        valorTotal: req.body.valorTotal,
        valorPago: req.body.valorPago,
        valorRestante: req.body.valorRestante
    };
    clients.push(newClient);
    fs.writeFileSync('./clients.json', JSON.stringify(clients, null, 2));
    res.status(201).send(newClient);
});

app.delete('/api/clients/:id', (req, res) => {
    const clientIndex = clients.findIndex(c => c.id === parseInt(req.params.id));
    if (clientIndex === -1) return res.status(404).send('Cliente não encontrado.');

    clients.splice(clientIndex, 1);

    // Reordenar IDs
    for (let i = clientIndex; i < clients.length; i++) {
        clients[i].id = i + 1;
    }

    fs.writeFileSync('./clients.json', JSON.stringify(clients, null, 2));
    res.send({ message: 'Cliente removido e IDs reordenados.' });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});