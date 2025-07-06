import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MemoryGameUtils } from './utils';

export const MEMORY_GAME_ROWS = 4;
export const MEMORY_GAME_COLUMNS = 3;
export const MEMORY_GAME_TOTAL_CARDS = MEMORY_GAME_ROWS * MEMORY_GAME_COLUMNS;

export type MemoryGameCard = {
  id: number;
  value: number;
  isFaceUp: boolean;
  isMatchedWithAnotherCard: boolean;
};

export const CARD_FLIP_DELAY_MS = 1000;

export const MAX_CARDS_FLIPPED = 2;

@Injectable({
  providedIn: 'root',
})
export class MemoryGameService {
  readonly cards$ = new BehaviorSubject<MemoryGameCard[]>([]);

  readonly cardsFlipped$ = new BehaviorSubject<MemoryGameCard[]>([]);

  setCards(cards: MemoryGameCard[]): void {
    this.cards$.next(cards);
  }

  getCards$(): Observable<MemoryGameCard[]> {
    return this.cards$;
  }

  initializeGame(): void {
    const cards = this.createShuffledCards();
    this.setCards(cards);
    this.resetFlippedCards();
  }

  private createShuffledCards(): MemoryGameCard[] {
    const allNumbers: number[] = Array.from(
      { length: MEMORY_GAME_TOTAL_CARDS / 2 },
      (_, index) => index + 1
    );

    const duplicatedNumbers = [...allNumbers, ...allNumbers];

    console.log('duplicatedNumbers', duplicatedNumbers);

    const ShuffledNumbers: number[] =
      MemoryGameUtils.shuffleArrayOfNumbers(duplicatedNumbers);

    return ShuffledNumbers.map((number, index) => ({
      id: index,
      value: number,
      isFaceUp: false,
      isMatchedWithAnotherCard: false,
    }));
  }

  flipCard(card: MemoryGameCard): void {
    if (this.isCardAlreadyFlipped(card) || this.isMaxCardsFlipped()) {
      return;
    }

    this.flipCardFaceUp(card);
    this.addCardToFlippedCards(card);

    if (this.isMaxCardsFlipped()) {
      this.processTwoCardsFlipped();
    }
  }

  private isCardAlreadyFlipped(card: MemoryGameCard): boolean {
    const currentCard = this.findCardById(card.id);

    return currentCard?.isFaceUp || false;
  }

  private isMaxCardsFlipped(): boolean {
    return this.cardsFlipped$.getValue().length === MAX_CARDS_FLIPPED;
  }

  private flipCardFaceUp(card: MemoryGameCard): void {
    const cards = this.cards$.getValue();
    const cardIndex = this.findCardIndexById(card.id);
    if (cardIndex !== -1) {
      cards[cardIndex].isFaceUp = true;
      this.setCards(cards);
    }
  }

  private addCardToFlippedCards(card: MemoryGameCard): void {
    const currentFlippedCards = this.cardsFlipped$.getValue();
    this.cardsFlipped$.next([...currentFlippedCards, card]);
  }

  private processTwoCardsFlipped(): void {
    const [firstCard, secondCard] = this.cardsFlipped$.getValue();
    if (this.areCardsMatched(firstCard, secondCard)) {
      this.markCardsAsMatched(firstCard, secondCard);
    } else {
      this.scheduleCardsToFlipBack(firstCard, secondCard);
    }

    this.resetFlippedCards();
  }

  private markCardsAsMatched(
    firstCard: MemoryGameCard,
    secondCard: MemoryGameCard
  ): void {
    const currentCards = this.cards$.getValue();
    const firstCardIndex = this.findCardIndexById(firstCard.id);
    const secondCardIndex = this.findCardIndexById(secondCard.id);
    if (firstCardIndex !== -1 && secondCardIndex !== -1) {
      currentCards[firstCardIndex].isMatchedWithAnotherCard = true;
      currentCards[secondCardIndex].isMatchedWithAnotherCard = true;
      this.setCards(currentCards);
    }
  }

  private setFlippedCardsToFaceDown(
    firstCard: MemoryGameCard,
    secondCard: MemoryGameCard
  ): void {
    const currentCards = this.cards$.getValue();

    if (firstCard.isFaceUp && secondCard.isFaceUp) {
      const firstCardIndex = this.findCardIndexById(firstCard.id);
      const secondCardIndex = this.findCardIndexById(secondCard.id);

      currentCards[firstCardIndex].isFaceUp = false;
      currentCards[secondCardIndex].isFaceUp = false;

      this.setCards(currentCards);
    }
  }

  private resetFlippedCards(): void {
    this.cardsFlipped$.next([]);
  }

  private findCardById(id: number): MemoryGameCard | undefined {
    const cards = this.cards$.getValue();
    return cards.find((c) => c.id === id);
  }

  private findCardIndexById(id: number): number {
    const cards = this.cards$.getValue();
    return cards.findIndex((c) => c.id === id);
  }

  private areCardsMatched(
    firstCard: MemoryGameCard,
    secondCard: MemoryGameCard
  ): boolean {
    return firstCard.value === secondCard.value;
  }

  private scheduleCardsToFlipBack(
    firstCard: MemoryGameCard,
    secondCard: MemoryGameCard
  ): void {
    setTimeout(() => {
      this.setFlippedCardsToFaceDown(firstCard, secondCard);
    }, CARD_FLIP_DELAY_MS);
  }
}
