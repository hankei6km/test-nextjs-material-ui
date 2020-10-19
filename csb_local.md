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

## コミットのハッシュ変更してみる

1. サンドボックスから PR 作成
1. ローカルで `gh pr checkout`
1. `git commit --amend` `git push -f origin ....` でコミットのハッシュを変える
1. サンドボックスを開き直す
1. サンドボックスの GitHub タブを確認("No chagens"となっていた)
1. サンドボックスから新しいコミットを push
1. ローカルから push したコミットが親となっていることを確認

以上のことから、「GitHub サンドボックスを開くと、リンク先のブランチを毎回 fetch して reset --hard しているような状態(実際の内部的な動作は不明)になる」と言える。
よって、PR で `main(master) ブランチでなければ、他の環境からブランチを編集していても大きな問題はおきないと思われる。

## PR をマージしブランチを削除してみる

1. ローカルで `gh pr merge -m`
1. GitHub 上でサンドボックスが作成したブランチが削除される
1. サンドボックスを開き直す
1. 以下のエラーが表示され、サンドボックスの GitHub タブのアイコンに黄色のドットが付いたままになる

> We were not able to compare the content with the source, please refresh or report the issue.
> Not Found

PR がクローズされるとサンドボックスを作り直すことになるので、とくに影響はない。

## PR ブランチを GitHubBox 経由で開いてみる

1. GitHub 上でブランチを開いた状態でブラウザのアドレスバーに `box` を追加(`https://github.com/hankei6km/test-nextjs-material-ui/tree/topic/csb_local`)
1. あとは `main(master)` のときと同じ
1. コミットは PR 作成せずに実行すれば元のブランチにコミットできる

PR はローカル側で draft で作成しておいて githubbox 経由で GitHub サンドボックスにするのが良いと思われる。

## yarn.log

1. 上記の PR ブランチを GitHubBox 経由で開いた状態のサンドボックスを用意
1. ローカルで `yarn install` 等を行った後に GitHub へ push
1. サンドボックスで依存パッケージを追加
1. サンドボックスの GitHub ブで確認しても `yarn.lock` は `Changes` には反映されない(`sha256sum` で確認してみると変更されている)

これは以前から少し気になっていたのだが、しかたないので依存関係の操作はローカルで行うことににする。

## diff

これもどうにもならなさそうなので、ローカルを極力最新に保っておいて、diff を確認したくなったらローカルへコピペして tig かな。。。


