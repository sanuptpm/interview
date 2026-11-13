# New AI/ML questions for the gaps found by audit.py.
# Each item: q, level, a, code, and `after` (or `before`) = the title it is placed next to, plus an
# optional `topic` when it goes into a sub-topic that does not exist yet (`new_topic_after`).
ITEMS = [
 dict(after="What are features and labels?", level='Basics',
  q="What is the difference between parameters and hyperparameters?",
  a="Parameters are values the model learns from the data during training, like the weights of a linear regression or the split points of a tree. Hyperparameters are settings I choose before training, like the learning rate, max_depth or the number of neighbors in KNN. I tune hyperparameters with a validation set or cross-validation, and for each choice the model learns its own parameters.",
  code=r'''from sklearn.linear_model import Ridge

X = [[1], [2], [3], [4]]
y = [2, 4, 6, 8]
model = Ridge(alpha=1.0)          # hyperparameter: chosen by me
model.fit(X, y)                   # parameters: learned from data

print("hyperparameter alpha:", model.alpha)
print("learned coef:", round(model.coef_[0], 3), "intercept:", round(model.intercept_, 3))'''),
 # ---- NumPy & pandas (new sub-topic after 'ML fundamentals')
 dict(after="What is the bias-variance tradeoff?", topic='NumPy & pandas', level='Basics',
  q="Why are NumPy arrays faster than Python lists?",
  a="A NumPy array stores numbers of one type in one block of memory, and its operations run in optimized C code over the whole array at once. That's called vectorization: I write prices * 2 instead of a Python loop, and it's shorter and much faster on big data. A list can hold mixed types, but every item is a full Python object, so math on it needs a loop.",
  code=r'''import numpy as np

prices = [10, 20, 30]
print([p * 2 for p in prices])          # list: needs a loop

arr = np.array(prices)
print(arr * 2, arr.sum(), arr.mean())   # vectorized, no loop
print(arr > 15)
print(arr[arr > 15])                    # boolean filtering'''),
 dict(after="Why are NumPy arrays faster than Python lists?", level='Basics',
  q="How do shape and reshape() work in NumPy?",
  a="shape is a tuple with the size of each dimension, like (2, 3) for 2 rows and 3 columns, and ndim is the number of dimensions. reshape() gives the same data in a new shape, as long as the total number of items stays the same. I often pass -1 to let NumPy work out one dimension, for example reshape(-1, 1) to turn a 1D array into the single-column 2D shape that scikit-learn expects.",
  code=r'''import numpy as np

a = np.arange(6)
print(a.shape, a.ndim)
m = a.reshape(2, 3)
print(m, m.shape, sep="\n")
print(a.reshape(-1, 1).shape)      # one column, for sklearn
print(m.T.shape, m.flatten())'''),
 dict(after="How do shape and reshape() work in NumPy?", level='Basics',
  q="What does axis=0 vs axis=1 mean in NumPy and pandas?",
  a="axis=0 means the operation runs down the rows, so I get one result per column; axis=1 runs across the columns, giving one result per row. The way I remember it is that the axis I pass is the one that gets collapsed. In pandas most methods default to axis=0, so df.sum() gives column totals, and for dropping I write drop(columns=...) because it's clearer than axis=1.",
  code=r'''import numpy as np
import pandas as pd

m = np.array([[1, 2, 3], [4, 5, 6]])
print(m.sum(axis=0), m.sum(axis=1))

df = pd.DataFrame(m, columns=["a", "b", "c"])
print(df.sum(axis=0).tolist(), df.sum(axis=1).tolist())'''),
 dict(after="What does axis=0 vs axis=1 mean in NumPy and pandas?", level='Intermediate',
  q="What is broadcasting in NumPy?",
  a="Broadcasting lets NumPy do math between arrays of different shapes without copying data. It compares shapes from the right, and two sizes fit if they are equal or one of them is 1, which then gets stretched. I use it all the time, for example to subtract the column means from a matrix, which is exactly what standardization does; if the shapes don't fit I get a clear error and fix it with reshape.",
  code=r'''import numpy as np

X = np.array([[1, 10], [3, 30]])
print(X + 100)                      # a scalar is stretched
print(X - X.mean(axis=0))           # (2, 2) minus (2,): column means
col = np.array([[1], [2]])          # shape (2, 1)
print(X * col)                      # each row times its own number'''),
 dict(after="What is broadcasting in NumPy?", level='Basics',
  q="How do you load a CSV with read_csv() and look at it with head() and describe()?",
  a="pd.read_csv() loads a CSV into a DataFrame and has useful options like usecols, dtype, parse_dates and na_values. Right after loading I check df.shape, df.head() for the first rows, df.info() for column types, df.describe() for count, mean, min and max of numeric columns, and df.isna().sum() for missing values. For a huge file I first read a sample with nrows=1000 to check the columns quickly.",
  code=r'''import io
import pandas as pd

csv = io.StringIO("name,age,city\nAsha,30,Pune\nRavi,25,\nMeera,35,Delhi")
df = pd.read_csv(csv)
print(df.shape)
print(df.head(2))
print(df["age"].describe().to_dict())
print(df.isna().sum().to_dict())'''),
 dict(after="How do you load a CSV with read_csv() and look at it with head() and describe()?", level='Basics',
  q="What is the difference between loc and iloc in pandas?",
  a="loc selects by label, meaning index names and column names, and its slices include the end label. iloc selects by integer position, like Python lists, so its slices exclude the end. The difference shows up when the index isn't 0, 1, 2, for example after sorting or filtering. I use loc for filtering with a condition, like df.loc[df.age > 28, 'name'].",
  code=r'''import pandas as pd

df = pd.DataFrame({"name": ["Asha", "Ravi", "Meera"], "age": [30, 25, 35]},
                  index=[10, 20, 30])
print(df.loc[20, "name"], "|", df.iloc[0, 0])
print(df.loc[10:20, "name"].tolist())      # label slice: end included
print(df.iloc[0:1]["name"].tolist())       # position slice: end excluded
print(df.loc[df.age > 28, "name"].tolist())'''),
 dict(after="What is the difference between loc and iloc in pandas?", level='Basics',
  q="What do value_counts(), unique() and nunique() do in pandas?",
  a="value_counts() counts how often each value appears, sorted from most to least common, and normalize=True gives proportions instead, which is the quickest way to check class balance. unique() returns the distinct values and nunique() just how many there are. They skip missing values by default, so I pass dropna=False when I want NaN counted too.",
  code=r'''import pandas as pd

s = pd.Series(["spam", "ham", "spam", None, "spam"])
print(s.value_counts().to_dict())
print(s.value_counts(normalize=True).to_dict())
print(list(s.dropna().unique()), s.nunique(), s.nunique(dropna=False))'''),
 dict(after="What do value_counts(), unique() and nunique() do in pandas?", level='Basics',
  q="How does groupby() work in pandas?",
  a="groupby() follows split-apply-combine: it splits the rows into groups by one or more columns, applies a function like sum or mean to each group, and combines the results. agg() lets me compute several stats at once with named output columns. I often add as_index=False or reset_index() so the result is a normal table I can merge or plot.",
  code=r'''import pandas as pd

df = pd.DataFrame({"city": ["Pune", "Delhi", "Pune", "Delhi", "Pune"],
                   "sales": [100, 200, 150, 50, 50]})
print(df.groupby("city")["sales"].sum().to_dict())

summary = df.groupby("city", as_index=False).agg(
    total=("sales", "sum"), avg=("sales", "mean"), orders=("sales", "count"))
print(summary)'''),
 dict(after="How does groupby() work in pandas?", level='Intermediate',
  q="What is the difference between merge(), join() and concat() in pandas?",
  a="merge() is SQL-style joining on one or more key columns, with how='inner', 'left', 'right' or 'outer'. join() is a shortcut that joins on the index. concat() doesn't match keys at all; it just stacks DataFrames on top of each other (axis=0) or side by side (axis=1). After a merge I always check the row count, because duplicate keys can silently multiply rows.",
  code=r'''import pandas as pd

users = pd.DataFrame({"id": [1, 2, 3], "name": ["Asha", "Ravi", "Meera"]})
orders = pd.DataFrame({"id": [1, 1, 3], "amount": [50, 20, 70]})

print(users.merge(orders, on="id", how="left"))          # 4 rows: id 1 matched twice
print(len(pd.concat([users, users], ignore_index=True)))   # stacked: 6 rows
print(users.set_index("id").join(orders.groupby("id").sum()))'''),
 dict(after="What is the difference between merge(), join() and concat() in pandas?", level='Intermediate',
  q="When do you use apply() vs vectorized operations in pandas?",
  a="apply() runs a Python function on each value, row or column, so it's flexible for custom logic that has no built-in method. But it loops in Python, so it's much slower than vectorized operations like df['a'] * 2, the .str methods or np.where. My rule is to look for a vectorized way first and use apply() only when the logic really needs it; for a simple value mapping I use map() with a dict.",
  code=r'''import numpy as np
import pandas as pd

df = pd.DataFrame({"price": [80, 120, 200], "qty": [1, 3, 2]})
df["total"] = df["price"] * df["qty"]                     # vectorized
df["band"] = np.where(df["price"] > 100, "high", "low")    # vectorized if/else
df["label"] = df.apply(lambda r: f"{r.qty} x {r.price}", axis=1)   # custom row logic
print(df)'''),
 # ---- Data preparation
 dict(after="How do you handle missing values?", level='Basics',
  q="What is the difference between dropna() and fillna()?",
  a="dropna() removes rows (or columns, with axis=1) that contain missing values, while fillna() replaces them with a value I choose, like 0, the mean, or 'Unknown'. I drop when only a few rows are missing at random, and fill when dropping would throw away too much data. Both return a new DataFrame by default, so I assign the result back, and in a real model I compute fill values from the training set only.",
  code=r'''import numpy as np
import pandas as pd

df = pd.DataFrame({"age": [25, np.nan, 35], "city": ["Pune", "Delhi", None]})
print(df.dropna())                          # any missing value -> row gone
print(df.dropna(subset=["age"]).shape)      # only look at age
print(df.fillna({"age": df["age"].mean(), "city": "Unknown"}))'''),
 dict(after="What is the difference between StandardScaler and MinMaxScaler?", level='Basics',
  q="What is the difference between fit(), transform() and fit_transform()?",
  a="fit() learns something from the data, like the mean and standard deviation for a scaler, and stores it in the object. transform() applies what was learned to data, and fit_transform() does both in one step on the same data. The key rule is that I call fit_transform() on the training set and only transform() on the test set, because fitting on test data leaks information.",
  code=r'''from sklearn.preprocessing import StandardScaler

X_train = [[10], [20], [30]]
X_test = [[40]]

scaler = StandardScaler()
print(scaler.fit_transform(X_train).ravel().round(2))   # learn + apply
print("learned mean:", scaler.mean_[0])
print(scaler.transform(X_test).ravel().round(2))        # reuse the train mean/std'''),
 dict(after="What is data leakage and how do pipelines prevent it?", level='Intermediate',
  q="What is a ColumnTransformer and when do you use it?",
  a="A ColumnTransformer applies different preprocessing to different columns, for example scaling the numeric ones and one-hot encoding the categorical ones, and joins the results into one feature matrix. I put it as the first step of a Pipeline, so everything is fitted on training data only and the same steps run at prediction time. Its remainder option ('drop' or 'passthrough') decides what happens to the columns I didn't list.",
  code=r'''import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler

df = pd.DataFrame({"age": [20, 30, 40], "city": ["Pune", "Delhi", "Pune"]})
ct = ColumnTransformer([("num", StandardScaler(), ["age"]),
                        ("cat", OneHotEncoder(), ["city"])])
print(ct.fit_transform(df).round(2))
print(list(ct.get_feature_names_out()))'''),
 # ---- Supervised algorithms
 dict(after="How does logistic regression work?", level='Basics',
  q="What is the difference between predict() and predict_proba()?",
  a="predict() returns the final class label, while predict_proba() returns the probability of each class, one column per class in the order of model.classes_. For a binary problem predict() is basically predict_proba() with a 0.5 cut-off. I use the probabilities when I need to rank customers by risk, compute ROC-AUC, or pick my own threshold, like flagging fraud above 0.3.",
  code=r'''from sklearn.linear_model import LogisticRegression

X = [[1], [2], [3], [4], [5], [6]]
y = [0, 0, 0, 1, 1, 1]
model = LogisticRegression().fit(X, y)

print(model.classes_, model.predict([[3], [4]]))
proba = model.predict_proba([[3], [4]])
print(proba.round(2))
print((proba[:, 1] > 0.3).astype(int))       # my own threshold'''),
 dict(after="What is regularization? L1 vs L2?", level='Intermediate',
  q="What are loss functions like MSE and cross-entropy?",
  a="A loss function measures how wrong the model's predictions are, and training means finding the parameters that make it as small as possible. For regression I usually use mean squared error, which punishes big errors heavily. For classification I use cross-entropy (log loss), which looks at the probability given to the true class and punishes confident wrong answers very hard. The loss is what the optimizer minimizes, while metrics like accuracy are what I report.",
  code=r'''import numpy as np
from sklearn.metrics import log_loss, mean_squared_error

print(mean_squared_error([3, 5], [2.5, 7]))       # (0.5² + 2²) / 2
y = [1, 0]
print(round(log_loss(y, [0.9, 0.2]), 3))          # confident and right
print(round(log_loss(y, [0.1, 0.8]), 3))          # confident and wrong
print(round(float(-np.log(0.9)), 3))              # loss of one good point'''),
 dict(after="What is gradient descent and the learning rate?", level='Intermediate',
  q="What is the difference between batch, stochastic and mini-batch gradient descent?",
  a="They differ in how many samples are used for each weight update. Batch gradient descent uses the whole dataset per step, so updates are smooth but slow on big data. Stochastic gradient descent (SGD) updates after every single sample, which is fast but noisy. Mini-batch, usually 32 to 256 samples, is the middle ground and the default in deep learning because it is both stable and fast on GPUs.",
  code=r'''import numpy as np
X = np.arange(1, 9) / 8; y = 2 * X           # true weight is 2
def one_epoch(batch_size, lr=0.5):
    w, updates = 0.0, 0
    for i in range(0, len(X), batch_size):
        xb, yb = X[i:i + batch_size], y[i:i + batch_size]
        w -= lr * np.mean(2 * (w * xb - yb) * xb); updates += 1
    return round(float(w), 3), updates
for name, bs in [("batch", 8), ("mini-batch", 4), ("stochastic", 1)]:
    print(f"{name:10} (w, updates) after 1 epoch:", one_epoch(bs))'''),
 # ---- Unsupervised
 dict(after="How does K-means clustering work?", level='Intermediate',
  q="How do you choose k in K-means with the elbow method and silhouette score?",
  a="With the elbow method I fit K-means for several values of k and look at the inertia (the sum of squared distances to the centers); it always goes down, so I pick the k where the drop flattens out, the 'elbow'. The silhouette score measures how well each point fits its own cluster compared to the nearest other one, from -1 to 1, and higher is better. I use both together with business sense, because the number of segments also has to be useful.",
  code=r'''from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=150, centers=3, random_state=0)
for k in [2, 3, 4, 5]:
    km = KMeans(n_clusters=k, n_init=10, random_state=0).fit(X)
    print(k, "inertia:", round(km.inertia_), "silhouette:", round(silhouette_score(X, km.labels_), 3))'''),
 dict(after="How do you choose k in K-means with the elbow method and silhouette score?", level='Intermediate',
  q="What is DBSCAN and how is it different from K-means?",
  a="DBSCAN groups points that are packed closely together: a point with at least min_samples neighbors within distance eps is a core point, and clusters grow out from those. Unlike K-means, I don't choose the number of clusters, it can find odd-shaped clusters, and points that don't belong anywhere get the label -1 as noise. The tricky part is choosing eps, and because it uses distances I scale the features first.",
  code=r'''from sklearn.cluster import DBSCAN, KMeans

X = [[1, 1], [1.2, 1.1], [0.9, 1], [8, 8], [8.1, 7.9], [7.9, 8.2], [4, 15]]

print(DBSCAN(eps=0.5, min_samples=2).fit(X).labels_)    # -1 = noise
print(KMeans(n_clusters=2, n_init=10, random_state=0).fit(X).labels_)'''),
 dict(after="What is DBSCAN and how is it different from K-means?", level='Intermediate',
  q="What is the curse of dimensionality?",
  a="As I add more features, the space grows so fast that the data becomes very sparse, and points start to look almost equally far from each other. Distance-based methods like KNN and K-means then lose their meaning, and models need far more data to avoid overfitting. I fight it with feature selection, PCA or regularization instead of throwing every column into the model.",
  code=r'''import numpy as np

rng = np.random.default_rng(0)
for dims in [2, 10, 100, 1000]:
    X = rng.random((200, dims))
    d = np.linalg.norm(X - X[0], axis=1)[1:]      # distances from one point
    print(f"{dims:4} dims: nearest/farthest = {d.min() / d.max():.2f}")'''),
 # ---- Evaluation
 dict(after="What is a confusion matrix?", level='Intermediate',
  q="What are false positives and false negatives (Type I and Type II errors)?",
  a="A false positive (Type I error) is when the model says yes but the truth is no, like a normal email flagged as spam. A false negative (Type II error) is when the model says no but the truth is yes, like a disease case the test missed. Which one is worse depends on the business: in disease screening I care most about false negatives, so I watch recall, and in spam filtering false positives hurt more, so I watch precision.",
  code=r'''from sklearn.metrics import confusion_matrix

y_true = [1, 0, 1, 1, 0, 0, 1, 0]
y_pred = [1, 1, 0, 1, 0, 0, 1, 0]
tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

print("TP:", tp, "FP (Type I):", fp, "FN (Type II):", fn, "TN:", tn)
print("precision:", tp / (tp + fp), "recall:", tp / (tp + fn))'''),
 # ---- Validation & tuning
 dict(after="How do you tune hyperparameters with GridSearchCV?", level='Intermediate',
  q="What is the difference between GridSearchCV and RandomizedSearchCV?",
  a="GridSearchCV tries every combination in the grid, so the cost multiplies with each extra hyperparameter. RandomizedSearchCV tries a fixed number of random combinations (n_iter), and it can sample from distributions instead of fixed lists. With many hyperparameters I start with a randomized search to find a good region quickly, then maybe run a small grid around the best values.",
  code=r'''from scipy.stats import randint
from sklearn.datasets import load_iris
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.tree import DecisionTreeClassifier

X, y = load_iris(return_X_y=True)
tree = DecisionTreeClassifier(random_state=0)
grid = GridSearchCV(tree, {"max_depth": [2, 3, 4], "min_samples_leaf": [1, 5, 10]}, cv=3).fit(X, y)
rand = RandomizedSearchCV(tree, {"max_depth": randint(2, 10), "min_samples_leaf": randint(1, 20)}, n_iter=4, cv=3, random_state=0).fit(X, y)
print("grid tried:", len(grid.cv_results_["params"]), "| random tried:", len(rand.cv_results_["params"]))'''),
 # ---- Deep learning
 dict(after="What is backpropagation?", level='Advanced',
  q="What are vanishing and exploding gradients?",
  a="In backpropagation the gradient is multiplied layer by layer. If those factors are below 1, like the sigmoid's derivative which is at most 0.25, the gradient shrinks toward zero and the early layers stop learning: vanishing gradients. If they are above 1 it blows up and training turns into NaNs: exploding gradients. I fix them with ReLU activations, good weight initialization, batch normalization and residual connections, plus gradient clipping for the exploding case.",
  code=r'''import numpy as np

for layers in [5, 10, 20]:
    print(f"{layers:2} layers: sigmoid 0.25^n = {0.25 ** layers:.1e} | factor 1.5^n = {1.5 ** layers:.1e}")

g = np.array([30.0, 40.0])                       # a huge gradient (norm 50)
clipped = g * min(1, 5 / np.linalg.norm(g))      # clip the norm to 5
print(clipped)'''),
 dict(after="What are vanishing and exploding gradients?", level='Advanced',
  q="What are optimizers like SGD with momentum and Adam?",
  a="An optimizer decides how to update the weights from the gradients. Plain SGD steps straight down the current gradient; momentum keeps a running average of past gradients, so it speeds up in a consistent direction and smooths out zig-zags. Adam combines momentum with a separate adaptive step size for each weight, which is why it's my default for neural networks; well-tuned SGD with momentum is still popular for some vision models.",
  code=r'''import numpy as np
grad = lambda w: np.array([0.2, 4.0]) * w      # flat in one direction, steep in the other
sgd, mom, adam = np.ones(2), np.ones(2), np.ones(2); v, m, s = np.zeros(2), np.zeros(2), np.zeros(2)
for t in range(1, 31):
    sgd = sgd - 0.2 * grad(sgd)                               # plain step
    v = 0.8 * v + grad(mom); mom = mom - 0.2 * v               # momentum: running sum
    g = grad(adam); m = 0.9 * m + 0.1 * g; s = 0.999 * s + 0.001 * g * g
    adam = adam - 0.1 * (m / (1 - 0.9 ** t)) / (np.sqrt(s / (1 - 0.999 ** t)) + 1e-8)   # per-weight step
dist = lambda w: round(float(np.linalg.norm(w)), 3)
print("distance from best after 30 steps -> SGD:", dist(sgd), "| momentum:", dist(mom), "| Adam:", dist(adam))'''),
 dict(after="What is the difference between CNNs and RNNs?", level='Advanced',
  q="What is transfer learning?",
  a="Transfer learning means reusing a model trained on a big dataset as the starting point for my own task, instead of training from scratch. Usually I freeze the pretrained layers, use them as a feature extractor and train only a small new head on my data, then optionally fine-tune the top layers with a low learning rate. It works because early layers learn general patterns like edges or word meanings, and it lets me get good results from just a few hundred labeled examples.",
  code=r'''from sklearn.datasets import load_digits
from sklearn.decomposition import PCA
from sklearn.linear_model import LogisticRegression

X, y = load_digits(return_X_y=True)
base = PCA(n_components=20, random_state=0).fit(X[:1500])    # stand-in for a pretrained model, then frozen
X_small, y_small = X[1500:1550], y[1500:1550]                 # my task: only 50 labeled images
head = LogisticRegression(max_iter=2000).fit(base.transform(X_small), y_small)   # train only the new head
print("accuracy:", round(head.score(base.transform(X[1600:]), y[1600:]), 3))'''),
 # ---- NLP
 dict(before="How do you build a text classification pipeline with TF-IDF?", level='Intermediate',
  q="What is the difference between bag-of-words and TF-IDF?",
  a="Bag-of-words turns each document into word counts and ignores word order, so very common words like 'the' get big numbers even though they say little. TF-IDF scales each count by how rare the word is across all documents, so words that appear everywhere are pushed down and distinctive words stand out. Both lose word order and meaning, which is why for semantic tasks I move to embeddings.",
  code=r'''from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

docs = ["the cat sat", "the dog sat", "the cat ran"]
bow = CountVectorizer().fit(docs)
print(list(bow.get_feature_names_out()))
print(bow.transform(docs).toarray()[0])                     # counts: 'the' = 1 like the rest
tfidf = TfidfVectorizer().fit(docs)
print(tfidf.transform(docs).toarray()[0].round(2))          # 'the' gets the lowest weight'''),
]
