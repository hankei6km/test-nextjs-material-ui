# CodeSandbox とローカルで git の操作を行うテスト

CodeSandbox のサンドボックスからは GitHub のリポジトリを扱う場合は、以下のようにとしていたが、
`diff` `add -p` `rebase` `stash` あたりが無いのは厳しい。

1. GitHub 上のリポジトリを GitHubBox 経由で開くなどで GitHub サンドボックとして作成
1. github のリポジトリとリンク
1. pr 作成でコミット
1. 以降、区切りのよいところまでコミット
1. GitHub 側で merge --sqush でコミットメッセージを整える(ブランチの最初のコミットメッセージが `Initial commit` になっているので)
1. サンドボックは削除
1. 新しい変更を行う場合は、1 から繰り返す

ということで、ローカル側である程度補えないかを試してみる。
