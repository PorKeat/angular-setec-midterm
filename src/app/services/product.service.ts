import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProductService {
  async fetchProducts(): Promise<any[]> {
    const res = await fetch('https://fakestoreapi.com/products');
    return res.json();
  }
}
