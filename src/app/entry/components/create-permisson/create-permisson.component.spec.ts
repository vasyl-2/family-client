import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePermissonComponent } from './create-permisson.component';

describe('CreatePermissonComponent', () => {
  let component: CreatePermissonComponent;
  let fixture: ComponentFixture<CreatePermissonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePermissonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePermissonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
