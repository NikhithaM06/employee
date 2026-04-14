# EMS - Employee Management System - Testing Checklist

## Status: READY FOR TESTING

### ✅ PART 1: CRUD OPERATIONS TESTING

#### 1. Employee CRUD Operations

- [ ] **Add Employee**
  - [ ] Navigate to "Employees" → "Add New Employee"
  - [ ] Fill all form fields (name, age, experience, company, domain, skills, salary, image)
  - [ ] Click "Create Employee"
  - [ ] Verify success toast appears
  - [ ] Verify new employee appears in Employees list
  - [ ] Verify data persists on page refresh

- [ ] **Edit Employee**
  - [ ] Go to Employees page
  - [ ] Click "Edit" on any employee
  - [ ] Change employee details
  - [ ] Click "Save changes"
  - [ ] Verify success toast appears
  - [ ] Verify changes reflected immediately
  - [ ] Navigate to employee detail page and verify edit worked

- [ ] **View Employee Details**
  - [ ] Go to Employees page
  - [ ] Click on an employee row OR click "Edit" button
  - [ ] Verify all employee details display correctly
  - [ ] Verify profile image displays
  - [ ] Verify skills are shown as tags
  - [ ] Verify previous company and domain display

- [ ] **Delete Employee**
  - [ ] Go to "Manage Employees" page
  - [ ] Click "Delete" button on an employee
  - [ ] Confirm the delete action
  - [ ] Verify success toast appears
  - [ ] Verify employee removed from list

- [ ] **Mark Employee as Past**
  - [ ] Go to "Manage Employees" page
  - [ ] Click "Mark as Past" on an employee
  - [ ] Confirm the action
  - [ ] Verify success toast appears
  - [ ] Verify employee no longer in active list
  - [ ] Go to "Past Employees" and verify it appears there

#### 2. Client CRUD Operations

- [ ] **Add Client**
  - [ ] Go to "Clients" page
  - [ ] Click "Add Client"
  - [ ] Fill company name, CEO, description
  - [ ] Click "Save Client"
  - [ ] Verify success toast appears
  - [ ] Verify new client appears on page

- [ ] **View Client Details**
  - [ ] Click "View Details" on a client
  - [ ] Verify modal shows: company name, CEO, ongoing projects, completed projects, description
  - [ ] Close modal

#### 3. Services View

- [ ] **View Services**
  - [ ] Navigate to "Services" page
  - [ ] Verify all services display: Apps, Websites, E-Commerce, Maintenance
  - [ ] Verify each service shows: name, description, active projects, completed projects
  - [ ] Verify colored accent bars display

### ✅ PART 2: DASHBOARD TESTING

- [ ] **Verify Dashboard Stats**
  - [ ] Dashboard loads without errors
  - [ ] Total Employees count is correct
  - [ ] Past Employees count is correct
  - [ ] Total Clients count is correct
  - [ ] New This Month count is correct

- [ ] **Verify Monthly Headcount Bar Graph**
  - [ ] Graph displays all 12 months (Jan to Dec)
  - [ ] Months with data show bars
  - [ ] Months without data show 0
  - [ ] Graph updates when new employees added

- [ ] **Verify Department Breakdown Pie Chart**
  - [ ] Pie chart displays all departments
  - [ ] Department list shows all domains with correct counts
  - [ ] Colors are distinct for each department

### ✅ PART 3: SEARCH & FILTER TESTING

- [ ] **Employee Search**
  - [ ] Go to "Employees" page
  - [ ] Type in search box (e.g., "John")
  - [ ] Verify list filters in real-time
  - [ ] Verify search is case-insensitive
  - [ ] Clear search and verify all employees show again

- [ ] **Manage Employees Domain Filter**
  - [ ] Go to "Manage Employees" page
  - [ ] Click on domain filters (All, Dev, QA, HR, Finance)
  - [ ] Verify list updates to show only selected domain
  - [ ] Combine search + filter

- [ ] **Manage Employees Search with Filter**
  - [ ] Apply domain filter
  - [ ] Type in search box
  - [ ] Verify both filters work together

### ✅ PART 4: EMPTY STATES TESTING

- [ ] **Empty Employee List**
  - [ ] Delete all employees from Manage Employees
  - [ ] Go to Employees page
  - [ ] Verify empty state message displays
  - [ ] Verify "Add New Employee" button visible

- [ ] **Empty Search Results**
  - [ ] Go to Employees page
  - [ ] Search for non-existent employee (e.g., "ZZZZZZ")
  - [ ] Verify empty state displays

### ✅ PART 5: NAVIGATION TESTING

- [ ] **Sidebar Navigation**
  - [ ] Click "Dashboard" → verify Dashboard page loads
  - [ ] Click "Employees" → verify Employees list loads
  - [ ] Click "Manage Employees" → verify management page loads
  - [ ] Click "Past Employees" → verify past employees list loads
  - [ ] Click "Clients" → verify clients page loads
  - [ ] Click "Services" → verify services page loads

- [ ] **Breadcrumb/Internal Navigation**
  - [ ] From Employees, add new employee, close form → back on Employees
  - [ ] Add employee → redirects to Employees after success
  - [ ] Click employee name/row → goes to detail page

### ✅ PART 6: USER FEEDBACK TESTING

- [ ] **Toast Notifications**
  - [ ] Add employee → success toast appears
  - [ ] Edit employee → success toast appears
  - [ ] Delete employee → success toast appears
  - [ ] Mark past → success toast appears
  - [ ] Add client → success toast appears
  - [ ] Invalid form submission → error toast appears
  - [ ] API error → error toast displays message

- [ ] **Loading States**
  - [ ] Dashboard initially shows spinner
  - [ ] Employees list shows spinner while loading
  - [ ] Data loads successfully after spinner

- [ ] **Error Handling**
  - [ ] If backend is down, error message displays
  - [ ] Form validation errors show below fields
  - [ ] Delete confirmation appears before delete

### ✅ PART 7: DATA INTEGRITY TESTING

- [ ] **Dashboard Numbers Update**
  - [ ] Note current total employees count
  - [ ] Add new employee
  - [ ] Return to dashboard
  - [ ] Verify total employees increased by 1

- [ ] **Search Filters Real-Time**
  - [ ] Add new employee with specific name
  - [ ] Search for that name
  - [ ] Verify it appears immediately

- [ ] **Employee Status Transitions**
  - [ ] Active employee → Mark Past → appears in Past Employees
  - [ ] Verify employee no longer in active lists

### ✅ PART 8: BROWSER & CONSOLE TESTING

- [ ] **Open Browser Console (F12)**
  - [ ] No red error messages
  - [ ] No warnings about missing keys
  - [ ] No warnings about deprecated React features

- [ ] **Responsive Design**
  - [ ] Test on desktop (1920px)
  - [ ] Test on tablet (768px) - sidebar collapses
  - [ ] Test on mobile (375px) - layout adapts

### KNOWN ISSUES / NOTES

- Deprecation warning from Node.js `fs.F_OK` (not our code, safe to ignore)
-

---

## OPTIONAL ENHANCEMENTS (Time Permitting)

- [ ] Dark mode toggle
- [ ] Image upload with Multer/Cloudinary
- [ ] Pagination for employee table
- [ ] CSV export functionality
- [ ] Custom confirmation modal for deletes
- [ ] Department color coding

---

## DEMO PREPARATION

### Database Seeding Status

- [ ] 10+ employees in database (with varying domains)
- [ ] 4+ clients in database
- [ ] 4 services in database
- [ ] 2-3 past employees in database

### Demo Walkthrough Script (5 minutes)

1. **Dashboard** (30s)
   - Show overview stats
   - Show monthly headcount trend
   - Show department breakdown

2. **Employees List** (30s)
   - Search functionality
   - Click through to employee detail

3. **Add Employee** (1m)
   - Fill form
   - Upload image
   - Submit
   - Show success toast

4. **Edit Employee** (30s)
   - Open employee detail
   - Click edit
   - Modify fields
   - Save

5. **Delete Employee** (20s)
   - Go to Manage Employees
   - Delete an employee
   - Show confirmation
   - Show success toast

6. **Mark Past** (20s)
   - Mark employee as past
   - Show in Past Employees section

7. **Clients** (20s)
   - Show clients list
   - Click View Details
   - Close modal

8. **Services** (10s)
   - Quick overview of services

---

## GITHUB DEPLOYMENT

### Git Setup

- [ ] `git init` (in the root directory)
- [ ] `git add .`
- [ ] Create `.gitignore`
- [ ] `git commit -m "Initial commit: EMS app"`
- [ ] Create GitHub repository
- [ ] `git remote add origin <your-repo-url>`
- [ ] `git push -u origin main`

### README.md Template

- [ ] Created with project description
- [ ] Listed tech stack
- [ ] Included setup instructions
- [ ] Added features list
- [ ] Included screenshots

---

## FINAL SIGN-OFF

- [ ] All CRUD operations working
- [ ] Dashboard displays correctly
- [ ] No errors in browser console
- [ ] Responsive design verified
- [ ] Code pushed to GitHub
- [ ] README.md complete
- [ ] Ready for demo
