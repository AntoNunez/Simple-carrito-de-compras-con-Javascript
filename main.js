/* fetch("https://api.escuelajs.co/api/v1/products")
  .then((res) => res.json())
  .then((data) => console.log(data)); */
//variables iniciales

let shoppingCartArray = [];
let total = 0;
let productContainer = document.querySelector(".shop-items");
let totalElement = document.querySelector(".cart-total-title");

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "b7b9bd5e3emsh0dcd55162816867p117879jsn98e5425806f2",
    "X-RapidAPI-Host": "books39.p.rapidapi.com",
  },
};

//Peticion de productos a la Api

let res = await fetch("https://books39.p.rapidapi.com/CZFA4F/books", options);
let data = await res.json();

//limitamos a 4 productos

let productsArray = data.slice(0, 4);
console.log(productsArray);

//Dibujar productos en pantalla

productsArray.forEach((product) => {
  productContainer.innerHTML += `
  <div class="shop-item" id="${product.id}">
          <span class="shop-item-title">${product.TITLE}</span>
          <img class="shop-item-image" src="./Images/libro.webp" />
          <p class="shop-item-author">${product.AUTHOR} </p>
          <div class="shop-item-details">
            <span class="shop-item-price">$${product.YEAR}</span>
            <button class="btn btn-primary shop-item-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>`;
});
//Escucho el evento click en un boton ADD

let addBtns = document.querySelectorAll(".shop-item-button");
addBtns = [...addBtns]; //transformo a un Arreglo

let cartContainer = document.querySelector(".cart-items");

addBtns.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    //AGREGAR PRODUCTOS AL CARRO

    //Buscar el Id del producto
    let actualId = parseInt(event.target.parentNode.parentNode.id);
    console.log(actualId);

    //Con el ID encontrar el objeto actual
    let actualProduct = productsArray.find((item) => item.id == actualId);

    if (actualProduct.quantity === undefined) {
      actualProduct.quantity = 1;
    }

    //consulta si el producto agregado ya existe
    let existe = false;

    shoppingCartArray.forEach((libro) => {
      if (actualId == libro.id) {
        existe = true;
      }
    });
    if (existe) {
      actualProduct.quantity++;
    } else {
      shoppingCartArray.push(actualProduct);
    }

    console.log(shoppingCartArray);

    //Dibujar en el Dom el arreglo de compras actualizado

    drawItems();

    //Actualiza el valor total

    getTotal();

    updateNumberOfItems();

    removeItems();
  });
});

function getTotal() {
  let sumTotal;
  let total = shoppingCartArray.reduce((sum, item) => {
    sumTotal = sum + item.quantity * item.YEAR;
    return sumTotal;
  }, 0);

  totalElement.innerText = `$${total}`;
}

function drawItems() {
  cartContainer.innerHTML = "";

  shoppingCartArray.forEach((item) => {
    cartContainer.innerHTML += `
    <div class="cart-row">
          <div class="cart-item cart-column">
            <img
              class="cart-item-image"
              src="./Images/libro.webp"
              width="100"
              height="100"
            />
            <span class="cart-item-title">${item.TITLE}</span>
          </div>
          <span class="cart-price cart-column">$${item.YEAR}</span>
          <div class="cart-quantity cart-column">
            <input
              class="cart-quantity-input"
              min="1"
              type="number"
              value="${item.quantity}"
            />
            <button class="btn btn-danger" type="button">REMOVE</button>
          </div>
        </div>`;
  });
  removeItems()
}

function updateNumberOfItems() {
  let inputNumber = document.querySelectorAll(".cart-quantity-input");
  inputNumber = [...inputNumber];

  inputNumber.forEach((item) => {
    item.addEventListener("click", (event) => {
      //conseguir el titulo del libro

      let actualBookTitle =
        event.target.parentElement.parentElement.childNodes[1].innerText;
      let actualBookQuantity = parseInt(event.target.value);

      //Busco elobjeto con ese titulo
      let actualBookObject = shoppingCartArray.find(
        (item) => item.TITLE == actualBookTitle
      );
      console.log(actualBookObject);
      //Actualizar el numero de quantity

      actualBookObject.quantity = actualBookQuantity;

      //Actualizar el precio total

      getTotal();
    });
  });
}

function removeItems() {
  let removeBtns = document.querySelectorAll(".btn-danger");
  removeBtns = [...removeBtns];
  removeBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      //conseguir el titulo del libro
      let actualBookTitle =
        event.target.parentElement.parentElement.childNodes[1].innerText;

      //Busco el objeto con ese titulo
      let actualBookObject = shoppingCartArray.find(
        (item) => item.TITLE == actualBookTitle
      );
      //Remover el arreglo de productos del carro
      shoppingCartArray = shoppingCartArray.filter(
        (item) => item != actualBookObject
      );
      console.log(shoppingCartArray)

      //Dibujar nuevamente en el Dom el arreglo de compras actualizado

      drawItems();

      //Actualiza el valor total

      getTotal();

      //Actualiza el 

      updateNumberOfItems();
    });
  });

}
