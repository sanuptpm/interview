// Sub-topic order for the git page: related questions are shown together.
// Each question title appears in exactly one topic, in the order shown on the page.
export default [
  {
    topic: 'Git basics',
    questions: [
      'What is Git and what is version control?',
      'What is the difference between Git and GitHub?',
      'What is a Git repository?',
      'What is the difference between git init and git clone?',
      'What is HEAD in Git?',
      'How do you configure Git with git config (global vs local)?',
      'How do you create Git aliases?',
    ],
  },
  {
    topic: 'Staging & committing',
    questions: [
      'What are the three areas in Git (working directory, staging area, repository)?',
      'What do git add, git commit and git status do?',
      'What is .gitignore and how does it work?',
      'How do you rename, move or delete files with git mv and git rm?',
      'How do you stop tracking a file that is already committed?',
      'How do you amend the last commit?',
      'What are good commit message conventions (Conventional Commits)?',
    ],
  },
  {
    topic: 'History & inspection',
    questions: [
      'How do you view history with git log?',
      'What is the difference between git diff and git diff --staged?',
      'How do you compare two branches?',
      'What does git show do?',
      'What does git blame do?',
      'How do you search the commit history?',
      'How do you see a file\'s history across renames (git log --follow)?',
    ],
  },
  {
    topic: 'Branches',
    questions: [
      'How do you create, switch, list and delete branches?',
      'What is the difference between git checkout, git switch and git restore?',
      'What is a detached HEAD?',
    ],
  },
  {
    topic: 'Remotes',
    questions: [
      'What is a remote in Git?',
      'What do git push, git pull and git fetch do?',
      'What is the difference between git fetch and git pull?',
      'What are origin and upstream?',
      'How do you list, rename and remove remotes, and check tracking branches?',
    ],
  },
  {
    topic: 'Merging & rebasing',
    questions: [
      'What is the difference between a fast-forward merge and a three-way merge?',
      'What is a merge conflict and how do you resolve it?',
      'What is git rebase?',
      'Merge vs rebase: which one do you use and when?',
      'What is interactive rebase and how do you squash commits with it?',
      'How else can you squash several commits into one?',
      'How do you fix \'Your branch and origin/main have diverged\'?',
      'What is git rerere?',
    ],
  },
  {
    topic: 'Undoing changes',
    questions: [
      'How do you undo the last commit?',
      'Explain git reset --soft, --mixed and --hard.',
      'What is the difference between git revert and git reset?',
      'How do you restore a file from an older commit or another branch?',
      'How do you revert a merge commit?',
      'What is git reflog and how do you recover a deleted branch or commit?',
      'What does git clean do?',
      'How do you rewrite history safely (force push with --force-with-lease)?',
      'What do you do if you accidentally committed a secret (API key, password)?',
    ],
  },
  {
    topic: 'Stash, tags & cherry-pick',
    questions: [
      'How do you use git stash?',
      'How do you stash untracked files and use named stashes?',
      'What is git cherry-pick?',
      'How do you cherry-pick a range of commits?',
      'What are tags and what is the difference between lightweight and annotated tags?',
      'What does a release workflow with tags look like?',
    ],
  },
  {
    topic: 'Workflows & collaboration',
    questions: [
      'What branching strategies do you know (Git Flow, GitHub Flow, trunk-based)?',
      'What is your pull request and code review workflow?',
      'How does git bisect help find a bug?',
      'What are Git hooks? Give a pre-commit example.',
    ],
  },
  {
    topic: 'Internals & advanced',
    questions: [
      'How does Git store data internally (blobs, trees, commits)?',
      'What are packfiles and what does git gc do?',
      'What are Git submodules?',
      'How do you handle large files in Git (Git LFS)?',
      'What is .gitattributes used for?',
      'What is git worktree and when do you use it?',
    ],
  },
]
