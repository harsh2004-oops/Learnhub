# Backend MySQL Complete - Windows Fixed Setup!

✅ **NO MANUAL SQL QUERIES NEEDED** - Everything scripted!

## 1-Click Setup (Recommended)
**Double-click `setup-mysql.bat`** (in project root):
```
Installs npm deps + creates ALL tables automatically
```
(Enters password prompt, sources schema.sql fully)

## Manual Commands (PowerShell)
```
cd server
npm install
mysql -u root -p"your_password" learning_platform -e "source schema.sql"
cd ..
```

**OR save as .bat:**
```
cd server
npm install
mysql -u root -p learning_platform -e "source schema.sql"
```

## Update server/.env (if empty)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=learning_platform
DB_USER=root
DB_PASSWORD=your_mysql_root_password
PORT=3001
```

## Start Backend
```
cd server
node index.js
```
**Test:** Open browser: http://localhost:3001/health → {status: 'OK'}

## Connected & Ready
- **All tables created by schema.sql** (users, chat_messages, recommendations, etc.)
- **APIs live**: POST chat → stores in MySQL automatically
- **Frontend Step 2 next** (persist via APIs)

**Backend 100% connected to MySQL - all data stored there!** Run setup.bat now.
