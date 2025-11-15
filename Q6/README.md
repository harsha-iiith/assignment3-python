# Octal Calculator

A feature-rich calculator that operates entirely in octal (base 8) numeral system with support for variables, user-defined functions, and conditional expressions.

## Features

1. **Octal Arithmetic**: All inputs and outputs are in octal (base 8)
   - Supports +, -, *, / operators
   - Comparison operators: <, >, <=, >=, ==, !=

2. **Variable Bindings (LET)**: Define and use variables in expressions
   - Syntax: `LET var = value IN expression`

3. **User-Defined Functions (DEF)**: Create reusable recursive functions
   - Syntax: `DEF funcname(param1, param2) = body; expression`

4. **Conditional Expressions (IF-THEN-ELSE)**: Branching logic
   - Syntax: `IF condition THEN expr1 ELSE expr2`

## Installation

No external dependencies required. Uses only Python standard library.

```bash
cd Q6
python octal_calculator.py  # Interactive mode
```

## Usage

### Interactive Mode

Run the calculator in interactive mode:

```bash
python octal_calculator.py
```

Example session:
```
Octal Calculator
All inputs and outputs are in octal (base 8)
Examples:
  10 + 7 = 17
  LET x = 10 IN x + 7 = 17
  DEF square(x) = x * x; square(5) = 31

> 10 + 7
17
> LET x = 5 IN x * x
31
> DEF double(x) = x + x; double(4)
10
> IF 5 > 3 THEN 100 ELSE 0
100
> exit
```

### Programmatic Usage

Use the `calculate()` function or `Calculator` class:

```python
from octal_calculator import calculate, Calculator

# Simple calculation
result = calculate("10 + 7")  # Returns "17"

# Using Calculator instance for multiple evaluations
calc = Calculator()
result1 = calc.evaluate("LET x = 10 IN x + x")  # Returns "20"
result2 = calc.evaluate("DEF square(x) = x * x; square(5)")  # Returns "31"
```

## Expression Syntax

### Basic Arithmetic
```
10 + 7       # Addition: 17 (8 + 7 = 15 in decimal)
20 - 5       # Subtraction: 13
4 * 3        # Multiplication: 14
100 / 2      # Division: 40
```

### Variable Bindings (LET)
```
LET x = 10 IN x + 7                    # 17
LET x = 5 IN LET y = 3 IN x * y        # 17 (nested LET)
```

### User-Defined Functions (DEF)
```
DEF square(x) = x * x; square(5)                           # 31
DEF add(x, y) = x + y; add(10, 7)                          # 17
DEF factorial(n) = IF n == 0 THEN 1 ELSE n * factorial(n - 1); factorial(5)
```

### Conditional Expressions (IF-THEN-ELSE)
```
IF 5 > 3 THEN 100 ELSE 0                                   # 100
IF 10 == 10 THEN 7 ELSE 3                                  # 7
LET x = 5 IN IF x > 3 THEN x * 2 ELSE x                    # 12
```

### Comparison Operators
```
5 < 10       # Returns 1 (true)
10 > 5       # Returns 1 (true)
7 == 7       # Returns 1 (true)
3 != 5       # Returns 1 (true)
5 <= 5       # Returns 1 (true)
10 >= 5      # Returns 1 (true)
```

## Examples

### Example 1: Simple Arithmetic
```
> 10 + 7
17
> 100 * 2
200
> 17 - 5
12
```

### Example 2: Variables
```
> LET radius = 5 IN radius * radius
31
> LET x = 10 IN LET y = 7 IN x + y
17
```

### Example 3: Functions
```
> DEF square(x) = x * x; square(10)
100
> DEF double(x) = x + x; double(17)
36
> DEF add(a, b) = a + b; add(5, 3)
10
```

### Example 4: Conditionals
```
> IF 1 THEN 100 ELSE 0
100
> LET x = 7 IN IF x > 5 THEN x * 2 ELSE x
16
```

### Example 5: Recursive Function
```
> DEF factorial(n) = IF n == 0 THEN 1 ELSE n * factorial(n - 1); factorial(5)
170
```

## Octal Number System

The calculator operates entirely in base 8 (octal):
- Valid digits: 0, 1, 2, 3, 4, 5, 6, 7
- 10 (octal) = 8 (decimal)
- 17 (octal) = 15 (decimal)
- 100 (octal) = 64 (decimal)

### Conversion Examples
| Octal | Decimal |
|-------|---------|
| 0     | 0       |
| 7     | 7       |
| 10    | 8       |
| 17    | 15      |
| 20    | 16      |
| 100   | 64      |
| 377   | 255     |

## Exception Handling

The calculator provides detailed error messages for various error conditions:

### Syntax Errors
```python
InvalidOctalDigitError    # Invalid octal digit (8 or 9)
UnexpectedTokenError      # Unexpected token in expression
InvalidSyntaxError        # General syntax error
```

### Runtime Errors
```python
VariableNotDefinedError   # Variable not found
FunctionNotDefinedError   # Function not found
DivisionByZeroError       # Division by zero
InvalidArgumentCountError # Wrong number of function arguments
RecursionLimitError       # Maximum recursion depth exceeded
```

Example:
```
> 18
Error: Invalid octal digit: '8'

> LET x = 5 IN y
Error: Variable 'y' is not defined

> 10 / 0
Error: Division by zero
```

## Testing

Run the comprehensive test suite:

```bash
python -m pytest test_cases.py -v
```

Or using unittest:

```bash
python -m unittest test_cases.py -v
```

The test suite includes 47 tests covering:
- Octal conversion functions (8 tests)
- Basic arithmetic operations (6 tests)
- Comparison operators (6 tests)
- LET variable bindings (6 tests)
- IF-THEN-ELSE conditionals (6 tests)
- User-defined functions (8 tests)
- Complex expressions (4 tests)
- Edge cases and error handling (3 tests)

## Design Decisions

1. **Manual Octal Conversion**: Implemented custom `octal_to_decimal()` and `decimal_to_octal()` functions instead of using Python's built-in `oct()` and `int()` with base parameter.

2. **Recursive Descent Parser**: Uses a recursive descent parsing approach with separate methods for different precedence levels (expression → comparison → term → factor → primary).

3. **Eager Evaluation**: IF-THEN-ELSE evaluates both branches (limitation), which can cause infinite recursion in some recursive functions.

4. **Lexical Scoping**: Variables follow lexical scoping rules - inner scopes can access outer scopes.

5. **Recursion Limit**: Maximum recursion depth of 100 to prevent stack overflow.

## File Structure

```
Q6/
├── octal_calculator.py   # Main calculator implementation
├── exceptions.py         # Custom exception hierarchy
├── test_cases.py         # Comprehensive test suite
├── README.md            # This file
└── Report.pdf           # Design documentation
```

## Assumptions

1. All numeric literals in expressions are assumed to be octal (base 8)
2. Variable and function names must start with a letter and contain only alphanumeric characters
3. Division truncates to integer (no floating-point support)
4. Comparison operators return 1 for true, 0 for false
5. Maximum recursion depth is set to 100 calls

## Limitations

1. **Eager IF Evaluation**: Both THEN and ELSE branches are evaluated before selecting the result, which can cause issues with recursive functions that rely on short-circuit evaluation
2. **Integer Only**: No support for floating-point numbers
3. **Limited Operators**: Only basic arithmetic and comparison operators
4. **No Comments**: Expression syntax doesn't support comments

## Author

Created as part of CS6.302 Software System Development Assignment 3
