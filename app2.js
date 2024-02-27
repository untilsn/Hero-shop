const productList = document.querySelector(".product .list");
const modalOpen = document.querySelector(".icon");
const modal = document.querySelector(".modal");
const modalList = document.querySelector(".table-body");
const quantity = document.querySelector(".number-item");
const search = document.querySelector(".search-product");
const categories = document.querySelector(".container #select");
const checkoutBtn = document.querySelector(".checkout-btn");
const navigationBtn = document.querySelector(".navigation-btn");
const navigationClose = document.querySelector(".navigation-close i");
const menuSidebar = document.querySelector(".navigation");
const overlay = document.querySelector(".overlay");

const STORE_API = "https://fakestoreapi.com/products";

let producItemData = [];
let cart = [];

async function fetchProduct(category = "all") {
  try {
    let response;
    if (category === "all") {
      response = await fetch(STORE_API);
    } else if (category === "asc" || category === "desc") {
      response = await fetch(`${STORE_API}?sort=${category}`);
    } else {
      response = await fetch(`${STORE_API}/category/${category}`);
    }
    const data = await response.json();
    console.log(data);
    producItemData = data;
    renderProduct(producItemData);
  } catch (error) {
    console.log(error);
  }
}
fetchProduct();

async function fetchCatgoriesData() {
  try {
    const res = await fetch(`${STORE_API}/categories`);
    const category = await res.json();
    const newCategory = ["all", "asc", "desc", ...category];
    renderCategories(newCategory);
  } catch (error) {
    console.log(error);
  }
}
fetchCatgoriesData();

categories.addEventListener("change", () => {
  const dropdowVal = categories.value;
  fetchProduct(dropdowVal);
});

function renderCategories(item) {
  if (!item) return;
  item.map((category) => {
    const template = `<option value="${category}">${category}</option>`;
    categories.insertAdjacentHTML("beforeend", template);
  });
}
renderCategories();

function renderProduct(product) {
  if (!product) return;
  productList.innerHTML = "";
  product.forEach((item, index) => {
    const { category, title, price, description, id, image, rating } = item;
    const template = `<li class="item">
    <div class="img">
      <img src="${image}" alt="" />
    </div>
    <div class="content">
      <h1 class="name">${title}</h1>
      <div class="info">
        <p class="price">${price}$</p>
        <div class="category">${category}</div>
      </div>

      <p class="desc">
        ${description}
      </p>
      <div class="rating">
        <div class="count">
          <span>${rating?.count}</span>
          <i class="fa-solid fa-user"></i>
        </div>
        <div class="rate">
          <span>${rating?.rate}</span>
          <i class="fa-solid fa-star"></i>
        </div>
      </div>
    </div>
    <div onClick="handleAdd(${index})" class="btn">
      <button class="add">Add to cart</button>
    </div>
  </li>`;
    productList.insertAdjacentHTML("beforeend", template);
  });
}

function calcMoney() {
  const total = cart.reduce((acc, item) => {
    return acc + item.price * item.quantity;
  }, 0);
  return total.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
checkoutBtn.addEventListener("click", handleCheckout);
function handleCheckout() {
  cart = [];
  renderCartItem();
  modal.classList.remove("active");
  quantity.textContent = cart.length;
}
function renderCartItem() {
  modalList.innerHTML = "";
  const money = document.querySelector(".total-price ");
  console.log(money);
  cart.forEach((item, index) => {
    const content = `
    <tr class="table-item">
                <td class="table-body_item"><img src=${item.image} alt="" /></td>
                <td class="table-body_item">${item.title}</td>
                <td class="table-body_item">${item.price}</td>
                <td class="table-body_item">
                  <span class="increase" onClick="handleIncrease(${index})" ><i class="fa-solid fa-plus"></i></span>
                  <span>${item.quantity}</span>
                  <span class="decrease" onClick="handleDecrease(${index})"><i class="fa-solid fa-minus"></i></span>
                </td>
              </tr>
        `;
    modalList.insertAdjacentHTML("beforeend", content);
  });
  const total = calcMoney();
  if (cart.length > 0) {
    money.textContent = `total: ${total}`;
  } else {
    money.textContent = "0$";
  }
}

search.addEventListener("input", handleSearch);
function handleSearch(e) {
  let searchQuery = e.target.value;
  console.log(searchQuery);
  const searchProduct = producItemData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  renderProduct(searchProduct);
}

function handleAdd(itemIndex) {
  const cartItem = producItemData[itemIndex];
  const existProduct = cart.find((item) => item.id === cartItem.id);
  if (existProduct) {
    existProduct.quantity += 1;
  } else {
    cartItem.quantity = 1;
    cart.push(cartItem);
  }
  quantity.textContent = cart.length;
  renderCartItem();
}
function handleIncrease(increase) {
  cart = cart.map((item, index) =>
    index === increase
      ? {
          ...item,
          quantity: item.quantity + 1,
        }
      : item
  );
  renderCartItem();
}
function handleDecrease(decrease) {
  const productItem = cart[decrease];
  if (productItem.quantity === 1) {
    cart = cart.filter((item) => item.id !== productItem.id);
  } else {
    cart = cart.map((item, index) =>
      index === decrease
        ? {
            ...item,
            quantity: item.quantity - 1,
          }
        : item
    );
  }
  quantity.textContent = cart.length;
  renderCartItem();
}

// ======================================

modalOpen.addEventListener("click", () => {
  modal.classList.add("active");
});

document.addEventListener("click", (e) => {
  if (e.target.matches(".overlay") || e.target.matches(".close")) {
    modal.classList.remove("active");
  }
});

navigationBtn.addEventListener("click", () => {
  menuSidebar.classList.add("active");
  overlay.style.display = "block";
});
navigationClose.addEventListener("click", () => {
  menuSidebar.classList.remove("active");
  overlay.style.display = "none";
});
document.addEventListener("click", (e) => {
  if (e.target === overlay || e.target.matches(".navigation-close i")) {
    menuSidebar.classList.remove("active");
    overlay.style.display = "none";
  }
});

// tabs change //

const tabsBtn = document.querySelectorAll(".item-tab");
const cardChange = document.querySelectorAll(".card-tab");

tabsBtn.forEach((item, index) => {
  item.addEventListener("click", () => {
    tabsBtn.forEach((item) => item.classList.remove("active"));
    item.classList.add("active");

    cardChange.forEach((content) => {
      content.classList.remove("active");
    });
    cardChange[index].classList.add("active");
  });
});

// accordion //

const openBtn = document.querySelectorAll(".accordion h2");
const contentAccordion = document.querySelectorAll(".content");

openBtn.forEach((item) => {
  item.addEventListener("click", (e) => {
    item.classList.toggle("active");

    const content = e.target.nextElementSibling;
    content.classList.toggle("active");
    content.style.height = content.scrollHeight + "px";

    if (!content.classList.contains("active")) {
      content.style.height = "0px";
    }
  });
});

// const toTop = document.querySelector(".scroll-top i");

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (
    document.body.scrollTop > 920 ||
    document.documentElement.scrollTop > 920
  ) {
    document.querySelector(".scroll-top i").style.display = "block";
  } else {
    document.querySelector(".scroll-top i").style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
