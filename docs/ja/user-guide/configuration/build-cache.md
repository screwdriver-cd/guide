---
layout: main
title: ビルドキャッシュ
category: User Guide
menu: menu_ja
toc:
    - title: ビルドキャッシュ
      url: "#ビルドキャッシュ"
    - title: 例
      url: "#例"
    - title: 注意
      url: "#注意"
    - title: 特定のジョブでキャッシュを無効にする
      url: "#特定のジョブでキャッシュを無効にする"
    - title: 並列ジョブによるキャッシュの更新
      url: "#並列ジョブによるキャッシュの更新"
    - title: キャッシュの削除
      url: "#キャッシュの削除"
---
# ビルドキャッシュ
ビルドにおいてキャッシュしたいファイルのパスを含めて一番上の階層で設定します。キャッシュはビルドの teardown bookend でキャッシュされ、setup bookend でリストアされます。キャッシュへのアクセスは、パイプライン、イベント、ジョブのスコープで制限することができます。

| スコープ  | アクセス範囲 |
|---|---|
| pipeline  | 同じパイプラインの全てのビルド ![pipeline-scope](../../../user-guide/assets/pipeline-scope.png) |
| event  | 同じイベントの全てのビルド ![event-scope](../../../user-guide/assets/event-scope.png) |
| job  | 同じジョブについての全てのビルド ![job-scope](../../../user-guide/assets/job-scope.png) |

## 例

```yaml
cache:
   pipeline: [~/.gradle]
   event: [$SD_SOURCE_DIR/node_modules]
   job:
       usejobcache: [/tmp/test]

jobs:
    setnpmcache:
        image: node:lts
        steps:
            - install: npm install
        requires: [~commit, ~pr]
    usenpmcache:
        image: node:lts
        steps:
            - ls: ls
            - install: npm install
        requires: [setnpmcache]
    usegradlecache:
        image: java:7
        steps:
            - ls: ls ~/
            - install: git clone https://github.com/gradle/gradle-site-plugin.git && cd gradle-site-plugin && ./gradlew build
        requires: [~commit, ~pr]
    usejobcache:
        image: node:lts
        steps:
            - ls-tmp: ls /tmp
            - echo: echo hi > /tmp/test
        requires: [~commit, ~pr]
```

上記の例では、パイプラインスコープの `.gradle` のキャッシュがパイプラインの全てのビルドから `gradle install` の時間を短縮するためにアクセスできます。イベントスコープのキャッシュでは、 `setnpmcache`ビルドのイベントスコープの下で `node_modules` フォルダーをキャッシュして、下流の `usenpmcache` ビルドが `npm install` の時間を節約できるようにします。ジョブスコープのキャッシュでは、`/tmp/test` ファイルをキャッシュして、同じジョブのその後のビルドで使用できるようにします。

サンプルリポジトリ: <https://github.com/screwdriver-cd-test/cache-example>

## 注意
- もしキャッシュが大きくてキャッシュ bookend がメモリオーバーとなるようでしたら、`screwdriver.cd/ram` [アノテーション](./annotations)に `HIGH` を設定するとより多くのメモリがビルドで使用できるようになります。

## 特定のジョブでキャッシュを無効にする
特定のジョブでキャッシュを利用したくない場合には、`cache` の設定を特定のジョブに設定します。
`cache` の値が `false` のときには、トップレベルのキャッシュの設定がされていてもそのジョブではキャッシュのストアもリストアも行いません。

例:
```
cache:
   event: [$SD_SOURCE_DIR/node_modules]

jobs:
    setnpmcache:
        image: node:lts
        steps:
            - install: npm install
        requires: [~commit, ~pr]
    usenpmcache:
        image: node:lts
        steps:
            - ls: ls
            - install: npm install
        requires: [setnpmcache]
    no-usenpmcache:
        image: node:lts
        steps:
            - ls: ls
            - run-command: echo 'run command which not uses npmcache.'
        requires: [usenpmcache]
        cache: false
```

## 並列ジョブによるキャッシュの更新

screwdriver.yamlに並列ジョブがあり、イベントまたはパイプラインレベルで同じキャッシュのPATHを指定する場合は注意が必要です。
ジョブが並行して実行されている場合、どのジョブが最初にキャッシュの書き込みに成功するかは保証されません。

上記のシナリオにどう対処するか？
1. キャッシュが必要なジョブでは、明示的にstore-cli setコマンドを使用してください。
2. キャッシュしたいジョブごとに異なるキャッシュフォルダを指定し、それらを使い分けてください。
3. まず1つのジョブだけでキャッシュへの書き込みを行い、その後のジョブを並列で動かしてください。

## キャッシュの削除
キャッシュを削除するには、 Screwdriver の UI からパイプラインのオプションタブへ行き、キャッシュのセクションのゴミ箱アイコンをクリックします。

![Clear cache](../../../user-guide/assets/clear-cache.png)
