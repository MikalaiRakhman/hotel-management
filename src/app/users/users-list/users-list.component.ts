import { AfterViewChecked, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule} from '@angular/material/table'
import { User } from '../../models/user/user.type'
import { UserService } from '../../services/user-service/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog'
import { UsersEditComponent } from '../users-edit/users-edit.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../services/snackbar/snackbar.service';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';


@Component({
  selector: 'app-users-list',
  imports: [MatTableModule, MatButtonModule, MatPaginatorModule, MatSortModule],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit, AfterViewChecked {  
  userService = inject(UserService);
  snackbar = inject(SnackbarService);
  dialog = inject(MatDialog);

  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'phoneNumber', 'actions']
  dataSource = new MatTableDataSource<User>();
  pagedUsers = new MatTableDataSource<User>();
  totalUsers: number = 0;
  pageSize: number = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private _liveAnnouncer: any;

  ngAfterViewChecked(): void {
    this.pagedUsers.sort = this.sort;
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.dataSource.data = users;
      this.totalUsers = users.length;
      this.paginateUsers();
      this.dataSource.paginator = this.paginator;
      })
  }  

  onDeleteUser(userId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: {
        title: 'Confirm deletion',
        message: 'Are you sure you want to delete this user?',
      },
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.userService.deleteUser(userId).subscribe({
          next: () => {
            window.location.reload();
          },
          error: err => {
            console.error('Something went wrong. User not deleted', err);
            this.snackbar.showError(err);
          },
        });
      }
    });
  }

  paginateUsers(event?: PageEvent): void {
    const pageIndex = event ? event.pageIndex : 0;
    const pageSize = event ? event.pageSize : this.pageSize;
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;
    this.pagedUsers.data = this.dataSource.data.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent): void {
    this.paginateUsers(event);
  }

  announceSortChange(sortState: Sort) {    
      if (sortState.direction) {
        this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      } else {
        this._liveAnnouncer.announce('Sorting cleared');
      }
    }
}
