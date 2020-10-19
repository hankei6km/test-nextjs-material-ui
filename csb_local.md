# CodeSandbox とローカルで git の操作を行うテスト

CodeSandbox のサンドボックスからは GitHub のリポジトリを扱う場合は、以下のようにとしていたが、
`diff` `add -p` `rebase` `stash` あたりが無いのは厳しい。

1. GitHub 上のリポジトリを GitHubBox 経由で開くなどで GitHub サンドボックスとして作成
1. github のリポジトリとリンク
1. pr 作成でコミット
1. 以降、区切りのよいところまでコミット
1. GitHub 側で merge --sqush でコミットメッセージを整える(ブランチの最初のコミットメッセージが `Initial commit` になっているので)
1. サンドボックスは削除
1. 新しい変更を行う場合は、1 から繰り返す

ということで、ローカル側である程度補えないかを試してみる。

# CodeSandbox とローカルの挙動確認

### コミットのハッシュを変更してみる

1. サンドボックスから PR 作成
1. ローカルで `gh pr checkout`
1. `git commit --amend` `git push -f origin ....` でコミットのハッシュを変える
1. サンドボックスを開き直す
1. サンドボックスの GitHub タブを確認("No chagens"となっていた)
1. サンドボックスから新しいコミットを push
1. ローカルから push したコミットが親となっていることを確認

以上のことから、「GitHub サンドボックスを開くと、リンク先のブランチを毎回 fetch して reset --hard しているような状態(実際の内部的な動作は不明)になる」と言える。
よって、PR で `main(master) ブランチでなければ、他の環境からブランチを編集していても大きな問題はおきないと思われる。

### PR をマージしブランチを削除してみる

1. ローカルで `gh pr merge -m`
1. GitHub 上でサンドボックスが作成したブランチが削除される
1. サンドボックスを開き直す
1. 以下のエラーが表示され、サンドボックスの GitHub タブのアイコンに黄色のドットが付いたままになる

> We were not able to compare the content with the source, please refresh or report the issue.
> Not Found

PR がクローズされるとサンドボックスを作り直すことになるので、とくに影響はない。

### PR ブランチを GitHubBox 経由で開いてみる

1. GitHub 上でブランチを開いた状態でブラウザのアドレスバーに `box` を追加(`https://github.com/hankei6km/test-nextjs-material-ui/tree/topic/csb_local`)
1. あとは `main(master)` のときと同じ
1. コミットは PR 作成せずに実行すれば元のブランチにコミットできる

PR はローカル側で draft で作成しておいて githubbox 経由で GitHub サンドボックスにするのが良いと思われる。

### yarn.lock

1. 上記の PR ブランチを GitHubBox 経由で開いた状態のサンドボックスを用意
1. ローカルで `yarn install` 等を行った後に GitHub へ push
1. サンドボックスで依存パッケージを追加
1. サンドボックスの GitHub ブで確認しても `yarn.lock` は `Changes` には反映されない(`sha256sum` で確認してみると変更されている)

これは以前から少し気になっていたのだが、しかたないので依存関係の操作はローカルで行うことににする。

### diff

これもどうにもならなさそうなので、ローカルを極力最新に保っておいて、diff を確認したくなったらローカルへコピペして tig かな。。。

## CodeSandbox とローカル利用の流れ

とりあえず、ぼっちで使うなら以下のような流れでいけるかな。

### プロジェクトを作成する

1. https://github.com/hankei6km/CSB-IEFBR14 を GitHubBox 経由で開きフォークする
1. 新しいプロジェクト用に構成を変更する(`create-????-app` の実行等)
1. GitHub へエクスポートする(パッケージ名もここで変更?)
1. フォークしたサンドボックスは削除する
1. `gh repo clone` 等でローカルにもリポジトリを作成
1. 可能であればローカルで `yarn install` を実行し `yarn.lock` を作成、push しておく

### プロジェクトを編集する(CodeSabdbox起点)

1. GitHub 上のプロジェクトをフォークしリンクする(通常は `main(master)` ブランチにリンクされる)
1. 編集する
1. 「Create branch csb-???? for the commit and start a PR」でコミットし、ブランチを作成する
なお、このときのコミットメッセージは RP のタイトルとなり、実際のコミットメッセージは `Initial comitt` となる
1. `gh pr checkout` などでリモート(GitHub)上の PR ブランチをチェックアウトする
1. ローカルでコミットメッセージを整えて `push -f` で更新する(これは必須ではない)
1. サンドボックスを開き直す
1. 以降、CodeSandbox とローカルで編集し `push` `fetch` など同期させていく
1. 編集が終わったら `gh pr merge` などで PR を閉じる
1. サンドボックスを削除する

良い点
- CodeSandbox 側で気軽に始められる
良くない点
- PR が ready 状態で作成される
- ブランチ名が `csb-????` となってわかりにくい(名前を考えなくても良いという利点でもある)
注意点
- サンドボックス側で依存関係を変更してはならない(`yarn.lock` を変更してはならないという意味)

### プロジェクトを編集する(ローカル起点)

1. `gh repo clone` などでクローンする
1. ブランチを作成する
1. 編集する
1. `gh rp create -d` などで GitHub 上に PR を作成する
1. CodeSandbox で編集する場合は、GitHub 上でブランチのページを開き、GitHubBox でフォークする
1. サンドボックスでコミットするときは、「Commit directly to the topic?????? branch」でコミットする
1. 以降、CodeSandbox とローカルで編集し `push` `fetch` など同期させていく
1. 編集が終わったら `gh pr merge` などで PR を閉じる
1. サンドボックスを削除する

良い点
- PR が draft 状態で作成される
- ブランチ名を自由に設定できる(名前を考えなくてはならないという難点でもある)
良くない点
- CodeSandbox 側で気軽に始められない(ローカルで実行環境を整える必要などがある)
注意点
- サンドボックス側で依存関係を変更してはならない(`yarn.lock` を変更してはならないという意味)

### diff

サンドボックスで diff を行いたい場合は

1. ローカル側のブランチを更新しする
1. サンドボックスの GitHub タブを開き変更されているファイルを確認する
1. diff を確認したいファイルがあればロカールへコピペし、`tig` 等で確認する
1. 確認できたらローカルのブランチは `git reset --hard HEAD` などで戻しておく
