# 🧪 Testing Guide

## Quick Test Scenario

### Scenario 1: Admin Login and User Management

1. **Start the application**
   ```bash
   start-all.bat
   ```

2. **Open browser**: http://localhost:5173

3. **Login as Admin**
   - Email: `pdev444444@gmail.com`
   - Password: `admin123`
   - Click "Login"
   - ✅ Should see "Admin Panel" page

4. **Create an Employee**
   - Click "Add User" button
   - Fill in:
     - Name: `John Doe`
     - Email: `john@example.com`
     - Password: `test123`
     - Role: `Employee`
   - Click "Create User"
   - ✅ Should see success message
   - ✅ Should see John Doe in user list

5. **Create Another Admin**
   - Click "Add User" button
   - Fill in:
     - Name: `Jane Admin`
     - Email: `jane@example.com`
     - Password: `admin456`
     - Role: `Admin`
   - Click "Create User"
   - ✅ Should see Jane Admin in user list

6. **Logout**
   - Click "Logout" button
   - ✅ Should return to login page

### Scenario 2: Employee Login

1. **Login as Employee**
   - Email: `john@example.com`
   - Password: `test123`
   - Click "Login"
   - ✅ Should see "Employee Dashboard"
   - ✅ Should NOT see "Add User" button
   - ✅ Should see profile information

2. **Verify Employee Restrictions**
   - ✅ No user management options visible
   - ✅ Only sees own dashboard

3. **Logout**
   - Click "Logout"
   - ✅ Returns to login page

### Scenario 3: User Deletion

1. **Login as Admin**
   - Email: `pdev444444@gmail.com`
   - Password: `admin123`

2. **Delete a User**
   - Find John Doe in user list
   - Click "Delete" button
   - Confirm deletion
   - ✅ User removed from list

3. **Try to Delete Self**
   - Try to delete your own account (pdev444444@gmail.com)
   - ✅ Should show error or button disabled

### Scenario 4: Invalid Login

1. **Try Wrong Password**
   - Email: `pdev444444@gmail.com`
   - Password: `wrongpassword`
   - ✅ Should show "Invalid email or password"

2. **Try Non-existent User**
   - Email: `notexist@example.com`
   - Password: `anything`
   - ✅ Should show "Invalid email or password"

### Scenario 5: Session Persistence

1. **Login as Admin**
   - Login successfully

2. **Refresh Page**
   - Press F5 or refresh browser
   - ✅ Should stay logged in
   - ✅ Should still see Admin Panel

3. **Close and Reopen Browser**
   - Close browser completely
   - Open browser again
   - Go to http://localhost:5173
   - ✅ Should still be logged in (token in localStorage)

4. **Logout and Refresh**
   - Click Logout
   - Try to refresh page
   - ✅ Should stay on login page

## API Testing (Optional)

### Using curl or Postman

1. **Login**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"email\":\"pdev444444@gmail.com\",\"password\":\"admin123\"}"
   ```
   ✅ Should return token and user object

2. **Get Current User**
   ```bash
   curl http://localhost:5000/api/auth/me \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```
   ✅ Should return user information

3. **Create User (Admin)**
   ```bash
   curl -X POST http://localhost:5000/api/auth/users \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN_HERE" \
     -d "{\"email\":\"test@example.com\",\"password\":\"test123\",\"name\":\"Test User\",\"role\":\"employee\"}"
   ```
   ✅ Should create user

4. **List Users (Admin)**
   ```bash
   curl http://localhost:5000/api/auth/users \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```
   ✅ Should return array of users

## Expected Behavior Checklist

### Login Page
- [ ] Shows email and password fields
- [ ] Shows "Login" button
- [ ] Shows default credentials hint
- [ ] Displays error for invalid credentials
- [ ] Redirects to dashboard on success

### Admin Panel
- [ ] Shows "Admin Panel" title
- [ ] Shows welcome message with admin name
- [ ] Shows "Logout" button
- [ ] Shows "Add User" button
- [ ] Shows list of all users
- [ ] Each user shows: name, email, role
- [ ] Shows "Delete" button for other users
- [ ] No "Delete" button for own account

### Add User Form
- [ ] Shows when "Add User" clicked
- [ ] Has fields: name, email, password, role
- [ ] Role dropdown has: Employee, Admin
- [ ] Shows success message on creation
- [ ] Shows error if email already exists
- [ ] Clears form after successful creation
- [ ] Updates user list automatically

### Employee Dashboard
- [ ] Shows "Employee Dashboard" title
- [ ] Shows welcome message with employee name
- [ ] Shows "Logout" button
- [ ] Shows profile card with: name, email, role
- [ ] Does NOT show user management features

### Security
- [ ] Cannot access admin routes as employee
- [ ] Cannot access dashboard without login
- [ ] Token expires after 7 days
- [ ] Logout invalidates token
- [ ] Passwords are hashed (not visible in database)

## Database Verification

### Check Users Table
```sql
psql -U postgres -d decode_age_task_manager

-- View all users
SELECT id, email, name, role, created_at FROM users;

-- Check password is hashed
SELECT email, password FROM users WHERE email = 'pdev444444@gmail.com';
-- Password should start with $2b$ (bcrypt hash)
```

### Check Sessions Table
```sql
-- View active sessions
SELECT s.id, u.email, s.expires_at, s.created_at 
FROM sessions s 
JOIN users u ON s.user_id = u.id 
WHERE s.expires_at > NOW();
```

## Performance Testing

1. **Create Multiple Users**
   - Create 10-20 users through admin panel
   - ✅ Should handle without lag
   - ✅ User list should display all users

2. **Rapid Login/Logout**
   - Login and logout 5 times quickly
   - ✅ Should work consistently
   - ✅ No session conflicts

## Browser Compatibility

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (if available)

## Mobile Responsiveness

1. Open browser dev tools (F12)
2. Toggle device toolbar
3. Test on different screen sizes
4. ✅ Forms should be usable
5. ✅ Buttons should be clickable
6. ✅ Text should be readable

## Common Issues and Solutions

### Issue: "Cannot connect to backend"
**Solution:** Make sure backend is running on port 5000

### Issue: "Database connection failed"
**Solution:** Check PostgreSQL is running and credentials in .env

### Issue: "Token expired"
**Solution:** Logout and login again

### Issue: "User already exists"
**Solution:** Use a different email address

### Issue: Blank page after login
**Solution:** Check browser console for errors, verify backend is responding

## Success Criteria

✅ All scenarios pass
✅ No console errors
✅ Smooth user experience
✅ Data persists across sessions
✅ Security features work correctly

---

**Ready to test?** Follow the scenarios above step by step!
