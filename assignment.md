
1
CS6.302 - Software System Development
Assignment 3 – Python
Due: 15 Nov 2025, 05:00 PM
Total Marks: 100
NOTE: This assignment is an individual submission, not a group activity. Evaluation will be conducted based
on a fixed grading rubric (syntax, logic, input and output) and the marks are divided as per prescribed weightage
in respective question. Inputs/output should fit the criteria mentioned in respective questions. Unless it is
specified, all input/output criteria are open to interpretation. All questions in the assignment are self-
explanatory. Do not reach us for any clarifications. If you are answering a question based on a certain
assumption, please feel free to mention it as part of your README file.
Submission Instructions:
Please follow the instructions below carefully. A strict zero will be given if the submission format doesn’t
adhere to this.
o Please submit your code in Moodle.
o Programs must be working correctly.
o Programs must be written in Python.
o Programs must be submitted with the format mentioned in each question. Programs must be saved
in files with the correct file name given in each question.
o Please do not forget to include a README.md file to mention your assumptions, execution
instructions or anything else in the ZIP
o Please feel free to make any valid assumptions wherever the question seems ambiguous. Clearly
mention these assumptions in README.md file. Marks will be awarded only if the assumptions are
stated explicitly. Any invalid assumptions will lead to penalties.
o Submissions that do not adhere to the file structure or naming convention will not be graded.
o If you are using any LLM for this task, please declare your usage with all required details here -
https://forms.office.com/r/754tAUacRk If you are found not mentioning about your LLM usage despite
using one, you will be awarded ‘0’. You will be awarded ‘0’ if your submission is found to be plagiarized
with other submissions.
o Submission Format:
o You are required to submit this lab activity as <roll_number>.zip. For example, if you roll
number 20162153, then your submission file should be 20162153.zip.
o Inside this .zip, create separate folders for each question (Q1, Q2,...Q6). Each folder should
contain the submission in the format specified for that particular question.
Q1: Code Similarity Analysis using Python — The Case of 27 MERN Implementations of VidyaVichar
project (25 Marks)
Objective: To design and implement a Python-based framework to quantitatively and qualitatively evaluate
code similarity across 27 independent implementations of the same MERN-stack project titled VidyaVichar -
Dataset. Students will apply techniques ranging from syntactic (textual) comparison to semantic (structural
and functional) similarity analysis and present their findings with visual analytics.
Background: VidyaVichar is a MERN (MongoDB, Express, React, Node.js) stack project developed by 27
different teams. Although each team solved the same problem statement, their implementations may differ
in: Folder structures, Coding conventions, Logic flow and architectural design, API route naming and model
structures. Understanding how similar or diverse these implementations are providing valuable insight into
software engineering practices, plagiarism detection, and collaborative coding styles.
Assignment Tasks:
Part A — Preprocessing & Data Understanding (5 Marks)
1. Collect all 27 project folders and organize them in a common directory.
2. Preprocess the code:
a. Remove comments, logs, and minified code.
b. Normalize formatting (indentation, spacing).
c. Identify comparable file types: .js, .jsx, .json, .css.
3. Summarize:
a. File and folder count per project.
b. Line of code (LOC), number of React components, Express routes, and Mongoose models.
Part B — Code Similarity Computation (15 Marks)
Design Python scripts to perform at least three levels of similarity analysis:
Level Description Expected Tools / Libraries
Textual
Similarity Line-level or token-level similarity difflib, Levenshtein, TF-IDF,
cosine_similarity
Structural
Similarity
Abstract Syntax Tree (AST) comparison, route or
schema matching esprima, ast, json parsing
Semantic
Similarity
Code embeddings, function-level meaning
similarity
codeBERT, graphcodeBERT,
sentence-transformers
Each student must:
• Compute pairwise similarity between all 27 projects (or a sampled subset).
• Present the results as a similarity matrix (NxN).
• Interpret which projects are most and least similar.
