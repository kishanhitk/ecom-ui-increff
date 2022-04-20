const login = async (e) => {
    e.preventDefault();
    $("#error_text").text("");
    var username = $("#email_input").val();
    var password = $("#password_input").val();
    const resp = await fetch("/assets/db/users.json");
    const json = await resp.json();
    const user = json.find(
        (element) => element.email == username && element.password == password
    );
    if (!user || user.length == 0) {
        $("#error_text").text("Invalid username or password");
    } else {
        window.localStorage.setItem("user", user.email);
        window.location.href = "/index.html";
    }

    return false;
};

const checkLogin = async () => {
    // TODO Check valid user
    const userFromLocalStoage = window.localStorage.getItem("user");
    let user;
    if (userFromLocalStoage) {
        const resp = await fetch("/assets/db/users.json");
        const json = await resp.json();
        user = json.find((element) => element.email == userFromLocalStoage);

        if (!user || user.length == 0) {
            window.localStorage.removeItem("user");
        } else {
            window.location.href = "/index.html";
        }
    }
};
function init() {
    $("#login_form").submit(login);
    checkLogin();
}

$(document).ready(init);
