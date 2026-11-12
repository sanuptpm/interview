// Sub-topic order for the aiMl page: related questions are shown together.
// Each question title appears in exactly one topic, in the order shown on the page.
export default [
  {
    topic: 'ML fundamentals',
    questions: [
      "What is the difference between AI, ML and deep learning?",
      "What are supervised, unsupervised and reinforcement learning?",
      "What is the difference between classification and regression?",
      "What are features and labels?",
      "What does a typical ML workflow look like?",
      "What is overfitting and underfitting?",
      "What is the bias-variance tradeoff?",
    ],
  },
  {
    topic: 'Data preparation',
    questions: [
      "Why do we split data into training, validation and test sets?",
      "How does train_test_split work and why use stratify?",
      "How do you do quick exploratory data analysis (EDA) with pandas?",
      "How do you clean data with pandas, like removing duplicates and outliers?",
      "How do you handle missing values?",
      "What is the difference between StandardScaler and MinMaxScaler?",
      "What is the difference between one-hot encoding and label encoding?",
      "How do you handle categorical features with very many categories?",
      "What is data leakage and how do pipelines prevent it?",
      "How do you split time series data for training and validation?",
    ],
  },
  {
    topic: 'Feature engineering',
    questions: [
      "What is feature engineering?",
      "How do you create time series features like moving averages and lags?",
      "How do you do feature selection?",
      "How do you explain which features a model relies on?",
    ],
  },
  {
    topic: 'Supervised algorithms',
    questions: [
      "How does linear regression work?",
      "How does logistic regression work?",
      "How does a decision tree work?",
      "How does K-Nearest Neighbors (KNN) work?",
      "What is a Support Vector Machine (SVM)?",
      "What is Naive Bayes?",
      "What is regularization? L1 vs L2?",
      "What is gradient descent and the learning rate?",
    ],
  },
  {
    topic: 'Ensembles',
    questions: [
      "What is a random forest?",
      "What is the difference between bagging and boosting?",
      "What is gradient boosting (and XGBoost)?",
    ],
  },
  {
    topic: 'Unsupervised learning',
    questions: [
      "How does K-means clustering work?",
      "What is PCA and what is explained variance?",
      "How does anomaly detection with Isolation Forest work?",
      "How does a recommendation system with collaborative filtering work?",
    ],
  },
  {
    topic: 'Evaluation metrics',
    questions: [
      "What are accuracy, precision, recall and F1-score?",
      "What is a confusion matrix?",
      "What is ROC-AUC?",
      "What are MAE, MSE, RMSE and R² for regression?",
      "Why does accuracy fail on imbalanced data and how do you handle imbalance?",
      "How does oversampling like SMOTE help with class imbalance?",
      "How do you use a precision-recall curve to tune the decision threshold?",
    ],
  },
  {
    topic: 'Validation & tuning',
    questions: [
      "What is k-fold cross-validation?",
      "How do you tune hyperparameters with GridSearchCV?",
      "What are learning curves and what do they tell you?",
      "How do you run a simple A/B test?",
    ],
  },
  {
    topic: 'Deep learning',
    questions: [
      "What is a neural network and a neuron?",
      "What are activation functions like sigmoid, ReLU and softmax?",
      "What is backpropagation?",
      "What are epochs, batches and iterations?",
      "What is early stopping?",
      "What do dropout and batch normalization do?",
      "What is the difference between CNNs and RNNs?",
    ],
  },
  {
    topic: 'NLP & embeddings',
    questions: [
      "How do you build a text classification pipeline with TF-IDF?",
      "What is the difference between one-hot vectors and word embeddings?",
      "What are embeddings and cosine similarity?",
      "What are transformers and the attention mechanism?",
    ],
  },
  {
    topic: 'LLMs & prompting',
    questions: [
      "What is a Large Language Model (LLM)?",
      "What are tokens and the context window?",
      "What is temperature and sampling in LLMs?",
      "What is prompt engineering?",
      "What are hallucinations and how do you reduce them?",
      "How do you evaluate LLM outputs?",
      "When do you use prompting vs RAG vs fine-tuning?",
      "How do LLM agents and tool calling work?",
      "How do you think about cost and latency tradeoffs in LLM apps?",
    ],
  },
  {
    topic: 'RAG & vector search',
    questions: [
      "What is RAG (Retrieval-Augmented Generation)?",
      "What is a vector database?",
      "How do you chunk documents for RAG?",
      "How do you evaluate the retrieval part of a RAG system?",
    ],
  },
  {
    topic: 'MLOps & responsible AI',
    questions: [
      "How do you save and deploy an ML model?",
      "What is MLOps and how do you monitor models for drift?",
      "What is responsible AI and how do you check a model for bias?",
    ],
  },
]
