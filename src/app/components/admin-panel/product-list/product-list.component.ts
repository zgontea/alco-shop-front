import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from 'src/app/services/products/products.service';
import { SnackBarNotificationUtil } from 'src/app/utils/snack-bar-notification-util';
import { Product } from 'src/app/wrappers/product';
import { AddProductComponent } from '../add-product/add-product.component';

export interface ProductWrapper {
  position: number;
  data: Product;
}

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  columns = [
    {
      columnDef: 'position',
      header: 'No.',
      cell: (element: ProductWrapper) => `${element.position}`,
    },
    {
      columnDef: 'name',
      header: 'Nazwa',
      cell: (element: ProductWrapper) => `${element.data.name}`,
    },
    {
      columnDef: 'description',
      header: 'Opis',
      cell: (element: ProductWrapper) => `${element.data.description}`,
    },
    {
      columnDef: 'unitPrice',
      header: 'Cena',
      cell: (element: ProductWrapper) => `${element.data.unitPrice}`,
    },
    {
      columnDef: 'size',
      header: 'Pojemnosć',
      cell: (element: ProductWrapper) => `${element.data.size}`,
    },
    {
      columnDef: 'concentration',
      header: 'Zawartość alkoholu',
      cell: (element: ProductWrapper) => `${element.data.concentration}`,
    },
    {
      columnDef: 'actions',
      header: '',
      cell: () => {},
    },
  ];

  dataSource: ProductWrapper[] = [];
  displayedColumns = this.columns.map((c) => c.columnDef);

  constructor(
    private productsService: ProductsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts() {
    this.productsService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log(data.length);

        for (let index = 0; index < data.length; index++) {
          const wrapper: ProductWrapper = {
            position: index + 1,
            data: data[index],
          };
          console.log(wrapper);

          this.dataSource.push(wrapper);
        }
      },
      error: (error) => {
        console.log('Error loading products');
      },
      complete: () => {},
    });
  }

  openDialog() {
    this.dialog.open(AddProductComponent);
  }

  onDelete(product: ProductWrapper) {
    this.productsService.delProducts(product.data).subscribe({
      next: (data) => {
        SnackBarNotificationUtil.showSnackBarSuccess(
          this.snackBar,
          'Produkt został usunięty pomyślnie',
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
    console.log('Deleted product of id:', product.data.id);
  }
}