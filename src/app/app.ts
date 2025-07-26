import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product.service';
import { CartService } from './services/cart.service';

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

  constructor(private productService: ProductService) {}

  async ngOnInit() {
    this.products = await this.productService.fetchProducts();
  }

  get totalUSD(): number {
    return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  get totalKHR(): number {
    return Math.round(this.totalUSD * 4100); // Conversion rate example
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
    // Removed auto-open: this.isOpen = true;
  }

  changeQty(productId: number, delta: number) {
    const item = this.cart.find((item) => item.id === productId);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        this.remove(productId);
      }
    }
  }

  remove(productId: number) {
    this.cart = this.cart.filter((item) => item.id !== productId);
    if (this.cart.length === 0) {
      this.isOpen = false;
    }
  }

  toggleCart() {
    this.isOpen = !this.isOpen;
  }
  showCheckoutModal = false;

  openCheckoutModal() {
    this.showCheckoutModal = true;
  }

  cancelCheckout() {
    this.showCheckoutModal = false;
  }

  confirmCheckout() {
    alert(
      `Order placed successfully for $${this.totalUSD.toFixed(
        2
      )} / ៛${this.totalKHR.toLocaleString()}`
    );
    this.cart = [];
    this.isOpen = false;
    this.showCheckoutModal = false;
  }
}
