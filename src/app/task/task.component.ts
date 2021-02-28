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
  email: any;
  photo: any;
  last: any;
  name: any;

  phone: number=0;
  number: number = 0;
  n1:number = 0;
  user: any = {} as any;
  userService: UserService;
  users: any;
  updateButton: boolean= false;

  constructor(Userservice:UserService) {
    this.userService=Userservice;
  }

  form = new FormGroup({
    name:new FormControl('',[Validators.requiredTrue]),
    last:new FormControl('',[Validators.requiredTrue]),
    photo:new FormControl('',[Validators.requiredTrue]),
    phone:new FormControl('',[Validators.requiredTrue]),
    email: new FormControl('', [Validators.requiredTrue])
  });

  ngOnInit() {

    this.userService.getUser().subscribe(
      (data:any) => {
         this.users = data.category.docs
         console.log(this.users);
      },
      (error:any) => {
        console.log(error);
      }
    );

  }

submit(){
  this.name ='';
  this.last ='';
  this.photo ='';
  this.email = '';

  this.user.firstName = this.form.get('name')?.value;
  this.user.lastName = this.form.get('last')?.value;
  this.user.profileImg = this.form.get('photo')?.value;
  this.user.phone  = this.form.get('phone')?.value;
  this.user.email = this.form.get('email')?.value;

this.userService.createUser(this.user).subscribe(
  (data:any) => {
    console.log(this.user);
    this.ngOnInit();
  },
  (error:any) => {
    console.log(error);
  }
);



}

delete(user: any){


  this.userService.deleteUser(user._id).subscribe(
    (data:any) => {
      this.ngOnInit();
    },
    (error)=>{
      console.log("error in deletion"+error)

    }
  );

}

getUser(user:any){
  this.user.id = user._id;
  this.form.controls.name.setValue(user.firstName)
  this.form.controls.last.setValue(user.lastName)
  this.form.controls.phone .setValue(user.phone)
  this.form.controls.photo .setValue(user.photo)
  this.form.controls.email .setValue(user.email)
  this.updateButton=true;
}

update(user: any){
  this.user.firstName = this.form.get('name')?.value;
  this.user.lastName = this.form.get('last')?.value;
  this.user.email = this.form.get('email')?.value;
  this.user.phone  = this.form.get('phone')?.value;
  this.user.profileImg = this.form.get('photo')?.value;
  this.userService.updateUser(user.id, this.user.firstName, this.user.lastName,this.user.email, this.user.phone, this.user.profileImg,).subscribe(
    (data:any) => {
      this.ngOnInit();
    },
    (error)=>{
      console.log("error in updation",error )
    }
  );
}



}
