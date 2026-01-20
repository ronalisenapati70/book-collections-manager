import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionNewComponent } from './collection-new.component';

describe('CollectionNewComponent', () => {
  let component: CollectionNewComponent;
  let fixture: ComponentFixture<CollectionNewComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CollectionNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CollectionNewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
