function sale() {
  fetch('/cart/get-cart-info')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
}