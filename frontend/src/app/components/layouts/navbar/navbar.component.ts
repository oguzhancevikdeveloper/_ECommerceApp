import { Component, OnInit } from '@angular/core';
import { UserModel } from '../../users/models/user.model';
import { AuthService } from '../../auths/services/auth.service';
import { SwalService } from '../../../commons/services/swal.service';
import { CryptoService } from '../../../commons/services/crypto.service';
import { Router } from '@angular/router';
import { BasketService } from '../../baskets/services/basket.service';
import { SharedModule } from '../../../commons/modules/shared.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  user: UserModel = new UserModel();
constructor(
  public _auth: AuthService,
  private _swal: SwalService,
  private _crypto: CryptoService,
  private _router: Router,
  public _basket: BasketService
){
  let userString = localStorage.getItem("user");
  if(userString != null && userString != undefined)
    this.user = JSON.parse(this._crypto.decryption(userString))    
  else
    this._router.navigateByUrl("/login");
}

  ngOnInit(): void {
    this.getBasketCount();
  }

logout(){
  this._swal.callSwal("Çıkış yapmak istiyor musunuz?","Çıkış Yap",()=>{
    this._auth.logout();
  });
}

getBasketCount(){
  this._basket.getBasketCount(this.user._id);
}
}