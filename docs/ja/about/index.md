---
layout: main
title: Screwdriverとは
category: About
menu: menu_ja
toc:
- title: Screwdriverとは
  url: "#screwdriverとは"
  active: 'true'
---

# Screwdriverとは

継続的デリバリーパイプラインのワークフローを簡単にするサービス群


<div class="row">
    <div class="col-xs-12 col-md-8">
        <h2>安全な継続的デリバリー</h2>
        <p>Screwdriverはあなたのビルドパイプライン上で継続的デリバリーを第一級オブジェクトとして扱います。プルリクエストからプロダクションまでの流れを簡単に定義します。</p>
    </div>
    <div class="col-xs-12 col-md-4">
        <img src="/assets/continuous_delivery.png" class="cd" alt="build publish deploy flowchart">
    </div>
</div>



<div class="row">
    <div class="col-xs-12 col-md-4">
        <img src="/assets/daily_habits.png" class="dh" alt="commit test release cycle">
    </div>
    <div class="col-xs-12 col-md-8">
        <h2>日常業務との統合</h2>
        <p>ScrewdriverはDevOpsの日々の習慣と繋がります。pull requestをテストし、マージされたコミットをビルドし、各自の環境にデプロイします。負荷テストやカナリアデプロイ、複数環境へのデプロイパイプラインを簡単に定義できます。</p>
    </div>
</div>



<div class="row">
    <div class="col-xs-12 col-md-8">
        <h2>パイプラインをコードで記述</h2>
        <p>シンプルなYAMLファイルをコードに追加することでパイプラインを定義できます。パイプラインを扱う他の設定は無いため、他のコードと合わせてパイプラインの変更をレビューした上で投入できます。</p>
    </div>
    <div class="col-xs-12 col-md-4">
        <img src="/assets/pipeline_code.png" class="pc" alt="Screwdriver.yaml screenshot">
    </div>
</div>



<div class="row">
    <div class="col-xs-12 col-md-4">
        <img src="/assets/3rd_party_services.png" class="party" alt="third party services examples">
    </div>
    <div class="col-xs-12 col-md-8">
        <h2>あらゆる環境で動作</h2>
        <p>Screwdriverのアーキテクチャは挿し替え可能なコンポーネントを使用し、利用者がそれらを自身のインフラに合ったものに差し替えることができます。データストアをPostgresに変更したり、実行エンジンをJenkinsに変更することができます。また、それぞれのパイプラインに応じて実行エンジンを選択することも可能です。例えば、Go言語のビルドにはkubernetesを使用し、iOSのビルドにはJenkinsを使用する、といったことが可能です。</p>
    </div>
</div>
