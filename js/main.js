const logout = () => {
    window.localStorage.removeItem("user");
    window.location.href = "/html/login.html";
};
const checkLoginState = () => {
    const loginButton = $("#login_button");
    const logoutButton = $("#logout_button");

    window.localStorage.getItem("user")
        ? loginButton.hide()
        : (logoutButton.hide(), (window.location.href = "/html/login.html"));
};
function init() {
    checkLoginState();
    $("#logout_button").on("click", logout);
    updateCartQuantityHeader();
}

const updateCartQuantityHeader = () => {
    const cartCount = getUserCart().reduce(
        (acc, element) => Number(acc) + Number(element.quantity),
        0
    );
    $("#cart_count").text(cartCount);
};

const addToCart = async (productId, quantity) => {
    // Get existing cartMap object if any from localStorage
    let userCart = getUserCart();
    // Find if product already exists in userCart
    const existingProduct = userCart.find(
        (element) => element.productId == productId
    );
    if (existingProduct) {
        // If product already exists, increment quantity
        existingProduct.quantity =
            parseInt(existingProduct.quantity) + parseInt(quantity);
    } else {
        // If product does not exist, add product to userCart
        userCart.push({ productId, quantity });
    }
    // Update userCart in localStorage
    updateUserCart(userCart);
    // !Removing notification temporarily
    $.notify("Item added to cart", {
        position: "bottom right",
        className: "success",
    });
    // Update cartMap count in header
    updateCartQuantityHeader();
};

const getUser = () => {
    const user = window.localStorage.getItem("user");
    if (!user) {
        window.location.href = "/html/login.html";
        return;
    }
    return JSON.parse(user);
};

const getUserCart = () => {
    const userId = getUser().email;
    let cartMap = JSON.parse(localStorage.getItem("cartMap")) ?? {};
    let userCart = cartMap.hasOwnProperty(userId) ? cartMap[userId] : [];
    return userCart;
};

const updateUserCart = (cartItems) => {
    const userId = getUser().email;
    let cartMap = JSON.parse(localStorage.getItem("cartMap")) ?? {};
    cartMap[userId] = cartItems;
    localStorage.setItem("cartMap", JSON.stringify(cartMap));
};

const clearCartForCurrentUser = () => {
    const userId = getUser().email;
    let cartMap = JSON.parse(localStorage.getItem("cartMap")) ?? {};
    cartMap[userId] = [];
    localStorage.setItem("cartMap", JSON.stringify(cartMap));
};

$(document).ready(init);
