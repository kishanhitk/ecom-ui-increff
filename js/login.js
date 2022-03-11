const login = async (e) => {
    e.preventDefault();
    $("#error_text").text("");
    var username = $("#email_input").val();
    var password = $("#password_input").val();
    const resp = await fetch("/assets/users.json");
    const json = await resp.json();
    const user = json.find(
        (element) => element.email == username && element.password == password
    );
    if (!user || user.length == 0) {
        $("#error_text").text("Invalid username or password");
    } else {
        window.sessionStorage.setItem("user", JSON.stringify(user));
        window.location.href = "/index.html";
    }
    console.log(json);
    return false;
};

const checkLogin = () => {
    if (window.sessionStorage.getItem("user"))
        window.location.href = "/index.html";
};
function init() {
    $("#login_form").submit(login);
    checkLogin();
}

$(document).ready(init);
