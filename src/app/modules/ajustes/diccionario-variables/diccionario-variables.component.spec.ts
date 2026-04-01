import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiccionarioVariablesComponent } from './diccionario-variables.component';

describe('DiccionarioVariablesComponent', () => {
  let component: DiccionarioVariablesComponent;
  let fixture: ComponentFixture<DiccionarioVariablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiccionarioVariablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiccionarioVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
