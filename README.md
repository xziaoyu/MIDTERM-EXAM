# AMUMA

## Concept and goal

Amuma takes inspiration from the Bisaya term associated with care and nurture. Its purpose is to connect people, encourage sharing and expression, and respect personal boundaries. The supplied symbol of a hand supporting speech bubbles visually connects care with conversation.

The privacy goal appears in the About Us story, the feed's concept panel, local-only activity storage and clearly explained login/signup simulations. The app includes no trackers or AI connections; this is a prototype experience rather than a guarantee against AI scraping.

## Technologies and structure

HTML provides the five pages and their content. CSS creates the responsive layout. Vanilla JavaScript manages fictional activity and responds to clicks/form submissions. There are no frameworks, dependencies, backend routes, database connections or APIs.

Each page loads `store.js` before `main.js` using `defer`. Scripts run after HTML parsing and in their listed order. Pages inside `pages/` use `../` to reach shared resources, while `index.html` uses root-relative folder paths such as `src/css/style.css`.

All code files use four-space indentation, with separate blocks for nested elements, CSS rules and JavaScript control flow.

## Page features

### Main feed

The feed begins with three fictional sample posts. Create a new post with 1–600 non-whitespace characters. Posts render the current profile name if they belong to you. Sample posts can display the supplied wellbeing and creative illustrations.

Like toggles the local liked flag. The displayed count is the original sample count plus one if liked. Comments accept 1–240 non-whitespace characters. Only own posts have a Delete button, and a confirmation prompt prevents accidental deletion. Deleting a post removes its comments as well.

There are no saved-post, search, circle, audience or upload controls in this version.

### Login

The form uses native browser validation for required email/password values, email syntax, and a minimum password length of eight characters. Show/Hide changes the password field type. Submitting valid fictional input clears the form and opens the feed.

There is no real authentication. Login does not compare credentials against an account and creates no session. All pages are accessible without login.

### Signup

The form validates a display name, email, password length and matching confirmation. A successful signup changes only the fictional profile name in local data, clears the form, and opens the feed. If saving fails, it stays on the page with an explanation.

No account is created and neither email nor password is added to the model or browser storage.

### User profile

Displays a supplied cover illustration, initials, name, bio, post count and own posts. The edit form accepts a trimmed name up to 40 characters and a bio up to 180 characters. Empty/whitespace values are rejected.

Own post and comment names use the current profile name when rendered, so profile edits also appear in the feed on a shared browser origin.

### About Us

Explains the Bisaya name, connection/privacy goals, guiding principles, storage behavior and frontend limitations. Team, course and section placeholders must be replaced before submission.

## JavaScript model

`store.js` exposes `window.AmumaStore` to the page controller.

| Function | Purpose |
| --- | --- |
| `defaultData()` | Create the fictional profile and sample posts |
| `validData()` | Check necessary fields before accepting saved data |
| `loadData()` | Read stored JSON or restore sample content after an error |
| `saveData()` | Attempt local persistence and report a failure |
| `initials()` | Generate up to two initials from a display name |
| `setProfile()` | Trim/validate name and bio, then save them |
| `addPost()` | Validate text and prepend an own post |
| `findPost()` | Retrieve a post by its ID |
| `toggleLike()` | Flip the local liked flag |
| `addComment()` | Validate/append a comment |
| `deletePost()` | Remove only a post marked as yours |

`main.js` creates DOM elements, displays feedback, builds cards, updates profile text, and attaches handlers only when the appropriate page elements exist. A `data-page` attribute identifies the current page.

`event.preventDefault()` stops forms from making normal page submissions. User text is assigned with `textContent`, so entered HTML is displayed as text rather than executed. Post images are restricted to the three bundled filenames during rendering.

## Data and privacy

Activity is stored under `amuma_project` in localStorage. It includes the fictional profile, posts, liked flags and comments. It never includes email/password fields.

Storage belongs to a browser origin. Direct `file://` pages can be isolated differently between browsers, so cross-page persistence is not guaranteed there. One local static-server URL gives the pages a common origin. Different browsers, hostnames or ports have separate activity.

If storage is blocked/full, changes remain available in current-page memory and the app displays a warning. The previously saved version may return after reload if a new write failed. Invalid stored data falls back to the sample content. This required-pages version uses a separate storage key from the earlier detailed version.

To reset the demo manually, remove only the `amuma_project` entry using your browser's developer tools. No additional reset page is included.

Browser storage is not encrypted and can be inspected by other people using the device. The app does not implement enforced privacy rules, moderation, secure messaging, production account security or multi-user synchronization.

## Images and logo

- `logo.png`: symbol cropped from the supplied logo image; used in all headers and browser tabs.
- `community.png`: supplied illustration used on the feed, login/signup and About Us.
- `wellbeing.png`: supplied illustration used for the profile cover and a sample post.
- `creative.png`: supplied illustration used for a sample post.

No AI-generated scene or portrait images are included. The three illustrations are copied unchanged. The logo's symbol is preserved, with the lower caption outside the crop. Avatars use text initials.

Add original creator/source details in `assets/img/CREDITS.txt`.

## Editing reference

| Change | File/location |
| --- | --- |
| Logo image | `assets/img/logo.png` |
| Logo display size | `.brand-logo` in `src/css/style.css` |
| Brand name/navigation | Header in all five HTML files |
| Colors | Variables at the top of `src/css/style.css` |
| Sample posts/profile | `defaultData()` in `src/js/store.js` |
| Buttons/forms | Matching handlers in `src/js/main.js` |
| About story/team | `pages/about.html` |

Changes to default sample data do not overwrite existing saved activity. Remove the project's storage key to load revised defaults.

## Verification and manual checklist

Creation checks: JavaScript syntax, five-page local links/assets, unique HTML IDs, indentation and image integrity. Model checks cover posting, validation, likes, comments, profile updates, own-post deletion, persistence, blocked storage and invalid saved data.

Rendered browser layout and end-to-end browser interactions have not been verified in the creation environment. Before submission:

- [ ] Open all five pages; check images, styling and navigation.
- [ ] Inspect the logo; verify only the symbol appears beside Amuma.
- [ ] Create a post, then check that it appears on Profile.
- [ ] Reject empty/whitespace post and comment input.
- [ ] Like/unlike and check the count returns to its initial value.
- [ ] Expand comments, add one and verify text/name/count.
- [ ] Cancel deletion, then confirm deletion; check other people's posts have no Delete button.
- [ ] Edit the profile name/bio and check own post/comment authors update.
- [ ] Reload and switch pages on one local-server origin to check persistence.
- [ ] Try invalid email, short password and mismatching signup passwords.
- [ ] Try valid fictional login/signup values and confirm navigation/profile behavior.
- [ ] Use keyboard navigation and inspect visible focus.
- [ ] Narrow the window to phone width; check cards, forms, navigation and images.
- [ ] Replace team/course placeholders and add artwork source credits.

AI assistance was used to draft code and documentation. Understand the implementation and acknowledge assistance according to your instructor's rules.
