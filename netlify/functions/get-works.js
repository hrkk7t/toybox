exports.handler = async (event, context) => {
  // POSTリクエスト以外は拒否
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // ブラウザから送られてきたパスワードを取得
    constbody = JSON.parse(event.body);
    const password = body.password;

    // ★重要★ Netlifyの環境変数に設定した正しいパスワードを読み込む
    // Netlifyの管理画面でキー名を「SECRET_WORK_PASSWORD」にして設定してください。
    // ローカルテストなどで環境変数が未設定の場合は仮のパスワード "test1234" で動くようにしています。
    const correctPassword = process.env.SECRET_WORK_PASSWORD || "test1234";

    if (password === correctPassword) {
      // 認証成功！ Worksの中身のHTMLを定義します。
      // ここに、いただいた情報を流し込みます。
      const secretHtmlContent = `
        <p style="margin-bottom: 20px; font-weight: bold;">制作実績リスト (Web Site)</p>
        
        <div class="work-list-container">
            <div class="work-item">
                <div class="work-thumbnail">
                    <img src="images/hp-01.jpg" alt="SNS運用代行サイトデザイン">
                </div>
                <div class="work-details">
                    <h3>SNS運用代行サイトのデザイン</h3>
                    <ul class="work-info-list">
                        <li><span class="label">担当範囲:</span> HPデザイン、サービス紹介イラスト</li>
                        <li><span class="label">制作期間:</span> 約20時間</li>
                        <li><span class="label">使用技術:</span> Adobe Illustrator, Adobe XD</li>
                        <li><span class="label">URL:</span> <span style="font-size: 0.9rem; color: #666;">(※現在は閉鎖されています)</span></li>
                    </ul>
                </div>
            </div>

            <div class="work-item">
                <div class="work-thumbnail">
                    <a href="https://www.toho-ew.co.jp/" target="_blank" rel="noopener noreferrer">
                        <img src="images/hp-02.jpg" alt="建設工事会社のWebサイト">
                    </a>
                </div>
                <div class="work-details">
                    <h3>建設工事会社のWebサイト</h3>
                    <ul class="work-info-list">
                        <li><span class="label">担当範囲:</span> HPデザイン</li>
                        <li><span class="label">制作期間:</span> 約15時間</li>
                        <li><span class="label">使用技術:</span> Adobe XD</li>
                        <li><span class="label">URL:</span> <a href="https://www.toho-ew.co.jp/" target="_blank" style="color: blue; text-decoration: underline;">https://www.toho-ew.co.jp/</a></li>
                    </ul>
                </div>
            </div>
        </div>
      `;

      return {
        statusCode: 200,
        body: JSON.stringify({ html: secretHtmlContent }),
      };

    } else {
      // 認証失敗
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Incorrect password" }),
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};