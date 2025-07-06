import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';

type TouchPoint = {
  x: number;
  y: number;
  color: string;
};

@Component({
  selector: 'app-chooser',
  standalone: true,
  imports: [],
  templateUrl: './chooser.component.html',
  styleUrl: './chooser.component.scss',
})
export default class ChooserComponent implements OnDestroy {
  @ViewChild('touchCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private touches: { [id: string]: TouchPoint } = {};
  private selectedTouchId: string | null = null;
  private selectionTimer: any = null;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    this.clearCanvas();

    // Handle window resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.drawTouches();
    });

    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    for (let t of Array.from(e.touches)) {
      const x = t.clientX - rect.left;
      const y = t.clientY - rect.top;

      this.touches[t.identifier] = {
        x: x,
        y: y,
        color: 'white',
      };
    }
    this.drawTouches();
    this.resetSelectionTimer();
  }

  private clearCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    for (let t of Array.from(e.touches)) {
      if (this.touches[t.identifier]) {
        this.touches[t.identifier].x = t.clientX - rect.left;
        this.touches[t.identifier].y = t.clientY - rect.top;
      }
    }
    this.drawTouches();
  }

  private handleTouchEnd(e: TouchEvent): void {
    for (let t of Array.from(e.changedTouches)) {
      // Si le cercle sélectionné est retiré, on réinitialise la sélection
      if (this.selectedTouchId === t.identifier.toString()) {
        this.selectedTouchId = null;
      }
      delete this.touches[t.identifier];
    }
    this.drawTouches();
    this.resetSelectionTimer();
  }

  private drawTouches(): void {
    const canvas = this.canvasRef.nativeElement;
    // Clear canvas
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw all touches
    Object.entries(this.touches).forEach(([id, touch]) => {
      this.ctx.beginPath();
      this.ctx.arc(touch.x, touch.y, 50, 0, Math.PI * 2);
      // Utiliser la couleur rouge si c'est le cercle sélectionné, sinon blanc
      this.ctx.fillStyle = this.selectedTouchId === id ? 'red' : 'white';
      this.ctx.fill();
    });
  }

  private resetSelectionTimer(): void {
    // Annuler le timer précédent s'il existe
    if (this.selectionTimer) {
      clearTimeout(this.selectionTimer);
    }

    // Réinitialiser la sélection
    this.selectedTouchId = null;
    this.drawTouches();

    // Démarrer un nouveau timer si il y a des cercles
    const touchIds = Object.keys(this.touches);
    if (touchIds.length > 0) {
      this.selectionTimer = setTimeout(() => {
        this.selectRandomCircle();
      }, 5000); // 5 secondes
    }
  }

  private selectRandomCircle(): void {
    const touchIds = Object.keys(this.touches);

    if (touchIds.length === 0) {
      this.selectedTouchId = null;
      return;
    }

    // Sélectionner un cercle au hasard
    const randomIndex = Math.floor(Math.random() * touchIds.length);
    this.selectedTouchId = touchIds[randomIndex];

    // Redessiner le canvas
    this.drawTouches();
  }

  ngOnDestroy(): void {
    // Nettoyer le timer lors de la destruction du composant
    if (this.selectionTimer) {
      clearTimeout(this.selectionTimer);
    }
  }
}
