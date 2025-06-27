document.addEventListener("DOMContentLoaded", function () {
  const body = document.body;
  const cartButton = document.querySelector(".cart-button");
  const closeButton = document.querySelector(".close-button");
  const curtain = document.getElementById("sidebar-cart-curtain");

  // Mở/đóng giỏ hàng
  function toggleCart() {
    body.classList.toggle("show-sidebar-cart");
  }

  cartButton.addEventListener("click", function (e) {
    e.preventDefault();
    toggleCart();
  });

  closeButton.addEventListener("click", function (e) {
    e.preventDefault();
    toggleCart();
  });

  curtain.addEventListener("click", function () {
    toggleCart();
  });

  // Tăng/giảm số lượng
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("plus-button") || e.target.classList.contains("minus-button")) {
      const input = e.target.closest(".qty").querySelector("input");
      let value = parseInt(input.value);
      const min = parseInt(input.min) || 1;
      const max = parseInt(input.max) || 1000;

      if (e.target.classList.contains("plus-button")) {
        if (value < max) value++;
      } else {
        if (value > min) value--;
      }

      input.value = value;
    }
  });
});
