"""
Octal Calculator - A calculator that works with octal numbers.

This calculator supports:
1. Octal arithmetic with variables (LET bindings)
2. User-defined recursive functions (DEF)
3. Conditional expressions (IF-THEN-ELSE)

All inputs and outputs are octal strings (base 8).
Internally converts to decimal for computation, then back to octal.
"""

import re
from exceptions import *


# =======================
# OCTAL CONVERSION
# =======================

def octal_to_decimal(octal_str):
    """
    Convert octal string to decimal integer (manual implementation).
    
    Args:
        octal_str: String representation of octal number
        
    Returns:
        Decimal integer value
        
    Raises:
        InvalidOctalDigitError: If string contains invalid octal digits
    """
    assert isinstance(octal_str, str), "Input must be a string"
    
    octal_str = octal_str.strip()
    negative = False
    
    if octal_str.startswith('-'):
        negative = True
        octal_str = octal_str[1:]
    
    # Validate octal digits
    for digit in octal_str:
        if digit not in '01234567':
            raise InvalidOctalDigitError(digit)
    
    # Convert manually: each position is power of 8
    result = 0
    for digit in octal_str:
        result = result * 8 + int(digit)
    
    if negative:
        result = -result
    
    assert isinstance(result, int), "Result must be an integer"
    return result


def decimal_to_octal(decimal_int):
    """
    Convert decimal integer to octal string (manual implementation).
    
    Args:
        decimal_int: Decimal integer
        
    Returns:
        Octal string representation
    """
    assert isinstance(decimal_int, int), "Input must be an integer"
    
    if decimal_int == 0:
        return '0'
    
    negative = decimal_int < 0
    decimal_int = abs(decimal_int)
    
    # Convert manually by repeatedly dividing by 8
    digits = []
    while decimal_int > 0:
        digits.append(str(decimal_int % 8))
        decimal_int //= 8
    
    result = ''.join(reversed(digits))
    
    if negative:
        result = '-' + result
    
    assert isinstance(result, str), "Result must be a string"
    return result


# =======================
# TOKENIZER
# =======================

class Token:
    """Represents a token in the input."""
    def __init__(self, type, value):
        self.type = type
        self.value = value
    
    def __repr__(self):
        return f"Token({self.type}, {self.value})"


def tokenize(expression):
    """
    Tokenize the input expression.
    
    Returns list of Token objects.
    """
    # Token patterns
    patterns = [
        ('NUMBER', r'-?[0-7]+'),
        ('IF', r'\bIF\b'),
        ('THEN', r'\bTHEN\b'),
        ('ELSE', r'\bELSE\b'),
        ('LET', r'\bLET\b'),
        ('IN', r'\bIN\b'),
        ('DEF', r'\bDEF\b'),
        ('COMPARE', r'==|!=|<=|>=|<|>'),
        ('PLUS', r'\+'),
        ('MINUS', r'-'),
        ('MULT', r'\*'),
        ('DIV', r'/'),
        ('MOD', r'%'),
        ('POW', r'\^'),
        ('LPAREN', r'\('),
        ('RPAREN', r'\)'),
        ('ASSIGN', r'='),
        ('COMMA', r','),
        ('IDENT', r'[a-zA-Z_][a-zA-Z0-9_]*'),
        ('WHITESPACE', r'\s+'),
    ]
    
    regex = '|'.join(f'(?P<{name}>{pattern})' for name, pattern in patterns)
    tokens = []
    
    for match in re.finditer(regex, expression):
        kind = match.lastgroup
        value = match.group()
        
        if kind == 'WHITESPACE':
            continue
        
        tokens.append(Token(kind, value))
    
    return tokens


# =======================
# PARSER & EVALUATOR
# =======================

class Environment:
    """Manages variable and function bindings."""
    def __init__(self, parent=None):
        self.vars = {}
        self.parent = parent
    
    def get(self, name):
        if name in self.vars:
            return self.vars[name]
        elif self.parent:
            return self.parent.get(name)
        else:
            raise VariableNotFoundError(name)
    
    def set(self, name, value):
        self.vars[name] = value


class Calculator:
    """Main calculator class."""
    
    def __init__(self):
        self.functions = {}  # Global function definitions
        self.recursion_depth = 0
        self.MAX_RECURSION = 1000
    
    def evaluate(self, expression):
        """
        Evaluate an expression and return result as octal string.
        
        Args:
            expression: Input expression string (octal numbers)
            
        Returns:
            Result as octal string
        """
        tokens = tokenize(expression)
        self.tokens = tokens
        self.pos = 0
        
        result = self.parse_expression(Environment())
        return decimal_to_octal(result)
    
    def current_token(self):
        """Get current token without advancing."""
        if self.pos < len(self.tokens):
            return self.tokens[self.pos]
        return None
    
    def consume(self, expected_type=None):
        """Consume and return current token."""
        token = self.current_token()
        if expected_type and (not token or token.type != expected_type):
            raise ParseError(f"Expected {expected_type}, got {token}")
        self.pos += 1
        return token
    
    def parse_expression(self, env):
        """Parse full expression (handles DEF, LET, IF, or arithmetic)."""
        token = self.current_token()
        
        if not token:
            raise ParseError("Unexpected end of expression")
        
        # DEF: function definition
        if token.type == 'DEF':
            return self.parse_def(env)
        
        # LET: variable binding
        if token.type == 'LET':
            return self.parse_let(env)
        
        # IF: conditional
        if token.type == 'IF':
            return self.parse_if(env)
        
        # Otherwise, parse comparison/arithmetic
        return self.parse_comparison(env)
    
    def parse_def(self, env):
        """Parse function definition: DEF name(params) = body."""
        self.consume('DEF')
        
        name_token = self.consume('IDENT')
        func_name = name_token.value
        
        self.consume('LPAREN')
        params = []
        
        # Parse parameters
        token = self.current_token()
        if token and token.type == 'IDENT':
            params.append(self.consume('IDENT').value)
            
            token = self.current_token()
            while token and token.type == 'COMMA':
                self.consume('COMMA')
                params.append(self.consume('IDENT').value)
                token = self.current_token()
        
        self.consume('RPAREN')
        self.consume('ASSIGN')
        
        # Store function definition (tokens from current position to end)
        body_start = self.pos
        self.functions[func_name] = {
            'params': params,
            'body_start': body_start,
            'tokens': self.tokens
        }
        
        # Move position to end (consume all remaining tokens as function body)
        self.pos = len(self.tokens)
        
        return 0  # DEF itself returns 0
    
    def parse_let(self, env):
        """Parse LET binding: LET var = value IN expression."""
        self.consume('LET')
        
        var_name = self.consume('IDENT').value
        self.consume('ASSIGN')
        
        # Evaluate value
        value = self.parse_comparison(env)
        
        self.consume('IN')
        
        # Create new environment with binding
        new_env = Environment(env)
        new_env.set(var_name, value)
        
        # Evaluate body in new environment
        return self.parse_expression(new_env)
    
    def parse_if(self, env):
        """Parse conditional: IF condition THEN expr1 ELSE expr2."""
        self.consume('IF')
        
        condition = self.parse_comparison(env)
        
        self.consume('THEN')
        
        # Save position to potentially backtrack
        then_start = self.pos
        
        # Evaluate both branches (we have to parse to find ELSE anyway)
        # Parse THEN branch as conditional_expression (allows nested IF)
        then_value = self.parse_conditional(env)
        
        self.consume('ELSE')
        
        # Parse ELSE branch
        else_value = self.parse_conditional(env)
        
        # Return the chosen branch
        return then_value if condition else else_value
    
    def parse_conditional(self, env):
        """Parse conditional expression or comparison (for IF branches)."""
        token = self.current_token()
        
        # Allow nested IF in branches
        if token and token.type == 'IF':
            return self.parse_if(env)
        
        # Otherwise parse comparison/arithmetic
        return self.parse_comparison(env)
    
    def parse_comparison(self, env):
        """Parse comparison operators: ==, !=, <, >, <=, >=."""
        left = self.parse_arithmetic(env)
        
        token = self.current_token()
        if token and token.type == 'COMPARE':
            op = self.consume('COMPARE').value
            right = self.parse_arithmetic(env)
            
            if op == '==':
                return 1 if left == right else 0
            elif op == '!=':
                return 1 if left != right else 0
            elif op == '<':
                return 1 if left < right else 0
            elif op == '>':
                return 1 if left > right else 0
            elif op == '<=':
                return 1 if left <= right else 0
            elif op == '>=':
                return 1 if left >= right else 0
        
        return left
    
    def parse_arithmetic(self, env):
        """Parse arithmetic expression with operator precedence."""
        return self.parse_add_sub(env)
    
    def parse_add_sub(self, env):
        """Parse addition and subtraction (lowest precedence)."""
        left = self.parse_mul_div_mod(env)
        
        while True:
            token = self.current_token()
            if token and token.type in ['PLUS', 'MINUS']:
                op = self.consume().type
                right = self.parse_mul_div_mod(env)
                
                if op == 'PLUS':
                    left = left + right
                else:  # MINUS
                    left = left - right
            else:
                break
        
        return left
    
    def parse_mul_div_mod(self, env):
        """Parse multiplication, division, modulo."""
        left = self.parse_power(env)
        
        while True:
            token = self.current_token()
            if token and token.type in ['MULT', 'DIV', 'MOD']:
                op = self.consume().type
                right = self.parse_power(env)
                
                if op == 'MULT':
                    left = left * right
                elif op == 'DIV':
                    if right == 0:
                        raise DivisionByZeroError()
                    left = left // right  # Integer division
                else:  # MOD
                    if right == 0:
                        raise DivisionByZeroError()
                    left = left % right
            else:
                break
        
        return left
    
    def parse_power(self, env):
        """Parse exponentiation (highest precedence, right-associative)."""
        base = self.parse_unary(env)
        
        token = self.current_token()
        if token and token.type == 'POW':
            self.consume('POW')
            exponent = self.parse_power(env)  # Right-associative
            return base ** exponent
        
        return base
    
    def parse_unary(self, env):
        """Parse unary operators and primary expressions."""
        token = self.current_token()
        
        # Unary minus
        if token and token.type == 'MINUS':
            self.consume('MINUS')
            return -self.parse_unary(env)
        
        return self.parse_primary(env)
    
    def parse_primary(self, env):
        """Parse primary expressions: numbers, variables, function calls, parentheses."""
        token = self.current_token()
        
        if not token:
            raise ParseError("Unexpected end of expression")
        
        # Number
        if token.type == 'NUMBER':
            num_str = self.consume('NUMBER').value
            return octal_to_decimal(num_str)
        
        # Parenthesized expression
        if token.type == 'LPAREN':
            self.consume('LPAREN')
            result = self.parse_expression(env)
            self.consume('RPAREN')
            return result
        
        # Identifier (variable or function call)
        if token.type == 'IDENT':
            name = self.consume('IDENT').value
            
            # Check if it's a function call
            next_token = self.current_token()
            if next_token and next_token.type == 'LPAREN':
                return self.parse_function_call(name, env)
            else:
                # Variable lookup
                return env.get(name)
        
        raise ParseError(f"Unexpected token: {token}")
    
    def parse_function_call(self, func_name, env):
        """Parse and evaluate function call."""
        if func_name not in self.functions:
            raise FunctionNotDefinedError(func_name)
        
        func_def = self.functions[func_name]
        params = func_def['params']
        
        self.consume('LPAREN')
        
        # Parse arguments
        args = []
        token = self.current_token()
        if token and token.type != 'RPAREN':
            args.append(self.parse_comparison(env))
            
            token = self.current_token()
            while token and token.type == 'COMMA':
                self.consume('COMMA')
                args.append(self.parse_comparison(env))
                token = self.current_token()
        
        self.consume('RPAREN')
        
        # Validate argument count
        if len(args) != len(params):
            raise InvalidArgumentCountError(func_name, len(params), len(args))
        
        # Check recursion depth
        self.recursion_depth += 1
        if self.recursion_depth > self.MAX_RECURSION:
            raise RecursionLimitError(self.MAX_RECURSION)
        
        try:
            # Create new environment with parameters bound to arguments
            func_env = Environment()
            for param, arg in zip(params, args):
                func_env.set(param, arg)
            
            # Evaluate function body
            saved_pos = self.pos
            saved_tokens = self.tokens
            
            self.tokens = func_def['tokens']
            self.pos = func_def['body_start']
            
            # Parse full expression to handle LET, IF, etc.
            result = self.parse_expression(func_env)
            
            self.pos = saved_pos
            self.tokens = saved_tokens
            
            return result
        finally:
            self.recursion_depth -= 1


# =======================
# CONVENIENCE FUNCTION
# =======================

def calculate(expression):
    """
    Evaluate an octal expression and return result.
    
    Args:
        expression: Input expression string
        
    Returns:
        Result as octal string
    """
    calc = Calculator()
    return calc.evaluate(expression)


if __name__ == '__main__':
    # Interactive mode
    print("Octal Calculator")
    print("All inputs and outputs are in octal (base 8)")
    print("Examples:")
    print("  10 + 7 = 17")
    print("  LET x = 10 IN x + 7 = 17")
    print("  DEF square(x) = x * x; square(5) = 31")
    print()
    
    calc = Calculator()
    
    while True:
        try:
            expr = input("> ").strip()
            if not expr or expr.lower() == 'exit':
                break
            
            result = calc.evaluate(expr)
            print(result)
        
        except CalculatorException as e:
            print(f"Error: {e}")
        except EOFError:
            break
        except KeyboardInterrupt:
            print("\nExiting...")
            break
