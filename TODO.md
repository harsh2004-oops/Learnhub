# TODO: Implement Student Login and Dynamic Ranking

## Plan Steps (Approved by User)

### 1. [ ] Update Database Schema
- Add `roll_number` column to `users` table in `server/schema.sql`
- Insert sample students with roll_numbers and progress data

### 2. [ ] Update Backend (`server/index.js`)
- Add `/api/login` endpoint (name + roll_number)
- Add `/api/leaderboard` endpoint (compute rankings by totalProgress)
- Enhance auth middleware

### 3. [ ] Create Frontend Login Component
- `src/components/Login.tsx`

### 4. [ ] Add Auth Context
- `src/contexts/AuthContext.tsx`
- Wrap App in `src/main.tsx`

### 5. [ ] Update App.tsx for Login Flow
- Show Login if not authenticated
- Load real student data post-login

### 6. [ ] Create Auth Service
- `src/services/auth.ts`

### 7. [ ] Update Types
- Add `rollNumber` to Student type in `src/types/index.ts`

### 8. [ ] Migrate DB and Test
- Run schema updates
- Insert sample data
- Test login, dashboard, leaderboard

### 9. [ ] Minor Updates
- Header, Dashboard to use real data

### 1. ✅ Update Database Schema
- Add `roll_number` column to `users` table in `server/schema.sql`
- Insert sample students with roll_numbers and progress data
- Schema updated successfully ✅

### 3. ✅ Create Frontend Login Component
- `src/components/Login.tsx` ✅

### 4. ✅ Add Auth Context
- `src/contexts/AuthContext.tsx` ✅
- Wrap App in `src/main.tsx` ✅

### 6. ✅ Create Auth Service
- `src/services/auth.ts` ✅

### 7. ✅ Update Types
- Add `rollNumber` to Student type in `src/types/index.ts` ✅

### 2. ✅ Update Backend (`server/index.js`)
- Add `/api/login` endpoint (name + roll_number) ✅
- Add `/api/leaderboard` endpoint (compute rankings by totalProgress) ✅
- Enhance auth middleware ✅

### 5. ✅ Update App.tsx for Login Flow
- Show Login if not authenticated ✅
- Load real student data post-login ✅

**Current Progress: Frontend login complete. Next: DB migration (manual), testing. Run npm run dev after DB applied and server started.**
