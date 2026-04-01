import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentoImpresionComponent } from './documento-impresion.component';

describe('DocumentoImpresionComponent', () => {
  let component: DocumentoImpresionComponent;
  let fixture: ComponentFixture<DocumentoImpresionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentoImpresionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoImpresionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
