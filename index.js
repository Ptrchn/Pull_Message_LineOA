const express = require('express');
const app = express();

// 👇 ใช้ express.json() แทน middleware ของ LINE SDK
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



app.post('/webhook', (req, res) => {
    const events = req.body.events;

    if (Array.isArray(events)) {
        events.forEach(event => {
            if (event.message && event.message.type === 'text') {
                console.log('ผู้ใช้:', event.source.userId);
                console.log('📩 ข้อความ:', event.message.text);
                printTreeWithLines(event)
                const textMassage = event.message.text;
                if (textMassage.toLowerCase().includes('open')) {
                    fetch('https://sonesambi.atlassian.net/rest/api/2/issue', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Basic ' + Buffer.from('sonesambi@gmail.com:ATATT3xFfGF0gLOlsz35civ001CsfdXUpogZk5WEJAZhfw0HoZXcNWoWisRyAc6yQ9P3PYEStc23rLBMBZVbbE2ACdaRlJkF32HAEYh_db-mcMhg_YCREwnsUmk-pAPBdkMzhRWLrlElb9hMCdBxc58O7CkoxBfIktbbXT2hnKpO4eTKuN1RYmo=62735F12').toString('base64'),
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "fields": {
                                "project": { "key": "MNEJ" },
                                "summary": "ทดสอบการสร้าง Issue ผ่าน line",
                                "description": "สร้าง Issue ผ่าน line",
                                "issuetype": { "name": "General request" },
                                "priority": { "name": "Medium" }
                            }
                        })
                    })
                    .then(response => response.json())
                    .then(data => console.log('Jira response:', data, '\nIssue created successfully!'))
                    .catch(error => console.error('Jira error:', error));
                }
        }});
    }

    // ✅ ตอบกลับ 200 ให้ LINE ว่ารับสำเร็จแล้ว
    res.status(200).send('OK');
});

app.get('/', (req, res) => {
    res.send('ok');
});

app.listen(8080, () => console.log('🚀 Server started on port 8080'));