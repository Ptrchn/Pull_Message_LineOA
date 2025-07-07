const express = require('express');
const app = express();
require('dotenv').config();
const USERNAME_JIRA = process.env.USERNAME_JIRA;
const TOKEN_API = process.env.TOKEN_API;

app.use(express.json());

function printTreeWithLines(obj, level = 0, isLast = true, prefix = '', indexMap = {}, layerCount = {}) {
    if (typeof obj !== 'object' || obj === null) {
        console.log(`${prefix}${isLast ? '└──' : '├──'} 📄 ${obj}`);
        return layerCount;
    }

    const entries = Object.entries(obj);

    if (!indexMap[level]) indexMap[level] = 1;
    if (!layerCount[level]) layerCount[level] = 0;

    entries.forEach((entry, idx) => {
        const key = entry[0];
        const val = entry[1];
        const isLastEntry = idx === entries.length - 1;
        const linePrefix = prefix + (isLast ? '    ' : '│   ');
        const branch = isLastEntry ? '└──' : '├──';

        const displayIndex = indexMap[level]++;
        layerCount[level]++;

        const displayKey = `[${displayIndex}] ${key}`;

        if (typeof val === 'object' && val !== null) {
            const subCount = Object.keys(val).length;
            console.log(`${prefix}${branch} ${displayKey} (${subCount} children)`);
            printTreeWithLines(val, level + 1, isLastEntry, linePrefix, indexMap, layerCount);
        } else {
            console.log(`${prefix}${branch} ${displayKey}: ${val}`);
        }
    });

    return layerCount;
}



app.post('/webhook', async (req, res) => {
    const events = req.body.events;

    if (Array.isArray(events)) {
        for (const event of events) {
            if (event.message && event.message.type === 'text') {
                console.log('UserID:', event.source.userId);
                console.log('📩 Text:', event.message.text);
                const layerSummary = printTreeWithLines(event);
                console.log('\n📊 Layer Summary');
                    Object.entries(layerSummary).forEach(([layer, count]) => {
                        console.log(`layer ${parseInt(layer) + 1} = ${count}`);
                    });

                const textMessage = event.message.text;

                if (textMessage.toLowerCase().includes('open')) {
                    try {
                        const response = await fetch('https://sonesambi.atlassian.net/rest/api/2/issue', {
                            method: 'POST',
                            headers: {
                            'Authorization': 'Basic ' + Buffer.from(`${USERNAME_JIRA}:${TOKEN_API}`).toString('base64'),
                            'Content-Type': 'application/json'
                        },
                            body: JSON.stringify({
                                fields: {
                                    project: { key: 'MNEJ' },
                                    summary: 'ทดสอบการสร้าง Issue ผ่าน line 111',
                                    description: 'สร้าง Issue ผ่าน line',
                                    issuetype: { name: 'General request' },
                                    priority: { name: 'Medium' }
                                }
                            })
                        });

                        const data = await response.json();
                        console.log('🟢 Jira response:', data);
                        console.log('-------------------------------------------------')
                    } catch (error) {
                        console.error('🔴 Jira error:', error);
                    }
                }
            }
        }
    }

    res.status(200).send('OK');
});

app.post('/telegram-webhook', async (req, res) => {
    const body = req.body;

    if (body.message && body.message.text) {
        const chatId = body.message.chat.id;
        const textMessage = body.message.text;

        console.log('📩 Telegram Message:', textMessage);
        printTreeWithLines(body, 0, true, '');  // <-- ใส่ parameter ให้ครบ

        if (textMessage.toLowerCase().includes('open')) {
            try {
                const response = await fetch('https://sonesambi.atlassian.net/rest/api/2/issue', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + Buffer.from(`${USERNAME_JIRA}:${TOKEN_API}`).toString('base64'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        fields: {
                            project: { key: 'MNEJ' },
                            summary: 'ทดสอบการสร้าง Issue ผ่าน Telegram',
                            description: `สร้างจาก Telegram: ${textMessage}`,
                            issuetype: { name: 'General request' },
                            priority: { name: 'Medium' }
                        }
                    })
                });

                const data = await response.json();
                console.log('🟢 Jira response:', data);
            } catch (error) {
                console.error('🔴 Jira error:', error);
            }
        }
    }

    res.status(200).send('OK');
});


app.get('/', (req, res) => {
    res.send('ok');
});

app.listen(8080, () => console.log('🚀 Server started on port 8080'));
