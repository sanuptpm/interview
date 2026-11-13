NEW = {}
NEW[38] = r'''
import numpy as np
from sklearn.feature_selection import SelectKBest, f_classif

rng = np.random.default_rng(0)
y = np.array([0, 1] * 50)
X = np.column_stack([y + rng.normal(0, 0.5, 100),     # useful
                     rng.normal(size=100),            # pure noise
                     2 * y + rng.normal(0, 2, 100)])  # weakly useful
skb = SelectKBest(f_classif, k=2).fit(X, y)
print("F-scores:", skb.scores_.round(1).tolist())
print("Selected columns:", skb.get_support(indices=True).tolist())
'''
NEW[14] = r'''
import pandas as pd

df = pd.DataFrame({"age": [25, 32, 47, None],
                   "city": ["A", "B", "A", "A"],
                   "churned": [1, 0, 0, 1]})
print(df.shape)
print(df.isna().sum().to_dict())
print(df["age"].describe()[["mean", "min", "max"]].round(1).to_dict())
print(df["city"].value_counts().to_dict())
print(df["churned"].mean())          # target balance
'''
