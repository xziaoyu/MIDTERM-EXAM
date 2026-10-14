/* Connects the shared model to the five HTML pages.
 * User input is rendered with textContent instead of executable HTML.
 */
(() => {
    "use strict";

    const store = window.AmumaStore;
    const page = document.body.dataset.page;
    const prefix = page === "feed" ? "" : "../";
    const expandedComments = new Set();
    let messageTimer;

    function select(selector) {
        return document.querySelector(selector);
    }

    function create(tag, className, text) {
        const node = document.createElement(tag);

        if (className) {
            node.className = className;
        }

        if (text !== undefined) {
            node.textContent = text;
        }

        return node;
    }

    function showMessage(text) {
        const message = select("#status-message");
        clearTimeout(messageTimer);
        message.textContent = text;
        message.classList.add("visible");

        messageTimer = setTimeout(() => {
            message.classList.remove("visible");
        }, 5000);
    }

    function updateStorageWarning() {
        const previous = select(".storage-warning");

        if (previous) {
            previous.remove();
        }

        const text = store.getStorageMessage();

        if (text) {
            const warning = create("p", "storage-warning", text);
            warning.setAttribute("role", "status");
            select("#main").prepend(warning);
        }
    }

    function report(saved, successText) {
        showMessage(saved ? successText : store.getStorageMessage());
        updateStorageWarning();
    }

    function updateProfile() {
        const profile = store.getData().profile;

        document.querySelectorAll("[data-user-name]").forEach((node) => {
            node.textContent = profile.name;
        });

        document.querySelectorAll("[data-user-initial]").forEach((node) => {
            node.textContent = store.initials(profile.name);
        });

        if (select("#profile-bio")) {
            select("#profile-bio").textContent = profile.bio;
            select("#post-count").textContent = store.getData().posts.filter((post) => post.own).length;
        }
    }

    function renderPosts() {
        const list = select("#post-list");

        if (!list) {
            return;
        }

        const focused = document.activeElement;
        const focusedId = focused && focused.dataset.postId;
        const focusedAction = focused && focused.dataset.action;
        const posts = store.getData().posts.filter((post) => page !== "profile" || post.own);
        list.replaceChildren();

        if (!posts.length) {
            const empty = create("section", "card empty-state");
            empty.append(create("h2", "", "Your story starts here."));
            const link = create("a", "", "Share a post from the feed →");
            link.href = "../index.html";
            empty.append(link);
            list.append(empty);
            return;
        }

        posts.forEach((post) => {
            const authorName = post.own ? store.getData().profile.name : post.author;
            const card = create("article", "card post");
            const header = create("div", "post-header");
            const avatar = create("span", "avatar", store.initials(authorName));
            avatar.setAttribute("aria-hidden", "true");
            const author = create("div");
            author.append(create("strong", "", authorName));
            author.append(create("small", "", post.own ? "Your demo post" : "Fictional member"));
            header.append(avatar, author);
            card.append(header, create("p", "post-text", post.text));

            if (["community.png", "wellbeing.png", "creative.png"].includes(post.image)) {
                const image = create("img", "post-image");
                image.src = prefix + "assets/img/" + post.image;
                image.alt = post.imageAlt;
                image.loading = "lazy";
                card.append(image);
            }

            const actions = create("div", "post-actions");
            const like = create("button", "post-action", "Like · " + (post.baseLikes + (post.liked ? 1 : 0)));
            like.type = "button";
            like.setAttribute("aria-pressed", String(post.liked));
            like.setAttribute("aria-label", (post.liked ? "Unlike" : "Like") + " post by " + authorName);
            like.dataset.postId = post.id;
            like.dataset.action = "like";

            like.addEventListener("click", () => {
                const saved = store.toggleLike(post.id);
                renderPosts();

                if (!saved) {
                    report(false, "");
                }
            });

            const commentsButton = create("button", "post-action", "Comments · " + post.comments.length);
            commentsButton.type = "button";
            commentsButton.setAttribute("aria-expanded", String(expandedComments.has(post.id)));
            commentsButton.dataset.postId = post.id;
            commentsButton.dataset.action = "comments";

            commentsButton.addEventListener("click", () => {
                if (expandedComments.has(post.id)) {
                    expandedComments.delete(post.id);
                } else {
                    expandedComments.add(post.id);
                }

                renderPosts();
            });

            actions.append(like, commentsButton);

            if (post.own) {
                const remove = create("button", "post-action delete-action", "Delete");
                remove.type = "button";

                remove.addEventListener("click", () => {
                    if (window.confirm("Delete your demo post and its comments?")) {
                        const saved = store.deletePost(post.id);
                        expandedComments.delete(post.id);
                        renderPosts();
                        updateProfile();
                        report(saved, "Your post was deleted.");
                    }
                });

                actions.append(remove);
            }

            card.append(actions);

            if (expandedComments.has(post.id)) {
                const comments = create("section", "comments");
                comments.setAttribute("aria-label", "Comments on post by " + authorName);

                post.comments.forEach((comment) => {
                    const item = create("div", "comment");
                    const name = comment.own ? store.getData().profile.name : comment.author;
                    item.append(create("strong", "", name), create("p", "", comment.text));
                    comments.append(item);
                });

                const form = create("form", "comment-form");
                const input = create("input");
                input.type = "text";
                input.maxLength = 240;
                input.required = true;
                input.placeholder = "Add a thoughtful comment…";
                input.setAttribute("aria-label", "Your comment on post by " + authorName);
                const send = create("button", "button", "Send");
                send.type = "submit";
                form.append(input, send);

                form.addEventListener("submit", (event) => {
                    event.preventDefault();

                    try {
                        const saved = store.addComment(post.id, input.value);
                        renderPosts();
                        report(saved, "Your comment was added.");
                    } catch (error) {
                        showMessage(error.message);
                    }
                });

                comments.append(form);
                card.append(comments);
            }

            list.append(card);
        });

        // Preserve keyboard focus on the same post action after rebuilding cards.
        if (focusedId && focusedAction) {
            const buttons = Array.from(list.querySelectorAll("button[data-post-id]"));
            const replacement = buttons.find((button) => {
                return button.dataset.postId === focusedId && button.dataset.action === focusedAction;
            });

            if (replacement) {
                replacement.focus({ preventScroll: true });
            }
        }
    }

    updateProfile();
    renderPosts();
    updateStorageWarning();

    if (select("#post-form")) {
        select("#post-form").addEventListener("submit", (event) => {
            event.preventDefault();

            try {
                const saved = store.addPost(select("#post-text").value);
                select("#post-form").reset();
                renderPosts();
                report(saved, "Your story was added to the local demo.");
            } catch (error) {
                showMessage(error.message);
            }
        });
    }

    if (select("#profile-form")) {
        select("#display-name").value = store.getData().profile.name;
        select("#bio").value = store.getData().profile.bio;

        select("#profile-form").addEventListener("submit", (event) => {
            event.preventDefault();

            try {
                const saved = store.setProfile(select("#display-name").value, select("#bio").value);
                updateProfile();
                renderPosts();
                report(saved, "Your local profile was updated.");
            } catch (error) {
                showMessage(error.message);
            }
        });
    }

    if (select("#toggle-password")) {
        select("#toggle-password").addEventListener("click", (event) => {
            const password = select("#password");
            const show = password.type === "password";
            password.type = show ? "text" : "password";
            event.currentTarget.textContent = show ? "Hide" : "Show";
            event.currentTarget.setAttribute("aria-pressed", String(show));
        });
    }

    if (select("#login-form")) {
        select("#login-form").addEventListener("submit", (event) => {
            event.preventDefault();
            select("#login-form").reset();
            window.location.href = "../index.html";
        });
    }

    if (select("#signup-form")) {
        select("#signup-form").addEventListener("submit", (event) => {
            event.preventDefault();
            const errorMessage = select("#form-error");
            errorMessage.textContent = "";

            if (select("#password").value !== select("#confirm-password").value) {
                errorMessage.textContent = "The passwords do not match.";
                return;
            }

            try {
                const saved = store.setProfile(select("#display-name").value, store.getData().profile.bio);
                select("#signup-form").reset();

                if (saved) {
                    window.location.href = "../index.html";
                } else {
                    errorMessage.textContent = "Demo profile updated on this page only. Use Explore as a guest to continue.";
                    updateStorageWarning();
                }
            } catch (error) {
                errorMessage.textContent = error.message;
            }
        });
    }
})();
