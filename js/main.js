const logout = () => {
    window.localStorage.removeItem("user");
    window.location.href = "/html/login.html";
};
const checkLoginState = () => {
    const loginButton = $("#login_button");
    const logoutButton = $("#logout_button");
    console.log(window.localStorage.getItem("user"));
    window.localStorage.getItem("user")
        ? loginButton.hide()
        : (logoutButton.hide(), (window.location.href = "/html/login.html"));
};
function init() {
    console.log("init");
    checkLoginState();
    $("#logout_button").on("click", logout);
}

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
    $.notify("Item added to cart", "success");
    // Update cartMap count in header
    const cartCount = userCart.reduce(
        (acc, element) => acc + element.quantity,
        0
    );
    $("#cart_count").text(cartCount);
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

$(document).ready(init);
