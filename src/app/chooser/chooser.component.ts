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
  private animationStartTime: number | null = null;
  private animationFrameId: number | null = null;
  private baseRadius: number = 70;
  private isAnimating: boolean = false;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.setupCanvas();

    // Handle window resize
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.drawTouches();
    });

    canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
    canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
    canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private setupCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    const devicePixelRatio = window.devicePixelRatio || 1;

    // Obtenir les dimensions d'affichage
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;

    // Définir les dimensions CSS du canvas
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    // Définir les dimensions physiques du canvas en tenant compte du devicePixelRatio
    canvas.width = displayWidth * devicePixelRatio;
    canvas.height = displayHeight * devicePixelRatio;

    // Ajuster l'échelle du contexte pour compenser le devicePixelRatio
    this.ctx.scale(devicePixelRatio, devicePixelRatio);

    this.clearCanvas();
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
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
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

  private getCurrentRadius(): number {
    if (!this.isAnimating) {
      return this.baseRadius;
    }

    // Animation continue - oscillation constante
    const time = Date.now() / 1000; // Temps en secondes
    const scale = 1 - 0.2 * Math.sin(time * 4); // Oscillation rapide
    return this.baseRadius * scale;
  }

  private drawTouches(): void {
    // Clear canvas
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    const currentRadius = this.getCurrentRadius();

    // Draw all touches
    Object.entries(this.touches).forEach(([id, touch]) => {
      this.ctx.beginPath();
      this.ctx.arc(touch.x, touch.y, currentRadius, 0, Math.PI * 2);
      // Utiliser la couleur rouge si c'est le cercle sélectionné, sinon blanc
      this.ctx.fillStyle = this.selectedTouchId === id ? 'red' : 'white';
      this.ctx.fill();
    });
  }

  private startContinuousAnimation(): void {
    this.isAnimating = true;
    this.animateFrame();
  }

  private stopAnimation(): void {
    this.isAnimating = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private animateFrame(): void {
    if (!this.isAnimating) return;

    this.drawTouches();
    this.animationFrameId = requestAnimationFrame(() => this.animateFrame());
  }

  private resetSelectionTimer(): void {
    // Annuler le timer précédent s'il existe
    if (this.selectionTimer) {
      clearTimeout(this.selectionTimer);
    }

    // Arrêter l'animation précédente
    this.stopAnimation();

    // Réinitialiser la sélection
    this.selectedTouchId = null;
    this.drawTouches();

    // Démarrer un nouveau timer si il y a des cercles
    const touchIds = Object.keys(this.touches);
    if (touchIds.length > 0) {
      this.selectionTimer = setTimeout(() => {
        // Après 5 secondes, commencer l'animation continue
        this.startContinuousAnimation();

        // Attendre encore 3 secondes avant de faire la sélection
        setTimeout(() => {
          this.selectRandomCircle();
          this.stopAnimation();
        }, 3000);
      }, 5000); // 5 secondes d'attente
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

    // Nettoyer l'animation
    this.stopAnimation();
  }
}
