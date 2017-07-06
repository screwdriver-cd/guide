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

<pre class="example">
<a href="#workflow"><span class="key">workflow</span>:
    - <span class="value">publish</span>
    - <span class="key">parallel</span>:
        - <span class="key">series</span>:
            - <span class="value">deploy-east</span>
            - <span class="value">validate-east</span>
        - <span class="key">series</span>:
            - <span class="value">deploy-west</span>
            - <span class="value">validate-west</span></a>
<a href="#shared"><span class="key">shared</span>:</a>
    <a href="#environment"><span class="key">environment</span>:
    <span class="key">NODE_ENV</span>: <span class="value">test</span></a>
    <a href="#settings"><span class="key">settings</span>:</a>
        <a href="#email"><span class="key">email</span>:
    <span class="key">addresses</span>: <span class="value">[test@email.com, test2@email.com]</span>
    <span class="key">statuses</span>: <span class="value">[SUCCESS, FAILURE]</span></a>
<a href="#jobs"><span class="key">jobs</span>:</a>
    <a href="#main-job"><span class="key">main</span>:</a>
        <a href="#image"><span class="key">image</span>: <span class="value">node:{{NODE_VERSION}}</span></a>
        <a href="#matrix"><span class="key">matrix</span>:
    <span class="key">NODE_VERSION</span>: <span class="value">[4,5,6]</span></a>
        <a href="#steps"><span class="key">steps</span>:
    - <span class="key">init</span>: <span class="value">npm install</span>
    - <span class="key">test</span>: <span class="value">npm test</span></a>
    <a href="#jobs"><span class="key">publish</span>:
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">steps</span>:
        - <span class="key">publish</span>: <span class="value">npm publish</span></a>
    <a href="#jobs"><span class="key">deploy-west</span>:
    <span class="key">image</span>: <span class="value">node:6</span>
    <span class="key">environment</span>:
        <span class="key">DEPLOY_ENV</span>: <span class="value">west</span>
    <span class="key">steps</span>:
        - <span class="key">init</span>: <span class="value">npm install</span>
        - <span class="key">publish</span>: <span class="value">npm deploy</span></a>
    <a href="#jobs">...</a>
</pre>
    <div class="yaml-side">
        <div id="workflow" class="hidden">
            <h4>Workflow</h4>
            <p>パイプラインで実行されるジョブの順番を定義します。workflowで参照される全てのジョブはjosセクションに定義されている必要があります。</p>
            <p>ジョブの実行は並列、順次、またはこの例のように両者の組み合わせも可能です。特別なキーワード <strong><em>parallel</em></strong> と <strong><em>series</em></strong> によりジョブのフローを定義できます。 デフォルトではworkflow内のジョブは<em>main</em>ジョブの成功後に順次実行されます。</p>
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
            <p>Configurable settings for any additional build plugins added to Screwdriver.cd.</p>
        </div>
        <div id="email" class="hidden">
            <h4>Email</h4>
            <p>Emails addresses to send notifications to and statuses to send notifications for.</p>
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
</div>
