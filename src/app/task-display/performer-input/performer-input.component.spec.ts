import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformerInputComponent } from './performer-input.component';

describe('PerformerInputComponent', () => {
  let component: PerformerInputComponent;
  let fixture: ComponentFixture<PerformerInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformerInputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerformerInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
