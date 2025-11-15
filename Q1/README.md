# Q1: Code Similarity Analysis - VidyaVichar MERN Projects

## Overview

This project implements a comprehensive code similarity analysis framework to quantitatively and qualitatively evaluate code similarity across multiple implementations of the VidyaVichar MERN-stack project. The analysis uses three distinct similarity metrics:

1. **Textual Similarity** - TF-IDF vectorization with cosine similarity
2. **Structural Similarity** - AST features and architectural patterns
3. **Semantic Similarity** - CodeBERT embeddings for deep code understanding

---

## Submission Contents

```
Q1/
├── similarity_analysis.ipynb   # Main Jupyter notebook with complete analysis
├── README.md                    # This file
├── report.pdf                   # Analytical report (to be generated)
├── projects/                    # Directory for 27 VidyaVichar projects (user-provided)
│   ├── Team_01/
│   ├── Team_02/
│   └── ... (27 total)
└── results/                     # Generated outputs
    ├── preprocessing_summary.csv
    ├── textual_similarity_matrix.npy
    ├── textual_similarity_matrix.csv
    ├── textual_similarity_heatmap.png
    ├── structural_similarity_matrix.npy
    ├── structural_similarity_matrix.csv
    ├── structural_similarity_heatmap.png
    ├── semantic_similarity_matrix.npy
    ├── semantic_similarity_matrix.csv
    ├── semantic_similarity_heatmap.png
    ├── average_similarity_comparison.png
    └── similarity_network.png
```

---

## Requirements

### System Requirements
- Python 3.8 or higher
- 4GB+ RAM (8GB+ recommended for CodeBERT)
- 2GB+ free disk space

### Python Libraries

Install all required packages:

```bash
pip install python-Levenshtein scikit-learn transformers matplotlib seaborn plotly networkx esprima torch numpy pandas jupyter
```

**Individual packages:**
- `python-Levenshtein` - Token-level similarity computation
- `scikit-learn` - TF-IDF vectorization and cosine similarity
- `transformers` - CodeBERT model for semantic analysis
- `torch` - PyTorch backend for transformers
- `matplotlib` - Visualization
- `seaborn` - Enhanced heatmaps
- `plotly` - Interactive visualizations (optional)
- `networkx` - Network graph visualization
- `esprima` - JavaScript AST parsing
- `numpy` - Numerical computations
- `pandas` - Data manipulation
- `jupyter` - Notebook execution

---

## Dataset Setup

### IMPORTANT: Dataset Organization

The notebook expects 27 VidyaVichar MERN project folders in the `projects/` directory:

```bash
cd Q1
mkdir -p projects

# Copy all 27 team projects into projects/ directory
cp -r /path/to/Team_01 projects/
cp -r /path/to/Team_02 projects/
...
cp -r /path/to/Team_27 projects/
```

### Expected Project Structure

Each project folder should contain a MERN stack implementation:
- Frontend: React components (`.js`, `.jsx`)
- Backend: Express routes (`.js`)
- Models: Mongoose schemas (`.js`)
- Styles: CSS files (`.css`)
- Config: JSON files (`.json`)

---

## Execution Instructions

### Step 1: Organize Dataset

```bash
# Create projects directory
cd Q1
mkdir -p projects

# Add all 27 VidyaVichar projects to projects/ directory
# Example structure:
# projects/
#   Team_01/
#   Team_02/
#   ...
#   Team_27/
```

### Step 2: Install Dependencies

```bash
# Install all required packages
pip install python-Levenshtein scikit-learn transformers matplotlib seaborn plotly networkx esprima torch numpy pandas jupyter
```

### Step 3: Run the Notebook

```bash
# Start Jupyter notebook
jupyter notebook similarity_analysis.ipynb
```

Or run all cells at once:

```bash
# Execute entire notebook
jupyter nbconvert --to notebook --execute similarity_analysis.ipynb
```

### Step 4: Review Results

After execution, check the `results/` directory for:
- Similarity matrices (CSV and NPY formats)
- Visualization plots (PNG images)
- Preprocessing summary (CSV)

---

## Methodology

### Part A: Preprocessing (5 marks)

1. **Project Organization**
   - Collects all 27 projects from `projects/` directory
   - Identifies comparable file types: `.js`, `.jsx`, `.json`, `.css`

2. **Code Preprocessing**
   - Removes single-line (`//`) and multi-line (`/* */`) comments
   - Detects and skips minified files (avg line length > 500 chars)
   - Normalizes formatting (indentation, spacing)
   - Converts multiple spaces to single space

3. **Metric Extraction**
   - File and folder counts per project
   - Lines of Code (LOC) counting
   - React components detection (class, function, arrow function patterns)
   - Express routes counting (`app.METHOD`, `router.METHOD`)
   - Mongoose models detection (`mongoose.Schema`, `mongoose.model`)

### Part B: Similarity Computation (15 marks)

#### 1. Textual Similarity

**Method**: TF-IDF + Cosine Similarity

- Combines all preprocessed code from each project
- Creates TF-IDF vectors with:
  - Max 5000 features
  - Unigrams and bigrams (1-2 word sequences)
  - Min document frequency: 1
- Computes pairwise cosine similarity (NxN matrix)

**Interpretation**: Measures token-level similarity - how much code text is shared

#### 2. Structural Similarity

**Method**: AST Features + Architectural Metrics

- Extracts structural features:
  - React component count
  - Express route count
  - Mongoose model count
  - JS/JSX file distribution
  - Folder structure depth
  - Normalized LOC
- Normalizes features using StandardScaler
- Computes cosine similarity between feature vectors

**Interpretation**: Measures architectural similarity - similar project organization

#### 3. Semantic Similarity

**Method**: CodeBERT Embeddings

- Uses Microsoft's `codebert-base` model (pre-trained on code)
- Generates embeddings for code samples from each project
- Uses [CLS] token representation (768-dimensional vector)
- Computes cosine similarity between embeddings

**Interpretation**: Measures functional similarity - similar code meaning/behavior

### Part C: Visualization & Reporting (5 marks)

1. **Heatmaps** - Color-coded NxN similarity matrices for each metric
2. **Network Graph** - Shows project clusters (edges for similarity > threshold)
3. **Bar Charts** - Compares average similarity across metrics
4. **Analytical Report** - Insights on coding diversity, structural consistency, and code reuse patterns

---

## Assumptions

### 1. Dataset Assumptions
- All 27 VidyaVichar projects are available in `projects/` directory
- Each project is a complete MERN stack implementation
- Projects follow standard MERN folder structures (frontend/backend separation may vary)

### 2. File Type Assumptions
- Only analyzing `.js`, `.jsx`, `.json`, `.css` files
- Excluding `.ts`, `.tsx` (TypeScript) - can be added if needed
- Skipping `node_modules/` and hidden directories (`.git`, `.vscode`, etc.)

### 3. Preprocessing Assumptions
- Minified files are detected by average line length > 500 characters
- Comment removal regex patterns cover most JavaScript comment styles
- Formatting normalization doesn't affect code semantics

### 4. Component Detection Assumptions
- **React components** identified by:
  - Class components: `class X extends Component`
  - Function components: `function X() { return (...) }`
  - Arrow components: `const X = () => ...`
- **Express routes** identified by: `app.METHOD(` or `router.METHOD(`
- **Mongoose models** identified by: `mongoose.Schema` or `mongoose.model`

### 5. Similarity Computation Assumptions
- **Textual**: Higher TF-IDF similarity indicates more shared vocabulary/patterns
- **Structural**: Similar architectural choices lead to higher similarity
- **Semantic**: CodeBERT captures functional similarity beyond surface text
- Similarity scores range from 0 (completely different) to 1 (identical)

### 6. Performance Assumptions
- CodeBERT processing may be slow on CPU (GPU recommended for 27 projects)
- Levenshtein distance computed on sampled code (first 10k chars) for performance
- TF-IDF limited to 5000 features to manage memory usage

---

## Output Interpretation

### Similarity Scores

- **0.0 - 0.3**: LOW similarity - significantly different implementations
- **0.3 - 0.6**: MODERATE similarity - some shared patterns
- **0.6 - 0.8**: HIGH similarity - substantial code overlap
- **0.8 - 1.0**: VERY HIGH similarity - possible code sharing/templates

### Preprocessing Summary

The CSV contains per-project metrics:
- `Total Files`: Count of analyzed files
- `Lines of Code`: Non-empty, non-comment lines
- `React Components`: Detected component definitions
- `Express Routes`: API endpoint count
- `Mongoose Models`: Database schema count

### Similarity Matrices

Three NxN matrices (N = number of projects):
- Diagonal = 1.0 (project compared with itself)
- Symmetric (similarity[i][j] = similarity[j][i])
- Saved in both NumPy binary (`.npy`) and CSV formats

---

## Troubleshooting

### Issue: "Projects directory not found"
**Solution**: Create `projects/` directory and add all 27 VidyaVichar projects

```bash
mkdir -p Q1/projects
```

### Issue: CodeBERT model download fails
**Solution**: Ensure internet connection, or download model manually:

```python
from transformers import AutoTokenizer, AutoModel
tokenizer = AutoTokenizer.from_pretrained("microsoft/codebert-base")
model = AutoModel.from_pretrained("microsoft/codebert-base")
```

### Issue: Out of memory during semantic similarity
**Solution**: Reduce batch size or sample size in `compute_semantic_similarity()`:

```python
code_sample = ' '.join(metrics['all_code'][:5])  # Reduce from 10 to 5 files
```

### Issue: Esprima parse errors
**Solution**: These are non-fatal - the notebook uses `tolerant=True` mode and continues

### Issue: Import errors for libraries
**Solution**: Install all dependencies:

```bash
pip install --upgrade python-Levenshtein scikit-learn transformers torch matplotlib seaborn networkx esprima numpy pandas
```

---

## Extension Ideas (Optional)

1. **Interactive Dashboard** - Use Streamlit for live exploration
2. **Clustering Analysis** - Apply K-means to group similar projects
3. **Plagiarism Detection** - Flag project pairs with >90% similarity
4. **Code Clone Detection** - Find duplicated code blocks within projects
5. **Evolution Analysis** - Compare git commit histories if available

---

## References

- **CodeBERT**: [microsoft/codebert-base](https://huggingface.co/microsoft/codebert-base)
- **TF-IDF**: Scikit-learn documentation
- **Esprima**: JavaScript AST parser
- **VidyaVichar**: MERN stack project specification

---

## Author

Assignment 3 - Q1  
CS6.302 - Software System Development  
November 2025

---

## License

This code is submitted as part of academic coursework. Please refer to course policies for usage restrictions.
