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

   createCategory(category: any){
    return this.http.post(`${this.apiUrl}/category/create`, category);
   }
   createProduct(product: any){
    return this.http.post(`${this.apiUrl}/product/create`, product);
   }

   getCategory(){
    return this.http.get(`${this.apiUrl}/category/search`);
   }
   getproduct(){
    return this.http.get(`${this.apiUrl}/product/search`);
   }

   deleteCategory(id: any) {
    return this.http.delete(`${this.apiUrl}/category/deleteJob_details/` + id);
  }
  deleteproduct(id: any) {
    return this.http.delete(`${this.apiUrl}/product/deleteProduct/` + id);
  }

  updateUser(id: string, CategoryId: any, categoryName: any) {
    let requestData = {
      id: id,
      CategoryId: CategoryId,
      categoryName: categoryName,
    }
    return this.http.put(`${this.apiUrl}/category/updateCategory/` + id, requestData);
  }
  updateProduct(id: string, productId: any, productName: any, supportedCategory: any) {
    let requestData = {
      id: id,
      productId: productId,
      productName: productName,
      supportedCategory: supportedCategory
    }
    return this.http.put(`${this.apiUrl}/product/updateProduct/` + id, requestData);
  }
  getCateryAndProductInfoWithProudctId(id: any) {
    return this.http.get(`${this.apiUrl}/category/categoryWithProductId/` + id);
  }


}
