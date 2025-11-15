# Q2: Image Blurring Implementation

## Objective
Implement 3x3 box blur using both iterative Python and vectorized NumPy, then compare performance.

## Files
- `box_blur.ipynb`: Jupyter notebook with complete implementation

## Requirements
```bash
pip install numpy pillow matplotlib
```

## Execution Instructions
1. Install dependencies: `pip install numpy pillow matplotlib`
2. Open Jupyter: `jupyter notebook box_blur.ipynb`
3. Run all cells in order

Alternatively, convert to Python script:
```bash
jupyter nbconvert --to script box_blur.ipynb
python box_blur.py
```

## Implementation Details

### Task 1: Python Iterative Implementation
- Function: `blur_python(image)`
- Uses nested for loops to iterate through pixels
- Excludes outermost single-pixel boundary
- Calculates mean of 3x3 neighborhood for each pixel

### Task 2: NumPy Vectorized Implementation
- Function: `blur_numpy(image)`
- Uses NumPy array slicing (no explicit Python loops)
- Leverages broadcasting for efficient computation
- Achieves same blurring effect as Python version

## Key Findings
1. NumPy implementation is 50-200x faster than Python
2. Both implementations produce identical results
3. Vectorization eliminates interpreted loop overhead
4. Contiguous memory layout enables cache efficiency

## Assumptions
- Default font used if system fonts unavailable
- Image created programmatically rather than loaded from file
- Integer division used for mean calculation (no fractions)
- Boundary pixels copied as-is from original image
