rm -rf project/build
git add . ; git commit -m "gix" ; git push
git init
git remote add origin https://github.com/lagleki/melbi-zei-lojban.git
git rm -r --cached .
git add .
git commit -m "first commit"
git push -f
git push --set-upstream origin master -f
docker exec -it snanu bash
