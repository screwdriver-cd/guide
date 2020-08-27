---
layout: main
title: トークン
category: User Guide
menu: menu_ja
toc:
    - title: トークン
      url: "#トークン"
    - title: ユーザーアクセストークン
      url: "#ユーザーアクセストークン"
    - title: パイプラインアクセストークン
      url: "#パイプラインアクセストークン"
    - title: アクセストークンを使う
      url: "#アクセストークンを使う"
---
# トークン
ユーザーはJSON Web Token (JWT) を取得するために、ScrewdriverのAPIへ（ユーザーまたはパイプラインスコープの）アクセストークンを渡すことができます。JWTはScrewdriverのAPIへさらなるリクエストを作成する時のAuthorizationヘッダーとして使用できます。

ビルドもJWTを`$SD_TOKEN`という名前の[環境変数](./environment-variables)で生成します。

## ユーザーアクセストークン
ユーザーアクセストークンは、特定のユーザーに紐付きます。
ユーザーアクセストークンを生成するには:

1. 任意のページの右上の角で、ユーザー名をクリックします。その後、ユーザー設定をクリックします。
![User settings](./../../user-guide/assets/user-settings.png)

2. トークンの名前と説明を入力します。

3. Addをクリックしてトークンを生成します。
![User token](./../../user-guide/assets/user-token.png)

4. トークンをクリップボードにコピーします。セキュリティ上の理由から、このページを離れた後はトークンを再度見ることはできません。
![Copy user token](./../../user-guide/assets/copy-user-token.png)

### オプション
トークンの作成後、Refreshボタンを押して新しいトークンを生成したり、削除したりできます。

## パイプラインアクセストークン
パイプラインアクセストークンは、Screwdriverのパイプラインに紐付きます。
パイプラインアクセストークンを生成するには:

1. Screwdriverのパイプラインページで、パイプライン名の下にあるSecretsタブをクリックします。
![Pipeline secrets](./../../user-guide/assets/pipeline-secrets.png)

2. アクセストークンのところに、トークンの名前と説明を入力します。

3. Addをクリックしてトークンを生成します。
![User token](./../../user-guide/assets/user-token.png)

4. トークンをクリップボードにコピーします。セキュリティ上の理由から、このページを離れた後はトークンを再度見ることはできません。
![Copy user token](./../../user-guide/assets/copy-user-token.png)

## アクセストークンを使う

新しく生成したトークンを認証するために、`https://${API_URL}/v4/auth/token?api_token=${YOUR_TOKEN_VALUE}`へGETリクエストを送ります。するとtokenのフィールドを持ったJSONオブジェクトが返ってきます。このtokenフィールドの値が、ScrewdriverのAPIへリクエストを送る時のAuthorization headerとして使えるJSON Web Tokenとなります。このJWTは12時間の有効期限があり、その後は再度認証を行う必要があります。

詳しくは[APIドキュメント](./api)をご覧ください。
