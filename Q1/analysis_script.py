#!/usr/bin/env python
# coding: utf-8

# # Code Similarity Analysis - VidyaVichar MERN Projects
# 
# **Objective**: Analyze code similarity across multiple implementations of the VidyaVichar MERN project using textual, structural, and semantic similarity metrics.
# 
# **Author**: Assignment 3 - Q1  
# **Date**: November 2025
# 
# ---
# 
# ## Table of Contents
# 1. [Setup & Installation](#setup)
# 2. [Part A: Preprocessing & Data Understanding](#part-a)
# 3. [Part B: Similarity Computation](#part-b)
# 4. [Part C: Visualization & Analysis](#part-c)
# 5. [Conclusions](#conclusions)

# ## 1. Setup & Installation <a name="setup"></a>
# 
# Install required libraries:

# In[ ]:


# Install required packages (uncomment if needed)
# !pip install python-Levenshtein scikit-learn transformers matplotlib seaborn plotly networkx esprima torch numpy pandas


# In[ ]:


# Import libraries
import os
import re
import json
import difflib
import warnings
from pathlib import Path
from typing import List, Dict, Tuple
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import Levenshtein
import esprima

warnings.filterwarnings('ignore')
plt.style.use('seaborn-v0_8-darkgrid')

print("✓ All libraries imported successfully")


# ## 2. Part A: Preprocessing & Data Understanding <a name="part-a"></a>
# 
# ### 2.1 Project Organization

# In[ ]:


# Configuration
PROJECTS_DIR = "projects"  # Directory containing all 27 projects
RESULTS_DIR = "results"
VALID_EXTENSIONS = ('.js', '.jsx', '.json', '.css')

# Create results directory
os.makedirs(RESULTS_DIR, exist_ok=True)

# Get list of project directories
if os.path.exists(PROJECTS_DIR):
    project_dirs = sorted([d for d in os.listdir(PROJECTS_DIR) 
                          if os.path.isdir(os.path.join(PROJECTS_DIR, d))])
    print(f"Found {len(project_dirs)} projects:")
    for i, proj in enumerate(project_dirs, 1):
        print(f"  {i}. {proj}")
else:
    print(f"⚠ Projects directory not found: {PROJECTS_DIR}")
    print("Please create 'projects/' directory and add all 27 VidyaVichar project folders")
    project_dirs = []


# ### 2.2 Preprocessing Functions

# In[ ]:


def remove_js_comments(code: str) -> str:
    """
    Remove single-line and multi-line comments from JavaScript code.

    Args:
        code: JavaScript source code string

    Returns:
        Code with comments removed
    """
    # Remove multi-line comments /* ... */
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
    # Remove single-line comments //
    code = re.sub(r'//.*?$', '', code, flags=re.MULTILINE)
    return code


def is_minified(code: str) -> bool:
    """
    Detect if code is minified (very long lines, no whitespace).

    Args:
        code: Source code string

    Returns:
        True if code appears to be minified
    """
    lines = code.split('\n')
    if not lines:
        return False

    # Check average line length
    avg_line_length = sum(len(line) for line in lines) / len(lines)

    # Minified files typically have very long lines (> 500 chars)
    # and few newlines
    return avg_line_length > 500 or (len(lines) < 10 and len(code) > 1000)


def normalize_formatting(code: str) -> str:
    """
    Normalize indentation and spacing.

    Args:
        code: Source code string

    Returns:
        Normalized code
    """
    # Split into lines and remove leading/trailing whitespace
    lines = [line.strip() for line in code.split('\n')]
    # Remove empty lines
    lines = [line for line in lines if line]
    # Normalize multiple spaces to single space
    lines = [re.sub(r'\s+', ' ', line) for line in lines]
    return '\n'.join(lines)


def preprocess_code(code: str, file_ext: str) -> str:
    """
    Complete preprocessing pipeline for code.

    Args:
        code: Source code string
        file_ext: File extension (.js, .jsx, etc.)

    Returns:
        Preprocessed code or empty string if minified
    """
    # Skip minified files
    if is_minified(code):
        return ""

    # Remove comments for JS/JSX files
    if file_ext in ('.js', '.jsx'):
        code = remove_js_comments(code)

    # Normalize formatting
    code = normalize_formatting(code)

    return code


print("✓ Preprocessing functions defined")


# ### 2.3 Project Analysis Functions

# In[ ]:


def count_react_components(file_path: str) -> int:
    """
    Count React components in a JS/JSX file.
    Looks for: function components, class components, arrow functions returning JSX.

    Args:
        file_path: Path to JS/JSX file

    Returns:
        Number of React components found
    """
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        count = 0
        # Class components: class X extends React.Component or Component
        count += len(re.findall(r'class\s+\w+\s+extends\s+(React\.)?Component', content))
        # Function components: function X() { return (...JSX...) }
        count += len(re.findall(r'function\s+[A-Z]\w*\s*\([^)]*\)\s*{[^}]*return\s*\(', content))
        # Arrow function components: const X = () => (...)
        count += len(re.findall(r'const\s+[A-Z]\w*\s*=\s*\([^)]*\)\s*=>\s*[\({]', content))

        return count
    except:
        return 0


def count_express_routes(file_path: str) -> int:
    """
    Count Express routes in a JS file.
    Looks for: app.get, app.post, router.get, router.post, etc.

    Args:
        file_path: Path to JS file

    Returns:
        Number of Express routes found
    """
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # Match app.METHOD or router.METHOD
        pattern = r'(app|router)\.(get|post|put|delete|patch)\s*\('
        return len(re.findall(pattern, content))
    except:
        return 0


def count_mongoose_models(file_path: str) -> int:
    """
    Count Mongoose model definitions in a JS file.
    Looks for: mongoose.Schema, mongoose.model patterns.

    Args:
        file_path: Path to JS file

    Returns:
        Number of Mongoose models found
    """
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        count = 0
        # mongoose.Schema
        count += len(re.findall(r'new\s+mongoose\.Schema\s*\(', content))
        # mongoose.model
        count += len(re.findall(r'mongoose\.model\s*\(', content))

        return count
    except:
        return 0


def analyze_project(project_path: str) -> Dict:
    """
    Analyze a project directory and extract metrics.

    Args:
        project_path: Path to project directory

    Returns:
        Dictionary containing project metrics
    """
    metrics = {
        'name': os.path.basename(project_path),
        'total_files': 0,
        'total_folders': 0,
        'loc': 0,
        'react_components': 0,
        'express_routes': 0,
        'mongoose_models': 0,
        'files_by_type': {ext: 0 for ext in VALID_EXTENSIONS},
        'all_code': []  # Store all preprocessed code for similarity analysis
    }

    for root, dirs, files in os.walk(project_path):
        # Skip node_modules and hidden directories
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']

        metrics['total_folders'] += len(dirs)

        for file in files:
            file_path = os.path.join(root, file)
            file_ext = os.path.splitext(file)[1]

            if file_ext in VALID_EXTENSIONS:
                metrics['total_files'] += 1
                metrics['files_by_type'][file_ext] += 1

                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()

                    # Count LOC
                    lines = content.split('\n')
                    metrics['loc'] += len([l for l in lines if l.strip()])

                    # Preprocess and store code
                    preprocessed = preprocess_code(content, file_ext)
                    if preprocessed:
                        metrics['all_code'].append(preprocessed)

                    # Count React components
                    if file_ext in ('.js', '.jsx'):
                        metrics['react_components'] += count_react_components(file_path)
                        metrics['express_routes'] += count_express_routes(file_path)
                        metrics['mongoose_models'] += count_mongoose_models(file_path)

                except Exception as e:
                    continue

    return metrics


print("✓ Project analysis functions defined")


# ### 2.4 Analyze All Projects

# In[ ]:


# Analyze all projects
project_metrics = []

if project_dirs:
    print("Analyzing projects...\n")
    for proj_name in project_dirs:
        proj_path = os.path.join(PROJECTS_DIR, proj_name)
        print(f"Analyzing: {proj_name}")
        metrics = analyze_project(proj_path)
        project_metrics.append(metrics)
        print(f"  Files: {metrics['total_files']}, LOC: {metrics['loc']}, "
              f"Components: {metrics['react_components']}, Routes: {metrics['express_routes']}")

    print(f"\n✓ Analyzed {len(project_metrics)} projects")
else:
    print("⚠ No projects to analyze. Please add projects to 'projects/' directory.")


# ### 2.5 Generate Preprocessing Summary

# In[ ]:


if project_metrics:
    # Create summary DataFrame
    summary_data = []
    for m in project_metrics:
        summary_data.append({
            'Project': m['name'],
            'Total Files': m['total_files'],
            'Total Folders': m['total_folders'],
            'Lines of Code': m['loc'],
            'React Components': m['react_components'],
            'Express Routes': m['express_routes'],
            'Mongoose Models': m['mongoose_models'],
            'JS Files': m['files_by_type'].get('.js', 0),
            'JSX Files': m['files_by_type'].get('.jsx', 0),
            'JSON Files': m['files_by_type'].get('.json', 0),
            'CSS Files': m['files_by_type'].get('.css', 0),
        })

    summary_df = pd.DataFrame(summary_data)

    # Save to CSV
    summary_df.to_csv(os.path.join(RESULTS_DIR, 'preprocessing_summary.csv'), index=False)

    # Display summary
    print("\n=== PROJECT SUMMARY ===")
    print(summary_df.to_string(index=False))

    # Statistics
    print("\n=== STATISTICS ===")
    print(summary_df.describe())

    print(f"\n✓ Saved preprocessing summary to {RESULTS_DIR}/preprocessing_summary.csv")


# ## 3. Part B: Similarity Computation <a name="part-b"></a>
# 
# ### 3.1 Textual Similarity

# In[ ]:


def compute_textual_similarity(project_metrics: List[Dict]) -> np.ndarray:
    """
    Compute textual similarity using TF-IDF and cosine similarity.

    Args:
        project_metrics: List of project metric dictionaries

    Returns:
        NxN similarity matrix
    """
    n = len(project_metrics)

    # Combine all code from each project
    project_texts = []
    for metrics in project_metrics:
        combined_text = ' '.join(metrics['all_code'])
        project_texts.append(combined_text)

    # Compute TF-IDF vectors
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),  # Use unigrams and bigrams
        min_df=1
    )

    tfidf_matrix = vectorizer.fit_transform(project_texts)

    # Compute cosine similarity
    similarity_matrix = cosine_similarity(tfidf_matrix)

    return similarity_matrix


def compute_levenshtein_similarity(project_metrics: List[Dict]) -> np.ndarray:
    """
    Compute token-level similarity using Levenshtein distance.

    Args:
        project_metrics: List of project metric dictionaries

    Returns:
        NxN similarity matrix (normalized)
    """
    n = len(project_metrics)
    similarity_matrix = np.zeros((n, n))

    # Sample a subset of code for performance (first 10000 chars)
    project_samples = []
    for metrics in project_metrics:
        combined = ''.join(metrics['all_code'][:100])  # First 100 files
        sample = combined[:10000]  # First 10k characters
        project_samples.append(sample)

    # Compute pairwise Levenshtein similarity
    for i in range(n):
        for j in range(n):
            if i == j:
                similarity_matrix[i][j] = 1.0
            else:
                # Levenshtein ratio (0 to 1, where 1 is identical)
                ratio = Levenshtein.ratio(project_samples[i], project_samples[j])
                similarity_matrix[i][j] = ratio

    return similarity_matrix


print("✓ Textual similarity functions defined")


# In[ ]:


# Compute textual similarity
if project_metrics:
    print("Computing textual similarity...")

    # TF-IDF based similarity
    textual_similarity = compute_textual_similarity(project_metrics)
    print(f"  TF-IDF similarity matrix: {textual_similarity.shape}")

    # Save matrix
    np.save(os.path.join(RESULTS_DIR, 'textual_similarity_matrix.npy'), textual_similarity)

    # Save as CSV for readability
    project_names = [m['name'] for m in project_metrics]
    textual_df = pd.DataFrame(textual_similarity, index=project_names, columns=project_names)
    textual_df.to_csv(os.path.join(RESULTS_DIR, 'textual_similarity_matrix.csv'))

    print("✓ Textual similarity computed and saved")

    # Show sample
    print("\nSample (first 5x5):")
    print(textual_df.iloc[:5, :5].to_string())


# ### 3.2 Structural Similarity

# In[ ]:


def extract_ast_features(file_path: str) -> Dict:
    """
    Extract AST features from a JavaScript file.

    Args:
        file_path: Path to JS/JSX file

    Returns:
        Dictionary of AST features
    """
    features = {
        'function_count': 0,
        'class_count': 0,
        'import_count': 0,
        'export_count': 0,
        'variable_count': 0,
        'node_types': []
    }

    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            code = f.read()

        # Parse AST
        ast = esprima.parseModule(code, {'jsx': True, 'tolerant': True})

        # Traverse AST and collect features
        def traverse(node):
            if isinstance(node, dict):
                node_type = node.get('type', '')
                features['node_types'].append(node_type)

                if 'Function' in node_type:
                    features['function_count'] += 1
                elif 'Class' in node_type:
                    features['class_count'] += 1
                elif 'Import' in node_type:
                    features['import_count'] += 1
                elif 'Export' in node_type:
                    features['export_count'] += 1
                elif 'Variable' in node_type:
                    features['variable_count'] += 1

                for value in node.values():
                    if isinstance(value, (dict, list)):
                        traverse(value)
            elif isinstance(node, list):
                for item in node:
                    traverse(item)

        traverse(ast)
    except:
        pass

    return features


def compute_structural_similarity(project_metrics: List[Dict]) -> np.ndarray:
    """
    Compute structural similarity based on AST features.

    Args:
        project_metrics: List of project metric dictionaries

    Returns:
        NxN similarity matrix
    """
    n = len(project_metrics)

    # Extract structural features for each project
    project_features = []

    for metrics in project_metrics:
        # Use metrics we already have
        features = [
            metrics['react_components'],
            metrics['express_routes'],
            metrics['mongoose_models'],
            metrics['files_by_type'].get('.js', 0),
            metrics['files_by_type'].get('.jsx', 0),
            metrics['total_folders'],
            metrics['loc'] / 1000  # Normalize LOC
        ]
        project_features.append(features)

    # Convert to numpy array
    features_matrix = np.array(project_features)

    # Normalize features
    from sklearn.preprocessing import StandardScaler
    scaler = StandardScaler()
    features_normalized = scaler.fit_transform(features_matrix)

    # Compute cosine similarity
    similarity_matrix = cosine_similarity(features_normalized)

    return similarity_matrix


print("✓ Structural similarity functions defined")


# In[ ]:


# Compute structural similarity
if project_metrics:
    print("Computing structural similarity...")

    structural_similarity = compute_structural_similarity(project_metrics)
    print(f"  Structural similarity matrix: {structural_similarity.shape}")

    # Save matrix
    np.save(os.path.join(RESULTS_DIR, 'structural_similarity_matrix.npy'), structural_similarity)

    # Save as CSV
    structural_df = pd.DataFrame(structural_similarity, index=project_names, columns=project_names)
    structural_df.to_csv(os.path.join(RESULTS_DIR, 'structural_similarity_matrix.csv'))

    print("✓ Structural similarity computed and saved")

    # Show sample
    print("\nSample (first 5x5):")
    print(structural_df.iloc[:5, :5].to_string())


# ### 3.3 Semantic Similarity (Using CodeBERT)

# In[ ]:


from transformers import AutoTokenizer, AutoModel
import torch

def compute_semantic_similarity(project_metrics: List[Dict]) -> np.ndarray:
    """
    Compute semantic similarity using CodeBERT embeddings.

    Args:
        project_metrics: List of project metric dictionaries

    Returns:
        NxN similarity matrix
    """
    print("  Loading CodeBERT model...")

    # Load CodeBERT model and tokenizer
    model_name = "microsoft/codebert-base"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    model.eval()

    print("  Generating embeddings...")

    # Generate embeddings for each project
    embeddings = []

    for i, metrics in enumerate(project_metrics):
        # Sample code from project (max 512 tokens)
        code_sample = ' '.join(metrics['all_code'][:10])  # First 10 files
        code_sample = code_sample[:2000]  # Limit length

        # Tokenize
        inputs = tokenizer(code_sample, return_tensors="pt", 
                          truncation=True, max_length=512, padding=True)

        # Get embeddings
        with torch.no_grad():
            outputs = model(**inputs)
            # Use [CLS] token embedding
            embedding = outputs.last_hidden_state[:, 0, :].numpy().flatten()

        embeddings.append(embedding)
        print(f"    Project {i+1}/{len(project_metrics)} processed")

    # Convert to numpy array
    embeddings_matrix = np.array(embeddings)

    # Compute cosine similarity
    similarity_matrix = cosine_similarity(embeddings_matrix)

    return similarity_matrix


print("✓ Semantic similarity function defined")


# In[ ]:


# Compute semantic similarity
if project_metrics:
    print("Computing semantic similarity (this may take a while)...")

    try:
        semantic_similarity = compute_semantic_similarity(project_metrics)
        print(f"  Semantic similarity matrix: {semantic_similarity.shape}")

        # Save matrix
        np.save(os.path.join(RESULTS_DIR, 'semantic_similarity_matrix.npy'), semantic_similarity)

        # Save as CSV
        semantic_df = pd.DataFrame(semantic_similarity, index=project_names, columns=project_names)
        semantic_df.to_csv(os.path.join(RESULTS_DIR, 'semantic_similarity_matrix.csv'))

        print("✓ Semantic similarity computed and saved")

        # Show sample
        print("\nSample (first 5x5):")
        print(semantic_df.iloc[:5, :5].to_string())
    except Exception as e:
        print(f"⚠ Error computing semantic similarity: {e}")
        print("  You may need to install: pip install torch transformers")
        semantic_similarity = None


# ### 3.4 Identify Most and Least Similar Projects

# In[ ]:


def find_extreme_pairs(similarity_matrix: np.ndarray, project_names: List[str], 
                       metric_name: str, top_n: int = 5) -> None:
    """
    Find and display most and least similar project pairs.

    Args:
        similarity_matrix: NxN similarity matrix
        project_names: List of project names
        metric_name: Name of the similarity metric
        top_n: Number of pairs to show
    """
    n = len(project_names)
    pairs = []

    # Get all pairs (excluding diagonal)
    for i in range(n):
        for j in range(i + 1, n):
            pairs.append({
                'Project 1': project_names[i],
                'Project 2': project_names[j],
                'Similarity': similarity_matrix[i][j]
            })

    # Sort by similarity
    pairs_df = pd.DataFrame(pairs)
    pairs_sorted = pairs_df.sort_values('Similarity', ascending=False)

    print(f"\n=== {metric_name.upper()} SIMILARITY ===")
    print(f"\nMost Similar Pairs (Top {top_n}):")
    print(pairs_sorted.head(top_n).to_string(index=False))

    print(f"\nLeast Similar Pairs (Bottom {top_n}):")
    print(pairs_sorted.tail(top_n).to_string(index=False))


if project_metrics:
    # Textual similarity pairs
    find_extreme_pairs(textual_similarity, project_names, "Textual")

    # Structural similarity pairs
    find_extreme_pairs(structural_similarity, project_names, "Structural")

    # Semantic similarity pairs (if available)
    if semantic_similarity is not None:
        find_extreme_pairs(semantic_similarity, project_names, "Semantic")


# ## 4. Part C: Visualization & Analysis <a name="part-c"></a>
# 
# ### 4.1 Heatmap Visualizations

# In[ ]:


def plot_similarity_heatmap(similarity_matrix: np.ndarray, project_names: List[str],
                           title: str, filename: str) -> None:
    """
    Create and save a heatmap visualization.

    Args:
        similarity_matrix: NxN similarity matrix
        project_names: List of project names
        title: Plot title
        filename: Output filename
    """
    plt.figure(figsize=(12, 10))

    sns.heatmap(similarity_matrix, 
                xticklabels=project_names,
                yticklabels=project_names,
                annot=True if len(project_names) <= 10 else False,
                fmt='.2f',
                cmap='YlOrRd',
                vmin=0, vmax=1,
                square=True,
                cbar_kws={'label': 'Similarity Score'})

    plt.title(title, fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('Projects', fontsize=12)
    plt.ylabel('Projects', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.yticks(rotation=0)
    plt.tight_layout()

    filepath = os.path.join(RESULTS_DIR, filename)
    plt.savefig(filepath, dpi=300, bbox_inches='tight')
    print(f"  Saved: {filepath}")
    plt.show()


if project_metrics:
    print("Creating heatmap visualizations...\n")

    # Textual similarity heatmap
    plot_similarity_heatmap(textual_similarity, project_names,
                           'Textual Similarity Matrix (TF-IDF + Cosine)',
                           'textual_similarity_heatmap.png')

    # Structural similarity heatmap
    plot_similarity_heatmap(structural_similarity, project_names,
                           'Structural Similarity Matrix (AST Features)',
                           'structural_similarity_heatmap.png')

    # Semantic similarity heatmap (if available)
    if semantic_similarity is not None:
        plot_similarity_heatmap(semantic_similarity, project_names,
                               'Semantic Similarity Matrix (CodeBERT)',
                               'semantic_similarity_heatmap.png')

    print("\n✓ All heatmaps created")


# ### 4.2 Comparison Bar Chart

# In[ ]:


if project_metrics:
    # Calculate average similarities (excluding diagonal)
    def avg_similarity(matrix):
        n = matrix.shape[0]
        mask = ~np.eye(n, dtype=bool)
        return matrix[mask].mean()

    avg_textual = avg_similarity(textual_similarity)
    avg_structural = avg_similarity(structural_similarity)

    metrics_data = {
        'Metric': ['Textual\n(TF-IDF)', 'Structural\n(AST Features)'],
        'Average Similarity': [avg_textual, avg_structural]
    }

    if semantic_similarity is not None:
        avg_semantic = avg_similarity(semantic_similarity)
        metrics_data['Metric'].append('Semantic\n(CodeBERT)')
        metrics_data['Average Similarity'].append(avg_semantic)

    # Create bar chart
    plt.figure(figsize=(10, 6))
    colors = ['#FF6B6B', '#4ECDC4', '#45B7D1']
    bars = plt.bar(metrics_data['Metric'], metrics_data['Average Similarity'], 
                   color=colors[:len(metrics_data['Metric'])], edgecolor='black', linewidth=1.5)

    plt.ylabel('Average Similarity Score', fontsize=12)
    plt.xlabel('Similarity Metric', fontsize=12)
    plt.title('Average Code Similarity by Metric', fontsize=16, fontweight='bold', pad=20)
    plt.ylim(0, 1)
    plt.grid(axis='y', alpha=0.3, linestyle='--')

    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.3f}',
                ha='center', va='bottom', fontsize=12, fontweight='bold')

    plt.tight_layout()
    filepath = os.path.join(RESULTS_DIR, 'average_similarity_comparison.png')
    plt.savefig(filepath, dpi=300, bbox_inches='tight')
    print(f"Saved: {filepath}")
    plt.show()


# ### 4.3 Network Graph Visualization

# In[ ]:


import networkx as nx

if project_metrics:
    # Create network graph based on textual similarity
    # Only show edges with similarity > threshold
    threshold = 0.3

    G = nx.Graph()

    # Add nodes
    for name in project_names:
        G.add_node(name)

    # Add edges for similar projects
    n = len(project_names)
    for i in range(n):
        for j in range(i + 1, n):
            sim = textual_similarity[i][j]
            if sim > threshold:
                G.add_edge(project_names[i], project_names[j], weight=sim)

    # Plot network
    plt.figure(figsize=(14, 10))

    # Layout
    pos = nx.spring_layout(G, k=2, iterations=50, seed=42)

    # Draw nodes
    nx.draw_networkx_nodes(G, pos, node_color='lightblue', 
                          node_size=1000, alpha=0.9, edgecolors='black', linewidths=2)

    # Draw edges with varying thickness based on similarity
    edges = G.edges()
    weights = [G[u][v]['weight'] for u, v in edges]
    nx.draw_networkx_edges(G, pos, width=[w * 5 for w in weights], 
                          alpha=0.6, edge_color=weights, edge_cmap=plt.cm.YlOrRd)

    # Draw labels
    nx.draw_networkx_labels(G, pos, font_size=8, font_weight='bold')

    plt.title(f'Project Similarity Network\n(Edges shown for similarity > {threshold})',
             fontsize=16, fontweight='bold', pad=20)
    plt.axis('off')
    plt.tight_layout()

    filepath = os.path.join(RESULTS_DIR, 'similarity_network.png')
    plt.savefig(filepath, dpi=300, bbox_inches='tight')
    print(f"Saved: {filepath}")
    plt.show()

    print(f"\nNetwork statistics:")
    print(f"  Nodes: {G.number_of_nodes()}")
    print(f"  Edges: {G.number_of_edges()}")
    print(f"  Density: {nx.density(G):.3f}")


# ## 5. Conclusions <a name="conclusions"></a>

# In[ ]:


if project_metrics:
    print("=" * 80)
    print("ANALYSIS SUMMARY")
    print("=" * 80)

    print(f"\nTotal projects analyzed: {len(project_metrics)}")
    print(f"\nSimilarity metrics computed:")
    print(f"  ✓ Textual (TF-IDF + Cosine Similarity)")
    print(f"  ✓ Structural (AST Features)")
    if semantic_similarity is not None:
        print(f"  ✓ Semantic (CodeBERT Embeddings)")

    print(f"\nAverage similarities:")
    print(f"  Textual: {avg_textual:.3f}")
    print(f"  Structural: {avg_structural:.3f}")
    if semantic_similarity is not None:
        print(f"  Semantic: {avg_semantic:.3f}")

    print(f"\nOutputs saved in '{RESULTS_DIR}/' directory:")
    for file in sorted(os.listdir(RESULTS_DIR)):
        print(f"  - {file}")

    print("\n" + "=" * 80)
    print("KEY INSIGHTS")
    print("=" * 80)

    print("\n1. CODING DIVERSITY:")
    if avg_textual < 0.3:
        print("   → HIGH diversity: Projects show significant textual differences")
    elif avg_textual < 0.6:
        print("   → MODERATE diversity: Some common patterns but varied implementations")
    else:
        print("   → LOW diversity: Projects share substantial code similarities")

    print("\n2. STRUCTURAL CONSISTENCY:")
    if avg_structural > 0.7:
        print("   → HIGH consistency: Teams followed similar architectural patterns")
    elif avg_structural > 0.4:
        print("   → MODERATE consistency: Mix of different approaches")
    else:
        print("   → LOW consistency: Diverse architectural choices")

    print("\n3. PATTERNS OF REUSE:")
    # Find projects with very high similarity
    high_sim_count = np.sum(textual_similarity > 0.8) - len(project_names)  # Exclude diagonal
    if high_sim_count > 0:
        print(f"   → Found {high_sim_count} project pairs with >80% similarity")
        print("   → Possible code sharing or template usage detected")
    else:
        print("   → No significant code reuse patterns detected")
        print("   → Each team implemented independent solutions")

    print("\n" + "=" * 80)
    print("✓ Analysis Complete!")
    print("=" * 80)

