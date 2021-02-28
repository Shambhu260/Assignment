import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {
http:HttpClient;
  apiUrl: string = 'http://localhost:3000/api/v1';
  constructor(https:HttpClient) {
    this.http= https;
   }

   createUser(user: any){
    return this.http.post(`${this.apiUrl}/user/create`, user);
   }

   getUser(){
    return this.http.get(`${this.apiUrl}/user/search`);
   }

   deleteUser(id: any) {
    return this.http.delete(`${this.apiUrl}/user/deleteJob_details/` + id);
  }

   updateUser(id: string, firstName: any, lastName: any, email: any, phone:any, profileImg:any) {
    let requestData = {
      id: id,
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone:phone,
      profileImg:profileImg
    }
    return this.http.put(`${this.apiUrl}/user/updateUser/` + id, requestData);
  }


}
