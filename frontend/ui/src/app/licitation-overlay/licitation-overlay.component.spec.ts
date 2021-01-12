import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicitationOverlayComponent } from './licitation-overlay.component';

describe('LicitationOverlayComponent', () => {
  let component: LicitationOverlayComponent;
  let fixture: ComponentFixture<LicitationOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicitationOverlayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicitationOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
