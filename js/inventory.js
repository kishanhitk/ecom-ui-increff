const getData = async () => {
    const productGrid = $("#product_grid");
    const resp = await fetch("./assets/inventory.json");
    const data = await resp.json();
    const filtered = applyFilter(data);
    const sorted = applySort(filtered);
    productGrid.empty();

    sorted.forEach((element) => {
        const cartQuantity = getCartQuantity(element.id);
        const product = $(`
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 p-4">
        <div class="item_card shadow rounded-lg text-center position-relative">
        <div >
        <a href="/html/product.html?id=${
            element.id
        }" class=" text-reset text-decoration-none">
        <div class="mx-auto p-4">
          <img class="img-fluid p-3" src=${element.imageUrl}
            alt=${element.name}>
            ${
                cartQuantity > 0
                    ? `<div class="badge badge-success ribbon position-absolute">Already in cart</div>`
                    : ""
            }
        </div>
        </a>
        <div>
        <h4>${element.name}</h4>
        <h6>MRP: Rs.${element.mrp}</h6>
          <button class="btn btn-primary mb-3" onclick='addToCart("${
              element.id
          }","${1}")'>Add to cart</button>
        </div>
      </div>
        </div>
        </div>
        `);
        productGrid.append(product);
    });
};

const applyFilter = (data) => {
    let selectedStorages = [];
    $.each($("input[name='storage-input']:checked"), function () {
        selectedStorages.push($(this).val());
    });
    const filtered = [];
    data.forEach((product) => {
        if (
            selectedStorages.length === 0 ||
            selectedStorages.includes(product.storage)
        ) {
            filtered.push(product);
        }
    });
    return filtered;
};

const applySort = (data) => {
    const sortBy = $("#sort_by").val();
    const sorted = data.sort((a, b) => {
        switch (sortBy) {
            case "price_low_high":
                return a.mrp - b.mrp;
            case "price_high_low":
                return b.mrp - a.mrp;
            case "name_a_z":
                return a.name.localeCompare(b.name);
            default:
                return a.name.localeCompare(b.name);
        }
    });
    return sorted;
};
function init() {
    getData();
    $("#apply-filter-btn").on("click", getData);
    $("#sort_by").on("change", getData);
}

$(document).ready(init);
