import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableServerSideComponent } from './table-server-side.component';

describe('TableServerSideComponent', () => {
  let component: TableServerSideComponent;
  let fixture: ComponentFixture<TableServerSideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableServerSideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableServerSideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
