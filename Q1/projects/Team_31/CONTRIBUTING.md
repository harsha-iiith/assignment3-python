# Contributing to VidyaVichar

First off, thank you for considering contributing to VidyaVichar! We're excited to build this project together.

This document provides guidelines for contributing to the project to ensure a smooth, consistent, and effective workflow for everyone on the team.

## 🚀 Core Workflow

Our development process is centered around a simple Git workflow. We will work on features in separate branches and merge them into a `develop` branch for integration before finally merging into `main` for a stable release.

**Branches:**

- `main`: This branch is for stable, reviewed, and working code only. Direct pushes are disabled.
- `develop`: This is our main integration branch. All feature branches are merged into `develop` through Pull Requests.
- `feature/<feature-name>`: All new work must be done on a feature branch.

---

## Step-by-Step Guide

Here is the process for adding a new feature or fixing a bug.

### 1. Create a GitHub Issue
Before starting work, create a new issue on GitHub to describe the feature or bug. This helps us track tasks on our project board.

### 2. Create Your Feature Branch
First, make sure your local `develop` branch is up-to-date.

```bash
# Switch to the develop branch
git checkout develop

# Pull the latest changes from the remote repository
git pull origin develop
```

Now, create a new branch for your feature. Name it descriptively.

```bash
# Create and switch to your new feature branch
# Example: feature/create-question-form
git checkout -b feature/<your-feature-name>
```

### 3. Write Your Code & Commit Changes
Work on your feature in this new branch. As you make progress, commit your changes with clear, descriptive messages.

**Commit Message Convention**

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification. This helps keep our commit history clean and readable. Each commit message should be structured as follows:

```text
<type>: <short description>
```

**Types:**
- `feat`: A new feature (e.g., `feat: implement question filtering logic`)
- `fix`: A bug fix (e.g., `fix: prevent empty question submission`)
- `docs`: Changes to documentation (e.g., `docs: update README with setup instructions`)
- `style`: Formatting, missing semi-colons, etc.; no code logic change.
- `refactor`: Refactoring production code, e.g., renaming a variable.
- `chore`: Updating build tasks, package manager configs, etc.

**Example Commit:**
```bash
git add .
git commit -m "feat: add sticky note component with status indicator"
```

### 4. Push Your Branch and Create a Pull Request (PR)
Once your feature is complete, push your branch to the GitHub repository.

```bash
git push origin feature/<your-feature-name>
```

Then, go to the repository on GitHub. You will see a prompt to create a Pull Request from your new branch.

- **Target Branch:** Make sure your PR is set to merge into the `develop` branch.  
- **Title:** Write a clear title for your PR.  
- **Description:** Use the PR template to explain what you did, why you did it, and how the reviewer can test your changes. Link the issue you created in Step 1.  

### 5. Code Review
At least one other team member must review your PR. The reviewer should check for correctness, style, and potential issues. Discuss any feedback in the PR comments.

### 6. Merge
Once the PR is approved and passes any checks, the owner of the PR can merge it into the `develop` branch. Make sure to delete the feature branch after merging.

---

By following these steps, we can maintain a high-quality codebase and a transparent workflow. Let's build something amazing!
