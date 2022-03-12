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
const helloWord = () => {
    console.log("Hello World");
};
