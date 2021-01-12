import { Injectable } from '@angular/core';

import { OverlayModule, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay'
import { ComponentPortal } from '@angular/cdk/portal';
import { LicitationOverlayComponent } from './licitation-overlay/licitation-overlay.component';

interface OverlayConfigInt
{
  panelClass? : string;
  hasBackdrop? : boolean;
  backdropClass? : string;
};

const DEFAULT_CONFIG : OverlayConfigInt = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'def-panel-class'
}

export class DialogOverlayRef
{
  constructor(private overlayRef: OverlayRef){}

  close()
  {
    this.overlayRef.dispose();
  }
}

@Injectable({
  providedIn: 'root'
})
export class OverlaysService {

  constructor(private overlay : Overlay) { }

  open(config : OverlayConfigInt = {}) 
  {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };

    let overlayRef = this.createOverlay(dialogConfig);
    let licitationPortal = new ComponentPortal(LicitationOverlayComponent);
    overlayRef.attach(licitationPortal);
    return new DialogOverlayRef(overlayRef);
  }

  private createOverlay(config: OverlayConfigInt)
  {
    const overlayConfig = this.getOverlayConfig(config);
    return this.overlay.create(overlayConfig);
  }

  private getOverlayConfig(config: OverlayConfigInt)
  {
    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    });
  }

}
