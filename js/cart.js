const displayCartItems = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
        window.location.href = "/html/login.html";
        return;
    }
    const userId = JSON.parse(user).email;
    let cartMap = JSON.parse(localStorage.getItem("cartMap")) ?? {};
    let cartItems = cartMap.hasOwnProperty(userId) ? cartMap[userId] : [];
    const cartItemsList = $("#cart_items");
    cartItemsList.empty();
    if (cartItems) {
        const cartItemsArray = cartItems;
        const resp = await fetch("/assets/inventory.json");
        const json = await resp.json();
        cartItemsArray.forEach((item) => {
            const product = json.find(
                (element) => element.id === item.productId
            );
            const itemElement = `
            <div class="card my-3">
            <div class="card-header bg-transparent border-bottom-0">
            <button class="btn close"
                        onClick='deleteItemFromCart("${product.id}")'>
                        <i class="material-icons">delete</i>
                    </button>
          </div>
            <div class="card-body mt-n5">
                <div class="row">
                    <img class="col-auto" src="${product.imageUrl}" />
                    <div class="col">
                        <h5 class="card-title">${product.name}</h5>
                        <h6 class="text-secondary">By ${product.brandId}</h6>
                        <h6 class="card-title">Rate: Rs. ${product.mrp}</h6>
                    </div>
                    <div class="col input-group col w-auto justify-content-end align-items-center">
                        <button ${
                            item.quantity <= 1 && "disabled"
                        } class="btn btn-light mx-3"
                            onclick='decrementQuantity("${
                                product.id
                            }")'>-</button>
                        <p class="my-auto">${item.quantity}</p>
                        <button class="btn btn-light mx-3"
                            onclick='incrementQuantity("${
                                product.id
                            }")'>+</button>
                    </div>
                </div>
            </div>
        </div>
            `;
            cartItemsList.append(itemElement);
        });
    }
};
const decrementQuantity = (productId) => {
    const cartItems = window.localStorage.getItem("cart");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        const item = cartItemsArray.find(
            (element) => element.productId == productId
        );
        if (item) {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cartItemsArray.splice(cartItemsArray.indexOf(item), 1);
            }
            window.localStorage.setItem("cart", JSON.stringify(cartItemsArray));
        }
    }
    displayCartItems();
};

const incrementQuantity = (productId) => {
    const cartItems = window.localStorage.getItem("cart");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        const item = cartItemsArray.find(
            (element) => element.productId == productId
        );
        if (item) {
            item.quantity++;
            window.localStorage.setItem("cart", JSON.stringify(cartItemsArray));
        }
    }
    displayCartItems();
};

const deleteItemFromCart = (productId) => {
    const cartItems = window.localStorage.getItem("cart");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        const newCartItems = cartItemsArray.filter(
            (item) => item.productId != productId
        );
        window.localStorage.setItem("cart", JSON.stringify(newCartItems));
    }
    displayCartItems();
};

function init() {
    displayCartItems();
}

$(document).ready(init);
