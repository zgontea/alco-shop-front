import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { User } from 'src/app/wrappers/user';
import { SnackBarNotificationUtil } from 'src/app/utils/snack-bar-notification-util';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface UserWrapper {
  position: number;
  data: User;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  public users: User[] = [];
  public value = '';
  columns = [
    {
      columnDef: 'position',
      header: 'No.',
      cell: (element: UserWrapper) => `${element.position}`,
    },
    {
      columnDef: 'name',
      header: 'Imię',
      cell: (element: UserWrapper) => `${element.data.name}`,
    },
    {
      columnDef: 'surname',
      header: 'Nazwisko',
      cell: (element: UserWrapper) => `${element.data.surname}`,
    },
    {
      columnDef: 'email',
      header: 'Email',
      cell: (element: UserWrapper) => `${element.data.email}`,
    },
    {
      columnDef: 'actions',
      header: '',
      cell: () => {},
    },
  ];
  dataSource: UserWrapper[] = [];
  displayedColumns = this.columns.map((c) => c.columnDef);

  constructor(
    private userService: UsersService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUsers();
  }
  
  getUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;

        for (let index = 0; index < data.length; index++) {
          const wrapper: UserWrapper = {
            position: index + 1,
            data: data[index],
          };
          console.log(wrapper);

          this.dataSource.push(wrapper);
        }
      },
      error: (error) => {
        console.log('Error loading users');
      },
      complete: () => {},
    });
  }



  onDelete(user: UserWrapper) {
    this.userService.delUsers(user.data).subscribe({
      next: (data) => {
        SnackBarNotificationUtil.showSnackBarSuccess(
          this.snackBar,
          'Użytkownik został usunięty pomyślnie',
          'Zamknij'
        )
          .afterDismissed()
          .subscribe(() => {
            window.location.reload();
          });
      },
      error: (error) => {
        SnackBarNotificationUtil.showSnackBarSuccess(
          this.snackBar,
          'Podczas usuwania wystapił problem',
          'Zamknij'
        );
      },
      complete: () => {},
    });
    console.log('Deleted product of id:', user.data.id);
  }
}
