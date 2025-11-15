"""
Kaooa Board Game - Vulture and Crows
Traditional Indian hunt game implementation using Pygame

Rules:
- 7 crows vs 1 vulture
- Crows place one by one in first 7 turns
- Vulture can move after being placed
- After all crows placed, crows can move
- Vulture wins by capturing 4 crows
- Crows win by blocking vulture
"""

import sys
import math
try:
    import pygame  # pylint: disable=import-error
except ImportError:
    print("Error: pygame is not installed. Install it with: pip install pygame")
    sys.exit(1)

# Constants
WINDOW_WIDTH = 800
WINDOW_HEIGHT = 700
BOARD_CENTER_X = WINDOW_WIDTH // 2
BOARD_CENTER_Y = 350
STAR_RADIUS = 250

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GRAY = (200, 200, 200)
DARK_GRAY = (100, 100, 100)
CROW_COLOR = (50, 50, 50)
VULTURE_COLOR = (200, 50, 50)
HIGHLIGHT_COLOR = (100, 200, 255)
VALID_MOVE_COLOR = (150, 255, 150)

# Game constants
CROW = 'crow'
VULTURE = 'vulture'


class KaooaGame:
    """Main game class for Kaooa board game"""

    def __init__(self):
        """Initialize game state"""
        pygame.init()
        self.screen = pygame.display.set_mode((WINDOW_WIDTH, WINDOW_HEIGHT))
        pygame.display.set_caption('Kaooa - Vulture and Crows')
        self.clock = pygame.time.Clock()
        self.font = pygame.font.Font(None, 36)
        self.small_font = pygame.font.Font(None, 24)

        # Calculate board positions (10 points on pentagonal star)
        self.positions = self._calculate_star_positions()

        # Define valid connections between positions
        self.connections = self._define_connections()

        # Game state - store None for empty, 'crow' or 'vulture' for pieces
        self.board = {}  # type: dict
        for i in range(10):
            self.board[i] = None
        self.crows_placed = 0
        self.vulture_placed = False
        self.current_player = CROW
        self.crows_captured = 0
        self.selected_position = None
        self.game_over = False
        self.winner = None

    def _calculate_star_positions(self):
        """Calculate (x, y) coordinates for 10 points of pentagonal star"""
        positions = {}

        # Outer 5 points (tips of star)
        for i in range(5):
            angle = math.radians(i * 72 - 90)  # Start from top, go clockwise
            x = BOARD_CENTER_X + STAR_RADIUS * math.cos(angle)
            y = BOARD_CENTER_Y + STAR_RADIUS * math.sin(angle)
            positions[i] = (int(x), int(y))

        # Inner 5 points (intersections of star lines)
        inner_radius = STAR_RADIUS * 0.382  # Golden ratio for pentagram
        for i in range(5):
            angle = math.radians(i * 72 - 90 + 36)  # Offset by 36 degrees
            x = BOARD_CENTER_X + inner_radius * math.cos(angle)
            y = BOARD_CENTER_Y + inner_radius * math.sin(angle)
            positions[i + 5] = (int(x), int(y))

        return positions

    def _define_connections(self):
        """Define which positions are connected (valid moves)"""
        # Pentagonal star connections
        connections = {
            0: [2, 3, 7, 5],     # Top outer
            1: [3, 4, 8, 6],     # Right outer
            2: [4, 0, 9, 7],     # Bottom-right outer
            3: [1, 0, 6, 9],     # Bottom-left outer
            4: [2, 1, 5, 8],     # Left outer
            5: [0, 4, 8, 7],     # Top-right inner
            6: [1, 3, 9, 8],     # Right inner
            7: [2, 0, 5, 9],     # Bottom inner
            8: [4, 1, 6, 5],     # Bottom-left inner
            9: [3, 2, 7, 6],     # Left inner
        }
        return connections

    def get_position_from_click(self, pos):
        """Get board position from mouse click coordinates"""
        mouse_x, mouse_y = pos
        click_radius = 30

        for i, (x, y) in self.positions.items():
            distance = math.sqrt((mouse_x - x) ** 2 + (mouse_y - y) ** 2)
            if distance <= click_radius:
                return i
        return None

    def is_valid_move(self, from_pos, to_pos):
        """Check if move from from_pos to to_pos is valid"""
        # Check if destination is empty
        if self.board[to_pos] is not None:
            return False

        # Check if positions are connected
        if to_pos not in self.connections[from_pos]:
            return False

        return True

    def can_vulture_capture(self, from_pos, to_pos):
        """Check if vulture can capture a crow by jumping"""
        # Must be in straight line through connection
        if to_pos not in self.connections[from_pos]:
            return (False, None)

        # Find middle position between from_pos and to_pos
        # Check all connections to find the crow in between
        from_x, from_y = self.positions[from_pos]
        to_x, to_y = self.positions[to_pos]

        # Find position that is approximately in the middle
        for i in range(10):
            if i == from_pos or i == to_pos:
                continue
            pos_x, pos_y = self.positions[i]

            # Check if position is between from and to
            if self._is_between(from_x, from_y, pos_x, pos_y, to_x, to_y):
                # Check if there's a crow at this position
                if self.board[i] == CROW:
                    # Check if to_pos is empty
                    if self.board[to_pos] is None:
                        # Verify connection path
                        if i in self.connections.get(from_pos, []) and to_pos in self.connections.get(i, []):
                            return (True, i)
        return (False, None)

    def _is_between(self, x1, y1, x2, y2, x3, y3):
        """Check if point (x2,y2) is between (x1,y1) and (x3,y3)"""
        # Use cross product to check collinearity
        cross_product = abs((y2 - y1) * (x3 - x1) - (y3 - y1) * (x2 - x1))
        if cross_product > 100:  # Not on same line (with tolerance)
            return False

        # Check if point is between the two endpoints
        dot_product = (x2 - x1) * (x3 - x1) + (y2 - y1) * (y3 - y1)
        squared_length = (x3 - x1) ** 2 + (y3 - y1) ** 2

        if squared_length == 0:
            return False

        param = dot_product / squared_length
        return 0 < param < 1

    def get_valid_moves(self, from_pos):
        """Get all valid moves from a position"""
        valid_moves = []

        if self.board[from_pos] == CROW:
            # Crows can only move to adjacent empty positions
            for to_pos in self.connections[from_pos]:
                if self.board[to_pos] is None:
                    valid_moves.append(to_pos)

        elif self.board[from_pos] == VULTURE:
            # Vulture can move to adjacent empty positions
            for to_pos in self.connections[from_pos]:
                if self.board[to_pos] is None:
                    valid_moves.append(to_pos)

            # Vulture can also capture crows by jumping
            for to_pos in range(10):
                can_capture, _ = self.can_vulture_capture(from_pos, to_pos)
                if can_capture and to_pos not in valid_moves:
                    valid_moves.append(to_pos)

        return valid_moves

    def check_vulture_blocked(self):
        """Check if vulture is blocked (crows win condition)"""
        # Find vulture position
        vulture_pos = None
        for i in range(10):
            if self.board[i] == VULTURE:
                vulture_pos = i
                break

        if vulture_pos is None:
            return False

        # Check if vulture has any valid moves
        valid_moves = self.get_valid_moves(vulture_pos)
        return len(valid_moves) == 0

    def make_move(self, from_pos, to_pos):
        """Execute a move on the board"""
        piece = self.board[from_pos]

        if piece == VULTURE:
            # Check if it's a capture move
            can_capture, crow_pos = self.can_vulture_capture(from_pos, to_pos)
            if can_capture and crow_pos is not None:
                self.board[crow_pos] = None
                self.crows_captured += 1

        # Move the piece
        self.board[to_pos] = piece
        self.board[from_pos] = None

    def handle_click(self, pos):
        """Handle mouse click on board"""
        if self.game_over:
            return

        clicked_pos = self.get_position_from_click(pos)
        if clicked_pos is None:
            return

        # Phase 1: Placing crows
        if self.crows_placed < 7:
            if self.current_player == CROW:
                # Place crow
                if self.board[clicked_pos] is None:
                    self.board[clicked_pos] = CROW
                    self.crows_placed += 1
                    self.current_player = VULTURE
            elif self.current_player == VULTURE and not self.vulture_placed:
                # Place vulture (only once)
                if self.board[clicked_pos] is None:
                    self.board[clicked_pos] = VULTURE
                    self.vulture_placed = True
                    self.current_player = CROW
            elif self.current_player == VULTURE and self.vulture_placed:
                # Vulture can move after being placed
                if self.board[clicked_pos] == VULTURE:
                    self.selected_position = clicked_pos
                elif self.selected_position is not None:
                    valid_moves = self.get_valid_moves(self.selected_position)
                    if clicked_pos in valid_moves:
                        self.make_move(self.selected_position, clicked_pos)
                        self.selected_position = None
                        self.current_player = CROW
                    else:
                        self.selected_position = None

        # Phase 2: Moving pieces
        else:
            current_piece = CROW if self.current_player == CROW else VULTURE

            if self.board[clicked_pos] == current_piece:
                # Select piece
                self.selected_position = clicked_pos
            elif self.selected_position is not None:
                # Try to move selected piece
                valid_moves = self.get_valid_moves(self.selected_position)
                if clicked_pos in valid_moves:
                    self.make_move(self.selected_position, clicked_pos)
                    self.selected_position = None
                    # Switch player
                    self.current_player = CROW if self.current_player == VULTURE else VULTURE
                else:
                    self.selected_position = None

        # Check win conditions
        if self.crows_captured >= 4:
            self.game_over = True
            self.winner = VULTURE
        elif self.vulture_placed and self.check_vulture_blocked():
            self.game_over = True
            self.winner = CROW

    def draw_board(self):
        """Draw the game board"""
        self.screen.fill(WHITE)

        # Draw connections (lines)
        for pos1, connected in self.connections.items():
            x1, y1 = self.positions[pos1]
            for pos2 in connected:
                if pos2 > pos1:  # Draw each line only once
                    x2, y2 = self.positions[pos2]
                    pygame.draw.line(self.screen, DARK_GRAY, (x1, y1), (x2, y2), 2)

        # Draw valid move indicators
        if self.selected_position is not None:
            valid_moves = self.get_valid_moves(self.selected_position)
            for move_pos in valid_moves:
                x, y = self.positions[move_pos]
                pygame.draw.circle(self.screen, VALID_MOVE_COLOR, (x, y), 15, 3)

        # Draw positions (circles)
        for i, (x, y) in self.positions.items():
            if self.board[i] == CROW:
                pygame.draw.circle(self.screen, CROW_COLOR, (x, y), 20)
                pygame.draw.circle(self.screen, WHITE, (x, y), 20, 2)
            elif self.board[i] == VULTURE:
                pygame.draw.circle(self.screen, VULTURE_COLOR, (x, y), 25)
                pygame.draw.circle(self.screen, WHITE, (x, y), 25, 2)
            else:
                pygame.draw.circle(self.screen, GRAY, (x, y), 10)

            # Highlight selected position
            if i == self.selected_position:
                pygame.draw.circle(self.screen, HIGHLIGHT_COLOR, (x, y), 30, 4)

    def draw_ui(self):
        """Draw UI elements (status, instructions)"""
        # Game title
        title = self.font.render('KAOOA - Vulture and Crows', True, BLACK)
        self.screen.blit(title, (WINDOW_WIDTH // 2 - title.get_width() // 2, 20))

        # Status bar
        if self.game_over:
            if self.winner == VULTURE:
                status = "VULTURE WINS! (Captured 4 crows)"
            else:
                status = "CROWS WIN! (Vulture blocked)"
            color = VULTURE_COLOR if self.winner == VULTURE else CROW_COLOR
        else:
            if self.crows_placed < 7:
                if self.current_player == CROW:
                    status = f"CROWS: Place crow {self.crows_placed + 1}/7"
                    color = CROW_COLOR
                elif not self.vulture_placed:
                    status = "VULTURE: Place your piece"
                    color = VULTURE_COLOR
                else:
                    status = "VULTURE: Make your move"
                    color = VULTURE_COLOR
            else:
                if self.current_player == CROW:
                    status = "CROWS: Make your move"
                    color = CROW_COLOR
                else:
                    status = "VULTURE: Make your move"
                    color = VULTURE_COLOR

        status_text = self.font.render(status, True, color)
        self.screen.blit(status_text, (WINDOW_WIDTH // 2 - status_text.get_width() // 2, 620))

        # Crows captured counter
        captured_text = self.small_font.render(
            f'Crows Captured: {self.crows_captured}/4', True, BLACK
        )
        self.screen.blit(captured_text, (20, 650))

        # Instructions
        if self.game_over:
            restart_text = self.small_font.render('Press R to restart', True, BLACK)
            self.screen.blit(restart_text, (WINDOW_WIDTH - 200, 650))
        else:
            quit_text = self.small_font.render('Press Q to quit', True, BLACK)
            self.screen.blit(quit_text, (WINDOW_WIDTH - 150, 650))

    def reset_game(self):
        """Reset game to initial state"""
        for i in range(10):
            self.board[i] = None
        self.crows_placed = 0
        self.vulture_placed = False
        self.current_player = CROW
        self.crows_captured = 0
        self.selected_position = None
        self.game_over = False
        self.winner = None

    def run(self):
        """Main game loop"""
        running = True

        while running:
            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False
                elif event.type == pygame.MOUSEBUTTONDOWN:
                    if event.button == 1:  # Left click
                        self.handle_click(event.pos)
                elif event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_q:
                        running = False
                    elif event.key == pygame.K_r and self.game_over:
                        self.reset_game()

            self.draw_board()
            self.draw_ui()
            pygame.display.flip()
            self.clock.tick(60)

        pygame.quit()
        sys.exit()


def main():
    """Entry point for the game"""
    game = KaooaGame()
    game.run()


if __name__ == '__main__':
    main()
