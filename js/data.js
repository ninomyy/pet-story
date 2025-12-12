// データストレージとサンプルデータ

// LocalStorageのキー
const STORAGE_KEYS = {
    USER: 'petstory_user',
    PETS: 'petstory_pets',
    POSTS: 'petstory_posts',
    CURRENT_PET: 'petstory_current_pet',
    MESSAGES: 'petstory_messages'
};

// サンプルバッジデータ
const BADGES = [
    { id: 'first_post', name: '初投稿', icon: '🎉', description: '最初の投稿をしました' },
    { id: 'week_streak', name: '7日連続', icon: '🔥', description: '7日連続で投稿しました' },
    { id: '10_posts', name: '投稿10件', icon: '📝', description: '10件の投稿を達成' },
    { id: '100_likes', name: '100いいね', icon: '❤️', description: '累計100いいねを獲得' },
    { id: 'popular', name: '人気者', icon: '⭐', description: '1つの投稿で50いいね獲得' },
    { id: 'friend_maker', name: '友達作り', icon: '🤝', description: '10人フォロワー達成' }
];

// ペット目線のテンプレート
const PET_VOICE_TEMPLATES = {
    dog: [
        'ワン！{text}だワン🐕',
        '{text}だよ！シッポふりふり〜🐾',
        'ねえねえ！{text}だワンワン！'
    ],
    cat: [
        'にゃ〜{text}なのニャ🐱',
        '{text}にゃ。気まぐれだけどね',
        'ふーん、{text}だにゃん😺'
    ],
    bird: [
        'ピヨピヨ！{text}だよ〜🐦',
        '{text}ピィ〜♪',
        'チュンチュン！{text}なんだ🎵'
    ],
    rabbit: [
        '{text}ぴょん🐰',
        'にんじん食べながら、{text}だよ',
        'ぴょんぴょん！{text}なんだ〜'
    ],
    hamster: [
        'キュッキュ！{text}なの🐹',
        'ほっぺいっぱいにして、{text}',
        '{text}だよ〜回し車で運動しよっと'
    ],
    other: [
        '{text}だよ！',
        '{text}なんだ〜',
        'ねえねえ！{text}だよ'
    ]
};

// データの初期化
function initializeData() {
    // サンプルデータがない場合、または投稿が0件の場合に初期化
    const postsData = localStorage.getItem(STORAGE_KEYS.POSTS);
    let posts = [];

    try {
        posts = postsData ? JSON.parse(postsData) : [];
    } catch (e) {
        posts = [];
    }

    // 投稿が0件の場合でもサンプルデータを追加しない（投稿なし画面を表示するため）
    // if (!posts || posts.length === 0) {
    //     // サンプルデータ生成ロジックを無効化
    // }
}

// ペットアバターを生成（プレースホルダー）
function generatePetAvatar(species) {
    const avatars = {
        dog: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200',
        cat: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200',
        bird: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200',
        rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200',
        hamster: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=200'
    };

    return avatars[species] || avatars.dog;
}

// データの取得と保存
function getCurrentUser() {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
}

function saveCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
}

function getCurrentPet() {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_PET);
    return data ? JSON.parse(data) : null;
}

function saveCurrentPet(pet) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PET, JSON.stringify(pet));
}

function clearCurrentPet() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PET);
}

function getPets() {
    const data = localStorage.getItem(STORAGE_KEYS.PETS);
    return data ? JSON.parse(data) : [];
}

function savePets(pets) {
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(pets));
}

function getPosts() {
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    const posts = data ? JSON.parse(data) : [];
    // 新しい順にソート
    return posts.sort((a, b) => b.timestamp - a.timestamp);
}

function savePosts(posts) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
}

function addPost(post) {
    const posts = getPosts();
    posts.push(post);
    savePosts(posts);
}

// ペット目線の文章生成
function generatePetVoice(text, species = 'other') {
    const templates = PET_VOICE_TEMPLATES[species] || PET_VOICE_TEMPLATES.other;
    const template = templates[Math.floor(Math.random() * templates.length)];
    return template.replace('{text}', text);
}

// 時間のフォーマット
function formatTime(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;

    const date = new Date(timestamp);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
}

// バッジチェック
function checkBadges(pet) {
    const posts = getPosts().filter(p => p.petId === pet.id);
    const earnedBadges = pet.badges || [];
    const newBadges = [];

    // 初投稿バッジ
    if (posts.length >= 1 && !earnedBadges.includes('first_post')) {
        newBadges.push('first_post');
    }

    // 10件投稿バッジ
    if (posts.length >= 10 && !earnedBadges.includes('10_posts')) {
        newBadges.push('10_posts');
    }

    // 100いいねバッジ
    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    if (totalLikes >= 100 && !earnedBadges.includes('100_likes')) {
        newBadges.push('100_likes');
    }

    // 人気者バッジ
    const hasPopularPost = posts.some(post => post.likes >= 50);
    if (hasPopularPost && !earnedBadges.includes('popular')) {
        newBadges.push('popular');
    }

    return newBadges;
}

// エクスポート（グローバルスコープで使用）
window.PetStoryData = {
    STORAGE_KEYS,
    BADGES,
    PET_VOICE_TEMPLATES,
    initializeData,
    generatePetAvatar,
    getCurrentUser,
    saveCurrentUser,
    getCurrentPet,
    saveCurrentPet,
    clearCurrentPet,
    getPets,
    savePets,
    getPosts,
    savePosts,
    addPost,
    generatePetVoice,
    formatTime,
    checkBadges,
    // メッセージ機能
    getMessages,
    saveMessage,
    getRecentChats,
    // コメント機能
    getComments,
    addComment,
    toggleLike,
    deletePet
};

// メッセージ関連
function deletePet(petId) {
    // 1. ペットリストから削除
    const pets = getPets();
    const newPets = pets.filter(p => p.id !== petId);
    savePets(newPets);

    // 2. このペットの投稿を削除
    const posts = getPosts();
    const newPosts = posts.filter(p => p.petId !== petId);
    savePosts(newPosts);

    // 3. ログイン中の場合、ログアウト処理のためにCurrentPetをクリア
    const currentPet = getCurrentPet();
    if (currentPet && currentPet.id === petId) {
        clearCurrentPet();
    }

    return true;
}

function getMessages(userId, otherUserId) {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const messages = data ? JSON.parse(data) : [];

    // 最新順にソート
    return messages.filter(m =>
        (m.fromId === userId && m.toId === otherUserId) ||
        (m.fromId === otherUserId && m.toId === userId)
    ).sort((a, b) => a.timestamp - b.timestamp);
}

function saveMessage(message) {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const messages = data ? JSON.parse(data) : [];
    messages.push(message);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
}

function getRecentChats(userId) {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    const messages = data ? JSON.parse(data) : [];

    // このユーザーが関わったメッセージを抽出
    const myMessages = messages.filter(m => m.fromId === userId || m.toId === userId);

    // 最新順にソート
    myMessages.sort((a, b) => b.timestamp - a.timestamp);

    // チャット相手のIDリスト（重複排除）
    const chatPartners = new Set();
    myMessages.forEach(m => {
        const partnerId = m.fromId === userId ? m.toId : m.fromId;
        chatPartners.add(partnerId);
    });

    return Array.from(chatPartners);
}

// コメント機能
function getComments(postId) {
    const posts = getPosts();
    const post = posts.find(p => p.id == postId);
    return post && post.commentList ? post.commentList : [];
}

function addComment(postId, comment) {
    const posts = getPosts();
    const post = posts.find(p => p.id == postId);
    if (post) {
        if (!post.commentList) post.commentList = [];
        post.commentList.push(comment);
        post.comments = post.commentList.length; // カウント更新
        savePosts(posts);
        return true;
    }
    return false;
}

function toggleLike(postId, userId) {
    const posts = getPosts();
    const post = posts.find(p => p.id == postId);

    if (post) {
        if (!post.likedBy) post.likedBy = [];

        const index = post.likedBy.indexOf(userId);
        if (index === -1) {
            // まだいいねしていない -> 追加
            post.likedBy.push(userId);
            post.likes = (post.likes || 0) + 1;
        } else {
            // すでにいいねしている -> 解除
            post.likedBy.splice(index, 1);
            post.likes = Math.max(0, (post.likes || 0) - 1);
        }

        savePosts(posts);

        // 最新の状態を返す
        return {
            likes: post.likes,
            liked: post.likedBy.includes(userId)
        };
    }
    return null;
}
