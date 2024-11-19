import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RoutesModel } from '../../../../commons/components/blank/models/routes.model';
import { ProductModel } from '../../models/product.model';
import { CategoryModel } from '../../../categories/models/category.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../categories/services/category.service';
import { SwalService } from '../../../../commons/services/swal.service';
import { ToastrService } from 'ngx-toastr';
import { SharedModule } from '../../../../commons/modules/shared.module';
import { ProductService } from '../../services/product.service';
import { NgForm } from '@angular/forms';
import { RoutesService } from '../../../../commons/services/routes.service';

@Component({
  selector: 'app-product-update',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './product-update.component.html',
  styleUrl: './product-update.component.css'
})
export class ProductUpdateComponent implements OnInit {
  routes: RoutesModel[] = [];
  productId: string = "";
  product: ProductModel = new ProductModel();
  categories: CategoryModel[] = [];
  images:any;
  constructor(
    private _routes: RoutesService,
    private _activated: ActivatedRoute,
    private _category: CategoryService,
    private _product: ProductService,
    private _router: Router,
    private _swal: SwalService,
    private _toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this._activated.params.subscribe(res => {
      if(res["value"]){
      this.productId = res["value"]; 
      this.getById();     
      this.routes = [
        {
          name: "Ürünler",
          class: "",
          link: "/admin/products"
        },
        {
          name: "Ürün Güncelleme",
          class: "active",
          link: "/admin/products/update/" + this.productId
        }
      ]
      this.routes = this._routes.getRoutes(this.routes);
    }else{
      this._router.navigateByUrl("/");
    }
    });
  }  

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(){
    this._category.getAll(res=>{
      this.categories = res;
    });
  }

  getById(){
    this._product.getById(this.productId, res=>{
      this.product = res
    });
  }

  update(form: NgForm){
    if(form.valid){
      let product = form.value;
      let categories: string[] = product["categoriesSelect"];
      let price = product["price"];
      price = price.toString().replace(",",".");
      let formData = new FormData();
      formData.append("_id", this.product._id);
      formData.append("name", product["name"]);
      formData.append("price", price);
      formData.append("stock", product["stock"]);
      for (const category of categories) {
        formData.append("categories",category);
      }
      formData.append("description", product["description"]); 
      if(this.images != undefined)
        for (const image of this.images) {
          formData.append("images", image, image.name);
        }
      
      this._product.update(formData,res=>{
        this._toastr.info(res.message);
        this._router.navigateByUrl("/admin/products");
      });
    }
  }

  deleteImage(_id: string, index: number){
    this._swal.callSwal("Resmi silmek istiyor musunuz?","Sil",()=>{
        this._product.removeImageByProductIdAndIndex(_id, index, res=>{
          this._toastr.warning(res.message);
          this.getById();
        });
    })
  }

  getImages(event:any){    
    this.images = event.target.files;
  }

}