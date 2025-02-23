# 🚔 ระบบตรวจสอบความปลอดภัย (Information Security Patrol - DENSY) 🔍

## 📌 ภาพรวม
โครงการนี้เป็นระบบตรวจสอบความปลอดภัยภายในองค์กร ซึ่งแบ่งออกเป็นสองส่วนหลัก:

- 🖥️ **Client**: พัฒนาโดยใช้ Next.js และ TypeScript
- 🖧 **Server**: สร้างขึ้นด้วย Express.js, Prisma และ TypeScript
- 🗄️ **ฐานข้อมูล**: MySQL

ระบบนี้มีหน้าที่หลักในการตรวจสอบการลาดตระเวน (Patrol) และแจ้งปัญหาไปยังผู้รับผิดชอบพื้นที่นั้น ๆ หากพบปัญหา พร้อมทั้งสามารถติดตามสถานะและออกรายงานผลการตรวจสอบได้ โดยกระบวนการตรวจสอบจะดำเนินการเป็นทีมแบบเรียลไทม์

### 🎠 คุณสมบัติหลัก
- 🕵️‍♂️ การลาดตระเวนแบบทีมเรียลไทม์
- 📍 แผนที่แสดงจุดตรวจสอบแบบอินเตอร์แอคทีฟ
- 🚨 รายงานปัญหาพร้อมแจ้งเตือนอัตโนมัติ
- 📊 Dashboard วิเคราะห์ข้อมูลการตรวจสอบ
- 📑 ระบบออกรายงานอัตโนมัติ (PDF/Excel)

## 🏗️ โครงสร้างโปรเจค
```bash
├── client/                 # 🖥️ Frontend (Next.js 14)
│   ├── app/                # 📂 Page Router
│   ├── components/         # 🧩 UI Components
│   ├── context/            # 🧭 Global State Management
│   ├── lib/                # 📚 Utility Libraries
├── ├── messages/           # 🌐 Localization Files (i18n)
│   └── public/             # 🖼️ Static Assets (Images, Fonts, Icons)
│
├── server/                 # 🌐 Backend (Express.js)
│   ├── prisma/             # 🗃️ Database Schema
│   ├── src/
│   │   ├── Controllers/    # 🎮 Business Logic
│   │   ├── Routes/         # 🛣️ API Endpoints
│   │   ├── Tests/          # 🧪 Unit Tests
│   │   └── Utils/          # ⚙️ Helper Functions
│   └── uploads/            # 📁 File Storage
│
├── nginx/                  # 🔄 Reverse Proxy Configuration
│   └── config/
│       └── nginx.conf      # 🛠️ Load Balancing Setup
│
├── Jenkinsfile/               # 🤖 CI/CD Workflows
└── docker-compose.yml      # 🐳 Container Orchestration

## 🚀 วิธีการเริ่มต้นใช้งาน

### 🖥️ การตั้งค่า Client
1. 📂 คัดลอกไฟล์ `.env-locale` และเปลี่ยนชื่อเป็น `.env`
2. 🔧 เข้าไปที่โฟลเดอร์ client:
   ```sh
   cd client
   ```
3. 📦 ติดตั้งแพ็กเกจที่จำเป็น:
   ```sh
   npm i
   ```
4. ▶️ เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา:
   ```sh
   npm run dev
   ```

### 🌐 การตั้งค่า Server
1. 📂 คัดลอกไฟล์ `.env-locale` และเปลี่ยนชื่อเป็น `.env`
2. 🔧 เข้าไปที่โฟลเดอร์ server:
   ```sh
   cd server
   ```
3. 📦 ติดตั้งแพ็กเกจที่จำเป็น:
   ```sh
   npm i
   ```
4. ⚙️ รันคำสั่งสำหรับตั้งค่าฐานข้อมูล:
   ```sh
   npx prisma migrate dev
   ```
5. 🌱 ใส่ข้อมูลเริ่มต้นลงในฐานข้อมูล:
   ```sh
   npm run seed
   ```
6. ▶️ เริ่มต้นเซิร์ฟเวอร์สำหรับพัฒนา:
   ```sh
   npm run dev
   ```

## 🔄 วิธีรีเซ็ตฐานข้อมูล
หากต้องการรีเซ็ตฐานข้อมูลให้ทำตามขั้นตอนดังนี้:

1. 🔧 เข้าไปที่โฟลเดอร์ server:
   ```sh
   cd server
   ```
2. 🔄 รีเซ็ตฐานข้อมูล:
   ```sh
   npx prisma migrate reset
   ```
3. 🌱 ใส่ข้อมูลเริ่มต้นลงในฐานข้อมูลอีกครั้ง:
   ```sh
   npm run seed
   ```

### ❗ วิธีแก้ปัญหา `npm run seed` Error
หากพบข้อผิดพลาดดังต่อไปนี้:
```
Error: Cannot find module 'C:\SE_3\TEAM6-DENSY\server\dist\Utils\seed.js'
```
ให้แก้ไขไฟล์ `package.json` โดยอัปเดตส่วนของ `scripts` ดังนี้:
```json
"scripts": {
    "test": "jest",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "build": "tsc && tsc-alias",
    "seed": "tsx src/Utils/seed",
    "lint": "node -e \"const fs = require('fs'); const date = new Date(); const dateString = date.toISOString().split('T')[0].replace(/-/g, '_'); const timeString = date.toTimeString().split(' ')[0].replace(/:/g, '_'); const fileName = `lintReports/lintReport_${dateString}_${timeString}.json`; fs.mkdirSync('lintReports', { recursive: true }); require('child_process').execSync(`eslint . --format json -o ${fileName}`);\" && tsx eslint-report.ts"
}
```

## 📜 แนวทางการมีส่วนร่วม (Contribution Guidelines)
- ❌ **ห้าม** Merge เข้า `dev` โดยพลการ
- 🔄 ทุกครั้งก่อนเริ่มทำงาน ต้องดึงอัปเดตล่าสุดจาก `developer`:
  ```sh
  git pull origin developer
  ```
- 💬 ตรวจสอบการอัปเดตและพูดคุยผ่าน **Discord Pull Request Channel** ก่อนทำการ Merge การเปลี่ยนแปลงใด ๆ
- 📝 Commit ต้องเป็นไปตาม Git Commit Convention เพื่อให้โค้ดสามารถติดตามและดูแลรักษาได้ง่าย
- 🛠️ เขียนโค้ดให้เป็นไปตาม Coding Standard ของทีม เพื่อให้แน่ใจว่าโค้ดมีคุณภาพและสามารถทำงานร่วมกันได้อย่างราบรื่น
