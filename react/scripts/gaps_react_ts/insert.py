# python3 insert.py <data file> <block files...>
# Each block file: first line = anchor title, then '@@', then the item text to insert
# right after the item whose `q:` is the anchor. Skips blocks already inserted.
import sys, re
path, blocks = sys.argv[1], sys.argv[2:]
s = open(path).read()
for b in blocks:
    anchor, body = open(b).read().split('\n@@\n', 1)
    first_q = re.search(r"q: (['\"].*?['\"]),", body).group(1)
    if first_q[1:-1] in s:
        print('already there:', first_q); continue
    i = -1
    for quote in ("'", '"'):
        i = s.find(f"    q: {quote}{anchor}{quote},")
        if i >= 0: break
    assert i >= 0, anchor
    end = s.index('\n  },\n', i) + len('\n  },\n')
    s = s[:end] + body.rstrip('\n') + '\n' + s[end:]
    print('inserted after:', anchor)
open(path, 'w').write(s)
