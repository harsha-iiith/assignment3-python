# Sorting Package

A Python package implementing five classical sorting algorithms with a clean, extensible factory pattern design.

## Features

Implements five sorting algorithms:
1. **Bubble Sort** - O(n²) comparison-based algorithm
2. **Selection Sort** - O(n²) selection-based algorithm  
3. **Quick Sort** - O(n log n) average, divide-and-conquer algorithm
4. **Merge Sort** - O(n log n) guaranteed, stable divide-and-conquer algorithm
5. **Shell Sort** - O(n log² n) gap-based insertion sort variant

All algorithms support:
- Ascending and descending order
- Integer arrays (positive, negative, zero)
- Consistent API through factory pattern
- Comprehensive test coverage

## Installation

No external dependencies required. Uses only Python standard library.

```bash
cd Q3/Sorting_Package
```

## Usage

### Command-Line Interface

The package provides a command-line interface that reads sorting requests from stdin:

```bash
# From file
python3 main.py < sample_input.txt

# From stdin
echo "quick asc 5 2 8 1 9" | python3 main.py

# Interactive
python3 main.py
bubble asc 5 2 8 1 9
# Output: 1 2 5 8 9
```

### Input Format

Each line should follow this format:
```
<algorithm> <order> <number1> <number2> ... <numberN>
```

Where:
- `algorithm`: `bubble`, `selection`, `quick`, `merge`, or `shell`
- `order`: `asc` (ascending) or `desc` (descending)
- `numbers`: Space-separated integers

### Examples

```bash
# Bubble sort in ascending order
bubble asc 5 2 8 1 9
# Output: 1 2 5 8 9

# Quick sort in descending order
quick desc 5 2 8 1 9
# Output: 9 8 5 2 1

# Merge sort with negative numbers
merge asc -5 -1 0 3 -10
# Output: -10 -5 -1 0 3

# Shell sort large array
shell asc 9 8 7 6 5 4 3 2 1
# Output: 1 2 3 4 5 6 7 8 9
```

### Programmatic Usage

Import and use the sorting algorithms directly:

```python
from src.sorting_factory import SortingFactory

# Using factory pattern
result = SortingFactory.sort('quick', [5, 2, 8, 1, 9], ascending=True)
print(result)  # [1, 2, 5, 8, 9]

# Direct import of specific algorithm
from src.quick_sort import QuickSort

sorter = QuickSort()
arr = [5, 2, 8, 1, 9]
sorter.sort(arr, ascending=True)
print(arr)  # [1, 2, 5, 8, 9]
```

## Architecture

### Design Pattern

Uses **Factory Pattern** for algorithm selection:

```
SortingFactory
├── create_sorter(algorithm_name) → SortingAlgorithm
└── sort(algorithm_name, arr, ascending) → sorted_array

SortingAlgorithm (Abstract Base)
├── sort(arr, ascending) → None (in-place)
└── validate_input(arr) → None

Concrete Implementations
├── BubbleSort
├── SelectionSort  
├── QuickSort
├── MergeSort (returns new array)
└── ShellSort
```

### File Structure

```
Sorting_Package/
├── src/
│   ├── __init__.py               # Package initialization
│   ├── sorting_base.py           # Abstract base class
│   ├── sorting_factory.py        # Factory pattern implementation
│   ├── bubble_sort.py            # Bubble sort algorithm
│   ├── selection_sort.py         # Selection sort algorithm
│   ├── quick_sort.py             # Quick sort algorithm
│   ├── merge_sort.py             # Merge sort algorithm
│   └── shell_sort.py             # Shell sort algorithm
│
├── test/
│   ├── __init__.py
│   └── test_sorting.py           # Comprehensive test suite
│
├── main.py                       # CLI entry point
├── sample_input.txt              # Example input file
└── README.md                     # This file
```

## Algorithm Details

### 1. Bubble Sort

**Time Complexity**: O(n²)  
**Space Complexity**: O(1)  
**Stability**: Stable

Repeatedly steps through the list, compares adjacent elements and swaps them if they're in the wrong order.

```python
from src.bubble_sort import BubbleSort

sorter = BubbleSort()
arr = [5, 2, 8, 1]
sorter.sort(arr, ascending=True)
# arr is now [1, 2, 5, 8]
```

### 2. Selection Sort

**Time Complexity**: O(n²)  
**Space Complexity**: O(1)  
**Stability**: Unstable

Divides the array into sorted and unsorted regions, repeatedly selects the smallest (or largest) element from unsorted region.

```python
from src.selection_sort import SelectionSort

sorter = SelectionSort()
arr = [5, 2, 8, 1]
sorter.sort(arr, ascending=True)
# arr is now [1, 2, 5, 8]
```

### 3. Quick Sort

**Time Complexity**: O(n log n) average, O(n²) worst case  
**Space Complexity**: O(log n) for recursion stack  
**Stability**: Unstable

Divide-and-conquer algorithm that picks a pivot and partitions the array around it.

**Pivot Selection**: Last element  
**Partitioning**: Lomuto partition scheme

```python
from src.quick_sort import QuickSort

sorter = QuickSort()
arr = [5, 2, 8, 1]
sorter.sort(arr, ascending=True)
# arr is now [1, 2, 5, 8]
```

### 4. Merge Sort

**Time Complexity**: O(n log n) guaranteed  
**Space Complexity**: O(n)  
**Stability**: Stable

Divide-and-conquer algorithm that recursively divides the array in half, sorts each half, and merges them.

**Note**: This implementation returns a new sorted array rather than sorting in-place.

```python
from src.merge_sort import MergeSort

sorter = MergeSort()
arr = [5, 2, 8, 1]
sorted_arr = sorter.sort(arr, ascending=True)
# sorted_arr is [1, 2, 5, 8]
# original arr is unchanged
```

### 5. Shell Sort

**Time Complexity**: O(n log² n) with our gap sequence  
**Space Complexity**: O(1)  
**Stability**: Unstable

Generalization of insertion sort that allows exchange of items that are far apart.

**Gap Sequence**: n/2, n/4, n/8, ..., 1

```python
from src.shell_sort import ShellSort

sorter = ShellSort()
arr = [5, 2, 8, 1]
sorter.sort(arr, ascending=True)
# arr is now [1, 2, 5, 8]
```

## Testing

### Run All Tests

```bash
cd Q3/Sorting_Package
python3 -m pytest test/test_sorting.py -v
```

Or using unittest:

```bash
python3 -m unittest test.test_sorting -v
```

### Test Coverage

The test suite (`test/test_sorting.py`) includes:

**Basic Functionality Tests** (25 tests):
- Ascending and descending order for each algorithm
- Empty arrays
- Single-element arrays
- Already sorted arrays
- Reverse sorted arrays

**Edge Cases** (10 tests):
- Duplicate elements
- All identical elements
- Negative numbers
- Mixed positive and negative numbers

**Error Handling** (5 tests):
- Invalid algorithm names
- Non-list inputs
- Invalid order parameter

### Example Test Run

```bash
$ python3 -m pytest test/test_sorting.py -v

test_sorting.py::TestBubbleSort::test_ascending PASSED
test_sorting.py::TestBubbleSort::test_descending PASSED
test_sorting.py::TestSelectionSort::test_ascending PASSED
test_sorting.py::TestSelectionSort::test_descending PASSED
test_sorting.py::TestQuickSort::test_ascending PASSED
test_sorting.py::TestQuickSort::test_descending PASSED
test_sorting.py::TestMergeSort::test_ascending PASSED
test_sorting.py::TestMergeSort::test_descending PASSED
test_sorting.py::TestShellSort::test_ascending PASSED
test_sorting.py::TestShellSort::test_descending PASSED
...

======================== 40 tests passed ========================
```

## Design Decisions

### 1. Factory Pattern

**Decision**: Use factory pattern for algorithm selection

**Rationale**:
- Single entry point for all sorting operations
- Easy to add new algorithms without modifying client code
- Consistent interface across all algorithms
- Runtime algorithm selection based on string name

### 2. Abstract Base Class

**Decision**: Use ABC (Abstract Base Class) for common interface

**Rationale**:
- Enforces consistent API across implementations
- Provides shared validation logic
- Type safety for factory pattern
- Clear contract for new algorithm implementations

### 3. In-Place Sorting

**Decision**: Most algorithms sort in-place (except merge sort)

**Rationale**:
- Memory efficiency (O(1) space)
- Matches traditional algorithm behavior
- **Exception**: Merge sort returns new array due to its fundamental nature

### 4. Input Validation

**Decision**: Validate inputs in base class

**Rationale**:
- Single source of truth for validation
- Consistent error messages
- DRY principle (Don't Repeat Yourself)

## Performance Comparison

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable |
|-----------|-----------|--------------|------------|-------|--------|
| Bubble    | O(n)      | O(n²)        | O(n²)      | O(1)  | Yes    |
| Selection | O(n²)     | O(n²)        | O(n²)      | O(1)  | No     |
| Quick     | O(n log n)| O(n log n)   | O(n²)      | O(log n)| No   |
| Merge     | O(n log n)| O(n log n)   | O(n log n) | O(n)  | Yes    |
| Shell     | O(n log n)| O(n log² n)  | O(n²)      | O(1)  | No     |

**Recommendations**:
- **Small arrays** (n < 50): Any algorithm works well
- **Medium arrays** (50 < n < 1000): Quick sort or shell sort
- **Large arrays** (n > 1000): Merge sort (guaranteed O(n log n))
- **Stability required**: Bubble sort or merge sort
- **Memory constrained**: Bubble, selection, quick, or shell sort

## Error Handling

The package provides clear error messages for common issues:

```python
# Invalid algorithm name
>>> SortingFactory.sort('invalid', [1, 2, 3])
ValueError: Unknown sorting algorithm: invalid

# Non-list input
>>> SortingFactory.sort('quick', "not a list")
TypeError: Input must be a list

# Invalid order parameter
>>> SortingFactory.sort('quick', [1, 2, 3], ascending='maybe')
# Defaults to ascending order
```

## Assumptions

1. **Input Type**: All array elements are integers
2. **Array Size**: No explicit size limit (limited by available memory)
3. **Mutability**: Input arrays are mutable (can be modified in-place)
4. **Order Parameter**: Defaults to ascending if invalid value provided
5. **Empty Arrays**: Sorting empty arrays returns empty array (no error)

## Future Enhancements

1. **Additional Algorithms**: Heap sort, radix sort, counting sort
2. **Generic Types**: Support for sorting any comparable objects
3. **Parallel Sorting**: Multi-threaded implementations for large datasets
4. **Adaptive Algorithms**: TimSort, IntroSort
5. **Performance Profiling**: Built-in benchmarking tools
6. **Visualization**: Step-by-step sorting visualization

## Author

Created as part of CS6.302 Software System Development Assignment 3
