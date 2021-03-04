import { LowerCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from "../service/user.service";

import {FormsModule,FormControl,FormControlName,FormBuilder,FormGroup,Validators} from '@angular/forms';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  CategoryId: any;
  categoryName: any;
  category: any  = {} as any;
    userService: UserService;
   categories: any;
   updateButton: boolean= false;


  constructor(Userservice: UserService) {
    this.userService = Userservice;
  }

  form = new FormGroup({
    CategoryId: new FormControl('',  [Validators.requiredTrue]),
    categoryName: new FormControl('', [Validators.requiredTrue]),
  });

  ngOnInit() {

    this.userService.getCategory().subscribe(
      (data:any) => {
         this.categories = data.category.docs
         console.log(this.categories);
      },
      (error:any) => {
        console.log(error);
      }
    );

  }

submit() {
  this.CategoryId = '';
  this.categoryName =  '';

  this.category.CategoryId = this.form.get('CategoryId')?.value;
  this.category.categoryName = this.form.get('categoryName')?.value;
this.userService.createCategory(this.category).subscribe(
  (data:any) => {
    console.log(this.category);
    this.ngOnInit();
  },
  (error:any) => {
    console.log(error);
  }
);



}

delete (category: any) {
  this.userService.deleteCategory(category._id).subscribe(
    (data: any) => {
      this.ngOnInit();
    },
    (error) => {
      console.log('error in deletion' + error);

    }
  );

}

getUser (category:any){
  this.category.id = category._id;
  this.form.controls.CategoryId.setValue(category.CategoryId);
  this.form.controls.categoryName.setValue(category.categoryName);
  this.updateButton=true;
}

update (category: any) {
  this.category.CategoryId = this.form.get('CategoryId')?.value;
  this.category.categoryName = this.form.get('categoryName')?.value;

  this.userService.updateUser(category.id, this.category.CategoryId, this.category.categoryName).subscribe(
    (data:any) => {
      this.ngOnInit();
    },
    (error)=>{
      console.log("error in updation",error )
    }
  );
}



}
