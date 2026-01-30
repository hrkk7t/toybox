exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const data = JSON.parse(event.body);
        const inputPassword = data.password;
        const CORRECT_PASSWORD = "123";

        if (inputPassword === CORRECT_PASSWORD) {
            const secretHtml = `
                <div class="work-list-container">
                    <p style="margin-bottom:20px; color:green; font-weight:bold;">>> Access Granted. Loading category-wise data...</p>

                    <h2 class="work-cat-title" style="border-left: 5px solid green; padding-left: 10px; margin: 30px 0 15px;">WEB DESIGN</h2>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <img src="images/hp-01.jpg" alt="Work 01" onclick="openModal(this.src)">
                        </div>
                        <div class="work-details">
                            <h3>SNS運用代行 Webサイト</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>HPデザイン、イラスト</li>
                                <li><span class="label">Period:</span>約20時間</li>
                                <li><span class="label">Tools:</span>Illustrator, XD</li>
                                <li><span class="label">Comment:</span>サイト閉鎖につき画像のみ掲載。</li>
                            </ul>
                        </div>
                    </div>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <img src="images/hp-02.jpg" alt="Work 02" onclick="openModal(this.src)">
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
                            <img src="images/hp-03.jpg" alt="Work 03" onclick="openModal(this.src)">
                        </div>
                        <div class="work-details">
                            <h3>美容室グループ Webサイト</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>HPデザイン</li>
                                <li><span class="label">Tools:</span>Adobe XD</li>
                            </ul>
                        </div>
                    </div>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <img src="images/hp-04.jpg" alt="Work 04" onclick="openModal(this.src)">
                        </div>
                        <div class="work-details">
                            <h3>食糧保管協会 Webサイト</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>HPデザイン</li>
                                <li><span class="label">Tools:</span>Adobe XD</li>
                            </ul>
                        </div>
                    </div>

                    <h2 class="work-cat-title" style="border-left: 5px solid blue; padding-left: 10px; margin: 40px 0 15px;">GRAPHIC DESIGN</h2>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <img src="images/graphic-01.jpg" alt="Icon Design" onclick="openModal(this.src)">
                        </div>
                        <div class="work-details">
                            <h3>オリジナルアイコン制作</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>デザイン</li>
                                <li><span class="label">Tools:</span>Adobe Illustrator</li>
                            </ul>
                        </div>
                    </div>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <img src="images/graphic-02.jpg" alt="Main Visual" onclick="openModal(this.src)">
                        </div>
                        <div class="work-details">
                            <h3>Webサイト用メインビジュアル</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>イラストデザイン</li>
                                <li><span class="label">Tools:</span>Clip Studio</li>
                            </ul>
                        </div>
                    </div>

                    <div class="work-item">
                        <div class="work-thumbnail">
                            <img src="images/graphic-03.jpg" alt="Main Visual" onclick="openModal(this.src)">
                        </div>
                        <div class="work-details">
                            <h3>Webサイト用メインビジュアル</h3>
                            <ul class="work-info-list">
                                <li><span class="label">Role:</span>イラストデザイン</li>
                                <li><span class="label">Tools:</span>Adobe Illustrator</li>
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
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized" }),
            };
        }
    } catch (error) {
        return { statusCode: 500, body: "Internal Server Error" };
    }
};
