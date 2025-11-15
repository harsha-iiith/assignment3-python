"""
Script to clone all VidyaVichar project repositories.

This script clones all available team repositories from GitHub
and organizes them in the projects/ directory for similarity analysis.

Usage:
    python clone_repositories.py
"""

import os
import subprocess
from pathlib import Path

# Repository data
REPOSITORIES = [
    {"team": "Team_25", "url": "https://github.com/abhinavborah/vidyavichara-team25"},
    {"team": "Team_03", "url": "https://github.com/Sahoo-Achyutananda/vidya-vichar", "branch": "test"},
    {"team": "Team_14", "url": "https://github.com/geethamGT3RS/VidyaVichar"},
    {"team": "Team_10", "url": "https://github.com/IIITH-2025-27/VidyaVichar"},
    {"team": "Team_33", "url": "https://github.com/PrathyushaKalluri/VidyaVichar_Team33.git"},
    {"team": "Team_24", "url": "https://github.com/Caerus256/VidyaVichars"},
    {"team": "Team_29", "url": "https://github.com/Rajkjain03/VidyaVichar-Classroom-Q-A-sticky-board"},
    {"team": "Team_32", "url": "https://github.com/nradhakrishna/vidya-vichaar"},
    {"team": "Team_16", "url": "https://github.com/leocodeio/vidya-vichar-iiith-ssd-26-sep-25-mid-hackathon"},
    {"team": "Team_17", "url": "https://github.com/anudeepbutha/VidyaVichar_main"},
    {"team": "Team_27", "url": "https://github.com/a-n-u-p-a-m/Group_27_SSD_MID_LAB"},
    {"team": "Team_26", "url": "https://github.com/incredibleharsh021/Vidya-Vichar.git"},
    {"team": "Team_28", "url": "https://github.com/Ishaan-Giri/VidyaVichar.git"},
    {"team": "Team_06", "url": "https://github.com/aayush18602/SSD_MidSem", "branch": "kavan1"},
    {"team": "Team_13", "url": "https://github.com/guptamanali0/VidhyaVichaar.git"},
    {"team": "Team_05", "url": "https://github.com/PranjalSK03/Vidya_Vichar_group5.git"},
    {"team": "Team_21", "url": "https://github.com/Yogesh-Narasimha/SSD_MID_group_21.git"},
    {"team": "Team_02", "url": "https://github.com/Sankalp0109/VidhyaVichar"},
    {"team": "Team_31", "url": "https://github.com/SSD-MidSem-Hackathon/VidhyaVichar"},
    {"team": "Team_22", "url": "https://github.com/shadesin/VidyaVichar"},
    {"team": "Team_20", "url": "https://github.com/sumitgk2003/VidyaVichar_SSD_M25_G20"},
]

# Note: Teams without git links: 18, 23, 12, 09, 34
# Team 25 appears twice in the list (keeping one instance)

TARGET_DIR = "projects"

def clone_repository(team_name, repo_url, branch=None):
    """
    Clone a repository to the projects directory.
    
    Args:
        team_name: Name of the team (e.g., "Team_01")
        repo_url: GitHub repository URL
        branch: Optional branch name to checkout
        
    Returns:
        True if successful, False otherwise
    """
    target_path = os.path.join(TARGET_DIR, team_name)
    
    # Skip if already exists
    if os.path.exists(target_path):
        print(f"  ⚠️  {team_name}: Already exists, skipping")
        return True
    
    try:
        print(f"  📥 {team_name}: Cloning from {repo_url}")
        
        # Clone command
        if branch:
            cmd = ["git", "clone", "-b", branch, "--depth", "1", repo_url, target_path]
        else:
            cmd = ["git", "clone", "--depth", "1", repo_url, target_path]
        
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            # Remove .git directory to save space
            git_dir = os.path.join(target_path, ".git")
            if os.path.exists(git_dir):
                subprocess.run(["rm", "-rf", git_dir], check=False)
            
            print(f"  ✅ {team_name}: Successfully cloned")
            return True
        else:
            print(f"  ❌ {team_name}: Failed - {result.stderr.strip()}")
            return False
            
    except subprocess.TimeoutExpired:
        print(f"  ❌ {team_name}: Timeout (60s)")
        return False
    except Exception as e:
        print(f"  ❌ {team_name}: Error - {str(e)}")
        return False

def validate_project(team_name):
    """
    Validate that a project has MERN stack structure.
    
    Args:
        team_name: Name of the team
        
    Returns:
        True if valid, False otherwise
    """
    target_path = os.path.join(TARGET_DIR, team_name)
    
    if not os.path.exists(target_path):
        return False
    
    # Check for common MERN indicators
    indicators = [
        "package.json",
        "src",
        "client",
        "server",
        "frontend",
        "backend",
        "app.js",
        "index.js",
    ]
    
    for indicator in indicators:
        check_path = os.path.join(target_path, indicator)
        if os.path.exists(check_path):
            return True
    
    # Recursively check one level deep
    try:
        for item in os.listdir(target_path):
            item_path = os.path.join(target_path, item)
            if os.path.isdir(item_path):
                for sub_indicator in indicators:
                    sub_path = os.path.join(item_path, sub_indicator)
                    if os.path.exists(sub_path):
                        return True
    except Exception:
        pass
    
    return False

def main():
    """Main function to clone all repositories."""
    print("=" * 70)
    print("VidyaVichar Repository Cloning Script")
    print("=" * 70)
    
    # Create projects directory
    os.makedirs(TARGET_DIR, exist_ok=True)
    print(f"\n✅ Projects directory: {TARGET_DIR}/\n")
    
    # Statistics
    total_repos = len(REPOSITORIES)
    successful = 0
    failed = 0
    skipped = 0
    
    print(f"📊 Found {total_repos} repositories to clone\n")
    print("-" * 70)
    
    # Clone each repository
    for repo_data in REPOSITORIES:
        team = repo_data["team"]
        url = repo_data["url"]
        branch = repo_data.get("branch")
        
        if clone_repository(team, url, branch):
            if os.path.exists(os.path.join(TARGET_DIR, team)):
                successful += 1
            else:
                skipped += 1
        else:
            failed += 1
    
    print("-" * 70)
    
    # Validate projects
    print("\n🔍 Validating project structures...\n")
    valid_projects = []
    invalid_projects = []
    
    for repo_data in REPOSITORIES:
        team = repo_data["team"]
        if validate_project(team):
            valid_projects.append(team)
            print(f"  ✅ {team}: Valid MERN structure")
        else:
            path = os.path.join(TARGET_DIR, team)
            if os.path.exists(path):
                invalid_projects.append(team)
                print(f"  ⚠️  {team}: No clear MERN structure found")
    
    # Summary
    print("\n" + "=" * 70)
    print("SUMMARY")
    print("=" * 70)
    print(f"Total repositories:     {total_repos}")
    print(f"Successfully cloned:    {successful}")
    print(f"Already existed:        {skipped}")
    print(f"Failed:                 {failed}")
    print(f"Valid MERN projects:    {len(valid_projects)}")
    print(f"Invalid/unclear:        {len(invalid_projects)}")
    
    if invalid_projects:
        print(f"\n⚠️  Projects with unclear structure: {', '.join(invalid_projects)}")
    
    print("\n" + "=" * 70)
    
    # Next steps
    if successful > 0 or skipped > 0:
        print("✅ SUCCESS: Repositories cloned!\n")
        print("Next steps:")
        print("1. Install dependencies:")
        print("   pip install python-Levenshtein scikit-learn transformers \\")
        print("       matplotlib seaborn plotly networkx esprima torch jupyter")
        print("\n2. Run similarity analysis:")
        print("   jupyter notebook similarity_analysis.ipynb")
        print("\n3. Results will be saved to results/ directory")
    else:
        print("❌ No repositories were cloned. Please check your internet connection.")
    
    print("=" * 70)
    
    return len(valid_projects)

if __name__ == "__main__":
    valid_count = main()
    exit(0 if valid_count > 0 else 1)
