import { LowerCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from "../service/user.service";

import {FormsModule,FormControl,FormControlName,FormBuilder,FormGroup,Validators} from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  productId: any;
  productName: any;
  supportedCategory: any;
  product: any  = {} as any;
    userService: UserService;
  products: any;
   updateButton: boolean= false;
   categories: any;


  constructor(Userservice: UserService) {
    this.userService = Userservice;
  }

  form = new FormGroup({
    productId: new FormControl('',  [Validators.requiredTrue]),
    productName: new FormControl('', [Validators.requiredTrue]),
    supportedCategory: new FormControl('', [Validators.requiredTrue]),
  });
  ngOnInit() {
    this.userService.getproduct().subscribe(
      (data:any) => {
         this.products = data.product.docs
         console.log(this.products);
      },
      (error:any) => {
        console.log(error);
      }
    );

  }

submit() {
  this.productId = '';
  this.productName =  '';
  this.supportedCategory = '';
  this.product.productId = this.form.get('productId')?.value;
  this.product.productName = this.form.get('productName')?.value;
  this.product.supportedCategory = this.form.get('supportedCategory')?.value;
this.userService.createProduct(this.product).subscribe(
  (data:any) => {
    console.log(this.product);
    this.ngOnInit();
  },
  (error:any) => {
    console.log(error);
  }
);



}

delete (product: any) {
  this.userService.deleteproduct(product._id).subscribe(
    (data: any) => {
      this.ngOnInit();
    },
    (error) => {
      console.log('error in deletion' + error);

    }
  );

}

getUser (product:any){
  this.product.id = product._id;
  this.form.controls.productId.setValue(product.productId);
  this.form.controls.productName.setValue(product.productName);
  this.form.controls.supportedCategory.setValue(product.supportedCategory);
  this.updateButton=true;
}

update (product: any) {
  this.product.productId = this.form.get('productId')?.value;
  this.product.productName = this.form.get('productName')?.value;
  this.product.supportedCategory = this.form.get('supportedCategory')?.value;
  this.userService.updateProduct(product.id, this.product.productId, this.product.productName, this.product.supportedCategory).subscribe(
    (data:any) => {
      this.ngOnInit();
    },
    (error)=>{
      console.log("error in updation",error )
    }
  );
}
mixData: any  = {} as any;
catData : any;
  prodData: any;
  data: any;
getAllFieldData(product: any) {
  console.log("mixData----------------------------", this.mixData);
 // this.mixData.existingCategory = product.m;
  //this.mixData.e

  this.userService.getCateryAndProductInfoWithProudctId(product._id).subscribe(
    (data:any) => {
      console.log("data---------------------------------", data);
      console.log("existingProduct-------------------------------", data.mixData.existingProduct);
      console.log("existingCategory----------------------------------", data.mixData.existingCategory);
      // this.catData =  this.product.mixData.existingCategory
      // this.prodData =  this.product.mixData.existingProduct
      this.mixData.product = data.mixData.existingProduct[0]
      this.mixData.category = data.mixData.existingCategory[0]

      console.log("data------------------------", data);
       console.log(this.catData);
       console.log(this.prodData);

    },
    (error:any) => {
      console.log(error);
    }
  );

}



}
