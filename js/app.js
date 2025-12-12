
// PetStory アプリケーションメインロジック

// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
    // 初期データチェック
    PetStoryData.initializeData();

    // --- 緊急対応: 'hato' ユーザーのパスワード強制リセット ---
    const petsData = PetStoryData.getPets();
    const hatoUser = petsData.find(p => p.name.toLowerCase() === 'hato');
    if (hatoUser) {
        // パスワードが 'hato' でない場合のみ更新して保存
        if (hatoUser.password !== 'hato') {
            hatoUser.password = 'hato';
            PetStoryData.savePets(petsData);
            console.log('Fixed: Reset password for hato to "hato"');
            setTimeout(() => {
                alert('【システム通知】\nユーザー "hato" のパスワードを "hato" に設定しました。\nログインをお試しください。');
            }, 1000);
        }
    }
    // ---------------------------------------------------

    // アプリ初期化
    initApp();

    // イベントリスナー設定
    setupEventListeners();

    // 初期ページ表示
    showPage('home');

    // ログイン状態チェック
    checkLoginStatus();
});

// アプリケーション初期化
function initApp() {
    // ヒーロー画像を生成
    const heroImg = document.getElementById('heroImage');
    if (heroImg) {
        // ローカル画像を使用（images/hero.png）
        heroImg.src = 'images/hero.png';
        heroImg.onerror = () => {
            // ローカル読み込み失敗時のフォールバック
            heroImg.src = 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800';
        };
    }
}

// イベントリスナー設定
function setupEventListeners() {
    // ナビゲーション
    const navLinks = document.querySelectorAll('.navbar-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Nav link clicked:', link.dataset.page); // Debug log
            const page = link.dataset.page;

            // アクティブ状態更新
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            showPage(page);
        });
    });

    // 新規登録ボタン
    const signupBtn = document.getElementById('signupBtn');
    if (signupBtn) {
        signupBtn.addEventListener('click', () => {
            showAuthModal(false);
        });
    }

    // ログインボタン（モーダルを開く）
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            showLoginModal();
        });
    }

    // ログイン中のユーザーボタン（クリックでプロフィールへ）
    const currentUserBtn = document.getElementById('currentUserBtn');
    if (currentUserBtn) {
        currentUserBtn.addEventListener('click', () => {
            showPage('profile');
            document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('active'));
            document.querySelector('[data-page="profile"]').classList.add('active');
        });
    }

    // ログインモーダル内の切り替えボタン
    const switchToSignupBtn = document.getElementById('switchToSignupBtn');
    if (switchToSignupBtn) {
        switchToSignupBtn.addEventListener('click', () => {
            hideLoginModal();
            showAuthModal(false);
        });
    }

    // ログイン処理関連
    const loginBackBtn = document.getElementById('loginBackBtn');
    if (loginBackBtn) {
        loginBackBtn.addEventListener('click', backToUserList);
    }

    const loginSubmitBtn = document.getElementById('loginSubmitBtn');
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', handleLoginAttempt);
    }

    // スタートボタン
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', showAuthModal);
    }

    // 詳しく見るボタン
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            const featuresSection = document.querySelector('.features');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // ペットプロファイル作成フォーム
    const petProfileForm = document.getElementById('petProfileForm');
    if (petProfileForm) {
        petProfileForm.addEventListener('submit', handlePetProfileSubmit);
    }



    // 投稿作成フォーム
    const createPostForm = document.getElementById('createPostForm');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }

    // 画像アップロード
    const imageUploadArea = document.getElementById('imageUploadArea');
    const postImage = document.getElementById('postImage');
    if (imageUploadArea && postImage) {
        imageUploadArea.addEventListener('click', () => postImage.click());
        postImage.addEventListener('change', handleImageUpload);
    }

    // ペット目線生成ボタン
    const generateVoiceBtn = document.getElementById('generateVoiceBtn');
    if (generateVoiceBtn) {
        generateVoiceBtn.addEventListener('click', handleGenerateVoice);
    }

    // メッセージ：新しい会話ボタン
    const newChatBtn = document.getElementById('newChatBtn');
    if (newChatBtn) {
        newChatBtn.addEventListener('click', showNewChatModal);
    }

    // メッセージ：送信フォーム
    const messageForm = document.getElementById('messageForm');
    if (messageForm) {
        messageForm.addEventListener('submit', handleSendMessage);
    }

    // メッセージ：モバイル用戻るボタン
    const backToThreadsBtn = document.getElementById('backToThreadsBtn');
    if (backToThreadsBtn) {
        backToThreadsBtn.addEventListener('click', () => {
            document.querySelector('.card').classList.remove('mobile-chat-active');
        });
    }

    // モーダルオーバレイクリック
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
    }

    // コメント投稿フォーム
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', handleCommentSubmit);
    }

    // パスワードリセットフォーム
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPasswordSubmit);
    }
}

// ページ表示
function showPage(pageName) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.classList.add('hidden'); // hiddenクラスを追加して確実に隠す
    });

    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
        targetPage.classList.remove('hidden'); // hiddenクラスを削除して表示させる
        targetPage.classList.add('active');

        // ナビゲーションのアクティブ状態更新
        const navLinks = document.querySelectorAll('.navbar-link');
        navLinks.forEach(link => {
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // ページごとの初期化
        if (pageName === 'timeline') {
            renderTimeline();
        } else if (pageName === 'create') {
            setupCreatePage();
        } else if (pageName === 'profile') {
            renderProfile();
        } else if (pageName === 'messages') {
            renderMessageThreads();
        }
    }
}

// 認証モーダル表示/非表示
function showAuthModal(isEdit = false) {
    const modal = document.getElementById('authModal');
    const form = document.getElementById('petProfileForm');
    const submitBtn = form.querySelector('button[type="submit"]');
    const modalTitle = modal.querySelector('h2');
    const modalDesc = modal.querySelector('p');
    const deleteBtn = document.getElementById('deleteAccountBtn');
    console.log('showAuthModal called, isEdit:', isEdit, 'deleteBtn found:', !!deleteBtn);

    if (modal) {
        modal.classList.add('active');

        // フォームのリセットとモード設定
        const passwordInput = document.getElementById('petPassword');

        if (isEdit) {
            // 編集モード：現在のデータをセット
            const currentPet = PetStoryData.getCurrentPet();
            if (currentPet) {
                document.getElementById('petId').value = currentPet.id;
                document.getElementById('petName').value = currentPet.name;
                document.getElementById('petSpecies').value = currentPet.species;
                document.getElementById('petBio').value = currentPet.bio;

                // パスワードは空にしておく（変更したい場合のみ入力）
                if (passwordInput) {
                    passwordInput.value = '';
                    passwordInput.placeholder = '変更する場合のみ入力';
                    passwordInput.required = false; // 編集時は必須ではない
                }

                if (submitBtn) submitBtn.textContent = 'プロフィールを更新';
                if (modalTitle) modalTitle.textContent = 'プロフィール編集';
                if (modalDesc) modalDesc.textContent = 'ペットの情報を更新します';

                // 削除ボタンを表示
                if (deleteBtn) deleteBtn.classList.remove('hidden');
            }
        } else {
            // 新規作成モード：フォームをクリア
            form.reset();
            document.getElementById('petId').value = ''; // IDを空に

            // 削除ボタンを非表示
            if (deleteBtn) deleteBtn.classList.add('hidden');

            // パスワードは必須
            if (passwordInput) {
                passwordInput.placeholder = 'パスワードを設定';
                passwordInput.required = true;
            }

            if (submitBtn) submitBtn.textContent = 'プロフィールを作成';
            if (modalTitle) modalTitle.textContent = 'PetStoryへようこそ！';
            if (modalDesc) modalDesc.textContent = 'ペットのプロフィールを作成しましょう';
        }
    }
}


function handleDeleteAccount() {
    // 1段階目：ブラウザ標準ダイアログ
    if (!confirm('本当にアカウントを削除しますか？\nこの操作は取り消せません。')) return;

    // 2段階目：カスタムモーダルを表示（注意喚起）
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeDeleteConfirmModal() {
    const modal = document.getElementById('deleteConfirmModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function executeDeleteAccount() {
    const currentPet = PetStoryData.getCurrentPet();
    if (currentPet) {
        PetStoryData.deletePet(currentPet.id);
        alert('アカウントを削除しました。ご利用ありがとうございました。');

        closeDeleteConfirmModal();
        hideAuthModal();

        // ログアウト処理（確認ダイアログを出さずに実行）
        localStorage.removeItem('petstory_current_pet');
        if (window.PetStoryData && typeof window.PetStoryData.clearCurrentPet === 'function') {
            window.PetStoryData.clearCurrentPet();
        }

        window.location.href = 'index.html'; // リロードして初期化
    }
}

function hideAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ログイン状態チェック
function checkLoginStatus() {
    const currentPet = PetStoryData.getCurrentPet();
    const loginBtn = document.getElementById('loginBtn');

    // ログイン状態に応じてボタンの表示を切り替え
    const guestButtons = document.getElementById('guestButtons');
    const currentUserBtn = document.getElementById('currentUserBtn');
    const getStartedBtn = document.getElementById('getStartedBtn'); // ヒーローセクションのボタン

    if (currentPet) {
        // ログイン中
        if (guestButtons) guestButtons.classList.add('hidden');
        if (currentUserBtn) {
            currentUserBtn.classList.remove('hidden');
            currentUserBtn.textContent = currentPet.name;
        }
        if (getStartedBtn) getStartedBtn.classList.add('hidden'); // ログイン中は非表示
    } else {
        // 未ログイン
        if (guestButtons) guestButtons.classList.remove('hidden');
        if (currentUserBtn) currentUserBtn.classList.add('hidden');
        if (getStartedBtn) getStartedBtn.classList.remove('hidden'); // 未ログイン時は表示
    }
}

// ペットプロフィール作成
function handlePetProfileSubmit(e) {

    e.preventDefault();

    const name = document.getElementById('petName').value;
    const species = document.getElementById('petSpecies').value;
    const bio = document.getElementById('petBio').value;
    const password = document.getElementById('petPassword').value;
    const avatarInput = document.getElementById('petAvatar');

    // IDの有無で新規作成か更新かを判断
    const petId = document.getElementById('petId').value;

    // 現在のペットリストを取得
    const pets = PetStoryData.getPets();

    let pet;
    let isUpdate = false;

    if (petId) {
        // 更新モード
        const index = pets.findIndex(p => p.id === petId);
        if (index !== -1) {
            pet = pets[index];
            pet.name = name;
            pet.species = species;
            pet.bio = bio;
            // パスワードが入力されていれば更新、空なら維持
            if (password) {
                pet.password = password;
            }
            // アバターは変更があれば下で更新
            isUpdate = true;
        } else {
            alert('エラー: 編集対象のペットが見つかりません');
            return;
        }
    } else {
        // 新規作成モード
        if (!password) {
            alert('パスワードを設定してください');
            return;
        }

        pet = {
            id: 'pet_' + Date.now(),
            name: name,
            species: species,
            bio: bio,
            password: password, // パスワード保存
            avatar: PetStoryData.generatePetAvatar(species),
            badges: [],
            followers: Math.floor(Math.random() * 50) + 10,
            createdAt: Date.now()
        };
    }

    // 保存処理の共通化
    const saveAndFinish = (petToSave) => {
        if (isUpdate) {
            // 更新の場合
            const index = pets.findIndex(p => p.id === petToSave.id);
            if (index !== -1) {
                pets[index] = petToSave;
            }
            PetStoryData.savePets(pets);
            PetStoryData.saveCurrentPet(petToSave);

            alert('プロフィールを更新しました！✨');

            // プロフィールページを再描画
            renderProfile();
        } else {
            // 新規の場合
            pets.push(petToSave);
            PetStoryData.savePets(pets);
            PetStoryData.saveCurrentPet(petToSave);

            alert(`${petToSave.name} のプロフィールを作成しました！🎉`);

            // タイムラインへ遷移（新規登録時のみ）
            showPage('timeline');
            const navLinks = document.querySelectorAll('.navbar-link');
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('[data-page="timeline"]').classList.add('active');
        }

        hideAuthModal();
        checkLoginStatus();
    };

    // アバター画像の処理
    if (avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            pet.avatar = e.target.result;
            saveAndFinish(pet);
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        saveAndFinish(pet);
    }
}

function savePetAndLogin(pet) {
    // この関数は統合されたため廃止、または互換性のために残すなら上記ロジックにリダイレクト
    // 今回は handlePetProfileSubmit 内に統合したため削除または放置
}

// タイムライン表示
function renderTimeline() {
    const container = document.getElementById('timelinePosts');
    if (!container) return;

    const posts = PetStoryData.getPosts();

    if (posts.length === 0) {
        container.innerHTML = `
            <div class="card text-center" style="padding: var(--spacing-2xl);">
                <div style="font-size: 4rem; margin-bottom: var(--spacing-md);">📝</div>
                <h3>まだ投稿がありません</h3>
                <p class="text-muted">最初の投稿をしてみましょう！</p>
                <button class="btn btn-primary mt-md" onclick="showPage('create')">投稿を作成</button>
            </div>
        `;
        return;
    }

    container.innerHTML = posts.map(post => createPostCard(post)).join('');

    // いいねボタンのイベントリスナー
    posts.forEach(post => {
        const likeBtn = document.getElementById(`like-${post.id}`);
        if (likeBtn) {
            likeBtn.addEventListener('click', () => handleLike(post.id));
        }
    });
}

// 投稿カード作成
function createPostCard(post) {
    const currentPet = PetStoryData.getCurrentPet();
    const isLiked = currentPet && post.likedBy && post.likedBy.includes(currentPet.id);

    return `
        <div class="post-card">
            <div class="post-header">
                <img src="${post.petAvatar}" alt="${post.petName}" class="avatar">
                <div class="post-author">
                    <div class="post-author-name">${post.petName}</div>
                    <div class="post-time">${PetStoryData.formatTime(post.timestamp)}</div>
                </div>
            </div>
            ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image">` : ''}
            <div class="post-content">
                ${post.caption ? `<p class="post-caption">${post.caption}</p>` : ''}
            </div>
            <div class="post-actions">
                <button class="action-btn ${isLiked ? 'liked' : ''}" id="like-${post.id}">
                    <span>${isLiked ? '❤️' : '🤍'}</span>
                    <span>${post.likes || 0}</span>
                </button>
                <button class="action-btn" onclick="openCommentModal('${post.id}')">
                    <span>💬</span>
                    <span>${post.comments || 0}</span>
                </button>
                <!-- シェア機能は未実装のため一時非表示 -->
                <button class="action-btn" style="display: none;">
                    <span>📤</span>
                </button>
            </div>
        </div>
    `;
}

// いいね処理
function handleLike(postId) {
    const currentPet = PetStoryData.getCurrentPet();
    if (!currentPet) {
        alert('いいねするにはログインしてください');
        return;
    }

    const result = PetStoryData.toggleLike(postId, currentPet.id);
    if (result) {
        renderTimeline(); // 再描画
        // または個別のボタンだけ更新する方が効率的だが、今回は再描画で統一
    }
}

// 投稿作成ページ設定
function setupCreatePage() {
    const currentPet = PetStoryData.getCurrentPet();
    const petSelect = document.getElementById('petSelect');
    const loginRequest = document.getElementById('createLoginRequest');
    const postContent = document.getElementById('createPostContent');

    if (!currentPet) {
        // ログインしていない場合
        if (loginRequest) loginRequest.classList.remove('hidden');
        if (postContent) postContent.classList.add('hidden');
        return;
    }

    // ログインしている場合
    if (loginRequest) loginRequest.classList.add('hidden');
    if (postContent) postContent.classList.remove('hidden');

    // ペット選択ドロップダウン
    if (petSelect) {
        const pets = PetStoryData.getPets();
        petSelect.innerHTML = pets.map(pet =>
            `<option value="${pet.id}" ${pet.id === currentPet.id ? 'selected' : ''}>${pet.name}</option>`
        ).join('');
    }
}

// 画像アップロード処理
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const preview = document.getElementById('imagePreview');
        const placeholder = document.getElementById('uploadPlaceholder');

        if (preview && placeholder) {
            preview.src = event.target.result;
            preview.classList.remove('hidden');
            placeholder.classList.add('hidden');
        }
    };
    reader.readAsDataURL(file);
}

// ペット目線文章生成
function handleGenerateVoice() {
    const captionInput = document.getElementById('postCaption');
    const currentPet = PetStoryData.getCurrentPet();

    if (!captionInput || !currentPet) return;

    const originalText = captionInput.value.trim();
    if (!originalText) {
        alert('まずテキストを入力してください');
        return;
    }

    const petVoice = PetStoryData.generatePetVoice(originalText, currentPet.species);
    captionInput.value = petVoice;
}

// 投稿作成
function handleCreatePost(e) {
    e.preventDefault();
    console.log('handleCreatePost called');

    const currentPet = PetStoryData.getCurrentPet();
    if (!currentPet) {
        alert('ログインが必要です');
        return;
    }

    const caption = document.getElementById('postCaption').value.trim();
    const imagePreview = document.getElementById('imagePreview');
    const isImageVisible = imagePreview && !imagePreview.classList.contains('hidden');
    const imageSrc = isImageVisible ? imagePreview.src : '';

    if (!caption && !imageSrc) {
        // 何も入力がない場合は何もせず終了（メッセージも出さない）
        return;
    }

    // 片方のみの場合の確認
    if (!caption && imageSrc) {
        if (!confirm('テキストが入力されていませんが、写真のみで投稿しますか？')) return;
    } else if (caption && !imageSrc) {
        if (!confirm('写真が選択されていませんが、テキストのみで投稿しますか？')) return;
    }

    // 新しい投稿作成
    const newPost = {
        id: Date.now(),
        petId: currentPet.id,
        petName: currentPet.name,
        petAvatar: currentPet.avatar,
        petSpecies: currentPet.species,
        image: imageSrc,
        caption: caption,
        likes: 0,
        comments: 0,
        timestamp: Date.now(),
        liked: false
    };

    PetStoryData.addPost(newPost);

    // バッジチェック
    const newBadges = PetStoryData.checkBadges(currentPet);
    if (newBadges.length > 0) {
        currentPet.badges = [...(currentPet.badges || []), ...newBadges];
        PetStoryData.saveCurrentPet(currentPet);

        // バッジ獲得通知
        const badgeNames = newBadges.map(id => {
            const badge = PetStoryData.BADGES.find(b => b.id === id);
            return badge ? `${badge.icon} ${badge.name} ` : '';
        }).join(', ');

        alert(`🎉 新しいバッジを獲得しました！\n${badgeNames} `);
    }

    // フォームリセット
    document.getElementById('createPostForm').reset();
    imagePreview.classList.add('hidden');
    document.getElementById('uploadPlaceholder').classList.remove('hidden');

    // タイムラインに移動
    showPage('timeline');
    document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="timeline"]').classList.add('active');
}

// プロフィール表示
function renderProfile() {
    const currentPet = PetStoryData.getCurrentPet();

    if (!currentPet) {
        const profilePage = document.getElementById('profilePage');
        if (profilePage) {
            profilePage.innerHTML = `
                <div class="container-narrow">
                    <div class="card text-center mt-xl" style="padding: var(--spacing-2xl);">
                        <h2>ログインが必要です</h2>
                        <p class="text-muted">プロフィールを表示するにはログインしてください</p>
                        <button class="btn btn-primary btn-lg mt-md" onclick="showAuthModal()">ログイン</button>
                    </div>
                </div>
            `;
        }
        return;
    }

    // プロフィール情報更新
    document.getElementById('profileAvatar').src = currentPet.avatar;
    document.getElementById('profileName').textContent = currentPet.name;
    document.getElementById('profileBio').textContent = currentPet.bio;

    // ログアウトボタンの追加（編集ボタンの横）
    // 既存のボタンエリアを探すか、再描画時に動的に生成される構造を利用
    const headerButtons = document.querySelector('.profile-header .flex-between');
    if (headerButtons) {
        // 既存の内容を書き換えてボタンを配置
        // 既存の内容を書き換えてボタンを配置
        headerButtons.innerHTML = `
            <div class="flex" style="gap: var(--spacing-lg); align-items: center;">
                <img id="profileAvatar" class="avatar avatar-xl" alt="Pet avatar" src="${currentPet.avatar}">
                <div>
                    <h2 id="profileName" class="mb-0">${currentPet.name}</h2>
                    <p id="profileBio" class="text-muted mt-sm mb-0">${currentPet.bio}</p>
                </div>
            </div>
            <div class="flex" style="gap: var(--spacing-sm);">
                <button class="btn btn-secondary" id="editProfileBtn">
                    編集
                </button>
                <button class="btn btn-outline-danger" id="logoutBtn">
                    ログアウト
                </button>
            </div>
        `;

        // イベントリスナーを設定
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }

        const editBtn = document.getElementById('editProfileBtn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                showAuthModal(true); // true = 編集モード
            });
        }
    }

    // 統計情報
    const posts = PetStoryData.getPosts().filter(p => p.petId === currentPet.id);
    document.getElementById('postCount').textContent = posts.length;

    // フォロワー数の表示（未設定の場合は生成して保存・固定化）
    if (!currentPet.followers) {
        currentPet.followers = Math.floor(Math.random() * 50) + 10;
        // 現在のペット情報を更新
        PetStoryData.saveCurrentPet(currentPet);

        // 全ペットリスト内の情報も同期更新
        const allPets = PetStoryData.getPets();
        const targetIndex = allPets.findIndex(p => p.id === currentPet.id);
        if (targetIndex !== -1) {
            allPets[targetIndex].followers = currentPet.followers;
            PetStoryData.savePets(allPets);
        }
    }
    document.getElementById('followerCount').textContent = currentPet.followers;

    document.getElementById('badgeCount').textContent = currentPet.badges ? currentPet.badges.length : 0;

    // バッジ表示
    const badgeList = document.getElementById('badgeList');
    if (badgeList) {
        if (currentPet.badges && currentPet.badges.length > 0) {
            badgeList.innerHTML = currentPet.badges.map(badgeId => {
                const badge = PetStoryData.BADGES.find(b => b.id === badgeId);
                return badge ? `
                    <div class="badge-item" title="${badge.description}">
                        ${badge.icon}
                    </div>
                ` : '';
            }).join('');
        } else {
            badgeList.innerHTML = '<p class="text-muted">まだバッジがありません</p>';
        }
    }

    // 投稿グリッド
    const profilePosts = document.getElementById('profilePosts');
    if (profilePosts) {
        if (posts.length > 0) {
            profilePosts.innerHTML = posts.map(post => {
                const content = post.image
                    ? `<img src="${post.image}" alt="Post" style="width: 100%; height: 100%; object-fit: cover;">`
                    : `<div style="width: 100%; height: 100%; background: var(--bg-secondary); padding: var(--spacing-sm); display: flex; align-items: center; justify-content: center; text-align: center; color: var(--text-color); font-size: 0.8rem; overflow: hidden;">
                        ${post.caption || 'No content'}
                       </div>`;

                return `
                <div class="profile-post-card">
                    ${content}
                    <div class="profile-post-overlay">
                        <span>❤️ ${post.likes}</span>
                        <span>💬 ${post.comments}</span>
                    </div>
                </div>
            `}).join('');
        } else {
            profilePosts.innerHTML = `
                <div class="card text-center" style="padding: var(--spacing-xl); grid-column: 1 / -1;">
                    <p class="text-muted">まだ投稿がありません</p>
                </div>
            `;
        }
    }
}

// --- ログインモーダル関連処理 ---

// ログインモーダル表示
function showLoginModal() {
    const pets = PetStoryData.getPets();
    const modal = document.getElementById('loginModal');
    const userListContainer = document.getElementById('loginUserList');

    if (pets.length === 0) {
        // ユーザーがいない場合は新規登録へ誘導
        if (confirm('登録されているペットがいません。新規登録しますか？')) {
            showAuthModal(false);
        }
        return;
    }

    // リスト表示モードで開く
    document.getElementById('loginUserList').classList.remove('hidden');
    document.getElementById('loginPasswordArea').classList.add('hidden');
    document.getElementById('loginModalTitle').textContent = 'ログイン';
    document.getElementById('loginModalDesc').textContent = 'ログインするペットを選択してください';

    // ユーザーリスト生成
    userListContainer.innerHTML = pets.map(pet => `
        <div class="login-pet-card flex-center flex-column text-center" onclick="selectLoginUser('${pet.id}')">
            <img src="${pet.avatar}" class="avatar avatar-lg">
            <h4 class="mt-sm mb-0" style="font-size: 1rem;">${pet.name}</h4>
        </div>
    `).join('');

    if (modal) {
        modal.classList.add('active');
    }
}

function hideLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
    }
    // 入力クリア
    document.getElementById('loginPasswordInput').value = '';
    document.getElementById('loginErrorMsg').classList.add('hidden');
}

// ユーザー選択後の処理（パスワード入力へ）
let selectedLoginPetId = null;

window.selectLoginUser = function (petId) {
    // デバッグ用: ID確認
    // alert('Debug: SelectUser ID=' + petId + ' (' + typeof petId + ')');

    const pets = PetStoryData.getPets();
    // HTML属性からは文字列で来るため、緩やかな一致(==)で検索
    const pet = pets.find(p => p.id == petId);

    if (!pet) return;

    // IDを正規化（重要：数値型などが混在する場合のため）
    selectedLoginPetId = pet.id;

    // パスワード入力画面へ切り替え
    document.getElementById('loginUserList').classList.add('hidden');
    document.getElementById('loginPasswordArea').classList.remove('hidden');
    document.getElementById('loginModalTitle').textContent = 'パスワード入力';
    document.getElementById('loginModalDesc').textContent = '';

    document.getElementById('loginSelectedAvatar').src = pet.avatar;
    document.getElementById('loginSelectedName').textContent = pet.name;

    // フォーカス
    setTimeout(() => {
        document.getElementById('loginPasswordInput').focus();
    }, 100);
};

function backToUserList() {
    document.getElementById('loginUserList').classList.remove('hidden');
    document.getElementById('loginPasswordArea').classList.add('hidden');
    document.getElementById('loginModalTitle').textContent = 'ログイン';
    document.getElementById('loginModalDesc').textContent = 'ログインするペットを選択してください';
    document.getElementById('loginPasswordInput').value = '';
    document.getElementById('loginErrorMsg').classList.add('hidden');
    selectedLoginPetId = null;
}

function handleLoginAttempt() {
    if (!selectedLoginPetId) return;

    const passwordInput = document.getElementById('loginPasswordInput').value;
    const errorMsg = document.getElementById('loginErrorMsg');

    const pets = PetStoryData.getPets();
    const pet = pets.find(p => p.id === selectedLoginPetId);

    if (!pet) return;

    // パスワード検証
    const storedPassword = pet.password;
    console.log(`Login attempt for ${pet.name}: Stored = '${storedPassword}', Input = '${passwordInput}'`);

    if (storedPassword) {
        if (storedPassword === passwordInput) {
            // ログイン成功
            executeLogin(pet);
        } else {
            // パスワード不一致
            console.log('Password mismatch');
            errorMsg.classList.remove('hidden');
        }
    } else {
        // パスワード未設定のデータ（古いデータなど）
        if (passwordInput === '') {
            // パスワード未設定かつ入力なしなら許可
            console.log('No password set, allowing login');
            executeLogin(pet);
        } else {
            // パスワード未設定なのに入力がある -> エラーとして扱う（セキュリティ強化）
            // または「パスワードが設定されていません」と出すべきだが、
            // 「間違っています」で統一して混乱を防ぐ
            console.log('No password set but input provided -> Error');
            errorMsg.classList.remove('hidden');
        }
    }
}

function executeLogin(pet) {
    PetStoryData.saveCurrentPet(pet);
    hideLoginModal();
    checkLoginStatus();
    showPage('timeline'); // またはプロフィール

    // Navbarのアクティブ状態更新
    const navLinks = document.querySelectorAll('.navbar-link');
    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelector('[data-page="timeline"]').classList.add('active');

    alert(`おかえりなさい、${pet.name}！`);
}

// ログアウト処理
function handleLogout() {
    console.log('Logout initiated');
    if (confirm('ログアウトしますか？')) {
        try {
            // 現在のペット情報を完全に削除（ハードコードで確実に）
            localStorage.removeItem('petstory_current_pet');
            localStorage.setItem('petstory_current_pet', '');

            // オブジェクトのキャッシュもクリア
            if (window.PetStoryData && typeof window.PetStoryData.clearCurrentPet === 'function') {
                window.PetStoryData.clearCurrentPet();
            } else if (window.PetStoryData && typeof window.PetStoryData.saveCurrentPet === 'function') {
                window.PetStoryData.saveCurrentPet(null);
            }

            // ホームへ戻る
            showPage('home');

            // リロードして初期状態（未ログイン）に戻す
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 100);

        } catch (error) {
            console.error('Logout error:', error);
            alert('ログアウトエラー: ' + error.message);
            location.reload();
        }
    }
}

// データリセット機能
function handleResetData() {
    const confirmed = confirm('すべてのデータをリセットして、サンプル投稿を表示しますか？\n\n※作成したプロフィールと投稿は削除されます。');

    if (confirmed) {
        // LocalStorageをクリア
        localStorage.clear();

        // データを再初期化
        PetStoryData.initializeData();

        // ホームページに戻る
        showPage('home');
        document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('active'));
        document.querySelector('[data-page="home"]').classList.add('active');

        // ページをリロード（これによりUI状態もcheckLoginStatusで正しくリセットされる）
        location.reload();
    }
}

// --- メッセージ機能 ---

let activeChatPartnerId = null;

function renderMessageThreads() {
    const currentPet = PetStoryData.getCurrentPet();

    if (!currentPet) {
        // 未ログイン時はログイン誘導
        document.getElementById('threadsContainer').innerHTML = `
            <div class="text-center p-md">
                <p class="text-muted">ログインしてメッセージを使おう</p>
                <button class="btn btn-primary btn-sm" onclick="showAuthModal()">ログイン</button>
            </div>
        `;
        return;
    }

    const partnerIds = PetStoryData.getRecentChats(currentPet.id);
    const container = document.getElementById('threadsContainer');
    const pets = PetStoryData.getPets();

    if (partnerIds.length === 0) {
        container.innerHTML = `
            <div class="text-center p-md text-muted">
                まだ会話がありません。<br>
                「+ 新しい会話」から始めよう！
            </div>
        `;
    } else {
        container.innerHTML = partnerIds.map(partnerId => {
            const partner = pets.find(p => p.id === partnerId);
            if (!partner) return '';

            // 最新メッセージを取得（簡易的）
            const messages = PetStoryData.getMessages(currentPet.id, partnerId);
            const lastMsg = messages[messages.length - 1];
            const time = lastMsg ? PetStoryData.formatTime(lastMsg.timestamp) : '';

            return `
                <div class="thread-item flex ${activeChatPartnerId === partnerId ? 'active' : ''}"
                    onclick="openChat('${partnerId}')" style="gap: var(--spacing-sm); align-items: center;">
                    <img src="${partner.avatar}" class="avatar avatar-sm">
                    <div style="flex: 1; min-width: 0;">
                        <div class="flex-between">
                            <h5 class="mb-0 text-truncate">${partner.name}</h5>
                            <span class="text-muted" style="font-size: 0.7rem;">${time}</span>
                        </div>
                        <p class="text-muted mb-0 text-truncate" style="font-size: 0.8rem;">
                            ${lastMsg ? lastMsg.text : '...'}
                        </p>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function showNewChatModal() {
    const currentPet = PetStoryData.getCurrentPet();
    if (!currentPet) {
        alert('ログインしてください');
        return;
    }

    const pets = PetStoryData.getPets().filter(p => p.id !== currentPet.id);
    const list = document.getElementById('newChatUserList');

    list.innerHTML = pets.map(pet => `
        <div class="login-pet-card flex-center flex-column text-center" onclick="startNewChat('${pet.id}')">
            <img src="${pet.avatar}" class="avatar avatar-lg">
            <h4 class="mt-sm mb-0" style="font-size: 1rem;">${pet.name}</h4>
        </div>
    `).join('');

    document.getElementById('newChatModal').classList.add('active');
}

window.startNewChat = function (partnerId) {
    document.getElementById('newChatModal').classList.remove('active');
    openChat(partnerId);
};

window.openChat = function (partnerId) {
    activeChatPartnerId = partnerId;
    const currentPet = PetStoryData.getCurrentPet();
    const allPets = PetStoryData.getPets();
    const partner = allPets.find(p => p.id === partnerId);

    if (!partner) return;

    // UI切り替え
    document.getElementById('noChatSelected').classList.add('hidden');
    document.getElementById('activeChat').classList.remove('hidden');
    document.querySelector('.card').classList.add('mobile-chat-active'); // モバイル用

    // ヘッダー設定
    document.getElementById('chatPartnerAvatar').src = partner.avatar;
    document.getElementById('chatPartnerName').textContent = partner.name;

    // メッセージ読み込み
    loadMessages();

    // スレッドリスト再描画（アクティブ状態更新のため）
    renderMessageThreads();
};

function loadMessages() {
    if (!activeChatPartnerId) return;

    const currentPet = PetStoryData.getCurrentPet();
    const messages = PetStoryData.getMessages(currentPet.id, activeChatPartnerId);
    const container = document.getElementById('messagesContainer');

    container.innerHTML = messages.map(msg => {
        const isMe = msg.fromId === currentPet.id;
        return `
            <div class="message-bubble ${isMe ? 'sent' : 'received'}">
                ${msg.text}
                <div class="message-time">${PetStoryData.formatTime(msg.timestamp)}</div>
            </div>
        `;
    }).join('');

    // 下までスクロール
    container.scrollTop = container.scrollHeight;
}

function handleSendMessage(e) {
    e.preventDefault();
    if (!activeChatPartnerId) return;

    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    if (!text) return;

    const currentPet = PetStoryData.getCurrentPet();

    // 自分のメッセージ保存
    const myMsg = {
        id: Date.now(),
        fromId: currentPet.id,
        toId: activeChatPartnerId,
        text: text,
        timestamp: Date.now(),
        read: false
    };

    PetStoryData.saveMessage(myMsg);
    input.value = '';
    loadMessages();
    renderMessageThreads();

    // 自動返信ボット
    setTimeout(() => {
        generateAutoReply(activeChatPartnerId, text);
    }, 2000); // 2秒後に返信
}

function generateAutoReply(partnerId, userText) {
    // まだチャットを開いているか確認（あるいはバックグラウンドでも受信していいが、今回は簡易実装）
    const allPets = PetStoryData.getPets();
    const partner = allPets.find(p => p.id === partnerId);
    if (!partner) return;

    // 返信内容生成（相手の種族などに基づいて）
    // userTextを少し考慮した返信にすると面白い
    let replyText = PetStoryData.generatePetVoice(userText, partner.species); // 既存機能流用

    // 少しトーンを変える（おうむ返しにならないように）
    // generatePetVoiceは "{text}だワン" みたいになるので、
    // userTextが質問形なら答えたいが、今は単純にVoiceを生成
    // 返信用に少しカスタマイズ

    const replyMsg = {
        id: Date.now(),
        fromId: partnerId,
        toId: PetStoryData.getCurrentPet().id,
        text: replyText,
        timestamp: Date.now(),
        read: false
    };

    PetStoryData.saveMessage(replyMsg);

    // もし今そのチャットを開いていればUI更新
    if (activeChatPartnerId === partnerId) {
        loadMessages();
        renderMessageThreads(); // スレッドのプレビュー更新
    } else {
        // 通知のみ（今回はスレッドの未読表示などで対応…未読ロジックは省略、スレッド順序が変わるのみ）
        renderMessageThreads();
    }
}

// --- コメント機能 ---
let activeCommentPostId = null;

function openCommentModal(postId) {
    // IDをそのまま使用（型判定はdata.js側の緩やかな一致に任せる）
    activeCommentPostId = postId;

    const modal = document.getElementById('commentModal');
    if (modal) {
        modal.classList.add('active');
        renderComments(postId);
        document.getElementById('commentPostId').value = postId;
    }
}

window.closeCommentModal = function () {
    document.getElementById('commentModal').classList.remove('active');
    activeCommentPostId = null;
};

// --- パスワードリセット機能 ---
window.showResetPasswordModal = function () {
    // 選択中のユーザーがいるか確認
    if (!selectedLoginPetId) {
        alert('先にユーザーを選択してください');
        return;
    }

    // ログインモーダルを隠す
    document.getElementById('loginModal').classList.remove('active');

    // リセットモーダルを表示
    document.getElementById('resetPasswordModal').classList.add('active');

    // ターゲットIDセット
    document.getElementById('resetTargetPetId').value = selectedLoginPetId;
};

window.closeResetPasswordModal = function () {
    document.getElementById('resetPasswordModal').classList.remove('active');
    // ログインモーダルに戻る
    document.getElementById('loginModal').classList.add('active');

    // フォームクリア
    document.getElementById('resetPasswordForm').reset();
};

function handleResetPasswordSubmit(e) {
    e.preventDefault();

    const targetId = document.getElementById('resetTargetPetId').value;
    const inputName = document.getElementById('resetPetName').value.trim();
    const inputSpecies = document.getElementById('resetPetSpecies').value;
    const newPassword = document.getElementById('resetNewPassword').value;

    if (!targetId || !inputName || !inputSpecies || !newPassword) return;

    const pets = PetStoryData.getPets();
    const pet = pets.find(p => p.id === targetId);

    if (!pet) {
        alert('ユーザーが見つかりません');
        closeResetPasswordModal();
        return;
    }
    // 大文字小文字を区別しない、前後の空白を削除して比較
    const isNameMatch = pet.name.trim().toLowerCase() === inputName.toLowerCase();
    const isSpeciesMatch = pet.species === inputSpecies;

    if (isNameMatch && isSpeciesMatch) {
        // 一致 -> パスワード更新
        pet.password = newPassword;
        PetStoryData.savePets(pets); // data.jsのsavePetsを使用

        alert('パスワードを再設定しました。\n新しいパスワードでログインしてください。');
        closeResetPasswordModal();

        // ログインパスワード欄をクリア
        document.getElementById('loginPasswordInput').value = '';
    } else {
        // 不一致の原因をヒントとして出す（デバッグ用）
        let errorMsg = '入力された情報が登録情報と一致しません。';
        if (!isNameMatch) errorMsg += '\n・名前が一致しません';
        if (!isSpeciesMatch) errorMsg += '\n・種類が一致しません';

        alert(errorMsg);
    }
}

// 初期化時にリセットフォームのイベントリスナーを設定
document.addEventListener('DOMContentLoaded', () => {
    const resetForm = document.getElementById('resetPasswordForm');
    if (resetForm) {
        resetForm.addEventListener('submit', handleResetPasswordSubmit);
    }
});

function renderComments(postId) {
    const commentsList = document.getElementById('commentsList');
    const comments = PetStoryData.getComments(postId);

    if (comments.length === 0) {
        commentsList.innerHTML = '<p class="text-center text-muted p-md">まだコメントはありません</p>';
        return;
    }

    commentsList.innerHTML = comments.map(c => `
        <div class="flex mb-sm">
            <img src="${c.userAvatar}" class="avatar avatar-sm mr-sm" style="margin-right: var(--spacing-sm);">
            <div style="background: #f0f2f5; padding: 8px 12px; border-radius: 12px; font-size: 0.9rem;">
                <div style="font-weight: bold; font-size: 0.8rem;">${c.userName}</div>
                <div>${c.text}</div>
            </div>
        </div>
    `).join('');

    // スクロール調整
    commentsList.scrollTop = commentsList.scrollHeight;
}

function handleCommentSubmit(e) {
    e.preventDefault();
    const currentPet = PetStoryData.getCurrentPet();
    if (!currentPet) {
        alert('コメントするにはログインしてください');
        return;
    }

    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    // IDが 0 の場合も許可するため、null/undefined チェックに変更
    if (!text || activeCommentPostId === null || activeCommentPostId === undefined) return;

    const newComment = {
        id: Date.now(),
        userId: currentPet.id,
        userName: currentPet.name,
        userAvatar: currentPet.avatar,
        text: text,
        timestamp: Date.now()
    };

    if (PetStoryData.addComment(activeCommentPostId, newComment)) {
        input.value = '';
        renderComments(activeCommentPostId);

        // タイムラインのコメント数表示も更新したいが、手軽に再描画
        // もし現在タイムライン表示中なら
        if (document.getElementById('timelinePage').classList.contains('active')) {
            renderTimeline();
        }
        // プロフィールページなら
        if (document.getElementById('profilePage').classList.contains('active')) {
            renderProfile(); // 簡易再描画
        }
    } else {
        alert('コメントの投稿に失敗しました。\n対象の投稿が見つかりません (ID: ' + activeCommentPostId + ')');
    }
}

// グローバルに公開（HTMLから呼び出せるように）
window.showPage = showPage;
window.showAuthModal = showAuthModal;
window.hideAuthModal = hideAuthModal;
window.handleDeleteAccount = handleDeleteAccount;
window.closeDeleteConfirmModal = closeDeleteConfirmModal;
window.executeDeleteAccount = executeDeleteAccount;
window.handleResetData = handleResetData;
window.handleLogout = handleLogout;
window.showNewChatModal = showNewChatModal;
window.openCommentModal = openCommentModal;
window.handleCreatePost = handleCreatePost;
window.closeCommentModal = closeCommentModal;
window.showResetPasswordModal = showResetPasswordModal;
window.closeResetPasswordModal = closeResetPasswordModal;

// 初期化時にイベントリスナーを設定

