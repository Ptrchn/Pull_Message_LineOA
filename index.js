const express = require('express');
const app = express();
require('dotenv').config();
const USERNAME = process.env.USERNAME;
const TOKEN_API = process.env.TOKEN_API;

app.use(express.json());

function printTreeWithLines(obj, level = 0, isLast = true, prefix = '') {
    if (typeof obj !== 'object' || obj === null) {
        console.log(`${prefix}${isLast ? '└──' : '├──'} 📄 ${obj}`);
        return;
    }

    const entries = Object.entries(obj);
    entries.forEach((entry, index) => {
        const key = entry[0];
        const val = entry[1];
        const isLastEntry = index === entries.length - 1;
        const linePrefix = prefix + (isLast ? '    ' : '│   ');
        const branch = isLastEntry ? '└──' : '├──';

        if (typeof val === 'object' && val !== null) {
            console.log(`${prefix}${branch}  ${key}`);
            printTreeWithLines(val, level + 1, isLastEntry, linePrefix);
        } else {
            console.log(`${prefix}${branch}  ${key}: ${val}`);
        }
    });
}

app.post('/webhook', async (req, res) => {
    const events = req.body.events;

    if (Array.isArray(events)) {
        for (const event of events) {
            if (event.message && event.message.type === 'text') {
                console.log('ผู้ใช้:', event.source.userId);
                console.log('📩 ข้อความ:', event.message.text);
                printTreeWithLines(event);

                const textMessage = event.message.text;

                if (textMessage.toLowerCase().includes('open')) {
                    try {
                        const response = await fetch('https://sonesambi.atlassian.net/rest/api/2/issue', {
                            method: 'POST',
                            headers: {
                            'Authorization': 'Basic ' + Buffer.from(`${USERNAME}:${TOKEN_API}`).toString('base64'),
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
                    } catch (error) {
                        console.error('🔴 Jira error:', error);
                    }
                }
            }
        }
    }

    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.send('ok');
});

app.listen(8080, () => console.log('🚀 Server started on port 8080'));
