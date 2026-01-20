# toybox

今後の流れ（Netlifyでの作業）
プロジェクトの準備:

プロジェクトフォルダのルートに netlify/functions/ フォルダを作成します。

その中に、前述の get-works.js を作成し、あなたの制作実績（HTML）を記述します。

GitHubへプッシュ:

全てのファイル（index.html, script.js, style.css, images/, netlify/）をGitHubのリポジトリにアップロードします。

Netlifyでデプロイ:

NetlifyとGitHubを連携し、サイトを作成します。

Site settings > Build & deploy > Environment > Environment variables に移動します。

Key: SECRET_WORK_PASSWORD

Value: あなたが決めたパスワード

を設定して保存します。

これで、Netlify上でサイトが公開され、パスワード機能が動作するようになります。
