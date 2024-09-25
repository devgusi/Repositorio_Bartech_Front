import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarBarComponent } from './registrar-bar.component';

describe('RegistrarBarComponent', () => {
  let component: RegistrarBarComponent;
  let fixture: ComponentFixture<RegistrarBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
