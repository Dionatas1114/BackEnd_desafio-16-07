const express = require('express');
const database = require('./database');

const server = express();

server.use(express.json());

server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// variaveis

let nextId = null;

server.get('/', (req, res) => {
    return res.json({ result: 'Bem vindo ao Controle de Estoque (API com Banco de Dados)' });
});

async function getNextId(req, res, next) {
    await database.query(`SELECT MAX(id) FROM stock;`, {
            type: database.QueryTypes.SELECT
        })
        .then(id => {
            nextId = id[0].max;
            nextId++;
        }).catch((err) => {
            return res.json(err);
        });
    next();
}

server.post('/stock', getNextId, async(req, res) => {

    let insert;

    const { product, brand, amount, perishable } = req.body;

    await database.query(`INSERT INTO stock VALUES(${id}, '${product}', '${brand}', '${amount}', '${perishable}');`, { type: database.QueryTypes.INSERT })
        .then(result => {
            insert = result;
        }).catch(err => {
            return res.json(err);
        });

    return res.json({ result: 'Item inserido com sucesso!!!', insert });
});

server.get('/stock', async(req, res) => {

    let stockList;

    await database.query(`SELECT * FROM stock`, { type: database.QueryTypes.SELECT })
        .then(result => {
            stockList = result;

        }).catch(err => {
            return res.json(err);
        });

    return res.json({ result: 'Os Items inseridos até o momento são:', stockList });
});

server.get('/stock/:id', async(req, res) => {

    const { id } = req.params;

    let product;

    await database.query(`SELECT * FROM stock WHERE id = ${id}`, { type: database.QueryTypes.SELECT })
        .then(result => {
            product = result;
        }).catch(err => {
            return res.json(err);
        });

    return res.json({ product });
});

server.put('/stock/:id', async(req, res) => {

    const { product, brand, amount, perishable } = req.body;
    const { id } = req.params;

    let results1;

    await database.query(`UPDATE stock SET product = '${product}', brand = '${brand}', amount = '${amount}', perishable = '${perishable}' WHERE id = ${id}`, { type: database.QueryTypes.UPDATE })
        .then(result => {
            results1 = result
        }).catch(err => {
            return res.json(err);
        });

    return res.json({
        results1: 'Item atualizado com sucesso!',
    });
});

server.delete('/stock/:id', async(req, res) => {

    const { id } = req.params;

    let results2;

    await database.query(`DELETE FROM stock WHERE id=${id}`, { type: database.QueryTypes.DELETE })
        .then(result => {
            results2 = result;
        }).catch(err => {
            return res.json(err);
        });

    return res.json({
        results2: 'Item excluído com sucesso!',
    });
});

server.listen(process.env.PORT);