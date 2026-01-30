exports.handler = async (event, context) => {
    // POSTリクエスト以外は拒否
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // 送られてきたパスワードを読み取る
        const data = JSON.parse(event.body);
        const inputPassword = data.password;

        // ★ここで正しいパスワードを設定（とりあえず 'toybox2026' にしています）
        // ※本当はNetlifyの管理画面（環境変数）で設定するのがベストですが、まずはこれで動きます
        const CORRECT_PASSWORD = "123";

        if (inputPassword === CORRECT_PASSWORD) {
            // ■■■ パスワード正解時の「中身」をここに書く ■■■
            // HTMLタグをそのまま書けます
            const secretHtml = `
            const secretHtml = `
                <div class="work-list-container">
                    <p style="margin-bottom:20px; color:green; font-weight:bold;">>> Access Granted. Loading 4 items...</p>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <img src="images/hp-01.jpg" alt="Work 01">
                        </div>
                        <div class="work-details">
                            <h3>SNS運用代行 Webサイト</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>HPデザイン、サービス紹介イラスト</li>
                                <li><span class="label">Period:</span>約20時間</li>
                                <li><span class="label">Tools:</span>Adobe Illustrator, Adobe XD</li>
                                <li><span class="label">Comment:</span>サイトは現在閉鎖されていますが、親しみやすいイラストを含めたトータルデザインを担当しました。</li>
                            </ul>
                        </div>
                    </div>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <a href="https://www.toho-ew.co.jp/" target="_blank"><img src="images/hp-02.jpg" alt="Work 02"></a>
                        </div>
                        <div class="work-details">
                            <h3>建設工事会社 Webサイト</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>HPデザイン</li>
                                <li><span class="label">Period:</span>約15時間</li>
                                <li><span class="label">Tools:</span>Adobe XD</li>
                                <li><span class="label">URL:</span><a href="https://www.toho-ew.co.jp/" target="_blank">View Site</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <a href="https://crayon-beauty.jp/" target="_blank"><img src="images/hp-03.jpg" alt="Work 03"></a>
                        </div>
                        <div class="work-details">
                            <h3>美容室グループ Webサイト</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>HPデザイン</li>
                                <li><span class="label">Period:</span>約20時間</li>
                                <li><span class="label">Tools:</span>Adobe XD</li>
                                <li><span class="label">URL:</span><a href="https://crayon-beauty.jp/" target="_blank">View Site</a></li>
                            </ul>
                        </div>
                    </div>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <a href="https://aomori-shokkankyo.com/" target="_blank"><img src="images/hp-04.jpg" alt="Work 04"></a>
                        </div>
                        <div class="work-details">
                            <h3>食糧保管協会 Webサイト</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>HPデザイン</li>
                                <li><span class="label">Period:</span>約10時間</li>
                                <li><span class="label">Tools:</span>Adobe XD</li>
                                <li><span class="label">URL:</span><a href="https://aomori-shokkankyo.com/" target="_blank">View Site</a></li>
                            </ul>
                        </div>
                    </div>

                </div>
            `;

            return {
                statusCode: 200,
                body: JSON.stringify({ html: secretHtml }),
            };
        } else {
            // パスワード間違い
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized" }),
            };
        }
    } catch (error) {
        return { statusCode: 500, body: "Internal Server Error" };
    }

};



