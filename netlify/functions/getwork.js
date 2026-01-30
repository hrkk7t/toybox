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
        const CORRECT_PASSWORD = process.env.WORK_PASSWORD || "123";

        if (inputPassword === CORRECT_PASSWORD) {
            // ■■■ パスワード正解時の「中身」をここに書く ■■■
            // HTMLタグをそのまま書けます
            const secretHtml = `
                <div class="work-list-container">
                    <p style="margin-bottom:20px; color:green; font-weight:bold;">>> Access Granted. Loading classified data...</p>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <a href="#" target="_blank"><img src="images/hp-01.jpg" alt="Work 01"></a>
                        </div>
                        <div class="work-details">
                            <h3>Secret Project A</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Client:</span>某 株式会社 様</li>
                                <li><span class="label">Role:</span>Design, Coding</li>
                                <li><span class="label">Period:</span>2024.01 - 2024.03</li>
                                <li><span class="label">Comment:</span>
                                    ここには一般公開できない実績の詳細を書きます。<br>
                                    苦労した点や、工夫したアニメーションなど。
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="work-item">
                        <div class="work-details">
                            <h3>Confidential Data B</h3>
                            <p>画像がなくても、テキストだけで詳細を書くことも可能です。</p>
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

