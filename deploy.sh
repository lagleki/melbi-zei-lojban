rm -rf project/build
git init
git remote add origin https://github.com/lagleki/melbi-zei-lojban.git
git rm -r --cached .
git add .
git commit -m "fix"
git branch source
git checkout source
git push --set-upstream origin source -f
