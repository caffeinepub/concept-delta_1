# Specification

## Summary
**Goal:** Fix Question Creation form validation to require classLevel, subject, and chapter fields, and fix question deletion functionality to properly remove questions from stable memory.

**Planned changes:**
- Make classLevel dropdown required with options '11th' and '12th', show validation error if not selected
- Make subject dropdown required with options 'Physics', 'Chemistry', and 'Maths', show validation error if not selected
- Make chapter/topic name text input required, show validation error if empty
- Prevent form submission unless all three fields (classLevel, subject, chapter) are filled
- Ensure classLevel, subject, and chapter are always sent to backend createQuestion function
- Preserve existing image-only workflow (questionText and option text fields remain optional)
- Fix backend deleteQuestion function to correctly remove questions from stable memory with proper ID type matching
- Refresh question list, update total count, and show success message after successful deletion in QuestionGallery
- Display error message in QuestionGallery when deletion fails

**User-visible outcome:** Admins must select class level, subject, and enter chapter name before creating questions, ensuring all questions are properly classified. Question deletion now works correctly, with the list automatically refreshing and showing success/error messages.
