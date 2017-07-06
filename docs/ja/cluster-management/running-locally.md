---
layout: main
title: ローカルで実行
category: Cluster Management
menu: menu_ja
toc:
- title: ローカルで実行
  url: "#ローカルで実行"
  active: 'true'
- title: SD-in-a-Box
  url: "#sd-in-a-box"
- title: SD-in-a-Boxの設定
  url: "#sd-in-a-boxの設定"
---

# ローカルで実行

Screwdriver-in-a-boxツールを使用することで、Screwdriverをローカルで実行することができます。

## SD-in-a-Box

このツールによりScrewdriverのすべてのインスタンス（UI、API、ログストア）がローカルで起動し、試すことができます。

### 必要なもの

- Mac OSX 10.10+
- [Docker for Mac](https://www.docker.com/products/docker)
- [Docker Compose 1.8.1+](https://www.docker.com/products/docker-compose)
- Python 2.6+

次のコマンドを端末で実行するとScrewdriverクラスタがローカルに起動します。

```bash
$ python <(curl https://raw.githubusercontent.com/screwdriver-cd/screwdriver/master/in-a-box.py)
```

Client IDとClient Secretを聞かれますので入力します。その後`y`と入力すればScrewdriverが起動します！

![SD-in-a-box](../../cluster-management/assets/sd-in-a-box.png)

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

```
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
$ docker-compose build
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

デフォルトでUIはポートを`4200`に、APIはポートを`8080`に設定されています。UIの`config/environment.js`をローカルのScrewdriverのクラスタ、特にAPIを指すように変更する必要があるかもしれません。この変更は、`return ENV;`文の丁度一行前の値を変更することで可能です。

以下のスニペットは`config/environment.js`で変更すべき部分のハイライトです。

```js
 . . .
 ENV.APP.SDAPI_HOSTNAME = 'http://11.22.33.44:8080';  // 8080 is the default. You can also change this
 return ENV;
```

以下のスニペットは`docker-compose.yml`で変更すべき部分のハイライトです。ローカルのUIインスタンスを使用するために、SD-in-a-boxクラスタに合わせる必要があります。

```
version: '2'
services:
  api:
    . . .
    ports:
      - 8080:80    # UI default port for API is 8080. This can be changed according to the value you set in config/environment.js
    environment:
      URI: http://11.22.33.44:8080             # Tells the launcher where to communicate build updates to the API.
      ECOSYSTEM_UI: http://11.22.33.44:4200    # Tells the API where the UI is hosted. Related to OAuth mismatching-hostname issues
    . . .
```

`URI`の値にIPアドレスを設定している場合、`localhost`を`ECOSYSTEM_UI`の値に設定することはできません。ログイン後に有効でないトークンを受け取ってしまいます。

#### APIの設定

APIのローカル開発インスタンスを使うように設定することが可能です。

関連する環境変数を設定することで高度な設定が可能です。詳しくは[the API documentation](https://github.com/screwdriver-cd/screwdriver#environment)をご覧ください。

#### Storeの設定

ストアのローカル開発インスタンスを使うように設定することが可能です。

デフォルトではストアのポートは`80`に設定されています。この値を自由に変更することができます。このガイドでは`8888`に変更しています。

以下のスニペットは`docker-compose.yml`で変更すべき部分のハイライトです。ローカルのストアインスタンスを使用するためにSD-in-a-boxクラスタに合わせる必要があります。

```
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
