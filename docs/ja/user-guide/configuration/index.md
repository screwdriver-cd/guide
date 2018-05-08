---
layout: main
title: 全体
category: User Guide
menu: menu_ja
toc:
- title: Yaml設定
  url: "#yaml設定"
  active: 'true'
---

# Yaml設定

ここではscrewdriver.yamlの主要な設定についてインタラクティブに紹介します。

各プロパティ名にマウスカーソルを乗せるとそれらの説明が表示されます。

<div class="yaml-docs">
</div>

<pre class="example">
<a href="#shared"><span class="key">shared</span>:</a>
    <a href="#environment"><span class="key">environment</span>:
    <span class="key">NODE_ENV</span>: <span class="value">test</span></a>
    <a href="#settings"><span class="key">settings</span>:</a>
        <a href="#email"><span class="key">email</span>:
    <span class="key">addresses</span>: <span class="value">[test@email.com, test2@email.com]</span>
    <span class="key">statuses</span>: <span class="value">[SUCCESS, FAILURE]</span></a>
    <a href="#annotations"><span class="key">annotations</span>:
    <span class="key">beta.screwdriver.cd/my-cluster-annotation</span>: <span class="value">my-data</span></a>
        <a href="#executor"><span class="key">beta.screwdriver.cd/executor</span>: <span class="value">k8s-vm</span></a>
        <a href="#cpu"><span class="key">beta.screwdriver.cd/cpu</span>: <span class="value">HIGH</span></a>
        <a href="#ram"><span class="key">beta.screwdriver.cd/ram</span>: <span class="value">LOW</span></a>
<a href="#jobs"><span class="key">jobs</span>:</a>
      <span class="key">main</span>:
        <a href="#requires"><span class="key">requires</span>: <span class="value">[~pr, ~commit, ~sd@123:main]</span></a>
        <a href="#sourcePaths"><span class="key">sourcePaths</span>: <span class="value">["src/app/", "screwdriver.yaml"]</span></a>
        <a href="#image"><span class="key">image</span>: <span class="value">node:6</span></a>
        <a href="#steps"><span class="key">steps</span>:
    - <span class="key">init</span>: <span class="value">npm install</span>
    - <span class="key">test</span>: <span class="value">npm test</span></a>
    <a href="#jobs"><span class="key">publish</span>:
    <span class="key">requires</span>: <span class="value">main</span>
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">steps</span>:
        - <span class="key">publish</span>: <span class="value">npm publish</span></a>
    <a href="#jobs"><span class="key">deploy-west</span>:
    <span class="key">requires</span>: <span class="value">publish</span>
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">environment</span>:
        <span class="key">DEPLOY_ENV</span>: <span class="value">west</span>
    <span class="key">steps</span>:
        - <span class="key">init</span>: <span class="value">npm install</span>
        - <span class="key">deploy</span>: <span class="value">npm deploy</span></a>
    <a href="#jobs"><span class="key">deploy-east</span>:
    <span class="key">requires</span>: <span class="value">publish</span>
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">environment</span>:
        <span class="key">DEPLOY_ENV</span>: <span class="value">east</span>
    <span class="key">steps</span>:
        - <span class="key">init</span>: <span class="value">npm install</span>
        - <span class="key">deploy</span>: <span class="value">npm deploy</span></a>
    <a href="#jobs"><span class="key">finished</span>:
    <span class="key">requires</span>: <span class="value">[deploy-west, deploy-east]</span>
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">steps</span>:
        - <span class="key">echo</span>: <span class="value">echo done</span></a>
    <a href="#jobs">...</a>
</pre>

```
<div class="yaml-side">
    <div id="requires" class="hidden">
        <h4>Requires</h4>
        <p>ジョブ実行のトリガーとなる1つまたは複数のジョブの配列を設定します。"requires: ~pr"が設定されたジョブはプルリクエストイベントにより実行されます。"requires: ~commit"が設定されたジョブはプッシュイベントにより実行されます。"requires: ~sd@123:main"が設定されたジョブはパイプライン"123"の"main"ジョブの完了により実行されます。"requires: [deploy-west, deploy-east]"が設定されたジョブは"deploy-west"と"deploy-east"の両方のジョブの成功後に実行されます。"注意: ~ のジョブはOR条件で、~ なしのジョブはジョインの働きをします。"</p>
    </div>
    <div id="shared" class="hidden">
        <h4>Shared</h4>
        <p>全てのジョブの適用されるグローバル設定を定義します。Sharedの設定は各ジョブにマージされますが、それぞれのジョブで更に設定が行われている場合はその設定により上書きされます。</p>
    </div>
    <div id="environment" class="hidden">
        <h4>Environment</h4>
        <p>ビルドに必要な環境変数のキーと値の組み合わせです。ジョブに設定できる全ての設定はSharedにも設定できますが、ジョブの設定により上書きされます。</p>
    </div>
    <div id="settings" class="hidden">
        <h4>Settings</h4>
        <p>Screwdriver.cdに追加されたビルドプラグインの設定です。</p>
    </div>
    <div id="annotations" class="hidden">
        <h4>Annotations</h4>
        <p>アノテーションはキーバリューのペアです。パイプラインまたはジョブ単位で設定することができます。アノテーションのキーバリューは任意に設定することができ、例えば、ビルドの実行方法を変更することができます。Screwdriverのクラスタ管理者にビルドの実行方法を変更するために、どのようなアノテーションがサポートされているか確認してください。</p>
    </div>
    <div id="executor" class="hidden">
        <h4>Executor annotation</h4>
        <p>デフォルト以外のExecutorでのビルドを実行したい場合に設定します。`jenkins`, `k8s-vm`が設定可能です。</p>
    </div>
    <div id="cpu" class="hidden">
        <h4>CPU annotation</h4>
        <p>`k8s-vm` Executor を利用する場合にVMに割り当てられるCPUを設定します。`LOW`はデフォルトで設定され、2CPUが割り当てられ、`HIGH`は6CPU割り当てられます。</p>
    </div>
    <div id="ram" class="hidden">
        <h4>RAM annotation</h4>
        <p>`k8s-vm` Executor を利用する場合にVMに割り当てられるRAMを設定します。`LOW`はデフォルトで設定され、2GBのメモリが割り当てられ、`HIGH`は12GBのメモリが割り当てられます。</p>
    <div id="email" class="hidden">
        <h4>Email</h4>
        <p>通知を送信するEmailアドレスと、通知を送信するステータスを設定します。</p>
    </div>
    <div id="jobs" class="hidden">
        <h4>Jobs</h4>
        <p>ビルドの挙動を定義するジョブのリストです。</p>
    </div>
    <div id="main-job" class="hidden">
        <h4>Main</h4>
        <p>唯一の必須ジョブです。このジョブはコードに変更が行われた際に自動的に実行されます。</p>
    </div>
    <div id="image" class="hidden">
        <h4>Image</h4>
        <p>ビルドで利用されるDockerイメージを指定します。この例ではテンプレートを使用しており、{{NODE_VERSION}}のように波括弧で囲まれた変数が展開されます。 この変数はmatrixで指定されている値に変更され、それら複数のイメージを利用したビルドが並列に実行されます。</p>
    </div>
    <div id="matrix" class="hidden">
        <h4>Matrix</h4>
        <p>image設定にテンプレートが利用されている場合、そのジョブのビルドが複数のイメージを利用して並列に実行されます。</p>
    </div>
    <div id="steps" class="hidden">
        <h4>Steps</h4>
        <p>コマンドラインで入力するように、ビルドで実行されるコマンドのリストを定義します。同じジョブ内では、環境変数はステップ間で受け渡されます。ステップの定義は全てのジョブに必須です。Screwdriverのステップとして予約語になっているため、ステップ名を'sd-'で始めることはできません。Screwdriverは'/bin/sh'をステップ実行のために使用するため、異なるターミナルやシェルを使用すると予期せぬ振る舞いをするかもしれません。</p>
    </div>
</div>
```



