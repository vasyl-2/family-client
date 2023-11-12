import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeChaptersComponent } from './tree-chapters.component';

describe('TreeChaptersComponent', () => {
  let component: TreeChaptersComponent;
  let fixture: ComponentFixture<TreeChaptersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeChaptersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
