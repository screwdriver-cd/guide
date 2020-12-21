---
layout: main
title: SD-in-a-Boxを使ってローカルでScrewdriverを実行
category: Cluster Management
menu: menu_ja
toc:
- title: SD-in-a-Box
  url: "#sd-in-a-box"
  active: true
- title: SD-in-a-Boxの設定
  url: "#sd-in-a-boxの設定"
---

## SD-in-a-Box

Screwdriver-in-a-box ツールを使用することで、Screwdriver をローカルで実行することができます。このツールにより Screwdriver のすべてのインスタンス（UI、API、ログストア）がローカルで起動し、試すことができます。

[SD-in-a-box のドキュメント](https://github.com/screwdriver-cd/in-a-box#screwdriver-in-a-box)に従って実行してください。

![SD-in-a-box](../../cluster-management/assets/sd-in-a-box.png)

[docker]: https://www.docker.com/products/docker
[docker-compose]: https://www.docker.com/products/docker-compose

## SD-in-a-Boxの設定

SD-in-a-boxはScrewdriverクラスタを各開発環境で簡単に稼働させるためツールで、これを利用することでScrewdriverの機能を直接体験することができます。

### カスタムDockerイメージ

Dockerを利用しているため、どのイメージを利用するか指定できます。SD-in-a-Box（とScrewdriver全体）としては下記のDockerイメージを使用します。

- [screwdrivercd/screwdriver](https://hub.docker.com/r/screwdrivercd/screwdriver) - API。CI/CDクラスタのメインエンジン
- [screwdrivercd/ui](https://hub.docker.com/r/screwdrivercd/ui) - Screwdriverと楽しく対話するためのUI
- [screwdrivercd/store](https://hub.docker.com/r/screwdrivercd/store) - アーティファクトリポジトリ。ビルドログやテンプレートなどのアーティファクトに責任を持つ
- [screwdrivercd/launcher](https://hub.docker.com/r/screwdrivercd/launcher/tags/) - ビルドを実行するワーカーコンポーネント。イメージの変更は*できません*。使用するタグの指定のみ可能です。

下記は`docker-compose.yml`ファイルのスニペットです。

```
version: '2'
services:
  api:
    image: screwdrivercd/screwdriver:stable
    . . .
  ui:
    image: screwdrivercd/ui:stable
    . . .
  store:
    image: screwdrivercd/store:stable
    . . .
```

これらを使用する代わりにローカルのDockerイメージを利用することもできます。

SD-in-a-Boxを起動するには、以下のコマンドを実行してください。

```bash
$ docker-compose -p screwdriver up
```

### Volume-Mounted Source Code

ローカルコピーとして、コンポーネントを選択し、変更することができます。 もしあなたがサービスの更新のための開発中で、クラスタ全体にどのような影響が出るかを確認したい場合、この方法は大変効果的です

変更したいコンポーネントに合わせて`docker-compose.yaml`を修正します。 例えば、以下のローカルのソース修正で、APIを変更することができます。

```yaml
services:
  api:
    # this "build" stanza replaces the default "image" setting
    build:
      context: ./relative/path/to/api_source
      dockerfile: Dockerfile.local
  ui:
    . . .
  store:
    . . .
```

修正を反映させるために、docker-composeをリビルドする必要があります。

```bash
$ docker-compose build --no-cache
```

ローカルクラスタを再起動することで、行った修正が適用されます。

```bash
$ docker-compose -p screwdriver down
$ docker-compose -p screwdriver up
```

#### 警告

この方法はサービス全体の変更には効果的ですが、いくつかの制限があります。

- この方法では、個々のモジュールを変更することはできません。

### Local Development Instances

もしあなたが特定のScrewdriverのコンポーネントを修正しようとしているなら、あなたの開発環境でコンポーネントを変更することができます。これはプルリクエストを送る前に、修正が他のScrewdriverのコンポーネントにどのような影響を与えるか調べるのに良い方法になるでしょう。

#### General configuration

`docker-compose.yml`に記述されているコンポーネントは全てIPアドレスが設定されています(`localhost`ではなく)。 以下の機能はIPアドレスの代わりに`localhost`を使用すると停止してしまいます。

- ローカルでビルドは始まらないでしょう

#### UIの設定

UIのローカル開発インスタンスを使うように設定することが可能です。

開発モードでは、デフォルトでは UI は自身の `4200` のポートで起動し、API　はローカルの `8080` で起動するようになっています。
開発モードで、デフォルトで UI はポートを`4200`に、API はポートを`8080`に設定されています。UI の `config/environment.js` をローカルの Screwdriver のクラスタ、特に API を指すように変更する必要があるかもしれません。これは、`docker-compose.yml` の services -> api -> environment -> `URI` と `ECOSYSTEM_STORE` の値に一致するように`SDAPI_HOSTNAME` と `SDSTORE_HOSTNAME` の値を変更することでできます。

以下のスニペットは`config/environment.js`で変更すべき部分のハイライトです。

```js
 ...
 APP: {
       // インスタンス作成時にここでフラグやオプションを渡すことも出来ます。
       SDAPI_HOSTNAME: 'http://172.142.26.99:9001',
       SDAPI_NAMESPACE: 'v4',
       SDSTORE_HOSTNAME: 'http://172.142.26.99:9002',
       ...
      },
```

以下のスニペットは`docker-compose.yml`で変更すべき部分のハイライトです。ローカルのUIインスタンスを使用するために、SD-in-a-boxクラスタに合わせる必要があります。`service` 以下にある `ui` を削除する必要もあります。

```yaml
version: '2'
services:
    api:
        image: screwdrivercd/screwdriver:stable
        ports:
            - 9001:80
        volumes:
            - /var/run/docker.sock:/var/run/docker.sock:rw
            - ./data/:/tmp/sd-data/:rw
        environment:
            PORT: 80
            URI: http://172.142.26.99:9001 # API
            ECOSYSTEM_UI: http://localhost:4200 # need to change to this value here
            ECOSYSTEM_STORE: http://172.142.26.99:9002 # Store
    . . .
    store:
        image: screwdrivercd/store:stable
        ports:
            - 9002:80
        environment:
            ECOSYSTEM_UI: http://localhost:4200
            URI: http://172.142.26.99:9002
```

`URI` の値にIPアドレスを設定している場合、`localhost`を`ECOSYSTEM_UI`の値に設定することはできません。ログイン後に有効でないトークンを受け取ってしまいます。

このように変更したら、UI を http://localhost:4200 で実行するために、UI の [README.md](https://github.com/screwdriver-cd/ui/#screwdriver-ui) にある通りに実行します。

新しい変更を加えたら、SD-in-a-box を再実行します。
```bash
$ docker-compose -p screwdriver up
$ docker-compose build --no-cache
$ docker-compose -p screwdriver up
```

_注意: Chrome を使用するとログインに問題が発生します。別のブラウザを使用してください。_

#### APIの設定

APIのローカル開発インスタンスを使うように設定することが可能です。

関連する環境変数を設定することで高度な設定が可能です。詳しくは[the API documentation](https://github.com/screwdriver-cd/screwdriver#environment)をご覧ください。

#### Storeの設定

ストアのローカル開発インスタンスを使うように設定することが可能です。

デフォルトではストアのポートは`80`に設定されています。この値を自由に変更することができます。このガイドでは`8888`に変更しています。

以下のスニペットは`docker-compose.yml`で変更すべき部分のハイライトです。ローカルのストアインスタンスを使用するためにSD-in-a-boxクラスタに合わせる必要があります。

```yaml
version: '2'
services:
  store:
    . . .
    ports:
      - 8888:80    # Port 8888 is arbitrary. You can choose another if you prefer
    environment:
      URI: http://11.22.33.44:9001
      ECOSYSTEM_STORE: http://10.73.202.183:8888    # Tells the API where the store is hosted
    . . .
```
