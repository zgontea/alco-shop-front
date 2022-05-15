import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from 'src/app/services/products/products.service';
import { ShoppingCart } from 'src/app/utils/shopping-cart';
import { SnackBarNotificationUtil } from 'src/app/utils/snack-bar-notification-util';
import { Product } from 'src/app/wrappers/product';
import { ProductWrapper } from '../admin-panel/product-list/product-list.component';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {

  products: Product[] = [];
  columns: any;
  displayedColumns = [];

  dataSource: ProductWrapper[] = [];
  totalCost: number = 0;

  constructor(
    private productsService: ProductsService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {   
    this.products = ShoppingCart.products;
    
    for (let index = 0; index < this.products.length; index++) {
      const wrapper: ProductWrapper = {
        position: index + 1,
        data: this.products[index],
      };
      console.log(wrapper);
      this.dataSource.push(wrapper);
    }

    console.log(this.products.length);
    

    if(this.products.length > 0) {
      this.totalCost = this.getTotalCost();
    }
    
    this.columns = [
      {
        columnDef: 'position',
        header: 'No.',
        footer: 'Total',
        cell: (element: ProductWrapper) => `${element.position}`,
      },
      {
        columnDef: 'name',
        header: 'Nazwa',
        footer: '',
        cell: (element: ProductWrapper) => `${element.data.name}`,
      },
      {
        columnDef: 'description',
        header: 'Opis',
        footer: '',
        cell: (element: ProductWrapper) => `${element.data.description}`,
      },
      {
        columnDef: 'size',
        header: 'Pojemnosć',
        footer: '',
        cell: (element: ProductWrapper) => `${element.data.size}`,
      },
      {
        columnDef: 'concentration',
        header: 'Zawartość alkoholu',
        footer: '',
        cell: (element: ProductWrapper) => `${element.data.concentration}`,
      },
      {
        columnDef: 'unitPrice',
        header: 'Cena',
        footer: this.totalCost,
        cell: (element: ProductWrapper) => `${element.data.unitPrice}`,
      },
      {
        columnDef: 'actions',
        header: '',
        footer: '',
        cell: () => {},
      },
    ];
    
    this.displayedColumns = this.columns.map((c: { columnDef: any; }) => c.columnDef);

  }

  onDelete(id: ProductWrapper) {    
    ShoppingCart.removeItem(id.position - 1);
    SnackBarNotificationUtil.showSnackBarSuccess(
      this.snackBar,
      'Produkt usunięto pomyślnie',
      'Zamknij'
    );
  }

  getTotalCost(): number {
    return this.products.map(t => t.unitPrice).reduce((acc, value) => acc + value, 0);
  }

}
