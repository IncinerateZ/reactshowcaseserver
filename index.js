const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));
const port = 3030;

var map = {};

async function wipeDataLoop() {
    setInterval(() => {
        map = {};
    }, 1_800_000);
}

function makeid(length = 5) {
    var result = '';
    var characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength),
        );
    }
    return result;
}

app.post('/store', (req, res) => {
    const data = req.body.value;
    if (!data || data.length < 1)
        return res.send({ status: 200, error: 'No data to be stored' });
    const id = makeid();
    if (Object.keys(map).length > 100) map = {};
    map[id] = data;
    res.send({ status: 200, id: id });
});

app.get('/store', (req, res) => {
    const id = req.query.id;
    const value = map[id];
    return res.send({
        status: 200,
        value: value || 'Data might have been wiped',
    });
});

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`);
    wipeDataLoop();
});
