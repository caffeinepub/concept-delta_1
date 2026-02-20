# Specification

## Summary
**Goal:** Add route protection to the Admin page to ensure only authenticated admin users can access it.

**Planned changes:**
- Implement redirect logic in the Admin page component using useNavigate and useEffect
- Redirect unauthenticated users to the home page (/)
- Redirect authenticated non-admin users to the dashboard page (/dashboard)
- Consume isAuthenticated and role from AuthContext using the useAuth hook

**User-visible outcome:** Unauthenticated users attempting to access the Admin page are redirected to the home page, while authenticated students are redirected to the dashboard. Only users with admin role can view the Admin page content.
