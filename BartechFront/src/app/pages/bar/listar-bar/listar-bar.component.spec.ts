import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarBarComponent } from './listar-bar.component';

describe('ListarBarComponent', () => {
  let component: ListarBarComponent;
  let fixture: ComponentFixture<ListarBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListarBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
