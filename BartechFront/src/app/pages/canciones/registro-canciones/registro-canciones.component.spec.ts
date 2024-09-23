import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCancionesComponent } from './registro-canciones.component';

describe('RegistroCancionesComponent', () => {
  let component: RegistroCancionesComponent;
  let fixture: ComponentFixture<RegistroCancionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistroCancionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCancionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
