// Git interview questions, basics to advanced.
// Each item: { q, level, a, code, output }. Outputs were produced by running the
// commands in throwaway repositories (fixed author/date, so hashes are
// stable); the branching-strategies answer is a written summary.

export const questions = [
  {
    q: "What is Git and what is version control?",
    level: 'Basics',
    a: "Version control is a system that records every change to my files over time, so I can see who changed what, go back to any earlier version and work in parallel with others. Git is a distributed version control system: every developer has the full history locally, so commits, branches and logs work offline and are very fast. I commit small, focused changes so the history reads like a story.",
    code: `# Start tracking a project
mkdir notes && cd notes
git init
echo "Day 1 ideas" > ideas.txt
git add ideas.txt
git commit -m "Add ideas"
echo "Day 2 ideas" >> ideas.txt
git commit -am "Add more ideas"
# Every saved version is in the history
git log --oneline`,
    output: `$ mkdir notes && cd notes

$ git init
Initialized empty Git repository in /home/dev/notes/.git/

$ echo "Day 1 ideas" > ideas.txt

$ git add ideas.txt

$ git commit -m "Add ideas"
[main (root-commit) dfc38be] Add ideas
 1 file changed, 1 insertion(+)
 create mode 100644 ideas.txt

$ echo "Day 2 ideas" >> ideas.txt

$ git commit -am "Add more ideas"
[main f0f0bcc] Add more ideas
 1 file changed, 1 insertion(+)

$ git log --oneline
f0f0bcc Add more ideas
dfc38be Add ideas`,
  },
  {
    q: "What is the difference between Git and GitHub?",
    level: 'Basics',
    a: "Git is the version control tool that runs on my machine; it tracks history and does not need the internet. GitHub is a hosting service for Git repositories that adds collaboration features like pull requests, code review, issues and CI with GitHub Actions. GitLab and Bitbucket are alternatives; to Git they are all just a 'remote' URL.",
    code: `# Git works fully offline on my machine
git log --oneline
# GitHub is just a remote that I connect to
git remote add origin https://github.com/dev/app.git
git remote -v`,
    output: `$ git log --oneline
4b4ae9b Initial commit

$ git remote add origin https://github.com/dev/app.git

$ git remote -v
origin	https://github.com/dev/app.git (fetch)
origin	https://github.com/dev/app.git (push)`,
  },
  {
    q: "What is a Git repository?",
    level: 'Basics',
    a: "A repository is my project folder plus a hidden .git directory that stores the whole history: commits, branches, tags and config. The files I edit are the working tree; the .git folder is the actual database. If I delete .git, the project files stay but all history is gone, so I never touch it by hand.",
    code: `ls -A            # project files + the hidden .git folder
ls .git          # Git's database
# A commit is an object that points to a tree of files
git cat-file -p HEAD`,
    output: `$ ls -A
.git
app.txt

$ ls .git
COMMIT_EDITMSG
HEAD
config
description
hooks
index
info
logs
objects
refs

$ git cat-file -p HEAD
tree fc4a9d1cf861cdc827a1bac561129b4b4c12fdb1
author Dev <dev@example.com> 1767261600 +0000
committer Dev <dev@example.com> 1767261600 +0000

Initial commit`,
  },
  {
    q: "What is the difference between git init and git clone?",
    level: 'Basics',
    a: "git init creates a new, empty repository in the current folder, which I use when starting a project from scratch. git clone copies an existing repository, with its full history, and automatically sets up a remote called origin. Here I use a local bare repository as the 'server' instead of GitHub.",
    code: `# Create a brand-new repo
mkdir app && cd app
git init
echo "# App" > README.md
git add . && git commit -m "Initial commit"
# Publish to a bare repo that acts as the server
git init --bare ../origin.git
git remote add origin ../origin.git
git push -q origin main
# A teammate copies the whole repo
cd .. && git clone origin.git teammate
cd teammate && git log --oneline && git remote`,
    output: `$ mkdir app && cd app

$ git init
Initialized empty Git repository in /home/dev/app/.git/

$ echo "# App" > README.md

$ git add . && git commit -m "Initial commit"
[main (root-commit) 69098c6] Initial commit
 1 file changed, 1 insertion(+)
 create mode 100644 README.md

$ git init --bare ../origin.git
Initialized empty Git repository in /home/dev/origin.git/

$ git remote add origin ../origin.git

$ git push -q origin main

$ cd .. && git clone origin.git teammate
Cloning into 'teammate'...
done.

$ cd teammate && git log --oneline && git remote
69098c6 Initial commit
origin`,
  },
  {
    q: "What are the three areas in Git (working directory, staging area, repository)?",
    level: 'Basics',
    a: "The working directory is where I edit files, the staging area (index) is where I prepare exactly what goes into the next commit, and the repository is the committed history. git add moves changes from working directory to staging, and git commit moves them from staging into the repository. The staging area lets me commit only part of my changes, which keeps commits focused.",
    code: `echo "version 2" > app.txt   # 1. working directory
git status --short
git add app.txt              # 2. staging area
git status --short
git commit -m "Update app"   # 3. repository
git status --short
git log --oneline`,
    output: `$ echo "version 2" > app.txt

$ git status --short
 M app.txt

$ git add app.txt

$ git status --short
M  app.txt

$ git commit -m "Update app"
[main a62cd47] Update app
 1 file changed, 1 insertion(+), 1 deletion(-)

$ git status --short

$ git log --oneline
a62cd47 Update app
4b4ae9b Initial commit`,
  },
  {
    q: "What do git add, git commit and git status do?",
    level: 'Basics',
    a: "git status shows which files are modified, staged or untracked. git add stages changes for the next commit, and git commit saves the staged snapshot with a message. I run git status constantly; it is the quickest way to know where I am and what Git expects next.",
    code: `echo "version 2" > app.txt
echo "print('hi')" > main.py
git status
git add app.txt main.py
git commit -m "Add main script"
git status`,
    output: `$ echo "version 2" > app.txt

$ echo "print('hi')" > main.py

$ git status
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   app.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	main.py

no changes added to commit (use "git add" and/or "git commit -a")

$ git add app.txt main.py

$ git commit -m "Add main script"
[main d728fc2] Add main script
 2 files changed, 2 insertions(+), 1 deletion(-)
 create mode 100644 main.py

$ git status
On branch main
nothing to commit, working tree clean`,
  },
  {
    q: "How do you view history with git log?",
    level: 'Basics',
    a: "git log lists commits newest first. I mostly use --oneline for a compact view, --graph --all to see how branches split and merge, and -n or --format to limit and shape the output. 'git log --oneline --graph --all' is the alias I use most for checking where branches are.",
    code: `git log --oneline
# Draw branches and merges
git log --oneline --graph --all
# Custom format, last 2 commits
git log -2 --format="%h | %an | %s"`,
    output: `$ git log --oneline
db52a94 Merge branch 'feature'
b2822b2 Fix typo
9b3f5c7 Add search
848bbaf Add login page
4b4ae9b Initial commit

$ git log --oneline --graph --all
*   db52a94 Merge branch 'feature'
|\\
| * 9b3f5c7 Add search
* | b2822b2 Fix typo
|/
* 848bbaf Add login page
* 4b4ae9b Initial commit

$ git log -2 --format="%h | %an | %s"
db52a94 | Dev | Merge branch 'feature'
b2822b2 | Dev | Fix typo`,
  },
  {
    q: "What is the difference between git diff and git diff --staged?",
    level: 'Basics',
    a: "git diff shows unstaged changes: working directory compared to the staging area. git diff --staged (or --cached) shows what is staged: the staging area compared to the last commit, which is exactly what my next commit will contain. I always check git diff --staged before committing.",
    code: `echo "version 2" > app.txt
git add app.txt                # staged change
echo "version 3" > app.txt     # another, unstaged change
git diff                       # working dir vs staging
git diff --staged              # staging vs last commit`,
    output: `$ echo "version 2" > app.txt

$ git add app.txt

$ echo "version 3" > app.txt

$ git diff
diff --git a/app.txt b/app.txt
index 1f7a7a4..7170a52 100644
--- a/app.txt
+++ b/app.txt
@@ -1 +1 @@
-version 2
+version 3

$ git diff --staged
diff --git a/app.txt b/app.txt
index 83baae6..1f7a7a4 100644
--- a/app.txt
+++ b/app.txt
@@ -1 +1 @@
-version 1
+version 2`,
  },
  {
    q: "What is .gitignore and how does it work?",
    level: 'Basics',
    a: ".gitignore lists file patterns Git should not track, like build output, logs, node_modules and .env files. It only affects untracked files; if a file is already committed I must remove it from the index with git rm --cached. git check-ignore -v tells me which rule is ignoring a file, which is great for debugging.",
    code: `mkdir node_modules dist
touch debug.log .env node_modules/lib.js dist/app.js main.js
printf "node_modules/\\ndist/\\n*.log\\n.env\\n" > .gitignore
git status --short --untracked-files=all
# Which rule ignores this file?
git check-ignore -v debug.log`,
    output: `$ mkdir node_modules dist

$ touch debug.log .env node_modules/lib.js dist/app.js main.js

$ printf "node_modules/\\ndist/\\n*.log\\n.env\\n" > .gitignore

$ git status --short --untracked-files=all
?? .gitignore
?? main.js

$ git check-ignore -v debug.log
.gitignore:3:*.log	debug.log`,
  },
  {
    q: "How do you create, switch, list and delete branches?",
    level: 'Basics',
    a: "A branch is just a lightweight pointer to a commit, so creating one is instant. I use git switch -c to create and switch, git branch to list (the * marks the current one), and git branch -d to delete a merged branch. -d refuses to delete unmerged work; -D forces it, so I only use -D when I am sure.",
    code: `git branch feature/login        # create
git switch -c feature/search    # create + switch
git branch                      # list
git switch main                 # switch
git branch -d feature/login     # delete (merged)
git branch`,
    output: `$ git branch feature/login

$ git switch -c feature/search
Switched to a new branch 'feature/search'

$ git branch
  feature/login
* feature/search
  main

$ git switch main
Switched to branch 'main'

$ git branch -d feature/login
Deleted branch feature/login (was 4b4ae9b).

$ git branch
  feature/search
* main`,
  },
  {
    q: "What is the difference between git checkout, git switch and git restore?",
    level: 'Basics',
    a: "git checkout is the old command that did two jobs: switching branches and restoring files. Since Git 2.23 those jobs are split: git switch changes branches and git restore discards or unstages file changes. I use switch and restore because they are clearer and harder to misuse.",
    code: `git switch -c feature        # new branch (= checkout -b)
git switch main              # change branch (= checkout main)
echo "oops" > app.txt
git restore app.txt          # discard edit (= checkout -- app.txt)
cat app.txt
echo "staged" > app.txt && git add app.txt
git restore --staged app.txt # unstage, keep the edit
git status --short`,
    output: `$ git switch -c feature
Switched to a new branch 'feature'

$ git switch main
Switched to branch 'main'

$ echo "oops" > app.txt

$ git restore app.txt

$ cat app.txt
version 1

$ echo "staged" > app.txt && git add app.txt

$ git restore --staged app.txt

$ git status --short
 M app.txt`,
  },
  {
    q: "What is a remote in Git?",
    level: 'Basics',
    a: "A remote is a named URL of another copy of the repository, usually on GitHub or GitLab. 'origin' is the default name given by git clone. I can have several remotes, and remote-tracking branches like origin/main show where the remote was the last time I fetched.",
    code: `# A bare repo plays the role of GitHub here
git init --bare ../origin.git
git remote add origin ../origin.git
git remote -v
git push -q -u origin main
git branch -r          # remote-tracking branches`,
    output: `$ git init --bare ../origin.git
Initialized empty Git repository in /home/dev/origin.git/

$ git remote add origin ../origin.git

$ git remote -v
origin	../origin.git (fetch)
origin	../origin.git (push)

$ git push -q -u origin main

$ git branch -r
  origin/main`,
  },
  {
    q: "What do git push, git pull and git fetch do?",
    level: 'Basics',
    a: "git push uploads my local commits to the remote. git fetch downloads new commits from the remote into remote-tracking branches like origin/main without touching my work. git pull is fetch plus merge (or rebase) into my current branch.",
    code: `# origin.git is a local bare repo; alice and bob are two clones
cd alice
echo "feature" > feature.txt
git add . && git commit -q -m "Add feature"
git push origin main
cd ../bob
git pull
git log --oneline`,
    output: `$ cd alice

$ echo "feature" > feature.txt

$ git add . && git commit -q -m "Add feature"

$ git push origin main
To /home/dev/origin.git
   f856f38..43dfaa1  main -> main

$ cd ../bob

$ git pull
From /home/dev/origin
   f856f38..43dfaa1  main       -> origin/main
Updating f856f38..43dfaa1
Fast-forward
 feature.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 feature.txt

$ git log --oneline
43dfaa1 Add feature
f856f38 Initial commit`,
  },
  {
    q: "What is the difference between git fetch and git pull?",
    level: 'Basics',
    a: "git fetch only downloads new commits and updates origin/main; my branch and files stay exactly as they are. git pull does a fetch and then immediately merges or rebases into my branch. I usually fetch first and check what changed with git log main..origin/main before merging.",
    code: `git fetch
git status -sb                      # behind by 1, nothing changed yet
git log --oneline main..origin/main # what is new on the remote
git merge                           # now integrate (pull = fetch + merge)
git log --oneline`,
    output: `$ git fetch
From /home/dev/origin
   f856f38..6b9a30c  main       -> origin/main

$ git status -sb
## main...origin/main [behind 1]

$ git log --oneline main..origin/main
6b9a30c Add API endpoint

$ git merge
Updating f856f38..6b9a30c
Fast-forward
 api.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 api.txt

$ git log --oneline
6b9a30c Add API endpoint
f856f38 Initial commit`,
  },
  {
    q: "What are origin and upstream?",
    level: 'Basics',
    a: "origin is the default name for the remote I cloned from. In a fork workflow, 'upstream' usually names the original project, so I fetch updates from upstream and push to my fork on origin. A branch's 'upstream' is also the remote branch it tracks, set with git push -u, so plain git push and git pull know where to go.",
    code: `# Fork workflow: origin = my fork, upstream = original project
git remote add upstream ../upstream.git
git remote -v
# Set the tracking (upstream) branch on first push
git switch -q -c feature
git push -u origin feature
git branch -vv`,
    output: `$ git remote add upstream ../upstream.git

$ git remote -v
origin	../origin.git (fetch)
origin	../origin.git (push)
upstream	../upstream.git (fetch)
upstream	../upstream.git (push)

$ git switch -q -c feature

$ git push -u origin feature
To ../origin.git
 * [new branch]      feature -> feature
branch 'feature' set up to track 'origin/feature'.

$ git branch -vv
* feature f856f38 [origin/feature] Initial commit
  main    f856f38 [origin/main] Initial commit`,
  },
  {
    q: "What is HEAD in Git?",
    level: 'Basics',
    a: "HEAD is a pointer to what I currently have checked out; normally it points to a branch, and the branch points to a commit. When I commit, the branch moves forward and HEAD follows. HEAD~1 means the parent of HEAD, which I use a lot with log, diff and reset.",
    code: `cat .git/HEAD                  # HEAD points to a branch
git rev-parse --short HEAD     # ...which points to a commit
git log --oneline -1 HEAD~1    # parent commit
git switch -q -c feature
cat .git/HEAD                  # HEAD moved to the new branch`,
    output: `$ cat .git/HEAD
ref: refs/heads/main

$ git rev-parse --short HEAD
b1fc101

$ git log --oneline -1 HEAD~1
4b4ae9b Initial commit

$ git switch -q -c feature

$ cat .git/HEAD
ref: refs/heads/feature`,
  },
  {
    q: "How do you configure Git with git config (global vs local)?",
    level: 'Basics',
    a: "git config sets options at three levels: --system for the machine, --global for my user (~/.gitconfig) and --local for one repository (.git/config), and the more specific level wins. The first thing I set on a new machine is user.name and user.email, because they are written into every commit. I use a local override when one repo needs a different identity, like my work email, and git config --list --show-origin tells me exactly which file a value comes from.",
    code: `git config --global user.name "Asha Dev"
git config --global user.email "asha@example.com"
# Only for this repo, e.g. a work email
git config --local user.email "asha@work.example.com"
git config user.email          # local wins over global
git config --list --show-origin | grep user
cat ~/.gitconfig`,
    output: `$ git config --global user.name "Asha Dev"

$ git config --global user.email "asha@example.com"

$ git config --local user.email "asha@work.example.com"

$ git config user.email
asha@work.example.com

$ git config --list --show-origin | grep user
file:/home/dev/.gitconfig	user.name=Asha Dev
file:/home/dev/.gitconfig	user.email=asha@example.com
file:.git/config	user.email=asha@work.example.com

$ cat ~/.gitconfig
[init]
	defaultBranch = main
[color]
	ui = false
[core]
	pager = cat
[advice]
	defaultBranchName = false
[protocol "file"]
	allow = always
[user]
	name = Asha Dev
	email = asha@example.com`,
  },
  {
    q: "How do you create Git aliases?",
    level: 'Basics',
    a: "An alias is a shortcut I define with git config alias.<name>, and Git expands it before running the command. I keep a few in my global config, like st for status --short, lg for a graph log and unstage for restore --staged. They save a lot of typing, but I still learn the full commands so I can work on any machine.",
    code: `git config --global alias.st "status --short"
git config --global alias.lg "log --oneline --graph --all"
git config --global alias.unstage "restore --staged"
echo "version 2" > app.txt
git add app.txt
git st
git unstage app.txt
git st
git lg
git config --get-regexp "^alias"`,
    output: `$ git config --global alias.st "status --short"

$ git config --global alias.lg "log --oneline --graph --all"

$ git config --global alias.unstage "restore --staged"

$ echo "version 2" > app.txt

$ git add app.txt

$ git st
M  app.txt

$ git unstage app.txt

$ git st
 M app.txt

$ git lg
* a755f5d Add search
* 4b4ae9b Initial commit

$ git config --get-regexp "^alias"
alias.st status --short
alias.lg log --oneline --graph --all
alias.unstage restore --staged`,
  },
  {
    q: "How do you rename, move or delete files with git mv and git rm?",
    level: 'Basics',
    a: "git mv renames or moves a file and stages the change in one step, and git rm deletes the file and stages the deletion. If I rename a file with plain mv, Git first sees a deleted and a new file, but after git add it still detects the rename by comparing content. I prefer git mv and git rm because the status is correct immediately and nothing gets forgotten.",
    code: `git mv helpers.js utils.js
git rm old-notes.txt
git status --short
git commit -q -m "Rename helpers and remove old notes"
git show --stat --format="%s" HEAD
ls`,
    output: `$ git mv helpers.js utils.js

$ git rm old-notes.txt
rm 'old-notes.txt'

$ git status --short
D  old-notes.txt
R  helpers.js -> utils.js

$ git commit -q -m "Rename helpers and remove old notes"

$ git show --stat --format="%s" HEAD
Rename helpers and remove old notes

 old-notes.txt          | 1 -
 helpers.js => utils.js | 0
 2 files changed, 1 deletion(-)

$ ls
app.txt
utils.js`,
  },
  {
    q: "How do you stop tracking a file that is already committed?",
    level: 'Basics',
    a: "Adding a path to .gitignore does nothing for files Git already tracks, so I also remove them from the index with git rm --cached (-r for folders). That deletes them from the repository in the next commit but keeps them on my disk. Teammates' copies are deleted when they pull, so for local config files I warn the team or ship a template like config.example.json instead.",
    code: `git ls-files
echo "dist/" >> .gitignore
git rm -r --cached dist      # remove from Git, keep on disk
git add .gitignore
git commit -q -m "Stop tracking build output"
git ls-files
ls dist
git check-ignore -v dist/bundle.js`,
    output: `$ git ls-files
app.txt
dist/bundle.js

$ echo "dist/" >> .gitignore

$ git rm -r --cached dist
rm 'dist/bundle.js'

$ git add .gitignore

$ git commit -q -m "Stop tracking build output"

$ git ls-files
.gitignore
app.txt

$ ls dist
bundle.js

$ git check-ignore -v dist/bundle.js
.gitignore:1:dist/	dist/bundle.js`,
  },
  {
    q: "How do you compare two branches?",
    level: 'Basics',
    a: "git log main..feature lists the commits that are on feature but not on main, which is what a pull request would bring in. For file changes, git diff main...feature (three dots) compares feature with the point where it branched off, so it shows only my work; two dots compares the two branch tips directly, so main's new commits show up reversed. I usually start with --stat or --name-only to get an overview before reading the full diff.",
    code: `git log --oneline main..feature    # commits only on feature
git diff --stat main...feature     # only the feature's changes
git diff --stat main..feature      # tip vs tip, includes main's new work
git diff main...feature -- search.txt`,
    output: `$ git log --oneline main..feature
848de79 Add filters
430a6f5 Add search

$ git diff --stat main...feature
 filter.txt | 1 +
 search.txt | 1 +
 2 files changed, 2 insertions(+)

$ git diff --stat main..feature
 filter.txt | 1 +
 hotfix.txt | 1 -
 search.txt | 1 +
 3 files changed, 2 insertions(+), 1 deletion(-)

$ git diff main...feature -- search.txt
diff --git a/search.txt b/search.txt
new file mode 100644
index 0000000..c2f79de
--- /dev/null
+++ b/search.txt
@@ -0,0 +1 @@
+search box`,
  },
  {
    q: "How do you list, rename and remove remotes, and check tracking branches?",
    level: 'Basics',
    a: "git remote -v lists remotes with their fetch and push URLs; git remote rename, set-url and remove manage them, for example after a repository moves to a new organization. Renaming a remote also updates the branches that track it. git branch -vv and git status -sb show which remote branch each local branch tracks and how far ahead or behind it is, which I check before pushing.",
    code: `git remote -v
git remote rename origin github
git remote set-url github https://github.com/dev/app.git
git remote add backup ../backup.git
git remote -v
git remote remove backup
git branch -vv
git status -sb`,
    output: `$ git remote -v
origin	../origin.git (fetch)
origin	../origin.git (push)

$ git remote rename origin github

$ git remote set-url github https://github.com/dev/app.git

$ git remote add backup ../backup.git

$ git remote -v
backup	../backup.git (fetch)
backup	../backup.git (push)
github	https://github.com/dev/app.git (fetch)
github	https://github.com/dev/app.git (push)

$ git remote remove backup

$ git branch -vv
* main b1fc101 [github/main: ahead 1] Add login

$ git status -sb
## main...github/main [ahead 1]`,
  },
  {
    q: "What is the difference between a fast-forward merge and a three-way merge?",
    level: 'Intermediate',
    a: "If main has no new commits since I branched, Git just moves the main pointer forward: that is a fast-forward, with no merge commit. If both branches have new commits, Git does a three-way merge using the common ancestor and creates a merge commit with two parents. I use --no-ff when I want a merge commit to record that a feature branch existed.",
    code: `# 1) main has not moved -> fast-forward
git merge feature-a
# 2) main and feature-b both moved -> three-way merge
echo "fix" > fix.txt && git add . && git commit -q -m "Hotfix on main"
git merge feature-b -m "Merge branch 'feature-b'"
git log --oneline --graph`,
    output: `$ git merge feature-a
Updating 4b4ae9b..8b55e48
Fast-forward
 a.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt

$ echo "fix" > fix.txt && git add . && git commit -q -m "Hotfix on main"

$ git merge feature-b -m "Merge branch 'feature-b'"
Merge made by the 'ort' strategy.
 b.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 b.txt

$ git log --oneline --graph
*   822094e Merge branch 'feature-b'
|\\
| * 8452bfc Add feature B
* | cfd2229 Hotfix on main
* | 8b55e48 Add feature A
|/
* 4b4ae9b Initial commit`,
  },
  {
    q: "What is a merge conflict and how do you resolve it?",
    level: 'Intermediate',
    a: "A conflict happens when two branches change the same lines and Git cannot decide which version wins. Git stops, marks the file with <<<<<<<, ======= and >>>>>>> markers, and I edit the file to the correct final content, then git add and commit. I talk to the other author if I am unsure, and I can always back out with git merge --abort.",
    code: `git merge feature
git status --short
cat config.txt                 # conflict markers
# Fix the file, then mark it resolved
echo 'greeting = "Hi there"' > config.txt
git add config.txt
git commit --no-edit
git log --oneline --graph`,
    output: `$ git merge feature
Auto-merging config.txt
CONFLICT (content): Merge conflict in config.txt
Automatic merge failed; fix conflicts and then commit the result.

$ git status --short
UU config.txt

$ cat config.txt
<<<<<<< HEAD
greeting = "Hello there"
=======
greeting = "Hi"
>>>>>>> feature

$ echo 'greeting = "Hi there"' > config.txt

$ git add config.txt

$ git commit --no-edit
[main ad8ec5f] Merge branch 'feature'

$ git log --oneline --graph
*   ad8ec5f Merge branch 'feature'
|\\
| * 7498c9d Use short greeting
* | a7d5c2e Make greeting friendlier
|/
* dc33bef Add config`,
  },
  {
    q: "What is git rebase?",
    level: 'Intermediate',
    a: "Rebase takes my branch's commits and replays them on top of another branch, as if I had started from there. The result is a straight, linear history without a merge commit, but the replayed commits get new hashes. I rebase my own feature branch on main before opening a PR so it is up to date and easy to review.",
    code: `git log --oneline --graph --all
git switch feature
git rebase main
# Same commits, new hashes, now on top of main
git log --oneline --graph --all`,
    output: `$ git log --oneline --graph --all
* 0bdd21c Add filters
* a755f5d Add search
| * 08baf4f Fix header
|/
* 4b4ae9b Initial commit

$ git switch feature
Switched to branch 'feature'

$ git rebase main
Rebasing (1/2)
Rebasing (2/2)
Successfully rebased and updated refs/heads/feature.

$ git log --oneline --graph --all
* 1c2b6a6 Add filters
* 907c264 Add search
* 08baf4f Fix header
* 4b4ae9b Initial commit`,
  },
  {
    q: "Merge vs rebase: which one do you use and when?",
    level: 'Intermediate',
    a: "Merge keeps the true history and adds a merge commit; it never rewrites commits, so it is safe for shared branches. Rebase rewrites my commits to give a clean linear history. My rule: rebase my local, unpushed feature branch to keep it updated, and merge (or squash-merge through the PR) into main; I never rebase a branch others are working on.",
    code: `# Option 1: merge -> keeps a merge commit
git switch -q -c merge-demo feature
git merge -q main -m "Merge main into feature"
git log --oneline --graph
# Option 2: rebase -> linear history
git switch -q -c rebase-demo feature
git rebase -q main
git log --oneline --graph`,
    output: `$ git switch -q -c merge-demo feature

$ git merge -q main -m "Merge main into feature"

$ git log --oneline --graph
*   ad43951 Merge main into feature
|\\
| * 08baf4f Fix header
* | a755f5d Add search
|/
* 4b4ae9b Initial commit

$ git switch -q -c rebase-demo feature

$ git rebase -q main

$ git log --oneline --graph
* 907c264 Add search
* 08baf4f Fix header
* 4b4ae9b Initial commit`,
  },
  {
    q: "What is interactive rebase and how do you squash commits with it?",
    level: 'Intermediate',
    a: "git rebase -i HEAD~n opens a todo list where I can reorder, reword, drop, squash or fixup commits. I use it to clean up messy 'wip' commits into one meaningful commit before a PR. Normally an editor opens; here I script the edit with GIT_SEQUENCE_EDITOR, turning every 'pick' after the first into 'fixup'.",
    code: `git log --oneline
# Normally: git rebase -i HEAD~3, then change pick -> fixup
GIT_SEQUENCE_EDITOR="sed -i.bak '2,\\$ s/^pick/fixup/'" git rebase -i HEAD~3
git log --oneline
git show --stat --format="%s" HEAD`,
    output: `$ git log --oneline
b58dae8 fix typo
e5ba99e wip
6285710 Add login form
4b4ae9b Initial commit

$ GIT_SEQUENCE_EDITOR="sed -i.bak '2,\\$ s/^pick/fixup/'" git rebase -i HEAD~3
Rebasing (2/3)
Rebasing (3/3)
Successfully rebased and updated refs/heads/main.

$ git log --oneline
b5715f3 Add login form
4b4ae9b Initial commit

$ git show --stat --format="%s" HEAD
Add login form

 login.txt | 1 +
 1 file changed, 1 insertion(+)`,
  },
  {
    q: "How else can you squash several commits into one?",
    level: 'Intermediate',
    a: "A simple way is git reset --soft to an earlier commit: the commits are removed but all their changes stay staged, so one new commit contains everything. It does the same as an interactive squash without an editor. On GitHub I can also choose 'Squash and merge' when merging the PR.",
    code: `git log --oneline
git reset --soft HEAD~3      # undo 3 commits, keep changes staged
git status --short
git commit -m "Add login page with validation"
git log --oneline`,
    output: `$ git log --oneline
a864090 fix typo
b8f5c88 wip
6285710 Add login form
4b4ae9b Initial commit

$ git reset --soft HEAD~3

$ git status --short
A  login.txt
A  validate.txt

$ git commit -m "Add login page with validation"
[main 61ba842] Add login page with validation
 2 files changed, 2 insertions(+)
 create mode 100644 login.txt
 create mode 100644 validate.txt

$ git log --oneline
61ba842 Add login page with validation
4b4ae9b Initial commit`,
  },
  {
    q: "How do you use git stash?",
    level: 'Intermediate',
    a: "git stash saves my uncommitted changes and gives me a clean working directory, which is handy when I must switch branches for an urgent fix. git stash list shows saved stashes, git stash pop re-applies the latest one and removes it, and git stash apply re-applies but keeps it in the list. I add a message with -m so I remember what each stash is.",
    code: `echo "half done" > app.txt
git stash push -m "login work in progress"
git status --short          # clean now
git stash list
git stash apply             # re-apply, keep the stash
git stash list
git checkout -- app.txt
git stash pop               # re-apply and drop it
git stash list`,
    output: `$ echo "half done" > app.txt

$ git stash push -m "login work in progress"
Saved working directory and index state On main: login work in progress

$ git status --short

$ git stash list
stash@{0}: On main: login work in progress

$ git stash apply
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   app.txt

no changes added to commit (use "git add" and/or "git commit -a")

$ git stash list
stash@{0}: On main: login work in progress

$ git checkout -- app.txt

$ git stash pop
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   app.txt

no changes added to commit (use "git add" and/or "git commit -a")
Dropped refs/stash@{0} (3ce90a9f14c6ea43e1b12847f8b0eb91fa8403c1)

$ git stash list`,
  },
  {
    q: "Explain git reset --soft, --mixed and --hard.",
    level: 'Intermediate',
    a: "All three move the branch pointer back to a commit; they differ in what happens to the changes. --soft keeps them staged, --mixed (the default) keeps them in the working directory but unstaged, and --hard throws them away completely. I treat --hard with care and check git status first, because uncommitted work is lost.",
    code: `git reset --soft HEAD~1
git status --short           # change is staged
git commit -q -m "Add feature"
git reset --mixed HEAD~1
git status --short           # change is unstaged
git commit -qam "Add feature"
git reset --hard HEAD~1
git status --short           # nothing left
git log --oneline`,
    output: `$ git reset --soft HEAD~1

$ git status --short
M  app.txt

$ git commit -q -m "Add feature"

$ git reset --mixed HEAD~1
Unstaged changes after reset:
M	app.txt

$ git status --short
 M app.txt

$ git commit -qam "Add feature"

$ git reset --hard HEAD~1
HEAD is now at 4b4ae9b Initial commit

$ git status --short

$ git log --oneline
4b4ae9b Initial commit`,
  },
  {
    q: "What is the difference between git revert and git reset?",
    level: 'Intermediate',
    a: "git reset moves the branch back and removes commits from history, so it is fine for local work but dangerous on pushed branches. git revert creates a new commit that undoes an older commit, keeping history intact. On shared branches like main I always use revert.",
    code: `git log --oneline
# Safe on shared branches: add an "undo" commit
git revert --no-edit HEAD~1
git log --oneline
cat price.txt`,
    output: `$ git log --oneline
01f4971 Add sale banner
92ee6fa Bug: set price to zero
af7f724 Add price
4b4ae9b Initial commit

$ git revert --no-edit HEAD~1
[main 2467701] Revert "Bug: set price to zero"
 Date: Thu Jan 1 10:00:00 2026 +0000
 1 file changed, 1 insertion(+), 1 deletion(-)

$ git log --oneline
2467701 Revert "Bug: set price to zero"
01f4971 Add sale banner
92ee6fa Bug: set price to zero
af7f724 Add price
4b4ae9b Initial commit

$ cat price.txt
price = 10`,
  },
  {
    q: "How do you undo the last commit?",
    level: 'Intermediate',
    a: "If it is not pushed, I use git reset --soft HEAD~1 to undo the commit but keep the changes staged, so I can fix and recommit. If I also want to throw the changes away, I use reset --hard. If it is already pushed, I use git revert HEAD instead so I don't rewrite shared history.",
    code: `git log --oneline
git reset --soft HEAD~1      # undo commit, keep changes
git log --oneline
git status --short`,
    output: `$ git log --oneline
d2a19d0 Add notes by mistake
4b4ae9b Initial commit

$ git reset --soft HEAD~1

$ git log --oneline
4b4ae9b Initial commit

$ git status --short
A  secret-notes.txt`,
  },
  {
    q: "How do you amend the last commit?",
    level: 'Intermediate',
    a: "git commit --amend replaces the last commit with a new one, so I can fix the message or add a file I forgot. --no-edit keeps the old message. Amending changes the commit hash, so I only amend commits that are not pushed yet (or I force-push with --force-with-lease on my own branch).",
    code: `git log --oneline
git commit --amend -m "Add login page"   # fix the message
echo "tests" > login.test.js
git add login.test.js
git commit --amend --no-edit             # add a forgotten file
git show --stat --format="%h %s" HEAD`,
    output: `$ git log --oneline
1e70a0c Add lgoin pgae
4b4ae9b Initial commit

$ git commit --amend -m "Add login page"
[main 01a252f] Add login page
 Date: Thu Jan 1 10:00:00 2026 +0000
 1 file changed, 1 insertion(+)
 create mode 100644 login.js

$ echo "tests" > login.test.js

$ git add login.test.js

$ git commit --amend --no-edit
[main 324a8d9] Add login page
 Date: Thu Jan 1 10:00:00 2026 +0000
 2 files changed, 2 insertions(+)
 create mode 100644 login.js
 create mode 100644 login.test.js

$ git show --stat --format="%h %s" HEAD
324a8d9 Add login page

 login.js      | 1 +
 login.test.js | 1 +
 2 files changed, 2 insertions(+)`,
  },
  {
    q: "What is git cherry-pick?",
    level: 'Intermediate',
    a: "cherry-pick copies one specific commit from another branch and applies it onto my current branch as a new commit. I use it to bring a bug fix from a feature branch into a release branch without merging everything else. I prefer -x so the message records which commit it came from.",
    code: `git log --oneline feature
git switch main
git cherry-pick -x 7907eaa
git log --oneline
git log -1 --format=%B`,
    output: `$ git log --oneline feature
9a1ca94 WIP: new checkout design
7907eaa Fix crash on empty cart
4b4ae9b Initial commit

$ git switch main
Switched to branch 'main'

$ git cherry-pick -x 7907eaa
[main 293de7e] Fix crash on empty cart
 Date: Thu Jan 1 10:00:00 2026 +0000
 1 file changed, 1 insertion(+)
 create mode 100644 bugfix.txt

$ git log --oneline
293de7e Fix crash on empty cart
4b4ae9b Initial commit

$ git log -1 --format=%B
Fix crash on empty cart

(cherry picked from commit 7907eaa80c8a6515814e23b2d118a010050dd8e9)`,
  },
  {
    q: "What are tags and what is the difference between lightweight and annotated tags?",
    level: 'Intermediate',
    a: "Tags mark specific commits, usually releases like v1.0.0. A lightweight tag is just a name pointing to a commit; an annotated tag is a full object with tagger, date and message, and can be signed. I use annotated tags for releases and push them with git push origin v1.1.0 or --tags.",
    code: `git tag v1.0.0                              # lightweight
git tag -a v1.1.0 -m "Release 1.1.0"        # annotated
git tag -n
git cat-file -t v1.0.0                      # points straight to a commit
git cat-file -t v1.1.0                      # its own tag object
git show v1.1.0 --no-patch`,
    output: `$ git tag v1.0.0

$ git tag -a v1.1.0 -m "Release 1.1.0"

$ git tag -n
v1.0.0          Add dark mode
v1.1.0          Release 1.1.0

$ git cat-file -t v1.0.0
commit

$ git cat-file -t v1.1.0
tag

$ git show v1.1.0 --no-patch
tag v1.1.0
Tagger: Dev <dev@example.com>
Date:   Thu Jan 1 10:00:00 2026 +0000

Release 1.1.0

commit b251c2e3b3f663ee74952da7b4c9fc0e3d059f4a
Author: Dev <dev@example.com>
Date:   Thu Jan 1 10:00:00 2026 +0000

    Add dark mode`,
  },
  {
    q: "What does git blame do?",
    level: 'Intermediate',
    a: "git blame shows, line by line, which commit and author last changed each line of a file. I use it to find context for a strange line, then git show that commit to read why it was changed, not to blame people. -L limits it to a range of lines.",
    code: `git blame config.py
# Only lines 2-3
git blame -L 2,3 config.py`,
    output: `$ git blame config.py
^f71a02c (Dev   2026-01-01 10:00:00 +0000 1) DEBUG = False
e9c5e275 (Alice 2026-01-01 10:00:00 +0000 2) TIMEOUT = 60
e9c5e275 (Alice 2026-01-01 10:00:00 +0000 3) RETRIES = 3

$ git blame -L 2,3 config.py
e9c5e275 (Alice 2026-01-01 10:00:00 +0000 2) TIMEOUT = 60
e9c5e275 (Alice 2026-01-01 10:00:00 +0000 3) RETRIES = 3`,
  },
  {
    q: "How do you search the commit history?",
    level: 'Intermediate',
    a: "git log --grep searches commit messages, --author filters by author, and -S (the 'pickaxe') finds commits that added or removed a given string in the code. -S is my favorite for finding when a function or config value appeared or disappeared. I combine them with --oneline to keep it short.",
    code: `git log --oneline --grep="login"        # in messages
git log --oneline --author="Alice"      # by author
git log --oneline -S "MAX_RETRIES"      # code added/removed`,
    output: `$ git log --oneline --grep="login"
0d08c5e Fix login retry
2d2f411 Add login

$ git log --oneline --author="Alice"
75427fa Add retry setting

$ git log --oneline -S "MAX_RETRIES"
f5aa72a Rename setting
75427fa Add retry setting`,
  },
  {
    q: "What does git show do?",
    level: 'Intermediate',
    a: "git show displays an object; for a commit it shows the metadata and the full diff. I use git show <hash> to review a single commit, --stat for just the changed files, and git show <ref>:<path> to print a file as it was in an older commit without checking it out.",
    code: `git show HEAD
git show --stat --oneline HEAD
# File content at the previous commit
git show HEAD~1:app.txt`,
    output: `$ git show HEAD
commit 6cda5ba9c8109f84b0645b5184b0a80ed2efa958
Author: Dev <dev@example.com>
Date:   Thu Jan 1 10:00:00 2026 +0000

    Bump to version 2

diff --git a/app.txt b/app.txt
index 83baae6..1f7a7a4 100644
--- a/app.txt
+++ b/app.txt
@@ -1 +1 @@
-version 1
+version 2

$ git show --stat --oneline HEAD
6cda5ba Bump to version 2
 app.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)

$ git show HEAD~1:app.txt
version 1`,
  },
  {
    q: "How do you stash untracked files and use named stashes?",
    level: 'Intermediate',
    a: "By default git stash only saves changes to tracked files, so a new file stays behind; git stash push -u includes untracked files too. I always give a stash a message with -m, then pick a specific one from git stash list with stash@{n}. apply keeps the stash in the list and drop deletes it, so I apply first and drop only when everything looks right.",
    code: `echo "version 2" > app.txt              # change to a tracked file
echo "draft" > todo.txt                 # new, untracked file
git stash push -m "wip: header"
git status --short                      # todo.txt was left behind
git stash push -u -m "wip: todo notes"  # -u includes untracked files
git stash list
git stash show --include-untracked --stat stash@{0}
git stash apply stash@{1}
git stash drop stash@{1}
git status --short
git stash list`,
    output: `$ echo "version 2" > app.txt

$ echo "draft" > todo.txt

$ git stash push -m "wip: header"
Saved working directory and index state On main: wip: header

$ git status --short
?? todo.txt

$ git stash push -u -m "wip: todo notes"
Saved working directory and index state On main: wip: todo notes

$ git stash list
stash@{0}: On main: wip: todo notes
stash@{1}: On main: wip: header

$ git stash show --include-untracked --stat stash@{0}
 todo.txt | 1 +
 1 file changed, 1 insertion(+)

$ git stash apply stash@{1}
On branch main
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   app.txt

no changes added to commit (use "git add" and/or "git commit -a")

$ git stash drop stash@{1}
Dropped stash@{1} (6b752a472f546c93b147cf19a072e59639f8d6d6)

$ git status --short
 M app.txt

$ git stash list
stash@{0}: On main: wip: todo notes`,
  },
  {
    q: "How do you restore a file from an older commit or another branch?",
    level: 'Intermediate',
    a: "First I find the commit with git log -- <file> and look at the old content with git show <commit>:<file>, which changes nothing. Then git restore --source=<commit> <file> puts that version back in my working directory, and I commit it like any other change. The same works with a branch name as the source, which is handy to grab one file from another branch without merging it.",
    code: `git log --oneline -- price.txt
git show HEAD~2:price.txt                # view only
git restore --source=HEAD~2 price.txt    # bring the old version back
cat price.txt
git restore --source=feature -- theme.css
git status --short`,
    output: `$ git log --oneline -- price.txt
2bca403 Bug: price set to zero
5e67f76 Raise price
af7f724 Add price

$ git show HEAD~2:price.txt
price = 10

$ git restore --source=HEAD~2 price.txt

$ cat price.txt
price = 10

$ git restore --source=feature -- theme.css

$ git status --short
 M price.txt
?? theme.css`,
  },
  {
    q: "How do you see a file's history across renames (git log --follow)?",
    level: 'Intermediate',
    a: "git log -- <path> only shows commits that touched that exact path, so a file's history seems to start at the commit where it was renamed. --follow tells Git to detect renames and keep going back through the old name. I also add --name-status so I can see the R (rename) entry and the old file name.",
    code: `git log --oneline -- helpers.js             # stops at the rename
git log --oneline --follow -- helpers.js    # follows the old name
git log --follow --name-status --format="%h %s" -- helpers.js`,
    output: `$ git log --oneline -- helpers.js
0d7f4cf Add sq
db11b78 Rename utils to helpers

$ git log --oneline --follow -- helpers.js
0d7f4cf Add sq
db11b78 Rename utils to helpers
70fd774 Add div
ee56dd5 Add math utils

$ git log --follow --name-status --format="%h %s" -- helpers.js
0d7f4cf Add sq

M	helpers.js
db11b78 Rename utils to helpers

R100	utils.js	helpers.js
70fd774 Add div

M	utils.js
ee56dd5 Add math utils

A	utils.js`,
  },
  {
    q: "How do you cherry-pick a range of commits?",
    level: 'Intermediate',
    a: "git cherry-pick A..B applies every commit after A up to and including B, so A itself is excluded; to include A I write A^..B. The commits are applied one by one, and if one conflicts I fix it and run git cherry-pick --continue, or --abort to go back. I use this to backport a small series of fixes to a release branch while leaving work-in-progress commits behind.",
    code: `git log --oneline main..feature
# A^..B includes A itself
git cherry-pick 962762f^..07edb24
git log --oneline    # copies with new hashes, WIP left behind`,
    output: `$ git log --oneline main..feature
8ef80af WIP: new checkout
07edb24 Fix footer link
2cfa6aa Fix cart total rounding
962762f Fix login redirect

$ git cherry-pick 962762f^..07edb24
[main 377dff1] Fix login redirect
 Date: Thu Jan 1 10:00:00 2026 +0000
 1 file changed, 1 insertion(+)
 create mode 100644 a.txt
[main 129d377] Fix cart total rounding
 Date: Thu Jan 1 10:00:00 2026 +0000
 1 file changed, 1 insertion(+)
 create mode 100644 b.txt
[main 55cdde8] Fix footer link
 Date: Thu Jan 1 10:00:00 2026 +0000
 1 file changed, 1 insertion(+)
 create mode 100644 c.txt

$ git log --oneline
55cdde8 Fix footer link
129d377 Fix cart total rounding
377dff1 Fix login redirect
0d94f37 Prepare release 1.4
4b4ae9b Initial commit`,
  },
  {
    q: "How do you revert a merge commit?",
    level: 'Intermediate',
    a: "A merge commit has two parents, so git revert needs -m to know which side is the mainline; -m 1 means keep the first parent (main) and undo what the merged branch brought in. It creates a new commit, so it is safe on a shared branch. The catch is that Git now thinks the branch is already merged, so to bring the work back later I revert the revert instead of merging again.",
    code: `git log --oneline --graph
git revert -m 1 --no-edit HEAD    # keep parent 1 (main)
git log --oneline -3
ls`,
    output: `$ git log --oneline --graph
*   703aa50 Merge branch 'feature'
|\\
| * 0bdd21c Add filters
| * a755f5d Add search
* | a0219fd Hotfix on main
|/
* 4b4ae9b Initial commit

$ git revert -m 1 --no-edit HEAD
[main 6be0f6c] Revert "Merge branch 'feature'"
 Date: Thu Jan 1 10:00:00 2026 +0000
 2 files changed, 2 deletions(-)
 delete mode 100644 filter.txt
 delete mode 100644 search.txt

$ git log --oneline -3
6be0f6c Revert "Merge branch 'feature'"
703aa50 Merge branch 'feature'
a0219fd Hotfix on main

$ ls
app.txt
hotfix.txt`,
  },
  {
    q: "What does a release workflow with tags look like?",
    level: 'Intermediate',
    a: "I follow semantic versioning: MAJOR for breaking changes, MINOR for new features, PATCH for fixes. Before a release I list what changed since the last tag with git log v1.0.0..HEAD, create an annotated tag and push that tag, which usually triggers the CI release job. git describe --tags is handy in builds because it tells me how many commits I am past the last release.",
    code: `git describe --tags
git log --oneline v1.0.0..HEAD      # what goes into the release
git tag -a v1.1.0 -m "Release 1.1.0"
git describe --tags
git push -q origin v1.1.0
git ls-remote --tags origin`,
    output: `$ git describe --tags
v1.0.0-2-gef1036e

$ git log --oneline v1.0.0..HEAD
ef1036e fix: cart total rounding
e10e2b6 feat: add search

$ git tag -a v1.1.0 -m "Release 1.1.0"

$ git describe --tags
v1.1.0

$ git push -q origin v1.1.0

$ git ls-remote --tags origin
00f8c41d056ebf6e791a43366bc58aafb70fd62d	refs/tags/v1.0.0
4b4ae9be9c41c15a6cce39038e4f7c369abd1590	refs/tags/v1.0.0^{}
1d1a8c81925f93fb22dbac43e7f29f7f1f2656da	refs/tags/v1.1.0
ef1036e33bf20830375845c284603fa057e6d195	refs/tags/v1.1.0^{}`,
  },
  {
    q: "What is git reflog and how do you recover a deleted branch or commit?",
    level: 'Advanced',
    a: "The reflog is a local log of every position HEAD and branches have pointed to, including commits that no branch points to anymore. If I delete a branch or do a bad reset --hard, I find the old hash in git reflog and create a branch at it. Entries are kept for about 90 days, so lost work is almost never really lost.",
    code: `git branch -D feature            # oops, unmerged work deleted
git reflog -4
# The lost commit is still there: recreate the branch
git branch feature 79d1dc2
git log --oneline feature`,
    output: `$ git branch -D feature
Deleted branch feature (was 79d1dc2).

$ git reflog -4
4b4ae9b HEAD@{0}: checkout: moving from feature to main
79d1dc2 HEAD@{1}: commit: Add payment integration
4b4ae9b HEAD@{2}: checkout: moving from main to feature
4b4ae9b HEAD@{3}: commit (initial): Initial commit

$ git branch feature 79d1dc2

$ git log --oneline feature
79d1dc2 Add payment integration
4b4ae9b Initial commit`,
  },
  {
    q: "What is a detached HEAD?",
    level: 'Advanced',
    a: "Detached HEAD means HEAD points straight to a commit instead of a branch, for example after checking out a tag or an old hash. I can look around and even commit, but those commits belong to no branch and can be lost when I switch away. If I want to keep them, I create a branch with git switch -c.",
    code: `git switch --detach HEAD~1
git status | head -1
echo "experiment" > test.txt
git add . && git commit -q -m "Experiment"
# Keep the work by giving it a branch
git switch -c experiment
git log --oneline --graph --all`,
    output: `$ git switch --detach HEAD~1
HEAD is now at 4b4ae9b Initial commit

$ git status | head -1
HEAD detached at 4b4ae9b

$ echo "experiment" > test.txt

$ git add . && git commit -q -m "Experiment"

$ git switch -c experiment
Switched to a new branch 'experiment'

$ git log --oneline --graph --all
* 98e678b Experiment
| * b1fc101 Add login
|/
* 4b4ae9b Initial commit`,
  },
  {
    q: "How does git bisect help find a bug?",
    level: 'Advanced',
    a: "git bisect does a binary search through history: I mark one good and one bad commit, and Git checks out the middle commit for me to test. With git bisect run and a test script that exits 0 for good and non-zero for bad, it finds the first bad commit automatically. Even across 1000 commits it needs only about 10 steps.",
    code: `cat test.sh                       # exit 0 = good, 1 = bad
git bisect start HEAD HEAD~7      # bad, good
git bisect run sh test.sh
git bisect reset`,
    output: `$ cat test.sh
total=$(cat price.txt)
[ "$total" -gt 0 ]

$ git bisect start HEAD HEAD~7
Bisecting: 3 revisions left to test after this (roughly 2 steps)
[6373509eb0e4c1bc068d410d31f20d59b8524138] Add logo

$ git bisect run sh test.sh
running 'sh' 'test.sh'
Bisecting: 1 revision left to test after this (roughly 1 step)
[cd93355606e8e1a79badd853d25c3656da914ec3] Add footer
running 'sh' 'test.sh'
Bisecting: 0 revisions left to test after this (roughly 0 steps)
[e8c3f545a1ef060698aad8565b80425d73e92783] Refactor pricing
running 'sh' 'test.sh'
e8c3f545a1ef060698aad8565b80425d73e92783 is the first bad commit
commit e8c3f545a1ef060698aad8565b80425d73e92783
Author: Dev <dev@example.com>
Date:   Thu Jan 1 10:00:00 2026 +0000

    Refactor pricing

 price.txt | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
bisect found first bad commit

$ git bisect reset
Previous HEAD position was e8c3f54 Refactor pricing
Switched to branch 'main'`,
  },
  {
    q: "What branching strategies do you know (Git Flow, GitHub Flow, trunk-based)?",
    level: 'Advanced',
    a: "Git Flow uses long-lived main and develop branches plus feature, release and hotfix branches; it suits products with planned versioned releases but is heavy. GitHub Flow keeps only main plus short-lived feature branches merged through pull requests and deployed often. Trunk-based development has everyone merge small changes into main at least daily, using feature flags to hide unfinished work; most teams with good CI that I have seen prefer GitHub Flow or trunk-based.",
    code: `# Git Flow
main, develop, feature/*, release/*, hotfix/*

# GitHub Flow
main + short-lived feature branches -> PR -> merge -> deploy

# Trunk-based
everyone commits small changes to main (or 1-day branches)
unfinished work hidden behind feature flags`,
    output: `Strategy     | Long-lived branches | Best for
-------------|---------------------|-----------------------------
Git Flow     | main + develop      | versioned, scheduled releases
GitHub Flow  | main only           | web apps, continuous deploy
Trunk-based  | main only           | fast CI/CD, large teams

Git Flow:     feature -> develop -> release -> main (+ tag)
GitHub Flow:  feature -> PR + review -> main -> deploy
Trunk-based:  tiny commits -> main many times a day`,
  },
  {
    q: "What is your pull request and code review workflow?",
    level: 'Advanced',
    a: "I create a feature branch from an up-to-date main, make small focused commits, and push it with -u. Then I open a pull request on GitHub, CI runs, and teammates review; I address comments with new commits on the same branch. After approval it is merged (often squash-merged) and I delete the branch and pull main.",
    code: `git switch main && git pull -q
git switch -c feature/add-search
echo "search" > search.js
git add . && git commit -q -m "feat: add product search"
git push -u origin feature/add-search
# ...open PR on GitHub, review, merge...
# After merge: clean up locally
git switch -q main
git branch -D feature/add-search`,
    output: `$ git switch main && git pull -q
Already on 'main'
Your branch is up to date with 'origin/main'.

$ git switch -c feature/add-search
Switched to a new branch 'feature/add-search'

$ echo "search" > search.js

$ git add . && git commit -q -m "feat: add product search"

$ git push -u origin feature/add-search
To /home/dev/origin.git
 * [new branch]      feature/add-search -> feature/add-search
branch 'feature/add-search' set up to track 'origin/feature/add-search'.

$ git switch -q main

$ git branch -D feature/add-search
Deleted branch feature/add-search (was 9454c4b).`,
  },
  {
    q: "What are good commit message conventions (Conventional Commits)?",
    level: 'Advanced',
    a: "A good message has a short imperative subject (under ~50 characters), a blank line, and a body explaining why. Conventional Commits adds a type prefix like feat, fix, docs, refactor, test or chore, an optional scope, and '!' or BREAKING CHANGE for breaking changes. It makes history easy to scan and lets tools generate changelogs and version bumps automatically.",
    code: `git commit -q --allow-empty -m "feat(cart): add discount codes"
git commit -q --allow-empty -m "fix(auth): handle expired tokens"
git commit -q --allow-empty -m "docs: update setup guide"
git commit -q --allow-empty -m "feat(api)!: remove v1 endpoints" -m "BREAKING CHANGE: clients must use /v2."
git log --format="%s"
git log --oneline --grep="^fix"`,
    output: `$ git commit -q --allow-empty -m "feat(cart): add discount codes"

$ git commit -q --allow-empty -m "fix(auth): handle expired tokens"

$ git commit -q --allow-empty -m "docs: update setup guide"

$ git commit -q --allow-empty -m "feat(api)!: remove v1 endpoints" -m "BREAKING CHANGE: clients must use /v2."

$ git log --format="%s"
feat(api)!: remove v1 endpoints
docs: update setup guide
fix(auth): handle expired tokens
feat(cart): add discount codes
Initial commit

$ git log --oneline --grep="^fix"
c6010d6 fix(auth): handle expired tokens`,
  },
  {
    q: "What are Git hooks? Give a pre-commit example.",
    level: 'Advanced',
    a: "Hooks are scripts in .git/hooks that Git runs at certain events, like pre-commit, commit-msg or pre-push; if the script exits non-zero, the action is stopped. I use a pre-commit hook to block things like debug statements or to run the linter. Because .git/hooks is not shared, teams usually use a tool like Husky or the pre-commit framework.",
    code: `cat .git/hooks/pre-commit
echo "console.log('debug')" > app.js
git add app.js
git commit -m "Add app"          # blocked by the hook
echo "export default {}" > app.js
git add app.js
git commit -m "Add app"          # passes`,
    output: `$ cat .git/hooks/pre-commit
#!/bin/sh
# Block commits that contain console.log
if git diff --cached | grep -q "console.log"; then
  echo "pre-commit: remove console.log before committing"
  exit 1
fi

$ echo "console.log('debug')" > app.js

$ git add app.js

$ git commit -m "Add app"
pre-commit: remove console.log before committing

$ echo "export default {}" > app.js

$ git add app.js

$ git commit -m "Add app"
[main 1205383] Add app
 1 file changed, 1 insertion(+)
 create mode 100644 app.js`,
  },
  {
    q: "What are Git submodules?",
    level: 'Advanced',
    a: "A submodule embeds another Git repository inside mine at a fixed commit, recorded in .gitmodules. It is useful for shared libraries, but teammates must run git submodule update --init (or clone with --recurse-submodules), and updating the pinned commit is an explicit step. Because of that friction, I usually prefer a package manager when possible.",
    code: `git submodule add ../ui-lib.git libs/ui
cat .gitmodules
git commit -q -m "Add ui-lib submodule"
git submodule status
# Teammates: git clone --recurse-submodules <url>`,
    output: `$ git submodule add ../ui-lib.git libs/ui
Cloning into '/home/dev/app/libs/ui'...
done.

$ cat .gitmodules
[submodule "libs/ui"]
	path = libs/ui
	url = ../ui-lib.git

$ git commit -q -m "Add ui-lib submodule"

$ git submodule status
 c9a3ae513068f6f3d86d5f949832e303d0091c50 libs/ui (heads/main)`,
  },
  {
    q: "What does git clean do?",
    level: 'Advanced',
    a: "git clean deletes untracked files that Git is not tracking, like build artifacts or temp files. It is permanent, so I always run git clean -n (dry run) first to see what would be removed. -d also removes untracked folders and -x includes ignored files.",
    code: `mkdir tmp
touch notes.tmp tmp/cache.bin debug.log
git clean -n -d        # dry run
git clean -f -d        # really delete
git clean -n -d -x     # -x: also ignored files
git clean -f -d -x
git status --short`,
    output: `$ mkdir tmp

$ touch notes.tmp tmp/cache.bin debug.log

$ git clean -n -d
Would remove notes.tmp
Would remove tmp/

$ git clean -f -d
Removing notes.tmp
Removing tmp/

$ git clean -n -d -x
Would remove debug.log

$ git clean -f -d -x
Removing debug.log

$ git status --short`,
  },
  {
    q: "How do you rewrite history safely (force push with --force-with-lease)?",
    level: 'Advanced',
    a: "After amending or rebasing a pushed branch, a normal push is rejected because history changed. git push --force overwrites the remote blindly and could delete a teammate's commits; --force-with-lease only overwrites if the remote is still where I last saw it. I only force-push my own feature branches, never main.",
    code: `git commit --amend -q -m "Add search (with tests)"
git push                       # rejected: history diverged
git push --force-with-lease    # safe overwrite
git log --oneline origin/feature`,
    output: `$ git commit --amend -q -m "Add search (with tests)"

$ git push
To /home/dev/origin.git
 ! [rejected]        feature -> feature (non-fast-forward)
error: failed to push some refs to '/home/dev/origin.git'
hint: Updates were rejected because the tip of your current branch is behind
hint: its remote counterpart. If you want to integrate the remote changes,
hint: use 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

$ git push --force-with-lease
To /home/dev/origin.git
 + ecd8a1f...261bcac feature -> feature (forced update)

$ git log --oneline origin/feature
261bcac Add search (with tests)
f856f38 Initial commit`,
  },
  {
    q: "How do you handle large files in Git (Git LFS)?",
    level: 'Advanced',
    a: "Git stores every version of every file, so big binaries like videos, PSDs or datasets make the repository huge and slow to clone. Git LFS replaces them in the repo with small pointer files and stores the real content on an LFS server. I run git lfs install once, then git lfs track \"*.psd\", which just writes a rule into .gitattributes that I commit.",
    code: `# git lfs track "*.psd" writes this rule into .gitattributes:
echo '*.psd filter=lfs diff=lfs merge=lfs -text' >> .gitattributes
cat .gitattributes
git check-attr filter diff merge text -- design.psd`,
    output: `$ echo '*.psd filter=lfs diff=lfs merge=lfs -text' >> .gitattributes

$ cat .gitattributes
*.psd filter=lfs diff=lfs merge=lfs -text

$ git check-attr filter diff merge text -- design.psd
design.psd: filter: lfs
design.psd: diff: lfs
design.psd: merge: lfs
design.psd: text: unset`,
  },
  {
    q: "What is .gitattributes used for?",
    level: 'Advanced',
    a: ".gitattributes sets per-path behaviour: line-ending normalization (text, eol=lf), marking files as binary so Git doesn't diff or merge them, custom diff and merge drivers, and LFS filters. I add '* text=auto' and 'eol=lf' for shell scripts so Windows and Mac developers don't fight over line endings.",
    code: `printf '* text=auto\\n*.sh text eol=lf\\n*.png binary\\n' > .gitattributes
cat .gitattributes
git check-attr -a deploy.sh
git check-attr -a logo.png`,
    output: `$ printf '* text=auto\\n*.sh text eol=lf\\n*.png binary\\n' > .gitattributes

$ cat .gitattributes
* text=auto
*.sh text eol=lf
*.png binary

$ git check-attr -a deploy.sh
deploy.sh: text: set
deploy.sh: eol: lf

$ git check-attr -a logo.png
logo.png: binary: set
logo.png: diff: unset
logo.png: merge: unset
logo.png: text: unset`,
  },
  {
    q: "How do you fix 'Your branch and origin/main have diverged'?",
    level: 'Advanced',
    a: "It means I have local commits and the remote also has commits I don't have. Since Git 2.27, a plain git pull refuses to guess and asks me to choose merge or rebase. For my own branch I usually run git pull --rebase to replay my commits on top, and I set pull.rebase=true so it is the default.",
    code: `git fetch -q
git status | head -3
git pull                    # Git asks how to reconcile
git pull --rebase
git log --oneline --graph`,
    output: `$ git fetch -q

$ git status | head -3
On branch main
Your branch and 'origin/main' have diverged,
and have 1 and 1 different commits each, respectively.

$ git pull
hint: You have divergent branches and need to specify how to reconcile them.
hint: You can do so by running one of the following commands sometime before
hint: your next pull:
hint:
hint:   git config pull.rebase false  # merge
hint:   git config pull.rebase true   # rebase
hint:   git config pull.ff only       # fast-forward only
hint:
hint: You can replace "git config" with "git config --global" to set a default
hint: preference for all repositories. You can also pass --rebase, --no-rebase,
hint: or --ff-only on the command line to override the configured default per
hint: invocation.
fatal: Need to specify how to reconcile divergent branches.

$ git pull --rebase
Rebasing (1/1)
Successfully rebased and updated refs/heads/main.

$ git log --oneline --graph
* a96791b Me: add UI
* 4f0ffab Teammate: add API
* f856f38 Initial commit`,
  },
  {
    q: "What do you do if you accidentally committed a secret (API key, password)?",
    level: 'Advanced',
    a: "First I treat the secret as leaked: I revoke or rotate it immediately, because once pushed it may already be copied. Then I stop tracking the file with git rm --cached and add it to .gitignore. Removing it in a new commit does not erase it from history, so if needed I rewrite history with git filter-repo or BFG and force-push, and tell the team to re-clone.",
    code: `git rm --cached .env           # stop tracking, keep local file
echo ".env" >> .gitignore
git add .gitignore
git commit -q -m "Stop tracking .env"
git status --short
# Still in history! Needs rotation + filter-repo/BFG
git log --oneline -- .env`,
    output: `$ git rm --cached .env
rm '.env'

$ echo ".env" >> .gitignore

$ git add .gitignore

$ git commit -q -m "Stop tracking .env"

$ git status --short

$ git log --oneline -- .env
b2cc016 Stop tracking .env
0f92377 Add config`,
  },
  {
    q: "How does Git store data internally (blobs, trees, commits)?",
    level: 'Advanced',
    a: "Git is a content-addressed key-value store: every object is named by the hash of its content. A blob holds a file's content, a tree is a folder listing names to blobs and other trees, and a commit points to one root tree, its parent commits, the author and the message. I can inspect any of them with git cat-file -t (type) and -p (pretty-print), and because names come from content, identical files are stored only once.",
    code: `echo "hello" > hello.txt
git hash-object hello.txt          # the blob id, from the content
git add hello.txt && git commit -q -m "Add hello"
git cat-file -t HEAD
git cat-file -p HEAD               # commit -> tree + parent
git cat-file -p HEAD^{tree}        # tree -> blobs
git cat-file -p HEAD:hello.txt     # blob -> content`,
    output: `$ echo "hello" > hello.txt

$ git hash-object hello.txt
ce013625030ba8dba906f756967f9e9ca394464a

$ git add hello.txt && git commit -q -m "Add hello"

$ git cat-file -t HEAD
commit

$ git cat-file -p HEAD
tree f6d2ad2e2cbc0b88932dc7ed06336f79d77a8c30
parent 4b4ae9be9c41c15a6cce39038e4f7c369abd1590
author Dev <dev@example.com> 1767261600 +0000
committer Dev <dev@example.com> 1767261600 +0000

Add hello

$ git cat-file -p HEAD^{tree}
100644 blob 83baae61804e65cc73a7201a7252750c76066a30	app.txt
100644 blob ce013625030ba8dba906f756967f9e9ca394464a	hello.txt

$ git cat-file -p HEAD:hello.txt
hello`,
  },
  {
    q: "What are packfiles and what does git gc do?",
    level: 'Advanced',
    a: "New objects are first stored as separate zlib-compressed 'loose' files under .git/objects. git gc packs them into a packfile, where similar versions are stored as deltas, and it removes unreachable objects that are older than the expiry time. Git runs gc automatically now and then, but git count-objects -v is a quick way to see how many loose objects and how much space the repo uses.",
    code: `git count-objects -v
git gc -q
git count-objects -v
ls .git/objects/pack`,
    output: `$ git count-objects -v
count: 33
size: 132
in-pack: 0
packs: 0
size-pack: 0
prune-packable: 0
garbage: 0
size-garbage: 0

$ git gc -q

$ git count-objects -v
count: 0
size: 0
in-pack: 33
packs: 1
size-pack: 4
prune-packable: 0
garbage: 0
size-garbage: 0

$ ls .git/objects/pack
pack-7bf4a63591af1b21b043fbcaa8c6699fc3b07da1.idx
pack-7bf4a63591af1b21b043fbcaa8c6699fc3b07da1.pack
pack-7bf4a63591af1b21b043fbcaa8c6699fc3b07da1.rev`,
  },
  {
    q: "What is git rerere?",
    level: 'Advanced',
    a: "rerere stands for 'reuse recorded resolution': when it is enabled, Git remembers how I resolved a conflict and applies the same fix automatically the next time that exact conflict appears; Git still pauses so I can check the file, then I just git add and commit. It is very useful when I rebase a long-lived branch again and again, or redo a merge. I still review the result and run the tests, because Git only replays the text, it doesn't know if it is still correct.",
    code: `git config rerere.enabled true
git merge feature                       # conflict
echo 'greeting = "Hello team"' > config.txt
git add config.txt
git commit -q --no-edit
# Undo the merge and do it again
git reset -q --hard HEAD~1
git merge feature                       # rerere reuses my fix
cat config.txt
git add config.txt
git commit -q --no-edit
git log --oneline -1`,
    output: `$ git config rerere.enabled true

$ git merge feature
Auto-merging config.txt
CONFLICT (content): Merge conflict in config.txt
Recorded preimage for 'config.txt'
Automatic merge failed; fix conflicts and then commit the result.

$ echo 'greeting = "Hello team"' > config.txt

$ git add config.txt

$ git commit -q --no-edit
Recorded resolution for 'config.txt'.

$ git reset -q --hard HEAD~1

$ git merge feature
Auto-merging config.txt
CONFLICT (content): Merge conflict in config.txt
Resolved 'config.txt' using previous resolution.
Automatic merge failed; fix conflicts and then commit the result.

$ cat config.txt
greeting = "Hello team"

$ git add config.txt

$ git commit -q --no-edit

$ git log --oneline -1
abff9c3 Merge branch 'feature'`,
  },
  {
    q: "What is git worktree and when do you use it?",
    level: 'Advanced',
    a: "git worktree lets one repository have several working directories, each with a different branch checked out at the same time. When an urgent hotfix comes in, I add a worktree for it instead of stashing my half-done feature, fix and commit there, then remove the worktree. All worktrees share the same .git data, so it is much lighter than a second clone, and Git won't let two worktrees check out the same branch.",
    code: `git worktree add -q ../hotfix -b hotfix/login
git worktree list
cd ../hotfix && echo "fix" > login.txt && git add . && git commit -q -m "Fix login"
cd ../app
git log --oneline -1 hotfix/login
git worktree remove ../hotfix
git worktree list`,
    output: `$ git worktree add -q ../hotfix -b hotfix/login

$ git worktree list
/home/dev/app    4b4ae9b [main]
/home/dev/hotfix 4b4ae9b [hotfix/login]

$ cd ../hotfix && echo "fix" > login.txt && git add . && git commit -q -m "Fix login"

$ cd ../app

$ git log --oneline -1 hotfix/login
7534a85 Fix login

$ git worktree remove ../hotfix

$ git worktree list
/home/dev/app 4b4ae9b [main]`,
  },
]
