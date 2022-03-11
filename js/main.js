const logout = () => {
    window.sessionStorage.removeItem("user");
    window.location.href = "/html/login.html";
};
const checkLoginState = () => {
    const loginButton = $("#login_button");
    const logoutButton = $("#logout_button");
    console.log(window.sessionStorage.getItem("user"));
    window.sessionStorage.getItem("user")
        ? loginButton.hide()
        : (logoutButton.hide(), (window.location.href = "/html/login.html"));
};
function init() {
    console.log("init");
    checkLoginState();
    $("#logout_button").on("click", logout);
}

$(document).ready(init);
