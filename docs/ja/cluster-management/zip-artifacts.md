---
layout: main
title: Zip Artifacts機能
category: Cluster Management
menu: menu_ja
toc:
- title: Zip Artifacts機能
  url: "#zip-artifacts機能"
  active: 'true'
- title: 構成
  url: "#構成"
- title: 構築
  url: "#構築"
- title: Artifacts Unzip Serviceの構築
  url: "#artifacts-unzip-serviceの構築"
- title: APIのfeature flagを設定
  url: "#apiのfeature-flagを設定"
- title: unzipに失敗した場合
  url: "#unzipに失敗した場合"
---

# Zip Artifacts機能

`screwdriver-artifact-bookend`を利用して、ビルド成果物をStoreにアップロードする際、それらのファイルをZip化して送信できます。  
この機能を有効化することで大量のファイルをアップロードする場合に`screwdriver-artifact-bookend`の実行時間を短縮できます。  
Zip化されたファイルをアップロード後に解凍するため、アップロードされたファイルがUIのArtifactsタブに表示されるまで時間がかかる場合があります。  

## 構成

![zip artifacts architecture](../../cluster-management/assets/zip-artifacts-architecture.png)  

1. ビルドコンテナ(`screwdriver-artifact-bookend`ステップ)からZip化されたビルド成果物をStoreにアップロードします。
1. ビルドコンテナはAPIに先程アップロードしたZipをUnzipするリクエストを行います。
1. APIはUnzipのリクエストが来たら、Redisにメッセージを送信します。
1. Artifacts Unzip ServiceがRedisからメッセージを取得し、Zip化されたビルド成果物をStoreから取得し、解凍してから再度Storeにアップロードします。
1. Artifacts Unzip ServiceはZip化されたビルド成果物をStoreから削除します。

## 構築

### Artifacts Unzip Serviceの構築

[Artifacts Unzip Serviceの設定](configure-artifacts-unzip-service)を参考にArtifacts Unzip Serviceを構築してください。

### APIのfeature flagを設定

APIにZip Artifacts機能を利用するための設定を追加する必要があります。  
以下の設定を追加することでAPIはqueue-serviceに解凍するためのメッセージを送るようになります。  

キー | デフォルト | 説明
--- | --- | ---
UNZIP_ARTIFACTS_ENABLED | false | Artifacts Unzip Serviceを利用するかの有無

```yaml
# config/local.yaml
unzipArtifacts:
  enabled: true
```

## unzipに失敗した場合

Artifacts Unzip Serviceが解凍に失敗した場合、UIのArtifactsタブにファイルの一覧が表示されなくなります。  
解凍に失敗した場合、管理者側で再度APIにリクエストを送る必要があります。

1. [APIドキュメント](../user-guide/api#restクライアント経由で実行する)を参考に認証トークンを取得します。
1. /builds/{id}/artifacts/unzipに、以下のようにリクエストを送信します。

    ```bash
    # 例
    curl -I -X POST -H "Authorization: Bearer {Token}" https://api.screwdriver.cd/v4/builds/{ID}/artifacts/unzip
    ```

1. 解凍したビルドIDのページにアクセスし、Artifactsタブにファイルが表示されていることを確認します。
