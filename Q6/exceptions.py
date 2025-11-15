"""
Custom exceptions for the Octal Calculator.

This module defines a hierarchy of exceptions used throughout the calculator.
"""


class CalculatorException(Exception):
    """Base exception for all calculator errors."""
    pass


class ParseError(CalculatorException):
    """Raised when the input cannot be parsed correctly."""
    pass


class EvaluationError(CalculatorException):
    """Raised when evaluation fails at runtime."""
    pass


class RecursionLimitError(EvaluationError):
    """Raised when recursion depth exceeds 1000 calls."""
    def __init__(self, depth=1000):
        super().__init__(f"Recursion limit of {depth} exceeded")
        self.depth = depth


class VariableNotFoundError(EvaluationError):
    """Raised when a variable is referenced but not defined."""
    def __init__(self, var_name):
        super().__init__(f"Variable '{var_name}' is not defined")
        self.var_name = var_name


class FunctionNotDefinedError(EvaluationError):
    """Raised when a function is called but not defined."""
    def __init__(self, func_name):
        super().__init__(f"Function '{func_name}' is not defined")
        self.func_name = func_name


class DivisionByZeroError(EvaluationError):
    """Raised when attempting to divide by zero."""
    def __init__(self):
        super().__init__("Division by zero is not allowed")


class InvalidOctalDigitError(CalculatorException):
    """Raised when a non-octal digit (8 or 9) is encountered."""
    def __init__(self, digit):
        super().__init__(f"Invalid octal digit: '{digit}' (octal uses 0-7)")
        self.digit = digit


class InvalidArgumentCountError(EvaluationError):
    """Raised when function is called with wrong number of arguments."""
    def __init__(self, func_name, expected, got):
        super().__init__(
            f"Function '{func_name}' expects {expected} argument(s), "
            f"but got {got}"
        )
        self.func_name = func_name
        self.expected = expected
        self.got = got
