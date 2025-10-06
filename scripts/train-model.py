#!/usr/bin/env python3
"""
Quick ML Model Training for Kerala Line Break Detection
Trains a simple neural network on the generated dataset
"""

import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib
import os

def load_dataset():
    """Load the generated dataset"""
    try:
        with open('data/kerala_grid_features_10k.csv', 'r') as f:
            df = pd.read_csv(f)
        return df
    except FileNotFoundError:
        print("Dataset not found. Please run generate-dataset.py first.")
        return None

def prepare_data(df):
    """Prepare data for training"""
    # Select features
    feature_columns = [
        'current_rms_r', 'current_rms_y', 'current_rms_b',
        'voltage_rms_r', 'voltage_rms_y', 'voltage_rms_b',
        'current_peak_r', 'current_peak_y', 'current_peak_b',
        'voltage_peak_r', 'voltage_peak_y', 'voltage_peak_b',
        'current_unbalance', 'voltage_unbalance',
        'current_drop_ratio', 'voltage_drop_ratio'
    ]
    
    X = df[feature_columns].values
    y = df['label'].values
    
    # Encode labels
    label_map = {'NORMAL': 0, 'LINE_BREAK': 1, 'SHORT_CIRCUIT': 2, 'OVERLOAD': 3}
    y_encoded = np.array([label_map[label] for label in y])
    
    return X, y_encoded, feature_columns

def train_model():
    """Train the ML model"""
    print("🚀 Training ML Model for Kerala Line Break Detection")
    print("=" * 50)
    
    # Load data
    df = load_dataset()
    if df is None:
        return
    
    print(f"📊 Dataset loaded: {len(df)} samples")
    print(f"📊 Classes: {df['label'].value_counts().to_dict()}")
    
    # Prepare data
    X, y, feature_columns = prepare_data(df)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train model
    print("\n🤖 Training Neural Network...")
    model = MLPClassifier(
        hidden_layer_sizes=(64, 32),
        activation='relu',
        solver='adam',
        alpha=0.001,
        batch_size=32,
        learning_rate='adaptive',
        max_iter=500,
        random_state=42
    )
    
    model.fit(X_train_scaled, y_train)
    
    # Evaluate model
    print("\n📈 Evaluating Model...")
    train_score = model.score(X_train_scaled, y_train)
    test_score = model.score(X_test_scaled, y_test)
    
    print(f"Training Accuracy: {train_score:.4f}")
    print(f"Test Accuracy: {test_score:.4f}")
    
    # Predictions
    y_pred = model.predict(X_test_scaled)
    
    # Classification report
    class_names = ['NORMAL', 'LINE_BREAK', 'SHORT_CIRCUIT', 'OVERLOAD']
    print("\n📊 Classification Report:")
    print(classification_report(y_test, y_pred, target_names=class_names))
    
    # Save model and scaler
    os.makedirs('server/ml', exist_ok=True)
    
    # Save model (simplified for demo)
    model_data = {
        'coefs': [coef.tolist() for coef in model.coefs_],
        'intercepts': [intercept.tolist() for intercept in model.intercepts_],
        'n_layers': model.n_layers_,
        'n_outputs': model.n_outputs_,
        'classes': model.classes_.tolist(),
        'feature_columns': feature_columns
    }
    
    with open('server/ml/model.json', 'w') as f:
        json.dump(model_data, f, indent=2)
    
    # Save scaler
    scaler_data = {
        'mean': scaler.mean_.tolist(),
        'std': scaler.scale_.tolist(),
        'feature_columns': feature_columns
    }
    
    with open('server/ml/scaler.json', 'w') as f:
        json.dump(scaler_data, f, indent=2)
    
    print("\n✅ Model saved to server/ml/model.json")
    print("✅ Scaler saved to server/ml/scaler.json")
    
    # Calculate metrics
    from sklearn.metrics import precision_recall_fscore_support
    precision, recall, f1, support = precision_recall_fscore_support(y_test, y_pred, average='weighted')
    
    metrics = {
        'accuracy': float(test_score),
        'precision': float(precision),
        'recall': float(recall),
        'f1_score': float(f1),
        'false_positive_rate': float(1 - recall),  # Simplified
        'dataset_size': len(df),
        'training_samples': len(X_train),
        'test_samples': len(X_test)
    }
    
    with open('server/ml/metrics.json', 'w') as f:
        json.dump(metrics, f, indent=2)
    
    print(f"\n🎉 Model training completed!")
    print(f"📊 Final Metrics: {metrics}")

if __name__ == '__main__':
    train_model()
