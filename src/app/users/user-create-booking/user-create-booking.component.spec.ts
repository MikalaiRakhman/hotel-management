import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreateBookingComponent } from './user-create-booking.component';

describe('UserCreateBookingComponent', () => {
  let component: UserCreateBookingComponent;
  let fixture: ComponentFixture<UserCreateBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCreateBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCreateBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
