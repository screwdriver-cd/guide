---
layout: main
title: Secrets
category: User Guide
menu: menu_ja
toc:
- title: Build Secrets
  url: "#build-secrets"
  active: 'true'
- title: セキュリティ
  url: "#セキュリティ"
- title: Secretsをジョブで利用する設定
  url: "#Secretsをジョブで利用する設定"
- title: ユーザインタフェース
  url: "#ユーザインタフェース"
---

# Build Secrets

同一パイプラインのジョブ間でのみ共有されるSecretsを使うことができます。 ScrewdriverはSecretsを環境変数として書き込む機能を提供します。Secretsは環境変数として提供されるので、ビルド内で簡単に扱うことができます。

## セキュリティ

Screwdriverチームは非常に真剣にセキュリティ問題に取り組んでおり、さまざまなサービス間の全てのトラフィックを暗号化しています。ユーザSecretsは暗号化されデータストアに保存され、Secretsの値はユーザによって許可されたビルドのみで利用されます。

セキュリティ意識の高いパイプライン管理者は、プルリクエストジョブでSecretsを利用することを望まないでしょう。悪意のあるプルリクエスト送信者が、管理者の同意なしにSecretsを利用可能にできるためです。しかし、mainジョブではSecretsが必要な場合があります。ScrewdriverはSecretsに`allowInPR` (デフォルト: false) というフラグを提供しています。これはプルリクエストジョブでSecretsを利用するために必要なフラグです。

SecretsはPipelineに紐付いているGitリポジトリの管理者のみ追加、変更または削除が可能です。"push"権限を持つユーザはSecretsのリストを取得できますが、Secretsの値を取得することはできません。

## Secretsをジョブで利用する設定

利用を許可するSecretsのリストをパイプラインの設定に追加します。SecretsのキーにはA-Zと_のみ利用でき、文字で始まる必要があります。

以下の例では、`NPM_TOKEN`というSecretsを`publish`ジョブに追加しています:

```yaml
publish:
    steps:
        - publish-npm: npm publish
    secrets:
        # Publishing to NPM
        - NPM_TOKEN
```

任意のジョブにSecretsを追加することができます。

### プルリクエストでのSecrets

セキュリティの観点から、プルリクエストジョブでのSecretsの利用は推奨されません。Secretsの設定を変更したscrewdriver.yamlを含むプルリクエストジョブを作成することが可能だからです。

プルリクエストジョブは`main`ジョブと同じ内容が実行されます。`main`ジョブでSecretsを使うよう設定ができますが、デフォルトではSecretsは利用できません。

```yaml
main:
    steps:
        - my-step: maybeDoSomethingWithASecret.sh
    secrets:
        - MY_SECRET
```

UIまたはAPIでSecretsを作成した際、`allowInPR` を有効にし、`main` ジョブでSecretsを利用する設定をすることで、プルリクエストジョブでSecretsの利用が可能になります。

## ユーザインタフェース

パイプラインのSecretsを作成する一番簡単な方法はScrewdriverのUIを使うことです。
![Secrets UI](../../../../assets/secrets.png)

### Secretsの作成

グレーのテキストボックスにキーと値を入力し、Addボタンをクリックします。`allowInPR`のチェックボックスにチェックを入れると、プルリクエストジョブ内でSecretsの利用が可能になります。

### Secretsの更新

Secretsの値はUIから参照することはできませんが、更新は可能です。新しい値を更新したいキーの隣のテキストボックスに入力し、Updateボタンをクリックします。

### Secretsの削除

削除したいSecretsのDeleteボタンをクリックします。
