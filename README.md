# 🤖 LINE Bot Webhook Listener (Node.js + Express)

โปรเจกต์นี้ใช้สำหรับรับข้อความจาก LINE Official Account ผ่าน Webhook ด้วย LINE Messaging API SDK (Node.js)

---

## ⚙️ วิธีใช้งาน

### 1. สร้าง `.env`

```env
token='Channel access token'
secretcode='Channel secret'
````

> ค่าทั้งสองหาได้จาก LINE Developers Console

---

### 2. ติดตั้งแพ็กเกจ

```bash
npm install
```

---

### 3. รันเซิร์ฟเวอร์

```bash
node index.js
```

คุณจะเห็น:

```
start server on port 8080
```

---

### 4. เปิด public tunnel

```bash
npx localtunnel --port 8080
```

จะได้ URL เช่น:

```
https://my-bot.loca.lt
```

---

### 5. ตั้งค่า Webhook

ไปที่ [LINE Developers Console](https://developers.line.biz/) → Messaging API → Webhook URL
แล้วใส่:

```
https://my-bot.loca.lt/webhook
```

จากนั้นกด ✅ **Verify**

---

## 🧪 ทดสอบ

* ส่งข้อความจาก LINE OA
* ดูผลใน Terminal (`console.log(event)`)

---

## ✅ หมายเหตุ

* ต้องรัน server ก่อนกด Verify
* ต้องเปิด tunnel (localtunnel, ngrok, cloudflared) ตลอดเวลา

---
