# Git examples for the new questions. 'setup' runs hidden first (in $HOME); 'code' is shown and echoed.
CASES = [
  {
    'q': 'SANITY: reproduce the existing git init example hash',
    'code': '''mkdir app && cd app
git init
echo "# App" > README.md
git add . && git commit -m "Initial commit"''',
  },
  {
    'q': 'What does git commit -a do?',
    'setup': '''mkdir app && cd app && git init -q
echo "v1" > app.txt && git add . && git commit -q -m "Initial commit"''',
    'code': '''echo "v2" > app.txt          # tracked file, changed
echo "notes" > notes.txt     # new, untracked file
git commit -a -m "Update app"
git status --short''',
  },
  {
    'q': 'What does git push -u (set upstream) do?',
    'setup': '''git init -q --bare origin.git
git clone -q origin.git app 2>/dev/null && cd app
echo "v1" > app.txt && git add . && git commit -q -m "Initial commit" && git push -q origin main
git switch -q -c feature && echo "f" > f.txt && git add . && git commit -q -m "Add feature"''',
    'code': '''git push -u origin feature
git branch -vv
# From now on plain push/pull know where to go
git push''',
  },
  {
    'q': 'How do you search code with git grep?',
    'setup': '''mkdir app && cd app && git init -q
printf 'def login():\\n    # TODO: add rate limit\\n    pass\\n' > auth.py
printf 'def pay():\\n    pass\\n' > pay.py
git add . && git commit -q -m "Add auth" && git tag v1.0
printf '# TODO: refunds\\n' >> pay.py && git commit -q -am "Note refunds"''',
    'code': '''git grep -n "TODO"           # tracked files, with line numbers
git grep -c "TODO"           # count per file
git grep "TODO" v1.0         # search an old version''',
  },
  {
    'q': 'What do git shortlog and git describe do?',
    'setup': '''mkdir app && cd app && git init -q
echo 1 > a.txt && git add . && git commit -q -m "Initial commit" && git tag -a v1.0 -m "Release 1.0"
echo 2 > a.txt && GIT_AUTHOR_NAME=Asha git commit -q -am "Add search"
echo 3 > a.txt && GIT_AUTHOR_NAME=Ravi git commit -q -am "Fix cart total"
echo 4 > a.txt && GIT_AUTHOR_NAME=Asha git commit -q -am "Add filters"''',
    'code': '''git shortlog v1.0..HEAD       # commits grouped by author
git shortlog -sn HEAD         # just the counts
git describe                  # nearest tag + commits since''',
  },
  {
    'q': 'What does git archive do?',
    'setup': '''mkdir app && cd app && git init -q
echo "print('hi')" > main.py && echo "# App" > README.md
echo "node_modules/" > .gitignore && mkdir node_modules && touch node_modules/big.js
git add . && git commit -q -m "Initial commit" && git tag v1.0''',
    'code': '''git archive --prefix=app/ -o app-v1.0.tar v1.0
tar -tf app-v1.0.tar
git archive -o app-v1.0.zip v1.0   # format comes from the extension
ls app-v1.0.*''',
  },
]
