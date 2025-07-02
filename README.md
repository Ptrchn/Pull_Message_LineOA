เพิ่มไฟล์ .env 

token = 'Channel access token'
secretcode = 'Channel secret'

-----------------------------------------------------------------------------------------------------------------

ก่อนใช้งานต้อง npm i ก่อนและต้องเปิด public tunnel ด้วย localtunnel (หรือ ngrok, cloudflared)
และต้องรัน server ก่อน
เช่น localtunnel 
จะใช้คำสั่ง npx localtunnel --port 8080
จะได้ URL เช่น https://my-bot.loca.lt
นำ URL ที่ได้ใส้ /webhook ปิดท้าย เช่น https://my-bot.loca.lt/webhook ไปใส่ใน Webhook URL ใน Line Developerแล้วกด verify
