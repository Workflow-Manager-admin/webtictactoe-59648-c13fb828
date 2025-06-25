import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// PUBLIC_INTERFACE
@Component({
  selector: 'app-root',
  styleUrls: ['./app.component.css'],
  templateUrl: './app.component.html',
  // Standalone component: add CommonModule import for Angular directives (ngFor, ngClass, etc.)
  standalone: true,
  imports: [CommonModule],
})
export class AppComponent {
  /** 3x3 board flattened 0..8; cells are '', 'X', or 'O' */
  board: string[] = Array(9).fill('');
  
  /** Current player ('X' or 'O') */
  currentPlayer: 'X' | 'O' = 'X';
  
  /** Track ongoing game state */
  isGameOver = false;
  statusMessage = '';
  
  /** Scoreboard */
  scores: { X: number; O: number; draw: number } = { X: 0, O: 0, draw: 0 };
  
  /** Track winner or who's turn */
  winner: '' | 'X' | 'O' = '';
  
  /** Reset the board and game state for a new round */
  // PUBLIC_INTERFACE
  resetBoard(): void {
    this.board = Array(9).fill('');
    this.currentPlayer = this.getNextStartPlayer();
    this.isGameOver = false;
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
    this.winner = '';
  }

  /** Reset the entire game, including scores */
  // PUBLIC_INTERFACE
  resetGame(): void {
    this.scores = { X: 0, O: 0, draw: 0 };
    this.currentPlayer = 'X';
    this.resetBoard();
  }

  /** Called when a square is clicked */
  // PUBLIC_INTERFACE
  handleClick(idx: number): void {
    if (this.board[idx] || this.isGameOver) {
      return; // Cell not empty or game finished
    }
    this.board[idx] = this.currentPlayer;
    if (this.checkWin(this.currentPlayer)) {
      this.scores[this.currentPlayer]++;
      this.statusMessage = `Player ${this.currentPlayer} wins!`;
      this.isGameOver = true;
      this.winner = this.currentPlayer;
      return;
    }
    if (this.isDraw()) {
      this.scores.draw++;
      this.statusMessage = `It's a draw!`;
      this.isGameOver = true;
      this.winner = '';
      return;
    }
    // Change turn
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
  }

  /** Check for a win */
  private checkWin(player: string): boolean {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    return lines.some(([a, b, c]) =>
      this.board[a] === player && this.board[b] === player && this.board[c] === player
    );
  }

  /** Check if the game is a draw */
  private isDraw(): boolean {
    return this.board.every(cell => cell) && !this.checkWin('X') && !this.checkWin('O');
  }

  /** To alternate starter each game (optional for UX) */
  private getNextStartPlayer(): 'X' | 'O' {
    // Always alternate after an entire reset; for per-round, keep same (could randomize if desired)
    return this.currentPlayer;
  }

  constructor() {
    this.statusMessage = `Player ${this.currentPlayer}'s turn`;
  }
}
