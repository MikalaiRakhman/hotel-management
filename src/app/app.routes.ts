import { Routes } from '@angular/router';
import { UsersListComponent } from './users/users-list/users-list.component';
import { HomeComponent } from './home/home.component';
import { RoomsListComponent } from './rooms/rooms-list/rooms-list.component';
import { BookingsListComponent } from './bookings/bookings-list/bookings-list.component';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent
    },
    {
        path:'users', 
        component: UsersListComponent
    },
    {
        path:'rooms',
        component: RoomsListComponent
    },
    {
        path:'bookings',
        component: BookingsListComponent
    }
];
