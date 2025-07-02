const express = require('express');
const app = express();
require('dotenv').config();

const line = require('@line/bot-sdk');

const config = {
    channelAccessToken: process.env.token,
    channelSecret: process.env.secretcode
}

app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
    .all([
        req.body.events.map(handleEvents)
    ])
    .then((result) => res.json(result))
});

function handleEvents(event){
    console.log(event);
}


app.get('/', (req, res) => {
    res.send('ok');
});

app.listen(8080, () => console.log('start erver on port 8080'));