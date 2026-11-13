// Checklist audit: for every commonly asked item, is there a question TITLE that covers it?
// (Only mentioned inside an answer counts as missing.) Run dump.py first.
// Usage: node scripts/gaps_css_db_git/audit.mjs
import { readFileSync } from 'node:fs'
const t = (p) => JSON.parse(readFileSync(new URL(`../topics/titles_${p}.json`, import.meta.url))).map((x) => x.title)
// [item, regex tested against each title (case-insensitive)]
const CHECK = {
  css: [
    ['display values', /block, inline|display: (none|contents)/], ['position values', /position: relative/], ['float/clear', /float/],
    ['overflow', /overflow do/], ['z-index', /z-index/], ['box-sizing', /box-sizing/],
    ['margin/padding/border shorthands', /shorthand/], ['units', /px vs em/], ['colors', /colors in CSS/], ['fonts', /fonts/],
    ['text properties', /style text/], ['background properties', /background-(repeat|position)/], ['background-size', /background-size/],
    ['gradients', /gradient/], ['shadows', /shadow/], ['transforms', /transform/],
    ['transitions (duration/timing/delay)', /transition \(|write a CSS transition/], ['animations/@keyframes', /@keyframes/],
    ['flex-direction', /flex-direction/], ['justify-content/align-items', /justify-content/], ['flex-wrap', /flex-wrap/],
    ['gap', /\bgap\b/], ['flex-grow', /flex-grow/], ['flex-shrink/basis', /flex-basis/], ['order', /\border\b/],
    ['align-content', /align-content/], ['grid basics', /CSS Grid\?/], ['fr unit', /\bfr\b/], ['repeat()/minmax()', /minmax/],
    ['auto-fit/auto-fill', /auto-fit/], ['grid areas', /grid-template-areas/], ['span', /span/],
    ['media queries', /media query/], ['container queries', /container quer/], ['variables', /CSS variables/],
    ['calc()', /calc\(\)/], ['clamp()', /clamp\(\)/], ['min()/max()', /min\(\) and max\(\)/],
    ['pseudo-classes', /:hover/], ['pseudo-elements', /::before/], [':is()/:where()', /:where\(\)/], [':not()', /:not\(\)/],
    ['combinators', /child selector|\+ and ~/], ['attribute selectors', /attribute selector/], ['specificity', /specificity/i],
    ['inheritance', /inherited/], ['cascade layers @layer', /@layer/], ['!important', /!important/], ['object-fit', /object-fit/],
    ['aspect-ratio', /aspect-ratio/], ['visibility vs opacity', /visibility: hidden and opacity/], ['display none vs visibility', /display: none vs visibility/],
    ['cursor', /cursor/], ['pointer-events', /pointer-events/], ['list-style', /list-style/], ['table styles', /table/],
    ['responsive layouts', /mobile-first|responsive/], ['BEM', /BEM/], ['preprocessors (SASS)', /SASS/],
  ],
  database: [
    ['SELECT/WHERE/ORDER BY/LIMIT', /WHERE, ORDER BY and LIMIT/], ['OFFSET / pagination', /OFFSET/], ['DISTINCT', /DISTINCT/],
    ['IN/BETWEEN/LIKE', /LIKE, IN and BETWEEN/], ['IS NULL', /NULL values/], ['COALESCE/NULLIF/IFNULL', /COALESCE/],
    ['CAST', /CAST/], ['CASE', /CASE WHEN/], ['aggregate functions', /aggregate functions/], ['GROUP BY', /GROUP BY work/],
    ['HAVING / WHERE vs HAVING', /WHERE and HAVING/], ['INNER JOIN', /INNER JOIN/], ['LEFT JOIN', /LEFT JOIN/], ['RIGHT JOIN', /RIGHT JOIN/],
    ['FULL JOIN', /FULL OUTER/], ['CROSS JOIN', /CROSS JOIN/], ['SELF JOIN', /SELF JOIN/], ['UNION', /UNION/],
    ['INTERSECT/EXCEPT', /INTERSECT/], ['subqueries', /subquery/], ['EXISTS', /EXISTS/], ['ANY/ALL', /ANY and ALL/],
    ['CTE / recursive CTE', /CTE/], ['ROW_NUMBER/RANK/DENSE_RANK', /ROW_NUMBER/], ['NTILE', /NTILE/], ['LAG/LEAD', /LAG and LEAD/],
    ['FIRST_VALUE', /FIRST_VALUE/], ['SUM OVER / GROUP BY vs window', /SUM\(\) OVER/], ['string functions', /string functions/],
    ['date functions', /dates/], ['math functions', /math functions/], ['INSERT/UPDATE/DELETE', /CRUD/], ['UPSERT', /upsert/],
    ['CREATE/ALTER TABLE', /ALTER TABLE/], ['DROP/TRUNCATE', /TRUNCATE and DROP/], ['constraints', /UNIQUE, NOT NULL, CHECK/],
    ['primary key', /What is a primary key/], ['foreign key', /foreign key\?/], ['indexes', /What is an index/], ['views', /What is a view/],
    ['triggers', /trigger/], ['transactions/ACID', /ACID/], ['isolation levels', /isolation levels/], ['normalization', /normalization/],
    ['ER design / relationships', /ER diagram|many-to-many/], ['candidate/composite/surrogate/natural keys', /surrogate/],
    ['stored procedures', /stored procedure/], ['primary vs unique key', /primary key and a unique key/],
    ['clustered vs non-clustered index', /clustered/],
  ],
  git: [
    ['init', /git init/], ['clone', /git clone/], ['status/add/commit', /git add, git commit and git status/], ['commit -a', /commit -a/],
    ['commit --amend', /amend/], ['log (oneline/graph)', /git log\?/], ['show', /git show/], ['diff staged/unstaged', /git diff --staged/],
    ['diff branches', /compare two branches/], ['branch', /create, switch, list and delete branches/], ['switch/checkout/restore', /git switch/],
    ['merge', /merge\b/], ['rebase', /git rebase\?/], ['interactive rebase/squash', /interactive rebase/], ['cherry-pick', /cherry-pick/],
    ['revert', /revert/], ['reset soft/mixed/hard', /--soft, --mixed and --hard/], ['stash', /stash/], ['tag', /tags/],
    ['remote', /remote in Git/], ['fetch/pull/push', /git push, git pull and git fetch/], ['push -u', /push -u/],
    ['--force-with-lease', /force-with-lease/], ['blame', /blame/], ['reflog', /reflog/], ['bisect', /bisect/], ['clean', /git clean/],
    ['rm/mv', /git mv and git rm/], ['.gitignore', /\.gitignore/], ['config', /git config/], ['alias', /aliases/], ['worktree', /worktree/],
    ['submodule', /submodule/], ['grep', /git grep/], ['shortlog', /shortlog/], ['describe', /describe/], ['archive', /archive/],
    ['HEAD', /What is HEAD/], ['detached HEAD', /detached HEAD/], ['origin/upstream', /origin and upstream/], ['fast-forward', /fast-forward/],
    ['merge conflicts', /merge conflict/], ['fetch vs pull', /git fetch and git pull/], ['merge vs rebase', /Merge vs rebase/],
    ['reset vs revert', /git revert and git reset/],
  ],
}
let total = 0
for (const [page, items] of Object.entries(CHECK)) {
  const titles = t(page)
  const missing = items.filter(([, re]) => !titles.some((x) => new RegExp(re.source, 'i').test(x))).map(([n]) => n)
  total += missing.length
  console.log(`${page}: ${items.length} checklist items, ${missing.length} missing${missing.length ? ':\n  - ' + missing.join('\n  - ') : ''}`)
}
process.exit(total ? 1 : 0)
