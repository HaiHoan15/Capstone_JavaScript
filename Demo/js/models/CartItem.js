// sản phẩm trong giỏ hàng 
export class CartItem {
  constructor(id, name, price, img, quantity = 1) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.img = img;
    this.quantity = quantity;
  }
}
