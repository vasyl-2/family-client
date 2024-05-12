import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullSizePhotoComponent } from './full-size-photo.component';

describe('FullSizePhotoComponent', () => {
  let component: FullSizePhotoComponent;
  let fixture: ComponentFixture<FullSizePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullSizePhotoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullSizePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
