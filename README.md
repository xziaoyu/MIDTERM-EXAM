# Amuma — required-pages version

**Your voice matters. Your privacy does too.**

Amuma is a Bisaya-inspired social media prototype centered on care, personal privacy, connection, and self-expression. This version contains only the five pages required by the web development midterm instructions. It uses HTML, CSS, and Vanilla JavaScript, with no backend, database, framework, or API.

## Open on a MacBook

1. Extract `Amuma-Required-Pages.zip`.
2. Open the `amuma-required` folder.
3. Right-click `index.html` and choose **Open With → Chrome or Safari**.
4. Keep the complete folder together so its images, CSS and JavaScript load.

Read `START-HERE.txt` for editing and reliable cross-page storage instructions. Directly opened HTML files can have inconsistent storage behavior between pages; serving the static folder from one local address provides a shared browser origin.

## Required pages

| Requirement | File | Behavior |
| --- | --- | --- |
| Main feed | `index.html` | Create text posts, like/unlike, comment, delete your own posts |
| Login | `pages/login.html` | Validate fictional email/password format and open the feed |
| Signup | `pages/signup.html` | Validate a name, email, password and matching confirmation |
| User profile | `pages/profile.html` | Edit name/bio, view initials, post count and own posts |
| About Us | `pages/about.html` | Explain the name, goal, principles, frontend limits and team |

Discover, Saved Posts, the Privacy Center, circle controls, audience controls, themes, and search are not part of this version.

## Folder organization

- `index.html`: main feed.
- `pages/`: Login, Signup, Profile, About Us.
- `src/css/style.css`: shared appearance, logo sizing, cards, forms and responsive layout.
- `src/js/store.js`: sample data, validation and browser storage.
- `src/js/main.js`: page rendering and event handlers.
- `assets/img/`: supplied logo symbol and three supplied illustrations.
- `DOCUMENTATION.md`: detailed explanation, feature limits and test checklist.

HTML, CSS and JavaScript use four-space indentation. Native code files are supplied directly; you do not need to recreate them with TextEdit.

## Demo scope

Login and signup are simulations. Any syntactically valid fictional email and password of at least eight characters can pass login validation. Signup updates the local display name only. No real account, authenticated session or access restrictions are created. Email and password values are discarded and never saved by application code.

The app stores fictional profile details, posts, likes and comments under the browser key `amuma-required-v1`. Browser data is not encrypted or private from another person using the device. If storage is blocked or full, changes work in the current page's memory and a warning explains that they could not be saved.

No trackers, advertising scripts, AI integrations, external image services or background network requests are included. This demonstrates privacy-aware design; a static frontend cannot prevent scraping or copying or provide production account security.

## Before submission

- Replace the team, course and section placeholders in `pages/about.html`.
- Add original image sources/creator credits in `assets/img/CREDITS.txt`.
- Complete the manual checks in `DOCUMENTATION.md`.
- Understand how HTML, CSS, JavaScript and local storage connect.
- Follow your instructor's rules for acknowledging assistance. AI assistance was used for code and documentation; the images were supplied by the project owner.

## Validation

JavaScript syntax, all five pages' local links and assets, unique IDs, four-space indentation, image integrity, and basic model behavior were checked. Browser layout and end-to-end interactions still need to be checked on your MacBook using the included checklist.
