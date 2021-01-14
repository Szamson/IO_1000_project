import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusikExchangeComponent } from './musik-exchange.component';

describe('MusikExchangeComponent', () => {
  let component: MusikExchangeComponent;
  let fixture: ComponentFixture<MusikExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MusikExchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MusikExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
