import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerMessegesComponent } from './logger-messeges.component';

describe('LoggerMessegesComponent', () => {
  let component: LoggerMessegesComponent;
  let fixture: ComponentFixture<LoggerMessegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoggerMessegesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggerMessegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
