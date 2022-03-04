const displayCartItems = async () => {
    const cartItemsList = $("#cart_items");
    cartItemsList.empty();
    const cartItems = window.sessionStorage.getItem("cart");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        const resp = await fetch("./assets/inventory.json");
        const json = await resp.json();
        cartItemsArray.forEach((item) => {
            const product = json.find(
                (element) => element.id == item.productId
            );
            const itemElement = `
            <div class="card my-3">
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                    <img src="https://picsum.photos/200/100?random=1" />
                    <div>

                        <h5 class="card-title">${product.name}</h5>
                        <h6>${product.brandId}</h6>
                    </div>
                    <p>${item.quantity}</p>
                    <button class="btn" onClick='deleteItemFromCart("${product.id}")'>
                        <i class="material-icons">delete</i>
                    </button>
                </div>
            </div>
        </div>
            `;
            cartItemsList.append(itemElement);
        });
    }
};

const deleteItemFromCart = (productId) => {
    const cartItems = window.sessionStorage.getItem("cart");
    if (cartItems) {
        const cartItemsArray = JSON.parse(cartItems);
        const newCartItems = cartItemsArray.filter(
            (item) => item.productId != productId
        );
        window.sessionStorage.setItem("cart", JSON.stringify(newCartItems));
    }
    displayCartItems();
};

const logout = () => {
    window.sessionStorage.removeItem("user");
    window.location.href = "./login.html";
};
const checkLoginState = () => {
    const loginButton = $("#login_button");
    const logoutButton = $("#logout_button");
    console.log(window.sessionStorage.getItem("user"));
    window.sessionStorage.getItem("user")
        ? loginButton.hide()
        : logoutButton.hide();
};
function init() {
    checkLoginState();
    displayCartItems();
    $("#logout_button").on("click", logout);
}

$(document).ready(init);
