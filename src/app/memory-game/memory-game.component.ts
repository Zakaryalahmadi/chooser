import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  MEMORY_GAME_COLUMNS,
  MEMORY_GAME_ROWS,
  MemoryGameCard,
  MemoryGameService,
} from './memory-game.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.scss',
})
export default class MemoryGameComponent implements OnInit {
  private readonly memoryGameService: MemoryGameService =
    inject(MemoryGameService);

  readonly MEMORY_GAME_COLUMNS = MEMORY_GAME_COLUMNS;

  readonly cards$ = this.memoryGameService.getCards$();

  ngOnInit(): void {
    this.memoryGameService.initializeGame();
  }

  flipCard(card: MemoryGameCard): void {
    this.memoryGameService.flipCard(card);
  }
}
