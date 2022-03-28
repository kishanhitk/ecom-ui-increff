const getData = async () => {
    const resp = await fetch("./assets/db/inventory.json");
    const data = await resp.json();
    return data;
};

const displayData = async () => {
    const productGrid = $("#product_grid");
    productGrid.empty();
    const data = await getData();
    const filtered = applyFilter(data);
    const sorted = applySort(filtered);

    if (sorted.length == 0) {
        $("#product_not_found").removeClass("d-none");
    }
    sorted.forEach(async (element) => {
        const cartQuantity = await getCartQuantity(element.id);
        // TODO Try using clone method
        const product = $(`
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 p-4">
        <div class="p-1 item_card shadow rounded-lg text-center position-relative">
        <div>
        <a href="/html/product.html?id=${
            element.id
        }" class=" text-reset text-decoration-none">
        <div class="px-4">
          <img class="img-fluid p-3 card_image"  src="/assets/images/${
              element.imageUrl
          }"
            alt=${element.name}>
            ${
                cartQuantity > 0
                    ? `<div class="badge badge-success ribbon position-absolute ">${cartQuantity} in cart</div>`
                    : ""
            }
        </div>
        </a>
        <div>
        <hr>
        <div class="font-weight-bold">${element.name}</div>
        <h6>MRP: Rs.${element.mrp}</h6>  
        <button class="btn btn-primary mb-3" onclick='addToCart("${
            element.id
        }","${1}",true);displayData()'>Add to cart</button>
        </div>
      </div>
        </div>
        </div>
        `);
        productGrid.append(product);
    });
};

const applyFilter = (data) => {
    let selectedColors = [];
    let selectedStorages = [];
    $.each($("input[name='storage-input']:checked"), function () {
        selectedStorages.push($(this).val());
    });
    $.each($("input[name='color-input']:checked"), function () {
        selectedColors.push($(this).val());
    });
    const filtered = [];
    data.forEach((product) => {
        if (
            (selectedStorages.length === 0 ||
                selectedStorages.includes(product.storage)) &&
            (selectedColors.length === 0 ||
                selectedColors.includes(product.color))
        ) {
            filtered.push(product);
        }
    });

    return filtered;
};

const populateFilterCheckBoxes = async () => {
    const data = await getData();

    const storageFilter = $("#storage-input");

    const uniqueStorages = [...new Set(data.map((product) => product.storage))];

    storageFilter.empty();
    uniqueStorages.forEach((storage) => {
        const storageFilterGroup = $(`
        <div class="form-check">
        <input class="form-check-input"  type="checkbox" id="inlineCheckbox2" value="${storage}"
          name="storage-input">
        <label class="form-check-label" for="inlineCheckbox2">${storage}</label>
      </div>
        `);
        storageFilter.append(storageFilterGroup);
    });

    const colorFilter = $("#color-input");
    const uniqueColors = [...new Set(data.map((product) => product.color))];
    colorFilter.empty();
    uniqueColors.forEach((color) => {
        const colorFilterGroup = $(`
        <div class="form-check ">
        <input class="form-check-input"  type="checkbox" id="inlineCheckbox2" value="${color}"
          name="color-input">
        <label class="form-check-label" for="inlineCheckbox2">${color}</label>
      </div>
        `);
        colorFilter.append(colorFilterGroup);
    });
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
    populateFilterCheckBoxes();
    displayData();
    $("#apply-filter-btn").on("click", displayData);
    $("#sort_by").on("change", displayData);
}

$(document).ready(init);
