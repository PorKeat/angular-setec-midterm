import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface CartItem extends Product {
  qty: number;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected title = 'midterm';
  products: Product[] = [];
  cart: CartItem[] = [];
  isOpen = false;
  showCheckoutModal = false;

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    this.products = await this.productService.fetchProducts();
    this.loadCartFromLocalStorage();
  }

  get totalUSD(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  get totalKHR(): number {
    return Math.round(this.totalUSD * 4100);
  }

  get totalItems(): number {
    return this.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  addToCart(product: Product) {
    const existingItem = this.cart.find((item) => item.id === product.id);
    if (existingItem) {
      existingItem.qty++;
    } else {
      this.cart.push({ ...product, qty: 1 });
    }
    this.saveCartToLocalStorage();
  }

  changeQty(productId: number, delta: number) {
    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        this.remove(productId);
      } else {
        this.saveCartToLocalStorage();
      }
    }
  }

  remove(productId: number) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    this.saveCartToLocalStorage();
    if (this.cart.length === 0) {
      this.isOpen = false;
    }
  }

  toggleCart() {
    this.isOpen = !this.isOpen;
  }

  openCheckoutModal() {
    this.showCheckoutModal = true;
  }

  cancelCheckout() {
    this.showCheckoutModal = false;
  }

  confirmCheckout() {
    alert(
      `Order placed successfully for $${this.totalUSD.toFixed(2)} / ៛${this.totalKHR.toLocaleString()}`
    );
    this.cart = [];
    this.isOpen = false;
    this.showCheckoutModal = false;
    this.saveCartToLocalStorage();
  }

  private saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private loadCartFromLocalStorage() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cart = JSON.parse(storedCart);
    }
  }
}
