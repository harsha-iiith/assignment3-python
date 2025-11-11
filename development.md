# Assignment 3 - Python Development Task List

## Initial Setup (Tasks 1-3)

1. Create folder structure: Q1/, Q2/, Q3/, Q4/, Q5/, Q6/
2. Set up Python virtual environment and install base dependencies
3. Declare LLM usage at https://forms.office.com/r/754tAUacRk

---

## Q1: Code Similarity Analysis (25 Marks) - Tasks 4-53

### Part A: Preprocessing & Data Understanding (5 Marks) - Tasks 4-18

4. Create Q1 folder with results/ subfolder
5. Download and organize 27 VidyaVichar project folders in common directory
6. Create similarity_analysis.ipynb notebook
7. Install required libraries: difflib, python-Levenshtein, scikit-learn, transformers, matplotlib, seaborn, plotly, networkx, esprima-python
8. Write function to identify file types: .js, .jsx, .json, .css
9. Write function to remove comments from JavaScript files
10. Write function to detect and remove minified code
11. Write function to normalize formatting (indentation, spacing)
12. Preprocess all 27 projects
13. Count files per project
14. Count folders per project
15. Count Lines of Code (LOC) per project
16. Count React components (JSX files, component patterns)
17. Count Express routes (app.get, app.post, router patterns)
18. Count Mongoose models (mongoose.Schema, model patterns)
19. Generate preprocessing summary as CSV/JSON
20. Save preprocessing summaries in results/ folder

### Part B: Code Similarity Computation (15 Marks) - Tasks 21-38

**Textual Similarity (Tasks 21-25)**
21. Implement line-level similarity using difflib
22. Implement token-level similarity using Levenshtein distance
23. Create TF-IDF vectors and compute cosine similarity
24. Compute pairwise textual similarity for all 27 projects (or sampled subset)
25. Save textual similarity matrix (NxN) in results/

**Structural Similarity (Tasks 26-31)**
26. Parse JavaScript files using esprima to get AST
27. Extract API routes from all projects
28. Extract Mongoose schemas from all projects
29. Implement AST/route/schema comparison algorithm
30. Compute pairwise structural similarity for all 27 projects
31. Save structural similarity matrix (NxN) in results/

**Semantic Similarity (Tasks 32-38)**
32. Load CodeBERT or GraphCodeBERT or sentence-transformers model
33. Extract code functions/methods from projects
34. Generate code embeddings
35. Compute cosine similarity between embeddings
36. Compute pairwise semantic similarity for all 27 projects
37. Save semantic similarity matrix (NxN) in results/
38. Identify most and least similar project pairs for each metric

### Part C: Visualization & Reporting (5 Marks) - Tasks 39-53

**Visualizations (Tasks 39-44)**
39. Create heatmap of similarity matrix for textual similarity
40. Create heatmap of similarity matrix for structural similarity
41. Create heatmap of similarity matrix for semantic similarity
42. Create network graph showing project clusters based on similarity
43. Create bar charts showing average similarity by metric
44. Save all plots in results/ folder

**Analytical Report (Tasks 45-49)**
45. Write methodology section explaining techniques used and justification
46. Write observations section about coding diversity
47. Write insights section on patterns of reuse or structural consistency
48. Compile report as 1-page document
49. Export report as report.pdf

**Optional & Finalization (Tasks 50-53)**
50. (Optional) Create interactive dashboard using Streamlit
51. Create Q1/README.md with assumptions and execution instructions
52. Test notebook execution from start to finish
53. Verify Q1 submission format: similarity_analysis.ipynb, results/, report.pdf, README.md

---

## Q2: Image Blurring Implementation (15 Marks) - Tasks 54-78

### Setup and Input Data Generation (Tasks 54-59)

54. Create Q2 folder
55. Create box_blur.ipynb notebook
56. Install libraries: Pillow, NumPy, matplotlib
57. Create 400x200 pixel 8-bit grayscale image using PIL
58. Add black background (pixel value 0) and text "SSD TAs ARE THE BEST" centered in white (value 255)
59. Convert PIL image to NumPy array (original_image)

### Implementation Requirements (Tasks 60-67)

**Task 1: Iterative Python Implementation (Tasks 60-63)**
60. Write blur_python(image) function
61. Use nested for loops to iterate through pixels
62. Exclude outermost single-pixel boundary
63. Calculate 3x3 mean blur for each pixel

**Task 2: Vectorized NumPy Implementation (Tasks 64-67)**
64. Write blur_numpy(image) function
65. Use NumPy array slicing (no explicit Python for loops)
66. Use padding and broadcasting for 3x3 mean blur
67. Verify same blurring effect as blur_python

### Benchmarking and Verification (Tasks 68-72)

68. Measure execution time of blur_python
69. Measure execution time of blur_numpy
70. Print timing results to console
71. Create matplotlib figure with 3 subplots side-by-side
72. Display: original_image, blur_python result, blur_numpy result

### Analysis and Discussion (Tasks 73-78)

73. Write Performance Results section: report timing difference and compare with expectations
74. Write Vectorization section: explain how it applies to blur_numpy
75. Write Compiled Code vs Interpreter section: contrast NumPy vs Python loops execution
76. Write Memory Layout section: explain NumPy contiguous memory advantages
77. Create Q2/README.md with assumptions and requirements
78. Verify Q2 submission format: box_blur.ipynb, README.md

---

## Q3: Sorting Algorithms Package (10 Marks) - Tasks 79-123

### Setup (Tasks 79-84)

79. Create Q3/Sorting_Package/ folder
80. Create subfolders: src/, test/, reports/
81. Initialize git repository in Sorting_Package/
82. Create .gitignore for Python
83. Create initial commit
84. Create git branch for development

### Implementation (Tasks 85-107)

**Abstract Base Class (Tasks 85-87)**
85. Create src/sorting_base.py with abstract SortingAlgorithm class
86. Define abstract sort() method
87. Add input validation (size < 2e5, INT32 range, integer type only)

**Sorting Algorithms (Tasks 88-99)**
88. Create src/bubble_sort.py implementing BubbleSort class
89. Implement bubble sort with ascending/descending parameter
90. Create src/selection_sort.py implementing SelectionSort class
91. Implement selection sort with ascending/descending parameter
92. Create src/quick_sort.py implementing QuickSort class
93. Implement quick sort with ascending/descending parameter
94. Create src/merge_sort.py implementing MergeSort class
95. Implement merge sort with ascending/descending parameter
96. Verify all algorithms return new list (not in-place)
97. Verify all algorithms work only for integer data type
98. Test each algorithm manually
99. Commit each implementation

**Factory Class (Tasks 100-104)**
100. Create src/sorting_factory.py with class to call algorithms based on parameter
101. Implement method accepting: ascending/descending, algorithm name, list size, input list
102. Return new sorted list
103. Add parameter validation
104. Commit factory implementation

### Testing (Tasks 105-111)

105. Create test package in test/ folder
106. Write tests for bubble sort correctness
107. Write tests for selection sort correctness
108. Write tests for quick sort correctness
109. Write tests for merge sort correctness
110. Run all tests and verify they pass
111. Commit test files

### Main and I/O (Tasks 112-118)

112. Create main.py in Sorting_Package/ root
113. Implement reading input from input file
114. Parse parameters: algorithm name, order, list
115. Call sorting functions via factory
116. Redirect output using terminal (stdout)
117. Create sample input file
118. Test main.py with all algorithms

### Git Management (Tasks 119-123)

119. Create git tag for initial version
120. Use branches to showcase different features
121. Create Q3/README.md (if separate from Sorting_Package)
122. Verify folder structure: Sorting_Package/src/, test/, reports/, main.py
123. Verify Q3 submission format and git history

---

## Q4: Pylint Refactoring (10 Marks) - Tasks 124-147

### Initial Pylint Report (Tasks 124-127)

124. Install pylint
125. Run pylint on Q3 src/ folder
126. Generate pylint report (before refactoring)
127. Save report in reports/pylint_before.txt

### Refactoring (Tasks 128-135)

128. Analyze pylint issues and create refactoring plan
129. Fix naming conventions, add docstrings, fix formatting
130. Refactor code to achieve pylint score > 8.5
131. Ensure all Q3 test cases still pass after refactoring
132. Generate pylint report (after refactoring)
133. Save report in reports/pylint_after.txt
134. Create git branch for refactoring
135. Commit refactored code with git tag

### Refactoring Report (Tasks 136-138)

136. Create report explaining what changes were made
137. Explain why each change was necessary
138. Save as reports/refactoring_report.md or .pdf

### Shell Sort Addition (Tasks 139-147)

139. Add shell sort algorithm to package
140. Create src/shell_sort.py implementing ShellSort class
141. Implement shell sort with ascending/descending parameter
142. Write tests for shell sort
143. Update factory to include shell sort
144. Run pylint on updated code
145. Document how pylint score changes after adding shell sort
146. Save new pylint report in reports/
147. Commit shell sort with git tag/branch

---

## Q5: Kaooa Board Game (20 Marks) - Tasks 148-172

### Game Research & Setup (Tasks 148-152)

148. Create Q5 folder
149. Research Kaooa rules from https://www.whatdowedoallday.com/kaooa/
150. Watch tutorial video: https://www.youtube.com/watch?v=Jzeug1XTRQM
151. Understand game rules: crows vs vulture, win conditions
152. Choose Python library (Turtle, Pygame, Tkinter, etc.)

### Board Implementation (Tasks 153-159)

153. Create kaooa.py file (can use modules but executable from this file)
154. Draw pentagonal star board (10 intersection points)
155. Set up game window
156. Draw lines connecting valid move positions
157. Implement coordinate system for board positions
158. Test board rendering
159. Add visual markers for positions

### Game Logic (Tasks 160-168)

160. Implement crow piece representation (7 crows total)
161. Implement vulture piece representation
162. Implement crow placement phase (first 7 turns)
163. Implement crow movement phase (after all placed)
164. Implement vulture movement and capture logic (jump over crow)
165. Track turn-based gameplay (crow turn, vulture turn)
166. Implement win condition: vulture captures 4 crows
167. Implement win condition: crows trap vulture (cannot move)
168. Display win/loss messages

### User Interaction (Tasks 169-172)

169. Implement click/input handling for moves
170. Display current player turn
171. Add basic UI elements (instructions, piece counters)
172. Test complete game playthrough

### Finalization (Tasks 173-175)

173. Clean up code with comments
174. Create Q5/README.md with game rules, controls, execution instructions
175. Verify Q5 submission format: kaooa.py (executable), README.md

---

## Q6: Octal Calculator (20 Marks) - Tasks 176-280

### Project Setup (Tasks 176-180)

176. Create Q6 folder
177. Create octal_calculator.py
178. Create exceptions.py
179. Create test_cases.py
180. Plan architecture: tokenizer, parser, evaluator, environment

### Custom Exception Hierarchy (Tasks 181-192)

181. Design exception hierarchy in exceptions.py
182. Create base CalculatorException
183. Create ParseError for syntax errors
184. Create EvaluationError for runtime errors
185. Create RecursionLimitError for exceeding 1000 calls
186. Create VariableNotFoundError
187. Create FunctionNotDefinedError
188. Create DivisionByZeroError
189. Create InvalidOctalDigitError
190. Create InvalidArgumentCountError
191. Add informative error messages to all exceptions
192. Document exception hierarchy design and rationale

### Octal Conversion (Tasks 193-202)

193. Implement manual octal_to_decimal(octal_str) - NO oct() or int(x,8)
194. Validate octal digits (0-7 only)
195. Handle negative octal numbers
196. Add assertions for valid octal input
197. Implement manual decimal_to_octal(decimal_int) - NO oct()
198. Handle negative decimals and zero
199. Add assertions for conversion correctness
200. Test octal conversions with various inputs
201. Test round-trip conversions
202. Document conversion algorithms

### Component 1: Octal Arithmetic with Variables (Tasks 203-218)

**Tokenizer/Lexer (Tasks 203-210)**
203. Create tokenizer to parse input string - NO eval() or exec()
204. Recognize octal numbers
205. Recognize operators: +, -, *, /, %, ^ (exponentiation)
206. Recognize parentheses: (, )
207. Recognize LET, IN keywords (uppercase)
208. Recognize variable names
209. Recognize = for assignment
210. Test tokenizer with sample expressions

**Parser for Arithmetic (Tasks 211-218)**
211. Build parser for arithmetic expressions - NO eval() or exec()
212. Implement PEMDAS order of operations
213. Support arbitrarily nested parentheses
214. Parse LET <variable> = <octal_value> IN <expression>
215. Support nested LET bindings
216. Create AST or evaluation structure
217. Test: "10 + 7" parses correctly
218. Test: "LET x = 10 IN x + 7" parses correctly

**Evaluator for Arithmetic (Tasks 219-225)**
219. Implement expression evaluator
220. Convert octal to decimal internally for computation
221. Perform arithmetic: +, -, *, /, %, ^
222. Division returns integer values (no fractions)
223. Convert result back to octal format
224. Implement variable scoping (local to IN expression)
225. Test: "10 + 7" → "17", "LET x = 10 IN x + 7" → "17"

### Component 2: User-Defined Recursive Functions (Tasks 226-242)

**Parser for Functions (Tasks 226-232)**
226. Extend parser to recognize DEF keyword (uppercase)
227. Parse: DEF <name>(<param1>, <param2>, ...) = <expression>
228. Parse function calls: <name>(<octal_arg1>, octal_arg2>, ...)
229. Store function definitions permanently
230. Support multiple parameters
231. Test: "DEF square(x) = x * x" stores correctly
232. Test: "square(5)" parses correctly

**Evaluator for Functions (Tasks 233-242)**
233. Implement function definition storage (global scope)
234. Implement function call evaluation
235. Create local scope for function parameters
236. Ensure parameters are local to function body
237. Validate argument count matches parameter count
238. Support recursive function calls
239. Track recursion depth
240. Enforce maximum 1000 nested calls (hard limit)
241. Raise RecursionLimitError if limit exceeded
242. Test: "DEF square(x) = x * x; square(5)" → "31"

### Component 3: Conditional Expressions (Tasks 243-252)

**Parser for Conditionals (Tasks 243-247)**
243. Extend parser to recognize IF, THEN, ELSE keywords (uppercase)
244. Parse: IF <condition> THEN <expression1> ELSE <expression2>
245. Parse comparison operators: ==, !=, <, >, <=, >=
246. Support nested conditionals
247. Test: "IF 10 > 7 THEN 5 ELSE 3" parses correctly

**Evaluator for Conditionals (Tasks 248-252)**
248. Implement condition evaluation (compare octal values)
249. Execute only chosen branch (THEN or ELSE)
250. Support variables and function calls in conditions
251. Support nested conditionals
252. Test: "IF 10 > 7 THEN 5 ELSE 3" → "5"

### Feature Integration (Tasks 253-260)

253. Ensure arithmetic can use operators, parentheses, LET bindings
254. Ensure functions can use arithmetic, variables, conditionals, recursion
255. Ensure conditionals can use arithmetic, variables, function calls, nested conditionals
256. Test combined example: "DEF sum_squares(n) = IF n <= 0 THEN 0 ELSE n * n + sum_squares(n - 1)"
257. Test: "sum_squares(5)" → "107"
258. Verify all inputs are octal strings
259. Verify all outputs are octal strings
260. Test complex nested combinations

### Assertions (Tasks 261-265)

261. Add pre-condition assertions at critical points
262. Add invariant assertions during evaluation
263. Add post-condition assertions
264. Validate assertions protect against bugs
265. Document assertion strategy and what they protect

### Testing (Tasks 266-275)

266. Write tests for octal conversion accuracy
267. Write tests for basic arithmetic operations
268. Write tests for LET bindings and variable scoping
269. Write tests for function definition and calls
270. Write tests for recursive functions (factorial, Fibonacci, sum_squares)
271. Write tests for conditional expressions
272. Write edge case tests: division by zero, invalid octal, undefined variable/function
273. Write edge case tests: wrong argument count, recursion limit
274. Write tests for nested features and complex combinations
275. Verify all tests pass

### Documentation (Tasks 276-283)

276. Create Report.pdf documentation
277. Document parsing approach and algorithm
278. Document octal conversion algorithms (to/from decimal)
279. Document recursion safety and depth tracking
280. Document variable scope management strategy
281. Document exception hierarchy design and rationale
282. Document assertion strategy
283. Document design decisions and assumptions

### Finalization (Tasks 284-288)

284. Add comprehensive code comments
285. Add docstrings to all functions
286. Create Q6/README.md with assumptions and requirements
287. Verify technical constraints: no eval(), no external libs (except re), no oct()/int(x,8), no SymPy/NumPy
288. Verify Q6 submission format: octal_calculator.py, exceptions.py, test_cases.py, Report.pdf, README.md

---

## Final Submission (Tasks 289-295)

289. Create root README.md for entire assignment with global assumptions
290. Verify all folders: Q1/, Q2/, Q3/, Q4/, Q5/, Q6/
291. Verify each folder has required files per question
292. Create <roll_number>.zip file
293. Verify zip structure matches submission format
294. Test unzip and verify all files present
295. Submit to Moodle before deadline: 15 Nov 2025, 05:00 PM

---

## Total Tasks: 295

**Breakdown by Question:**
- Q1: 50 tasks (25 marks)
- Q2: 25 tasks (15 marks)
- Q3: 45 tasks (10 marks)
- Q4: 24 tasks (10 marks)
- Q5: 28 tasks (20 marks)
- Q6: 113 tasks (20 marks)
- Setup & Submission: 10 tasks

**Priority Order:** Q1 (25m), Q6 (20m), Q5 (20m), Q2 (15m), Q3 (10m), Q4 (10m)
