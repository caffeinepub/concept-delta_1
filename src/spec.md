# Specification

## Summary
**Goal:** Implement a chapter-wise test creation system in the Admin panel that allows creating, managing, and publishing tests with selected questions filtered by class and subject.

**Planned changes:**
- Add a new "Create Test" tab to the Admin panel navigation
- Create a test creation form with fields for test name, class level, subject, duration, and marks per question
- Implement dynamic question fetching and filtering based on selected class and subject
- Display filtered questions in a selectable list with thumbnails, showing question ID, chapter, and checkboxes
- Show a live count of selected questions
- Add backend Test type with fields: id, testName, classLevel, subject, duration, marksPerQuestion, questionIds, status, and createdAt
- Implement createTest() backend function to store tests in stable memory with auto-generated IDs and draft status
- Create useQueries hook for test creation
- Implement form validation and submission that saves tests and clears the form
- Add updateTestStatus() backend function to change test status between draft and published
- Add a Publish toggle button to change test status
- Ensure mobile-responsive UI following the navy and light blue color scheme

**User-visible outcome:** Admins can create chapter-wise tests by selecting class and subject, choosing questions from a filtered list, setting test parameters, saving tests as drafts, and publishing them when ready.
