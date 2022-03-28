const logout = () => {
    window.localStorage.removeItem("user");
    window.location.href = "/html/login.html";
};
const checkLoginState = async () => {
    const userFromLocalStoage = getUser();
    let user;
    if (userFromLocalStoage) {
        const resp = await fetch("/assets/db/users.json");
        const json = await resp.json();
        user = json.find((element) => element.email == userFromLocalStoage);

        if (!user || user.length == 0) {
            window.localStorage.removeItem("user");
            window.location.href = "/html/login.html";
        } else {
            $("#username_display").text(user.name);
        }
    }
    return user;
    // TODO Check if user is valid
};
function init() {
    checkLoginState();
    showLiveDateTime();
    $("#logout_button").on("click", logout);
    updateCartQuantityHeader();
}

const updateCartQuantityHeader = () => {
    const cartCount = getUserCart().reduce(
        (acc, element) => Number(acc) + Number(element.quantity),
        0
    );
    $("*#cart_count").each(function () {
        $(this).text(cartCount);
    });
};

const addToCart = async (productId, quantity, merge = false) => {
    // Get existing cartMap object if any from localStorage
    let userCart = getUserCart();
    // Find if product already exists in userCart
    const existingProduct = userCart.find(
        (element) => element.productId == productId
    );
    if (existingProduct) {
        // If product already exists, increment quantity
        if (merge) {
            existingProduct.quantity =
                parseInt(existingProduct.quantity) + parseInt(quantity);
        } else {
            existingProduct.quantity = parseInt(quantity);
        }
    } else {
        // If product does not exist, add product to userCart
        userCart.push({ productId, quantity });
    }
    // Update userCart in localStorage
    updateUserCart(userCart);
    $.notify("Item added to cart", {
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
    return user;
};

const getUserCart = () => {
    const userId = checkLoginState();
    if (!userId) return;
    // TODO try catch JSON.parse
    let cartMap = JSON.parse(localStorage.getItem("cartMap")) ?? {};
    let userCart = cartMap.hasOwnProperty(userId) ? cartMap[userId] : [];
    return userCart;
};

const updateUserCart = (cartItems) => {
    const userId = checkLoginState();
    if (!userId) return;

    let cartMap = JSON.parse(localStorage.getItem("cartMap")) ?? {};
    cartMap[userId] = cartItems;
    localStorage.setItem("cartMap", JSON.stringify(cartMap));
};

// TODO Can be used on cart page
const clearCartForCurrentUser = () => {
    const userId = checkLoginState();
    if (!userId) return;
    let cartMap = JSON.parse(localStorage.getItem("cartMap")) ?? {};
    cartMap[userId] = [];
    localStorage.setItem("cartMap", JSON.stringify(cartMap));
};

const showLiveDateTime = () => {
    const date = new Date();
    const dateTime = $("#date_time");
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    const strTime = hours + ":" + minutes + ":" + seconds + " " + ampm;
    dateTime.text(`${day}/${month}/${year} ${strTime}`);
    setTimeout(showLiveDateTime, 1000);
};

const getCartQuantity = (productId) => {
    const userCart = getUserCart();
    const cartItem = userCart.find((element) => element.productId == productId);
    return cartItem ? cartItem.quantity : 0;
};

function readFileData(file, callback) {
    // TODO Add validatiopn
    var config = {
        header: true,
        error: function (err, file, inputElem, reason) {
            $.notify(reason, "error");
        },
        skipEmptyLines: "greedy",
        complete: function (results) {
            callback(results);
        },
    };
    Papa.parse(file, config);
}
// TODO: add fallback for images
$(document).ready(init);
