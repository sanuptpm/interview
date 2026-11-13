# Simpler AI/ML snippets, keyed by item index in aiMlQuestionsData.js.
NEW = {}
ANS = {}

NEW[0] = r'''
from sklearn.tree import DecisionTreeClassifier

def rule(temp):                      # AI: a hand-written rule
    return "hot" if temp > 30 else "not hot"

X = [[20], [25], [32], [40]]         # ML: the rule is learned from data
y = ["not hot", "not hot", "hot", "hot"]
model = DecisionTreeClassifier(random_state=0).fit(X, y)

print(rule(33), "|", model.predict([[33]])[0])
print("Learned threshold:", model.tree_.threshold[0])
'''

NEW[1] = r'''
from sklearn.linear_model import LogisticRegression
from sklearn.cluster import KMeans

X = [[1, 1], [1, 2], [8, 8], [9, 8]]
y = [0, 0, 1, 1]                                      # labels

print(LogisticRegression().fit(X, y).predict([[8, 9]]))       # supervised
print(KMeans(2, n_init=10, random_state=0).fit(X).labels_)    # unsupervised: no y

rewards = {"left": 0.3, "right": 0.9}                 # RL: average reward per action
print(max(rewards, key=rewards.get))
'''

NEW[3] = r'''
import pandas as pd

df = pd.DataFrame({"size": [800, 1200, 1500],
                   "rooms": [2, 3, 4],
                   "price": [100, 150, 190]})

X = df[["size", "rooms"]]   # features
y = df["price"]             # label / target
print(list(X.columns), y.name)
print(X.shape, y.shape)
'''

NEW[4] = r'''
import numpy as np
from sklearn.model_selection import train_test_split

data = np.arange(100)
train, rest = train_test_split(data, test_size=0.3, random_state=42)
val, test = train_test_split(rest, test_size=0.5, random_state=42)
print(len(train), len(val), len(test))
'''

NEW[5] = r'''
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.dummy import DummyClassifier
from sklearn.ensemble import RandomForestClassifier

X, y = load_iris(return_X_y=True)                                 # 1. data
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)   # 2. split
base = DummyClassifier().fit(X_tr, y_tr)                          # 3. baseline
model = RandomForestClassifier(random_state=0).fit(X_tr, y_tr)    # 4. model
print(round(base.score(X_te, y_te), 2), round(model.score(X_te, y_te), 2))  # 5. evaluate
'''

NEW[6] = r'''
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

X, y = make_moons(n_samples=400, noise=0.3, random_state=3)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

for depth in [1, 4, None]:
    m = DecisionTreeClassifier(max_depth=depth, random_state=0).fit(X_tr, y_tr)
    print(f"depth={depth}: train={m.score(X_tr, y_tr):.2f} test={m.score(X_te, y_te):.2f}")
'''

NEW[7] = r'''
import numpy as np

rng = np.random.RandomState(0)
x = rng.rand(40) * 6
y = np.sin(x) + rng.randn(40) * 0.2
x_tr, y_tr, x_te, y_te = x[:30], y[:30], x[30:], y[30:]

for degree in [1, 4, 12]:
    coefs = np.polyfit(x_tr, y_tr, degree)
    error = np.mean((np.polyval(coefs, x_te) - y_te) ** 2)
    print(f"degree={degree}: test error={error:.3f}")
'''
ANS[7] = ("so I look for the sweet spot, usually by checking validation scores across model complexity.",
          "so I look for the sweet spot, usually by checking validation scores across model complexity. Here degree 1 underfits (high bias) and a very high degree overfits (high variance).")

NEW[8] = r'''
import numpy as np
import pandas as pd

df = pd.DataFrame({"age": [25, np.nan, 35, 40],
                   "city": ["Pune", "Delhi", np.nan, "Pune"]})
print(df.isna().sum().to_dict())

df["age"] = df["age"].fillna(df["age"].median())        # numbers: median
df["city"] = df["city"].fillna(df["city"].mode()[0])    # categories: most frequent
print(df)
'''
ANS[8] = ("I fit the imputer on training data only,",
          "I compute the fill values (or fit sklearn's SimpleImputer) on training data only,")

NEW[9] = r'''
import numpy as np
from sklearn.preprocessing import StandardScaler, MinMaxScaler

X = np.array([[10.0], [20.0], [30.0], [100.0]])
std = StandardScaler().fit_transform(X).ravel()
mm = MinMaxScaler().fit_transform(X).ravel()

print("Standard:", std.round(2), "mean", round(std.mean(), 2), "std", round(std.std(), 2))
print("MinMax:  ", mm.round(2))
'''

NEW[10] = r'''
import pandas as pd
from sklearn.preprocessing import LabelEncoder

colors = pd.Series(["red", "green", "blue", "green"])
print(LabelEncoder().fit_transform(colors))   # one number per category
print(pd.get_dummies(colors, dtype=int))      # one 0/1 column per category
'''

NEW[11] = r'''
import pandas as pd

df = pd.DataFrame({"date": pd.to_datetime(["2024-01-06", "2024-01-08"]),
                   "price": [300000, 450000],
                   "sqft": [1000, 1500]})

df["day"] = df["date"].dt.day_name()
df["is_weekend"] = df["date"].dt.dayofweek >= 5
df["price_per_sqft"] = df["price"] / df["sqft"]
print(df.drop(columns="date"))
'''

NEW[12] = r'''
import numpy as np
from sklearn.model_selection import train_test_split

y = np.array([0] * 90 + [1] * 10)        # only 10% positive

_, test = train_test_split(y, test_size=0.2, random_state=3)
print("Without stratify:", test.sum(), "of 20 are positive")
_, test = train_test_split(y, test_size=0.2, random_state=3, stratify=y)
print("With stratify:", test.sum(), "of 20 are positive")
'''

NEW[13] = r'''
import pandas as pd

df = pd.DataFrame({"id": [1, 2, 2, 3, 4, 5],
                   "salary": [50, 52, 52, 48, 51, 400]})
df = df.drop_duplicates()
print("Rows after dedup:", len(df))

q1, q3 = df["salary"].quantile([0.25, 0.75])
iqr = q3 - q1
low, high = q1 - 1.5 * iqr, q3 + 1.5 * iqr
print("Outliers:", df[~df["salary"].between(low, high)]["id"].tolist())
print("Clipped:", df["salary"].clip(low, high).tolist())
'''

NEW[14] = r'''
import pandas as pd

df = pd.DataFrame({"age": [25, 32, 47, None],
                   "city": ["A", "B", "A", "A"],
                   "churned": [1, 0, 0, 1]})
print(df.shape)
print(df.isna().sum().to_dict())
print(df["age"].describe().round(1).to_dict())
print(df["city"].value_counts().to_dict())
print(df["churned"].mean())          # target balance
'''
ANS[14] = ("and corr() shows which features move together with the target.",
           "and later corr() shows which features move together with the target.")

NEW[15] = r'''
import pandas as pd

sales = pd.DataFrame({"units": [10, 12, 9, 15, 14]})       # already sorted by day
sales["lag_1"] = sales["units"].shift(1)                    # yesterday
sales["ma_3"] = sales["units"].shift(1).rolling(3).mean()   # past 3 days only
print(sales.round(2))
print("Rows usable for training:", len(sales.dropna()))
'''

NEW[16] = r'''
from sklearn.linear_model import LinearRegression

X = [[1], [2], [3], [4], [5]]       # years of experience
y = [30, 35, 41, 44, 50]            # salary in thousands

model = LinearRegression().fit(X, y)
print("Slope:", round(model.coef_[0], 2), "Intercept:", round(model.intercept_, 2))
print("Predict 6 years:", round(model.predict([[6]])[0], 2))
'''

NEW[17] = r'''
from sklearn.linear_model import LogisticRegression

X = [[1], [2], [3], [6], [7], [8]]      # hours studied
y = [0, 0, 0, 1, 1, 1]                  # passed?

model = LogisticRegression().fit(X, y)
print(model.predict_proba([[4], [5]])[:, 1].round(2))   # sigmoid -> P(pass)
print(model.predict([[2], [7]]))                        # threshold 0.5
'''

NEW[19] = r'''
from sklearn.datasets import load_iris
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

iris = load_iris()
X_tr, X_te, y_tr, y_te = train_test_split(iris.data, iris.target, random_state=0)
rf = RandomForestClassifier(n_estimators=100, random_state=0).fit(X_tr, y_tr)

print("Accuracy:", round(rf.score(X_te, y_te), 3))
print(dict(zip(iris.feature_names, rf.feature_importances_.round(2).tolist())))
'''

NEW[20] = r'''
from sklearn.neighbors import KNeighborsClassifier

X = [[1, 1], [1, 2], [2, 1], [8, 8], [8, 9], [9, 8]]
y = ["red", "red", "red", "blue", "blue", "blue"]

knn = KNeighborsClassifier(n_neighbors=3).fit(X, y)
print(knn.predict([[2, 2], [7, 8]]))        # majority vote of 3 neighbors
print("Nearest to [2, 2]:", knn.kneighbors([[2, 2]])[1][0].tolist())
'''

NEW[21] = r'''
from sklearn.datasets import make_moons
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC

X, y = make_moons(n_samples=200, noise=0.2, random_state=0)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

for kernel in ["linear", "rbf"]:
    svm = SVC(kernel=kernel).fit(X_tr, y_tr)
    print(f"{kernel}: accuracy={svm.score(X_te, y_te):.2f}, support vectors={len(svm.support_vectors_)}")
'''

NEW[22] = r'''
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

texts = ["win money now", "free prize win", "meeting at noon", "project meeting notes"]
labels = ["spam", "spam", "ham", "ham"]

vec = CountVectorizer()
nb = MultinomialNB().fit(vec.fit_transform(texts), labels)
print(nb.predict(vec.transform(["free money", "meeting notes"])))
'''

NEW[24] = r'''
from sklearn.datasets import load_iris
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

X = StandardScaler().fit_transform(load_iris().data)
pca = PCA(n_components=2)
X_2d = pca.fit_transform(X)

print(X.shape, "->", X_2d.shape)
print("Explained variance ratio:", pca.explained_variance_ratio_.round(3))
'''

NEW[25] = r'''
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingClassifier

X, y = load_breast_cancer(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

for n in [1, 10, 100]:
    gb = GradientBoostingClassifier(n_estimators=n, learning_rate=0.1, random_state=0)
    print(f"trees={n}: accuracy={gb.fit(X_tr, y_tr).score(X_te, y_te):.3f}")
'''

NEW[26] = r'''
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier, AdaBoostClassifier

X, y = load_breast_cancer(return_X_y=True)
for name, m in [("single tree", DecisionTreeClassifier(random_state=0)),
                ("bagging", BaggingClassifier(random_state=0)),
                ("boosting", AdaBoostClassifier(random_state=0))]:
    print(name, round(cross_val_score(m, X, y, cv=5).mean(), 3))
'''

NEW[28] = r'''
from sklearn.metrics import confusion_matrix

y_true = [1, 1, 1, 1, 0, 0, 0, 0, 0, 0]
y_pred = [1, 1, 0, 0, 1, 0, 0, 0, 0, 0]

cm = confusion_matrix(y_true, y_pred)
print(cm)                        # rows = actual, columns = predicted
tn, fp, fn, tp = cm.ravel()
print(f"TN={tn} FP={fp} FN={fn} TP={tp}")
'''

NEW[29] = r'''
from sklearn.metrics import roc_auc_score

y_true = [0, 0, 1, 1, 0, 1]
probs = [0.1, 0.4, 0.35, 0.8, 0.2, 0.9]      # predicted P(class 1)

print("ROC-AUC:", round(roc_auc_score(y_true, probs), 3))
print("Random guess:", roc_auc_score(y_true, [0.5] * 6))
'''

NEW[30] = r'''
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, recall_score

X, y = make_classification(n_samples=2000, weights=[0.95], class_sep=0.5, random_state=0)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, stratify=y, random_state=0)
print("Always 'normal': accuracy", round(1 - y_te.mean(), 3), "recall 0")

for cw in [None, "balanced"]:
    p = LogisticRegression(class_weight=cw).fit(X_tr, y_tr).predict(X_te)
    print(f"class_weight={cw}: accuracy={accuracy_score(y_te, p):.3f} recall={recall_score(y_te, p):.3f}")
'''

NEW[33] = r'''
from sklearn.datasets import load_iris
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.svm import SVC

X, y = load_iris(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0, stratify=y)

grid = GridSearchCV(SVC(), {"C": [0.1, 1, 10], "kernel": ["linear", "rbf"]}, cv=5)
grid.fit(X_tr, y_tr)
print(grid.best_params_, round(grid.best_score_, 3))
print("Test score:", round(grid.score(X_te, y_te), 3))
'''

NEW[34] = r'''
import numpy as np
from sklearn.linear_model import LinearRegression, Lasso, Ridge

rng = np.random.RandomState(0)
X = rng.randn(50, 4)
y = 3 * X[:, 0] + 2 * X[:, 1] + rng.randn(50) * 0.5   # only 2 useful features

for m in [LinearRegression(), Ridge(alpha=10), Lasso(alpha=0.5)]:
    print(type(m).__name__, m.fit(X, y).coef_.round(2))
'''

NEW[35] = r'''
import numpy as np

X = np.array([1, 2, 3, 4])
y = 2 * X                       # the true weight is 2

for lr in [0.001, 0.05, 0.2]:
    w = 0.0
    for _ in range(20):
        grad = -2 * np.mean((y - w * X) * X)   # slope of the MSE loss
        w -= lr * grad                          # step downhill
    print(f"lr={lr}: w={w:.3f}")
'''

NEW[36] = r'''
from sklearn.datasets import load_breast_cancer
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

X, y = load_breast_cancer(return_X_y=True)
pipe = make_pipeline(StandardScaler(), LogisticRegression())
scores = cross_val_score(pipe, X, y, cv=5)   # scaler is fit on training folds only
print("CV accuracy (no leakage):", round(scores.mean(), 3))
'''

NEW[37] = r'''
import numpy as np
from sklearn.model_selection import TimeSeriesSplit

days = np.arange(9)                  # days in order, never shuffled
for tr, va in TimeSeriesSplit(n_splits=3).split(days):
    print("train", tr.tolist(), "validate", va.tolist())
'''

NEW[38] = r'''
from sklearn.datasets import make_classification
from sklearn.feature_selection import SelectKBest, f_classif

X, y = make_classification(n_samples=200, n_features=5, n_informative=2,
                           n_redundant=0, shuffle=False, random_state=0)
skb = SelectKBest(f_classif, k=2).fit(X, y)
print("F-scores:", skb.scores_.round(1))
print("Selected columns:", skb.get_support(indices=True))
'''

NEW[39] = r'''
import pandas as pd

df = pd.DataFrame({"city": ["Kochi", "Delhi", "Kochi", "Pune", "Delhi", "Goa"],
                   "bought": [1, 0, 1, 0, 1, 1]})
counts = df["city"].value_counts()
df["grouped"] = df["city"].where(df["city"].map(counts) >= 2, "Other")  # rare -> Other
df["freq"] = df["city"].map(counts / len(df))                           # frequency
df["target"] = df.groupby("grouped")["bought"].transform("mean")        # target encoding
print(df.round(2))
'''

NEW[40] = r'''
import numpy as np

rng = np.random.default_rng(0)
minority = np.array([[3.0, 3.0], [3.5, 2.5], [4.0, 3.5]])

new = []
for _ in range(3):
    a, b = minority[rng.choice(3, size=2, replace=False)]   # a point and a neighbor
    new.append(a + rng.random() * (b - a))                  # a new point between them
print(np.round(new, 2))
print("Minority size:", len(minority), "->", len(minority) + len(new))
'''

NEW[41] = r'''
from sklearn.metrics import precision_recall_curve

y_true = [0, 0, 1, 0, 1, 1, 0, 1]
proba = [0.1, 0.3, 0.35, 0.4, 0.6, 0.7, 0.75, 0.9]

prec, rec, thr = precision_recall_curve(y_true, proba)
for p, r, t in zip(prec, rec, thr):
    print(f"threshold={t:.2f}  precision={p:.2f}  recall={r:.2f}")
'''

NEW[42] = r'''
from sklearn.datasets import load_digits
from sklearn.model_selection import learning_curve
from sklearn.tree import DecisionTreeClassifier

X, y = load_digits(return_X_y=True)
sizes, train_sc, val_sc = learning_curve(DecisionTreeClassifier(random_state=0), X, y,
                                         train_sizes=[0.1, 0.5, 1.0], cv=5)
for n, tr, va in zip(sizes, train_sc.mean(1), val_sc.mean(1)):
    print(f"n={n}: train={tr:.2f} val={va:.2f}")
'''

NEW[43] = r'''
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import make_pipeline

texts = ["refund my money", "item broken, want refund", "love this product", "great quality, happy"]
labels = ["complaint", "complaint", "praise", "praise"]

model = make_pipeline(TfidfVectorizer(), LogisticRegression()).fit(texts, labels)
print(model.predict(["I want a refund", "really happy, love it"]))
'''

NEW[44] = r'''
import numpy as np
from sklearn.ensemble import IsolationForest

rng = np.random.default_rng(42)
amounts = np.append(rng.normal(100, 5, 50), [160, 20, 190]).reshape(-1, 1)

iso = IsolationForest(contamination=0.05, random_state=0).fit(amounts)
flags = iso.predict(amounts)                      # -1 = anomaly
print("Flagged:", amounts[flags == -1].ravel().round(1))
'''

NEW[45] = r'''
import numpy as np
from scipy import stats

rng = np.random.default_rng(7)
a = rng.normal(5.0, 1.5, 400)        # minutes on page, old design
b = rng.normal(5.3, 1.5, 400)        # new design

t, p = stats.ttest_ind(b, a, equal_var=False)
print(f"Mean A={a.mean():.2f} B={b.mean():.2f} p={p:.4f} significant={p < 0.05}")
'''

NEW[46] = r'''
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance

rng = np.random.default_rng(0)
X = rng.normal(size=(300, 3))                  # income, age, noise
y = (2 * X[:, 0] + X[:, 1] > 0).astype(int)

rf = RandomForestClassifier(random_state=0).fit(X[:200], y[:200])
print("Impurity:", rf.feature_importances_.round(2))
perm = permutation_importance(rf, X[200:], y[200:], random_state=0)
print("Permutation:", perm.importances_mean.round(3))
'''

NEW[47] = r'''
import numpy as np

X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([0, 0, 0, 1])              # AND gate

w, b = np.zeros(2), 0.0
for epoch in range(10):
    for xi, target in zip(X, y):
        error = target - int(xi @ w + b > 0)   # neuron: weighted sum + step
        w += 0.1 * error * xi
        b += 0.1 * error
print("Predictions:", [int(xi @ w + b > 0) for xi in X])
'''

NEW[48] = r'''
import numpy as np

z = np.array([-2.0, 0.0, 3.0])
print("sigmoid:", (1 / (1 + np.exp(-z))).round(3))
print("relu:   ", np.maximum(0, z))
print("softmax:", (np.exp(z) / np.exp(z).sum()).round(3))
'''

NEW[49] = r'''
import numpy as np

x, y = 2.0, 1.0
w, lr = 0.5, 0.1

for step in range(3):
    pred = 1 / (1 + np.exp(-w * x))                 # forward: sigmoid(w * x)
    loss = (pred - y) ** 2
    grad = 2 * (pred - y) * pred * (1 - pred) * x   # backward: chain rule
    w -= lr * grad                                  # update
    print(f"step {step}: loss={loss:.4f} w={w:.4f}")
'''

NEW[50] = r'''
n_samples, batch_size, epochs = 1000, 100, 3

updates = 0
for epoch in range(epochs):                          # one full pass over the data
    for start in range(0, n_samples, batch_size):    # one batch -> one update
        updates += 1

print("Iterations per epoch:", n_samples // batch_size)
print("Total iterations:", updates)
'''

NEW[51] = r'''
import numpy as np

signal = np.array([0, 0, 0, 1, 1, 1])
edge = np.array([-1, 1])                    # CNN: slide a small filter
print("CNN:", [int(signal[i:i + 2] @ edge) for i in range(5)])

h = 0.0                                     # RNN: carry a hidden state
for x in [1, 2, 3]:
    h = np.tanh(0.5 * x + 0.8 * h)
    print("RNN hidden state:", round(h, 3))
'''

NEW[52] = r'''
import numpy as np

np.random.seed(0)
X = np.random.randn(3, 4)                  # 3 tokens, 4 numbers each
Wq, Wk, Wv = np.random.randn(3, 4, 4)

Q, K, V = X @ Wq, X @ Wk, X @ Wv
scores = Q @ K.T / np.sqrt(4)              # query . key, scaled
weights = np.exp(scores) / np.exp(scores).sum(axis=1, keepdims=True)   # softmax
print(weights.round(2))                    # each row sums to 1
print((weights @ V).shape)                 # weighted mix of values
'''

NEW[53] = r'''
import numpy as np

king = np.array([0.9, 0.8, 0.1])
queen = np.array([0.85, 0.9, 0.15])
apple = np.array([0.1, 0.2, 0.95])

def cosine(a, b):
    return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))

print("king vs queen:", round(cosine(king, queen), 3))
print("king vs apple:", round(cosine(king, apple), 3))
'''

NEW[54] = r'''
from collections import Counter

words = "i like ml . i like ai . i love python .".split()
after_i = Counter(nxt for cur, nxt in zip(words, words[1:]) if cur == "i")
total = sum(after_i.values())
print({w: round(c / total, 2) for w, c in after_i.items()})   # next-token probabilities
'''

NEW[55] = r'''
import re

prompt = "Summarize: Unbelievable results in machine learning!"
tokens = re.findall(r"\w+|[^\w\s]", prompt.lower())   # toy tokenizer
print(tokens, len(tokens))

context_window = 6
print("Fits?", len(tokens) <= context_window)
print("Kept:", tokens[-context_window:])
'''

NEW[57] = r'''
import numpy as np

docs = ["Refunds are allowed within 30 days.",
        "Shipping takes 3 to 5 business days."]
doc_vecs = np.array([[0.9, 0.1], [0.1, 0.9]])     # toy embeddings
question = "How long does delivery take?"
q_vec = np.array([0.2, 0.95])

best = docs[np.argmax(doc_vecs @ q_vec)]          # retrieve the closest doc
print(f"Context: {best}\nQuestion: {question}")
'''

NEW[58] = r'''
def choose(needs_private_data, needs_custom_style):
    if needs_private_data:
        return "RAG"
    if needs_custom_style:
        return "Fine-tuning"
    return "Prompting"

print("FAQ bot over company docs:", choose(True, False))
print("Write in our brand voice:", choose(False, True))
print("Summarize an email:", choose(False, False))
'''

NEW[59] = r'''
def grounded(answer, context):           # share of answer words found in the context
    words = [w.strip(".,").lower() for w in answer.split()]
    return sum(w in context.lower() for w in words) / len(words)

context = "The Eiffel Tower is in Paris and was completed in 1889."
for a in ["The Eiffel Tower was completed in 1889.",
          "The Eiffel Tower was built by Romans in 450."]:
    score = grounded(a, context)
    print(f"{score:.2f}", "OK" if score > 0.8 else "possible hallucination")
'''

NEW[60] = r'''
import numpy as np
from sklearn.neighbors import NearestNeighbors

ids = ["cats", "dogs", "cars"]
vectors = np.array([[0.9, 0.1], [0.8, 0.3], [0.1, 0.9]])
index = NearestNeighbors(n_neighbors=2, metric="cosine").fit(vectors)

dist, idx = index.kneighbors([[0.85, 0.2]])     # a "pets" query
print([ids[i] for i in idx[0]])
print("similarity:", (1 - dist[0]).round(3))
'''

NEW[61] = r'''
tests = [("Capital of France?", "paris", "The capital is Paris."),
         ("2 + 2?", "4", "It is 4."),
         ("Largest planet?", "jupiter", "Saturn is the largest.")]

passed = 0
for question, expected, got in tests:
    ok = expected in got.lower()
    passed += ok
    print("PASS" if ok else "FAIL", question)
print(f"Score: {passed}/{len(tests)}")
'''

NEW[62] = r'''
import numpy as np

tokens = ["cat", "dog", "car"]
logits = np.array([2.0, 1.5, 0.5])

for t in [0.2, 1.0, 2.0]:
    p = np.exp(logits / t) / np.exp(logits / t).sum()     # softmax with temperature
    print(f"T={t}:", dict(zip(tokens, p.round(2).tolist())))
'''

NEW[63] = r'''
import joblib, os, tempfile
from sklearn.datasets import load_iris
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X, y = load_iris(return_X_y=True)
pipe = make_pipeline(StandardScaler(), LogisticRegression()).fit(X, y)
path = os.path.join(tempfile.mkdtemp(), "model.joblib")
joblib.dump(pipe, path)                  # save after training
loaded = joblib.load(path)               # load in the API server
print(loaded.predict([[5.1, 3.5, 1.4, 0.2]]))
'''

NEW[64] = r'''
import numpy as np
from scipy.stats import ks_2samp

rng = np.random.default_rng(0)
train_age = rng.normal(35, 5, 1000)     # data the model was trained on
live_age = rng.normal(45, 5, 1000)      # production: users got older

stat, p = ks_2samp(train_age, live_age)
print(f"KS={stat:.3f} ->", "DRIFT, retrain" if p < 0.05 else "OK")
'''

NEW[65] = r'''
import pandas as pd

df = pd.DataFrame({"group": ["A"] * 6 + ["B"] * 6,
                   "approved": [1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0]})

rates = df.groupby("group")["approved"].mean().round(3)
print(rates.to_dict())
ratio = rates.min() / rates.max()
print("Disparate impact:", round(ratio, 2), "| passes 80% rule:", ratio >= 0.8)
'''

NEW[66] = r'''
val_losses = [0.90, 0.70, 0.55, 0.48, 0.46, 0.47, 0.49, 0.50]
patience, best, waited = 2, float("inf"), 0

for epoch, loss in enumerate(val_losses, 1):
    if loss < best:
        best, waited = loss, 0           # improved: reset the counter
    else:
        waited += 1
    if waited >= patience:
        print(f"Stop at epoch {epoch}, best loss {best}")
        break
'''

NEW[67] = r'''
import numpy as np

rng = np.random.default_rng(0)
acts = np.ones(8)                              # a layer's activations
mask = rng.random(8) > 0.5                     # drop about half
print("Dropout (train):", acts * mask / 0.5)   # scale up the rest
print("Dropout (eval): ", acts)

batch = np.array([10.0, 12.0, 14.0, 16.0])
normed = (batch - batch.mean()) / batch.std()  # batch norm: mean 0, std 1
print("BatchNorm:", normed.round(2))
'''

NEW[68] = r'''
import numpy as np

def cos(a, b):
    return round(float(a @ b / (np.linalg.norm(a) * np.linalg.norm(b))), 3)

one_hot = np.eye(3)                          # king, queen, apple
king = np.array([0.80, 0.65, 0.10])          # toy learned embeddings
queen = np.array([0.78, 0.70, 0.12])

print("One-hot king:", one_hot[0])
print("One-hot king~queen:", cos(one_hot[0], one_hot[1]))
print("Embedding king~queen:", cos(king, queen))
'''

NEW[69] = r'''
import numpy as np

items = ["Matrix", "Inception", "Titanic"]
R = np.array([[5, 4, 1],            # rows = users, columns = items
              [4, 5, 0],
              [1, 0, 5],
              [5, 0, 0]])           # last user: what next?

norms = np.linalg.norm(R, axis=0)
sim = R.T @ R / np.outer(norms, norms)          # item-item cosine similarity
scores = sim @ R[3]                             # similar to what they liked
print({items[i]: round(float(scores[i]), 2) for i in [1, 2]})
'''

NEW[70] = r'''
def get_weather(city):                          # a tool my code can run
    return {"Kochi": "31C, humid"}.get(city, "unknown")

def fake_llm(history):                          # stands in for the real model
    if len(history) == 1:
        return {"tool": "get_weather", "args": {"city": "Kochi"}}
    return {"answer": f"It is {history[-1]} in Kochi."}

history = ["Weather in Kochi?"]
reply = fake_llm(history)                       # 1. model asks for a tool
print(reply)
history.append(get_weather(**reply["args"]))    # 2. my code runs it
print(fake_llm(history))                        # 3. model answers with the result
'''

NEW[71] = r'''
text = ("Refunds are allowed within 30 days. Items must be unused. "
        "Shipping takes 3 to 5 days. Express shipping costs extra.")

def chunk(text, size=8, overlap=3):
    words = text.split()
    step = size - overlap
    return [" ".join(words[i:i + size]) for i in range(0, len(words) - overlap, step)]

for c in chunk(text):
    print("|", c)
'''

NEW[72] = r'''
results = {"refund?": ["d3", "d1", "d7"],       # ranked docs from the retriever
           "shipping?": ["d2", "d5", "d9"],
           "hours?": ["d4", "d8", "d6"]}
relevant = {"refund?": "d1", "shipping?": "d2", "hours?": "d6"}

def hit_rate(k):
    return sum(relevant[q] in docs[:k] for q, docs in results.items()) / len(results)

ranks = [docs.index(relevant[q]) + 1 for q, docs in results.items()]
print("Hit@1:", round(hit_rate(1), 2), "Hit@3:", hit_rate(3))
print("MRR:", round(sum(1 / r for r in ranks) / len(ranks), 3))
'''

NEW[73] = r'''
PRICES = {"large": (3.00, 15.00), "small": (0.25, 1.25)}   # $ per 1M tokens (example)

def monthly_cost(model, in_tok, out_tok, requests=100_000):
    p_in, p_out = PRICES[model]
    return requests * (in_tok * p_in + out_tok * p_out) / 1_000_000

big = monthly_cost("large", 2000, 300)
small = monthly_cost("small", 2000, 300)
print(f"All large: ${big:,.2f}  All small: ${small:,.2f}")
print(f"Route 80% to small: ${0.2 * big + 0.8 * small:,.2f}")
print(f"Trim the context: ${monthly_cost('large', 800, 300):,.2f}")
'''
