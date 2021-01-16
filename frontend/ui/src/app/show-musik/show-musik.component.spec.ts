import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowMusikComponent } from './show-musik.component';

describe('ShowMusikComponent', () => {
  let component: ShowMusikComponent;
  let fixture: ComponentFixture<ShowMusikComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowMusikComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowMusikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
