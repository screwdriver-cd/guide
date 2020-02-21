---
layout: main
title: 開発を開始する
category: About
menu: menu_ja
toc:
    - title: 開発を開始する
      url: "#開発を開始する"
      active: true
    - title: Screwdriver の API と UI を起動させる
      url: "#screwdriver-の-api-と-ui-を起動させる"
    - title: SD-in-a-Box で実行する
      url: "#sd-in-a-box-で実行する"
---
# 開発を開始する

Screwdriver をローカルで実行してテストするために、ローカルの開発環境を構築するための方法が3つあります。

1. **Screwdriver の API と UI をローカルで起動させる** - ビルドの実行を必要としない npm パッケージの依存関係をテストするのに理想的
2. **SD-in-a-box を起動させる** - ビルドを実行するのに理想的
3. **Screwdriver の API と UI をローカルで開発する** - npm パッケージの依存関係の開発や、簡単なビルドのテストをローカルで実行するのに理想的

# Screwdriver の API と UI を起動させる
## API を起動させる

### 事前準備
- Node v8.0.0 or higher
- [Kubernetes][kubectl] or [Docker][docker]

### インストール

```bash
$ git clone git@github.com:screwdriver-cd/screwdriver.git ./
$ cd screwdriver/ # change directory into the newly cloned repository
$ npm install
# API はデフォルトの設定は ./config/default.yaml にあります。
# 設定を local.yaml で上書きする必要があります。
$ vim ./config/local.yaml
```

### local.yaml を定義する
いくつか上書きする必要のある項目があります。

1. `auth`
1. `httpd`
1. `scms`
1. `ecosystem`

#### auth
##### jwtPrivateKey
jwt トークンを署名するのに使用される秘密鍵です。`$ openssl genrsa -out jwt.pem 2048` を実行することで簡単に生成できます。
##### jwtPublicKey
署名を verify するのに使用される公開鍵です。`$ openssl rsa -in jwt.pem -pubout -out jwt.pub` を実行することで生成できます。

この時、`./config/local.yaml`は次のようになっています。
```yaml
---
auth:
    jwtPrivateKey: |
        -----BEGIN RSA PRIVATE KEY-----
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        THISISAFAKEPRIVATEKEYTHISISAFAKEPRIVATEKEY
        -----END RSA PRIVATE KEY-----
    jwtPublicKey: |
        -----BEGIN PUBLIC KEY-----
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEYTHISISAFAKEPUBLICKEY
        THISISAFAKEPUBLICKEY
        -----END PUBLIC KEY-----
```

#### httpd
##### port
listen するポートです。API サーバが実行されるポートと一致させます。http://localhost:8080 で実行するのならば、ポートは `8080` に設定します。

##### uri
外部から接続する URI です。`http://localhost:8080` に設定します。

これらを `local.yaml` に追加します、

```yaml
httpd:
    port: 8080
    uri: http://localhost:8080
```

#### scms
##### github
この例では、github SCM を設定します。その他のオプションについては、[default.yaml](https://github.com/screwdriver-cd/screwdriver/blob/master/config/default.yaml#L147-L185)を見てください。

`oauthClientId` と `oauthClientSecret` を設定する必要があります。[Developer Settings page](https://github.com/settings/developers) に行き、New OAuth App をクリックします。ここに描かれているように設定します。
![Definition](../../../assets/scm-oauth-app.png)

Register Application をクリックし、Client ID と Client Secret を以下のように設定します。

```yaml
scms:
    github:
        plugin: github
        config:
            oauthClientId: SOMEOAUTHCLIENTID
            oauthClientSecret: SOMEOATHCLIENTSECRET
            secret: RANDOMSECRETTHING
```

#### ecosystem
##### ui
更新されたローカルの UI のために必要です。`http://localhost:4200` で設定しましょう。

```yaml
ecosystem:
    ui: http://localhost:4200
```

### 独自の node modules を使用する(オプション)
local の node modules をテストしたいならば、以下のように `npm install` します。

```bash
$ npm install <relative_path_to_your_node_module>
```

### 実行
設定した `local.yaml` を保存し、実行します。

```bash
$ npm start
info: Server running at http://localhost:8080
```
or
```bash
$ docker run --rm -it --volume=`pwd`/local.yaml:/config/local.yaml -p 8080 screwdrivercd/screwdriver:stable
info: Server running at http://localhost:8080
```

### UI の実行

UI の [README.md](https://github.com/screwdriver-cd/ui/#screwdriver-ui) にある通りにします。

UI が http://localhost:4200 で実行されたらログインします。

# SD-in-a-Box で実行する

[Running Locally docs](../../cluster-management/running-locally) を参考にしてください。

[docker]: https://www.docker.com/products/docker
[kubectl]: https://kubernetes.io/docs/user-guide/kubectl-overview/
