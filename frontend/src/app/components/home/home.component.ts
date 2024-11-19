import { Component, OnInit } from '@angular/core';
import { RoutesModel } from '../../commons/components/blank/models/routes.model';
import { PaginationResponseModel } from '../../commons/models/pagination-response.model';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { TrCurrencyPipe } from 'tr-currency';
import { RequestModel } from '../../commons/models/request.model';
import { CategoryModel } from '../categories/models/category.model';
import { ProductModel } from '../products/models/product.model';
import { CategoryService } from '../categories/services/category.service';
import { ProductService } from '../products/services/product.service';
import { ToastrService } from 'ngx-toastr';
import { CryptoService } from '../../commons/services/crypto.service';
import { BasketService } from '../baskets/services/basket.service';
import { SharedModule } from '../../commons/modules/shared.module';
import { CategoryPipe } from '../categories/pipes/category.pipe';
import { UserModel } from '../users/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, CategoryPipe, TrCurrencyPipe, InfiniteScrollModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  routes: RoutesModel[] = [
    {
      name: "Ana Sayfa",
      link: "/",
      class: "active",
    },   
  ]
  categories: CategoryModel[] = [];
  search: string = "";
  selectedCategory: string = "Tümü";
  result: PaginationResponseModel<ProductModel[]> = new PaginationResponseModel<ProductModel[]>();
  request: RequestModel = new RequestModel(); 
  product: ProductModel = new ProductModel();
  quantity: number = 1;
  constructor(
    private _categories: CategoryService,
    private _product: ProductService,
    private _toastr: ToastrService,
    private _crytpo: CryptoService,
    private _basket: BasketService
  ){
    this.request.pageSize = 9;
  }

  ngOnInit(): void {
    this.getCategories();
    this.getProducts();
  }

  onScroll() {
    this.request.pageSize += 9;
    this.getProducts(this.request.categoryId);
  }

  getCategories(){
    this._categories.getAll(res=> {
      this.categories = res;      
    });
  }

  getProducts(categoryId: string = ""){
    this.request.categoryId = categoryId;
    this._product.getAllByHomePage(this.request, res=> this.result = res);  
  }

  changeCategory(_id: string = "", name: string = ""){
    this.selectedCategory = name;    
    this.request.pageSize = 9;
    this.getProducts(_id);
  }

  searchProducts(){
    this.request.pageNumber = 1;
    this.getProducts(this.request.categoryId);
    let index = this.categories.findIndex(p=> p._id == this.request.categoryId);
    this.selectedCategory = this.categories[index].name;
  }

  clear(){
    this.selectedCategory = "Tümü";
    this.request = new RequestModel();
    this.getProducts();
  }

  getProduct(product: ProductModel){
    this.product = {...product};
  }

  addBasket(){
    if(localStorage.getItem("user")){
      let userString = localStorage.getItem("user");
      let user: UserModel = JSON.parse(this._crytpo.decryption(userString));
      let model = {
        productId: this.product._id,
        quantity: this.quantity,
        userId: user._id,
        price: this.product.price
      }      

      this._basket.add(model, res=>{
        this._toastr.success(res.message);
        this.product.stock = this.product.stock - this.quantity;
        this.getProducts(this.request.categoryId);
      })
    }    
  }

  checkQuantity(){
    if(this.quantity < 1){
      this.quantity = 1
    }

    if(this.quantity > this.product.stock){
      this.quantity = this.product.stock
    }
  }

}
