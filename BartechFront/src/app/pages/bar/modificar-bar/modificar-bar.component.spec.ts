import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarBarComponent } from './modificar-bar.component';

describe('ModificarBarComponent', () => {
  let component: ModificarBarComponent;
  let fixture: ComponentFixture<ModificarBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModificarBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
