import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomsCreateComponent } from './rooms-create.component';

describe('RoomsCreateComponent', () => {
  let component: RoomsCreateComponent;
  let fixture: ComponentFixture<RoomsCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoomsCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
