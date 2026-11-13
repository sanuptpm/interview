# Audit: for every commonly asked Python / AI-ML item, is there a question TITLE that names it?
# An item that only appears inside an answer/code counts as missing (like lastIndexOf on the JS page).
# Usage: python3 scripts/gaps_py/audit.py   (run scripts/topics/dump.py first)
import json, os, re, subprocess
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.join(here, '..', '..')

def load(page, f):
    js = f"import('{os.path.abspath(os.path.join(root, 'src/pages', f))}').then(m => console.log(JSON.stringify(m.questions)))"
    return json.loads(subprocess.run(['node', '--input-type=module', '-e', js], capture_output=True, text=True, check=True).stdout)

# (item, regex matched case-insensitively against titles)
PY = [
 ('len()', r'\blen\b'), ('range()', r'range\(\)'), ('enumerate()', r'enumerate'), ('zip()', r'zip\(\)'),
 ('map()/filter()', r'map\(\), filter'), ('sorted()', r'sorted\(\)'), ('reversed()', r'reversed\(\)'),
 ('sum()/min()/max()', r'\bsum\(\)|\bmin\(\)|\bmax\(\)'), ('any()/all()', r'\bany\(\)|\ball\(\)'),
 ('abs()', r'\babs\(\)'), ('round()', r'round\(\)'), ('isinstance() vs type()', r'isinstance'),
 ('id()', r'\bid\(\)'), ('print()/input()', r'print\(\) and input'), ('open()', r'read and write files|open\(\)'),
 ('iter()/next()', r'\biter\(\)|\bnext\(\)'), ('hash()', r'\bhash'), ('divmod()/pow()', r'divmod|\bpow\(\)'),
 ('chr()/ord()', r'\bord\(\)|\bchr\(\)'), ('bin()/hex()', r'\bbin\(\)|\bhex\(\)'),
 ('format() / str.format()', r'format\(\)|format specification'), ('getattr/setattr/hasattr', r'getattr\(\)|setattr|hasattr'),
 ('vars()/dir()', r'\bvars\(\)|\bdir\(\)'), ('globals()/locals()', r'globals\(\)|locals\(\)'), ('eval()/exec()', r'\beval\(|\bexec\('),
 # strings
 ('str find() vs index()', r'\bfind\(\)'), ('str rfind()', r'rfind'), ('count()', r'\bcount\(\)'),
 ('split()/rsplit()/splitlines()', r'\bsplit\(\)|rsplit|splitlines'), ('join()', r'\bjoin\(\)'),
 ('strip()/lstrip()/rstrip()', r'strip\(\)'), ('replace()', r'replace\(\)'),
 ('upper/lower/title/capitalize/swapcase', r'capitalize|swapcase|title\(\)'), ('startswith()/endswith()', r'startswith|endswith'),
 ('isdigit/isalpha/isalnum/isspace', r'isdigit|isalpha|isalnum|isspace'), ('center/ljust/rjust/zfill', r'zfill|ljust|rjust|center\(\)'),
 ('partition()', r'partition'), ('f-strings', r'f-strings'), ('f-string format specifiers', r'format specification'),
 # lists
 ('append() vs extend() vs insert()', r'append\(\)|extend\(\)|insert\(\)'), ('remove() vs pop() vs del', r'\bremove\(\)|\bpop\(\)|\bdel\b'),
 ('list index()', r'\bindex\(\)'), ('sort() vs sorted()', r'\bsort\(\)'), ('reverse() vs reversed()', r'reverse\(\)|reversed\(\)'),
 ('copy()', r'copy'), ('clear()', r'clear\(\)|empty list'),
 # dicts
 ('dict get()/setdefault()', r'setdefault'), ('dict update()', r'update'), ('dict pop()/popitem()', r'popitem'),
 ('keys()/values()/items()', r'keys\(\)|items\(\)|values\(\)'), ('dict fromkeys()', r'fromkeys'),
 ('dict | merge', r'merge dictionaries'), ('dict comprehension', r'dict and set comprehensions'),
 # sets / tuples
 ('set add()/update()', r'add and remove items in a set'), ('set remove() vs discard()', r'discard'),
 ('union/intersection/difference', r'set operations'), ('issubset/issuperset/isdisjoint', r'issubset|issuperset|isdisjoint'),
 ('tuple methods count()/index()', r'tuples?.*(count|index)|(count|index).*tuples?'),
 # keywords / statements
 ('pass/continue/break', r'\bpass\b|continue|break'), ('del statement', r'\bdel\b'), ('global/nonlocal', r'nonlocal'),
 ('lambda', r'lambda'), ('yield', r'yield'), ('with', r'with statement'), ('assert', r'assert'),
 ('is / in', r"'is'|'in'"), ('try/except/else/finally', r'finally'), ('ternary / conditional expression', r'ternary|conditional expression'),
 ('match/case', r'match'), ('walrus', r'walrus'),
 # stdlib
 ('collections', r'collections'), ('itertools', r'itertools'), ('functools (lru_cache, partial)', r'functools'),
 ('functools.wraps', r'wraps'), ('os module', r'\bos\b'), ('sys module', r'\bsys\b'), ('pathlib', r'pathlib'),
 ('json', r'json'), ('re', r'regular expressions'), ('datetime', r'datetime'), ('math module', r'\bmath\b'),
 ('float precision (0.1 + 0.2)', r'0\.1|floats?\b'), ('random module', r'\brandom\b'), ('copy module (shallow/deep)', r'deep copy'),
 ('typing', r'typing|type hints'), ('module vs package', r'package'),
]
ML = [
 ('linear regression', r'linear regression'), ('logistic regression', r'logistic regression'), ('decision tree', r'decision tree'),
 ('random forest', r'random forest'), ('KNN', r'KNN'), ('SVM', r'SVM'), ('Naive Bayes', r'Naive Bayes'),
 ('K-means', r'K-means'), ('choosing k (elbow/silhouette)', r'elbow|silhouette'), ('DBSCAN', r'DBSCAN'),
 ('PCA', r'PCA'), ('curse of dimensionality', r'curse of dimensionality'), ('gradient boosting', r'gradient boosting'),
 ('bagging vs boosting', r'bagging'),
 ('accuracy/precision/recall/F1', r'precision, recall'), ('confusion matrix', r'confusion matrix'), ('ROC-AUC', r'ROC'),
 ('false positives/negatives (Type I/II)', r'false positive|type i'), ('MAE/MSE/RMSE/R2', r'RMSE'),
 ('normalization vs standardization', r'normaliz|standardiz|StandardScaler and MinMaxScaler'),
 ('one-hot encoding', r'one-hot'), ('missing values', r'missing values'), ('dropna() vs fillna()', r'dropna|fillna'),
 ('fit/transform/fit_transform', r'fit_transform|transform\(\)'), ('predict() vs predict_proba()', r'predict_proba'),
 ('Pipeline', r'pipeline'), ('ColumnTransformer', r'ColumnTransformer'), ('train_test_split', r'train_test_split'),
 ('cross_val_score / k-fold', r'cross_val_score|cross-validation'), ('GridSearchCV', r'GridSearchCV'),
 ('RandomizedSearchCV', r'RandomizedSearchCV'), ('parameters vs hyperparameters', r'parameters and hyperparameters|parameters vs'),
 ('pandas read_csv', r'read_csv'), ('head/info/describe', r'describe\(\)|info\(\)|head\(\)'), ('loc vs iloc', r'\biloc\b'),
 ('groupby', r'groupby'), ('merge/join/concat', r'concat'), ('apply', r'apply\(\)'), ('value_counts', r'value_counts'),
 ('numpy arrays vs lists / vectorization', r'numpy arrays|vectoriz'), ('shape/reshape', r'reshape'),
 ('broadcasting', r'broadcasting'), ('axis', r'\baxis\b'),
 ('overfitting', r'overfitting'), ('regularization', r'regularization'), ('gradient descent', r'gradient descent'),
 ('batch/SGD/mini-batch GD', r'mini-batch|stochastic'), ('learning rate', r'learning rate'), ('optimizers (momentum/Adam)', r'adam|optimizer'),
 ('epochs', r'epochs'), ('activation functions', r'activation'), ('loss functions (MSE/cross-entropy)', r'loss function|cross-entropy'),
 ('vanishing/exploding gradients', r'vanishing|exploding'), ('transfer learning', r'transfer learning'),
 ('bag-of-words vs TF-IDF', r'bag-of-words|bag of words'), ('TF-IDF', r'TF-IDF'), ('embeddings', r'embeddings'),
 ('transformers/attention', r'transformers'), ('tokenization', r'token'), ('RAG', r'RAG'), ('fine-tuning', r'fine-tuning'),
]

for page, f, items in [('python', 'pythonQuestionsData.js', PY), ('aiMl', 'aiMlQuestionsData.js', ML)]:
    qs = load(page, f); titles = [q['q'] for q in qs]
    body = '\n'.join(q['a'] + '\n' + q['code'] for q in qs).lower()
    missing = []
    for name, rx in items:
        hits = [t for t in titles if re.search(rx, t, re.I)]
        if not hits:
            key = re.sub(r'[^a-z_]+', ' ', name.lower()).split()[0]
            missing.append(f"{name}{'  (only inside an answer)' if key in body else ''}")
    print(f"{page}: {len(items)} checklist items, {len(items) - len(missing)} covered by a title, {len(missing)} missing")
    for m in missing: print('  MISSING', m)
