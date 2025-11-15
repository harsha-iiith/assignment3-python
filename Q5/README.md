# Q5: Kaooa Board Game (20 marks)

Traditional Indian strategy game - Vulture and Crows

## Game Overview

Kaooa is a traditional hunt game from India where two players compete:
- **Player 1 (Crows)**: Controls 7 crows, trying to trap the vulture
- **Player 2 (Vulture)**: Controls 1 vulture, trying to capture 4 crows

## Rules

### Board
- Pentagonal star shape with 10 intersection points
- 5 outer points (star tips) + 5 inner points (star intersections)
- Pieces move along the lines connecting these points

### Game Phases

#### Phase 1: Placement (First 7 Turns)
1. **Turn 1**: Crows place their first crow on any position
2. **Turn 2**: Vulture places on any empty position
3. **Turns 3-7**: Crows continue placing one crow per turn, vulture can move

#### Phase 2: Movement (After Turn 7)
- Both crows and vulture can move to adjacent empty positions
- Vulture can capture crows by jumping over them (in straight line)
- Only one move/jump per turn

### Win Conditions
- **Vulture wins**: Captures 4 or more crows
- **Crows win**: Trap vulture so it has no valid moves

## Installation

### Prerequisites
Python 3.x with pygame library:

```bash
pip install pygame
```

Or using pip3:

```bash
pip3 install pygame
```

## How to Run

```bash
cd Q5
python3 kaooa.py
```

Or simply:

```bash
python3 Q5/kaooa.py
```

## Controls

### Mouse Controls
- **Left Click**: 
  - Place piece (during placement phase)
  - Select piece to move (during movement phase)
  - Click destination to move selected piece

### Keyboard Controls
- **Q**: Quit game
- **R**: Restart game (only available after game ends)

## Gameplay Instructions

1. **Starting the Game**
   - Game starts with crows' turn
   - Click any position to place first crow
   - Vulture places next, then continues placing crows

2. **Selecting and Moving**
   - Click on your piece to select it (highlighted in blue)
   - Valid move positions are shown in green
   - Click on a valid position to move there
   - Click elsewhere to deselect

3. **Vulture Capturing**
   - Vulture can jump over a crow to capture it
   - Must jump in a straight line to an empty position
   - Captured crows are removed from the board
   - Capture counter shown at bottom-left

4. **Winning**
   - Game announces winner when conditions are met
   - Press R to play again

## Visual Guide

### Board Layout
```
        0 (top)
       / \
      /   \
     5     7
    /       \
   4    9    2
    \       /
     8     6
      \   /
       \ /
        1
       / \
      /   \
     3-----4
```

### Color Scheme
- **Crows**: Dark gray/black circles
- **Vulture**: Red circle (larger)
- **Empty positions**: Small gray dots
- **Selected piece**: Blue highlight ring
- **Valid moves**: Green circles

## Strategy Tips

### For Crows
- Work together to surround the vulture
- Avoid creating straight lines (vulnerable to capture)
- Use outer positions to control vulture's movement
- Sacrifice 1-2 crows if needed to trap vulture

### For Vulture
- Capture crows early before they organize
- Look for straight-line jump opportunities
- Keep mobile - don't get cornered
- Target isolated crows first

## Implementation Details

### Features Implemented
1. Pentagonal star board geometry with 10 positions
2. Two-phase gameplay (placement → movement)
3. Crow placement logic (7 crows placed one by one)
4. Vulture movement and jump/capture mechanics
5. Win condition detection (4 captures or blocked vulture)
6. Interactive mouse controls with visual feedback
7. Turn-based gameplay with status display
8. Game restart functionality

### Code Structure
- **KaooaGame class**: Main game logic
  - `_calculate_star_positions()`: Board geometry calculation
  - `_define_connections()`: Valid move graph
  - `get_valid_moves()`: Move validation
  - `can_vulture_capture()`: Capture detection
  - `check_vulture_blocked()`: Win condition check
  - `handle_click()`: User input processing
  - `draw_board()`: Board rendering
  - `draw_ui()`: Status and instructions

### Technical Highlights
- Pentagram geometry using golden ratio (0.382)
- Connection graph for valid moves
- Line intersection detection for capture mechanics
- Visual feedback system (highlights, valid move indicators)
- Clean separation of game logic and rendering

## File Structure

```
Q5/
├── kaooa.py        # Main game implementation (400+ lines)
└── README.md       # This documentation
```

## Known Limitations

1. **Draw Detection**: Repetitive moves could lead to infinite games (rule not enforced)
2. **Forced Captures**: Vulture not forced to capture when opportunity exists (as per traditional rules)
3. **AI Player**: No computer opponent implemented (human vs human only)

## Testing

To verify the game works correctly:

1. **Placement Phase**
   - Place all 7 crows
   - Verify vulture can move after being placed
   - Check turn indicators update correctly

2. **Movement Phase**
   - Verify crows can only move to adjacent positions
   - Test vulture capture by jumping
   - Check captured crows are removed

3. **Win Conditions**
   - Vulture wins: Capture 4 crows
   - Crows win: Surround vulture completely

4. **Edge Cases**
   - Clicking invalid positions (no effect)
   - Selecting/deselecting pieces
   - Restart after game ends

## References

- Game Rules: https://www.whatdowedoallday.com/kaooa/
- Pentagram Geometry: Golden ratio intersections
- Pygame Documentation: https://www.pygame.org/docs/

## Author

Assignment 3 - Question 5
SSD Course - Python Implementation
