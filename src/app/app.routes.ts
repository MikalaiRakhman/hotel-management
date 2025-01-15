import { Routes } from '@angular/router';
import { UsersListComponent } from './users/users-list/users-list.component';
import { HomeComponent } from './home/home.component';
import { RoomsListComponent } from './rooms/rooms-list/rooms-list.component';
import { BookingsListComponent } from './bookings/bookings-list/bookings-list.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent
    },
    {
        path:'users', 
        component: UsersListComponent,
        canActivate: [authGuard],
    },
    {
        path:'rooms',
        component: RoomsListComponent
    },
    {
        path:'bookings',
        component: BookingsListComponent
    },
    {
        path:'register',
        component: RegisterComponent
    },
    {
        path:'login',
        component: LoginComponent
    },
    {
        path:'error',
        component: ErrorPageComponent
    },
    {
        path:'**',
        component: ErrorPageComponent

    }
];