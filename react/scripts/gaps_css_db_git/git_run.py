# Runs Git examples in throwaway repos and records their real output.
# Usage: python3 scripts/gaps_css_db_git/git_run.py  -> writes git_out.json next to this file.
# Safety: everything runs inside a fresh temp folder (outside any real repo), with HOME set to
# that folder, GIT_CEILING_DIRECTORIES so git can never walk up into a parent repo, and no
# system/global config from the user. Nothing is pushed outside the temp folder.
import json, os, re, shutil, subprocess, sys, tempfile

here = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, here)
from git_cases import CASES  # noqa: E402

def env_for(home):
    env = {
        'PATH': '/usr/bin:/bin:/usr/sbin:/sbin:/opt/homebrew/bin',
        'HOME': home, 'TZ': 'UTC', 'LANG': 'C', 'LC_ALL': 'C',
        'GIT_AUTHOR_NAME': 'Dev', 'GIT_AUTHOR_EMAIL': 'dev@example.com',
        'GIT_COMMITTER_NAME': 'Dev', 'GIT_COMMITTER_EMAIL': 'dev@example.com',
        'GIT_AUTHOR_DATE': '2026-01-01T10:00:00+0000', 'GIT_COMMITTER_DATE': '2026-01-01T10:00:00+0000',
        'GIT_CONFIG_NOSYSTEM': '1', 'GIT_CEILING_DIRECTORIES': os.path.dirname(home),
        'GIT_TERMINAL_PROMPT': '0',
    }
    return env

def run_case(case):
    base = tempfile.mkdtemp(prefix='gitgap-', dir=os.environ.get('GITGAP_TMP'))
    real = os.path.realpath(base)
    home = os.path.join(real, 'dev')
    os.makedirs(home)
    with open(os.path.join(home, '.gitconfig'), 'w') as f:
        f.write('[init]\n\tdefaultBranch = main\n[color]\n\tui = false\n[core]\n\tpager = cat\n'
                '[advice]\n\tdetachedHead = true\n')
    shown = [l for l in case['code'].split('\n') if l.strip() and not l.lstrip().startswith('#')]
    script = ['set +e', 'cd "$HOME"', case.get('setup', ''), 'exec 3>&1']
    for i, line in enumerate(shown):
        echo = re.sub(r'\s{2,}#.*$', '', line)
        if i: script.append('echo')
        script.append('printf "%s\\n" ' + shlex_quote('$ ' + echo))
        script.append(line + ' 2>&1')
    p = subprocess.run(['bash', '-c', '\n'.join(script)], env=env_for(home), capture_output=True, text=True, cwd=home)
    out = p.stdout + p.stderr
    for prefix in (home, base + '/dev'):
        out = out.replace(prefix, '/home/dev')
    # Collapse each command's trailing blank lines so there is exactly one blank line between commands.
    out = re.sub(r'\n{2,}(?=\$ )', '\n\n', out).rstrip('\n')
    shutil.rmtree(base)
    return out

def shlex_quote(s):
    return "'" + s.replace("'", "'\\''") + "'"

if __name__ == '__main__':
    res = {}
    for c in CASES:
        res[c['q']] = {'code': c['code'], 'output': run_case(c)}
        print('=' * 70, '\n' + c['q'] + '\n' + res[c['q']]['output'])
    json.dump(res, open(os.path.join(here, 'git_out.json'), 'w'), indent=1)
