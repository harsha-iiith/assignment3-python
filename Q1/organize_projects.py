"""
Helper script to organize VidyaVichar projects for similarity analysis.

This script helps you prepare the dataset for Q1 by:
1. Creating the projects/ directory structure
2. Copying available VidyaVichar projects to the right location
3. Validating the project structure

Usage:
    python organize_projects.py

Or manually:
    mkdir -p projects
    cp -r /path/to/Team_01 projects/
    cp -r /path/to/Team_02 projects/
    ...
"""

import os
import shutil
from pathlib import Path

# Configuration
SOURCE_DIR = "../../mid"  # Adjust this to where your VidyaVichar projects are located
TARGET_DIR = "projects"
REQUIRED_PROJECTS = 27

def create_projects_dir():
    """Create the projects directory if it doesn't exist."""
    os.makedirs(TARGET_DIR, exist_ok=True)
    print(f"✓ Created directory: {TARGET_DIR}/")

def find_vidyavichar_projects(search_path):
    """
    Search for VidyaVichar project directories.
    
    Args:
        search_path: Path to search in
        
    Returns:
        List of project directories found
    """
    projects = []
    
    if not os.path.exists(search_path):
        print(f"⚠ Search path not found: {search_path}")
        return projects
    
    # Look for Team_XX or similar directories
    for item in os.listdir(search_path):
        item_path = os.path.join(search_path, item)
        if os.path.isdir(item_path):
            # Check if it's a valid project (has package.json or typical MERN structure)
            if (os.path.exists(os.path.join(item_path, 'package.json')) or
                any(os.path.exists(os.path.join(item_path, d)) 
                    for d in ['client', 'server', 'frontend', 'backend', 'src'])):
                projects.append(item_path)
    
    return projects

def copy_projects(projects):
    """
    Copy projects to the target directory.
    
    Args:
        projects: List of project paths to copy
    """
    copied = 0
    
    for project_path in projects:
        project_name = os.path.basename(project_path)
        target_path = os.path.join(TARGET_DIR, project_name)
        
        if os.path.exists(target_path):
            print(f"  - {project_name} (already exists, skipping)")
            copied += 1
            continue
        
        try:
            shutil.copytree(project_path, target_path, 
                          ignore=shutil.ignore_patterns('node_modules', '.git', '__pycache__'))
            print(f"  - {project_name} ✓")
            copied += 1
        except Exception as e:
            print(f"  - {project_name} ✗ (error: {e})")
    
    return copied

def validate_structure():
    """Validate the projects directory structure."""
    if not os.path.exists(TARGET_DIR):
        print("⚠ Projects directory not found!")
        return False
    
    projects = [d for d in os.listdir(TARGET_DIR) 
                if os.path.isdir(os.path.join(TARGET_DIR, d))]
    
    print(f"\nFound {len(projects)} projects in {TARGET_DIR}/:")
    for i, proj in enumerate(sorted(projects), 1):
        print(f"  {i:2d}. {proj}")
    
    if len(projects) < REQUIRED_PROJECTS:
        print(f"\n⚠ Warning: Expected {REQUIRED_PROJECTS} projects, but found {len(projects)}")
        print(f"  Please add {REQUIRED_PROJECTS - len(projects)} more projects to complete the dataset.")
        return False
    
    return True

def main():
    """Main function to organize projects."""
    print("=" * 60)
    print("VidyaVichar Project Organization Script")
    print("=" * 60)
    
    # Step 1: Create directory
    print("\n[Step 1] Creating projects directory...")
    create_projects_dir()
    
    # Step 2: Find available projects
    print(f"\n[Step 2] Searching for projects in {SOURCE_DIR}...")
    found_projects = find_vidyavichar_projects(SOURCE_DIR)
    
    if found_projects:
        print(f"Found {len(found_projects)} potential projects:")
        for proj in found_projects:
            print(f"  - {os.path.basename(proj)}")
    else:
        print("⚠ No projects found!")
        print("\nManual steps required:")
        print("1. Locate all 27 VidyaVichar project folders")
        print("2. Copy them to the 'projects/' directory:")
        print("   cp -r /path/to/Team_XX projects/")
        return
    
    # Step 3: Copy projects
    print(f"\n[Step 3] Copying projects to {TARGET_DIR}/...")
    copied = copy_projects(found_projects)
    print(f"✓ Copied {copied} projects")
    
    # Step 4: Validate
    print("\n[Step 4] Validating project structure...")
    is_valid = validate_structure()
    
    # Summary
    print("\n" + "=" * 60)
    if is_valid:
        print("✓ SUCCESS: All projects organized correctly!")
        print("\nNext steps:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Run notebook: jupyter notebook similarity_analysis.ipynb")
    else:
        print("⚠ INCOMPLETE: Please add more projects to reach 27 total")
        print("\nTo add projects manually:")
        print("  cp -r /path/to/Team_XX projects/")
    print("=" * 60)

if __name__ == "__main__":
    main()
