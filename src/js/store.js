/* Stores fictional demo activity in this browser only.
 * Passwords and emails are never added to this data model.
 */
window.AmumaStore = (() => {
    "use strict";

    const storageKey = "amuma-required-v1";
    let storageMessage = "";

    function defaultData() {
        return {
            version: 1,
            profile: {
                name: "Jason",
                bio: "Learning, creating, and finding joy in everyday moments."
            },
            posts: [
                {
                    id: "sample-gorge",
                    author: "George Bugwak",
                    own: false,
                    text: "A gentle reminder that you do not need to share everything to feel connected. Make a little time for yourself today. 🌿",
                    image: "wellbeing.png",
                    imageAlt: "Illustration of a peaceful person surrounded by plants",
                    baseLikes: 12,
                    liked: false,
                    comments: []
                },
                {
                    id: "sample-bossing",
                    author: "Bossing",
                    own: false,
                    text: "Study sako kay aron unya kaon kos mang inasal:))",
                    image: "creative.png",
                    imageAlt: "Illustration of a person working at a desk beside a window",
                    baseLikes: 8,
                    liked: false,
                    comments: []
                },
                {
                    id: "sample-you",
                    author: "You",
                    own: true,
                    text: "Hello, Amuma! Bago rako diri.",
                    image: "",
                    imageAlt: "",
                    baseLikes: 0,
                    liked: false,
                    comments: []
                }
            ]
        };
    }

    function validData(value) {
        return value && value.version === 1 && value.profile &&
            typeof value.profile.name === "string" &&
            typeof value.profile.bio === "string" &&
            Array.isArray(value.posts) && value.posts.every((post) => {
                return post && typeof post.id === "string" &&
                    typeof post.author === "string" &&
                    typeof post.text === "string" &&
                    typeof post.baseLikes === "number" &&
                    Array.isArray(post.comments) && post.comments.every((comment) => {
                        return comment && typeof comment.author === "string" &&
                            typeof comment.text === "string";
                    });
            });
    }

    function loadData() {
        try {
            const saved = window.localStorage.getItem(storageKey);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (validData(parsed)) {
                    return parsed;
                }

                storageMessage = "Saved demo data is invalid. Sample content was restored.";
            }
        } catch (error) {
            storageMessage = "Browser storage could not be read. This page is using temporary demo data.";
        }

        return defaultData();
    }

    let data = loadData();

    function saveData() {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(data));
            storageMessage = "";
            return true;
        } catch (error) {
            storageMessage = "Your change works on this page but could not be saved. Browser storage may be blocked or full.";
            return false;
        }
    }

    function initials(name) {
        return name.trim().split(/\s+/).slice(0, 2).map((word) => {
            return word.charAt(0);
        }).join("").toUpperCase();
    }

    function setProfile(name, bio) {
        name = String(name).trim();
        bio = String(bio).trim();

        if (!name || name.length > 40 || !bio || bio.length > 180) {
            throw new Error("Enter a name and bio within the character limits.");
        }

        data.profile = { name, bio };
        return saveData();
    }

    function addPost(text) {
        text = String(text).trim();

        if (!text || text.length > 600) {
            throw new Error("Write a story between 1 and 600 characters.");
        }

        data.posts.unshift({
            id: "post-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8),
            author: "You",
            own: true,
            text,
            image: "",
            imageAlt: "",
            baseLikes: 0,
            liked: false,
            comments: []
        });

        return saveData();
    }

    function findPost(id) {
        return data.posts.find((post) => post.id === id);
    }

    function toggleLike(id) {
        const post = findPost(id);

        if (!post) {
            return false;
        }

        post.liked = !post.liked;
        return saveData();
    }

    function addComment(id, text) {
        const post = findPost(id);
        text = String(text).trim();

        if (!post || !text || text.length > 240) {
            throw new Error("Write a comment between 1 and 240 characters.");
        }

        post.comments.push({ author: "You", own: true, text });
        return saveData();
    }

    function deletePost(id) {
        const index = data.posts.findIndex((post) => post.id === id && post.own);

        if (index === -1) {
            return false;
        }

        data.posts.splice(index, 1);
        return saveData();
    }

    return {
        getData: () => data,
        getStorageMessage: () => storageMessage,
        initials,
        setProfile,
        addPost,
        findPost,
        toggleLike,
        addComment,
        deletePost
    };
})();
