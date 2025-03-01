import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditChaptersComponent } from './edit-chapters.component';

describe('EditChaptersComponent', () => {
  let component: EditChaptersComponent;
  let fixture: ComponentFixture<EditChaptersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditChaptersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
