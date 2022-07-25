1.识别出最大的三个文件
git verify-pack -v .git/objects/pack/pack-9d09b4193dbf17ae0d84828783e1268bf67d11d7.idx | sort -k 3 -n | tail -3 2.查询大文件的文件名
git rev-list --objects --all | grep 35047899fd3b0dd637b0da2086e7a70fe27b1ccb 3.将该文件从历史记录的所有 tree 中移除
git filter-branch --index-filter 'git rm --cached --ignore-unmatch /wabapi/bulid/master-0.0.1.jar' --tag-name-filter cat -- --all

rm -rf .git/refs/original/ & git reflog expire --expire=now --all & git fsck --full --unreachable & git repack -A -d & git gc --aggressive --prune=now & git push --force

rm -rf .git/refs/original/

git reflog expire --expire=now --all

git fsck --full --unreachable

git repack -A -d

git gc --aggressive --prune=now

git push --force --all
