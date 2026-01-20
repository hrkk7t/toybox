// このファイルはサーバー側で実行されます。ブラウザからは見えません。

exports.handler = async (event, context) => {
  // POSTリクエスト以外は拒否
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // ブラウザから送られてきたパスワードを取得
    const { password } = JSON.parse(event.body);

    // 重要：正解のパスワードはコードに直書きせず、Netlifyの管理画面で設定する「環境変数」から読み込む
    // ここでは仮に環境変数名 "SECRET_WORK_PASSWORD" とします。
    const correctPassword = process.env.SECRET_WORK_PASSWORD;

    if (password === correctPassword) {
      // 認証成功！機密データを返します。
      // ここに、今まで index.html に書いていたWorksの中身をHTML文字列として定義します。
      const secretHtmlContent = `
        <p style="margin-bottom: 20px;">認証成功。制作実績リストを表示します:</p>
        <div class="prop-list">
            <div class="prop-item"><span class="label">秘密の案件A:</span> <a href="#" style="color: blue;">details_a.html</a></div>
            <div class="prop-item"><span class="label">すごい案件B:</span> <a href="#" style="color: blue;">details_b.html</a></div>
            <div class="prop-item"><span class="label">非公開案件C:</span> <a href="#" style="color: blue;">details_c.html</a></div>
        </div>
        <p style="font-size: 0.8rem; margin-top: 20px; color: #666;">(Double click to open)</p>
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
    // エラー発生時
    return { statusCode: 500, body: "Internal Server Error" };
  }
};