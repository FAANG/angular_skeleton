import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameDetailComponent } from './name-detail.component';

describe('NameDetailComponent', () => {
  let component: NameDetailComponent;
  let fixture: ComponentFixture<NameDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
