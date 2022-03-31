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
    } else {
        $("#product_not_found").addClass("d-none");
    }
    sorted.forEach(async (element) => {
        const cartQuantity = await getCartQuantity(element.id);
        // TODO Try using clone method
        const product = $(`
        <div class="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 p-3">
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
    const filterFromSessionStorage = sessionStorage.getItem("filter");
    const filter = JSON.parse(filterFromSessionStorage);

    let selectedColors = filter?.colors ?? [];
    let selectedStorages = filter?.storages ?? [];

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

    const appliedFilterText = `<div class="">
    <h5>Showing  ${filtered.length} results for:</h5>
    <div class="d-flex flex-wrap">
    ${
        selectedColors.length > 0
            ? `<div class="p-2">
            <h6>Colors:</h6>
            <div class="d-flex flex-wrap">
            ${selectedColors
                .map(
                    (color) =>
                        `<div class="p-1 m-1 badge badge-primary">${color}</div>`
                )
                .join("")}    
            </div>
            </div>`
            : ""
    }
    ${
        selectedStorages.length > 0
            ? `<div class="p-2">
            <h6>Storage:</h6>
            <div class="d-flex flex-wrap">
            ${selectedStorages
                .map(
                    (storage) =>
                        `<div class="p-1 m-1 badge badge-primary">${storage}</div>`
                )
                .join("")}
            </div>
            </div>`
            : ""
    }
    </div>
    </div>`;
    if (selectedColors.length > 0 || selectedStorages.length > 0) {
        $("#applied-filter").html(appliedFilterText);
        $("#clear_filter_btn").removeClass("d-none");
    } else {
        $("#applied-filter").empty();
        $("#clear_filter_btn").addClass("d-none");
    }
    return filtered;
};

const populateFilterCheckBoxes = async () => {
    const data = await getData();

    const filterFromSessionStorage = sessionStorage.getItem("filter");
    const filter = JSON.parse(filterFromSessionStorage);

    const selectedColorsFromStorage = filter?.colors ?? [];
    const selectedStoragesFromStorage = filter?.storages ?? [];

    const storageFilter = $("#storage-input");
    const storageFilterAside = $("#storage-input-aside");

    const uniqueStorages = [...new Set(data.map((product) => product.storage))];

    storageFilter.empty();
    storageFilterAside.empty();
    uniqueStorages.forEach((storage) => {
        const storageFilterGroup = $(`
        <div class="form-check">
        <input class="form-check-input" ${
            selectedStoragesFromStorage.includes(storage) && "checked"
        } type="checkbox" id="inlineCheckbox2" value="${storage}"
          name="storage-input">
        <label class="form-check-label" for="inlineCheckbox2">${storage}</label>
      </div>
        `);
        storageFilter.append(storageFilterGroup);
        storageFilterAside.append(storageFilterGroup.clone());
    });

    const colorFilter = $("#color-input");
    const colorFilterAside = $("#color-input-aside");
    const uniqueColors = [...new Set(data.map((product) => product.color))];
    colorFilter.empty();
    colorFilterAside.empty();
    uniqueColors.forEach((color) => {
        const colorFilterGroup = $(`
        <div class="form-check ">
        <input class="form-check-input" 
        ${selectedColorsFromStorage.includes(color) && "checked"}
        type="checkbox" id="inlineCheckbox2" value="${color}"
          name="color-input">
        <label class="form-check-label" for="inlineCheckbox2">${color}</label>
      </div>
        `);
        colorFilter.append(colorFilterGroup);
        colorFilterAside.append(colorFilterGroup.clone());
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

function updateFilterInSessionStorage() {
    let selectedColorsFromInput = [];
    let selectedStoragesFromInput = [];
    const storageFilter = $("#storage-input");
    const storageFilterAside = $("#storage-input-aside");
    const colorFilter = $("#color-input");
    const colorFilterAside = $("#color-input-aside");
    if (this.id == "storage-input-aside") {
        storageFilter.empty();
    }
    if (this.id == "color-input-aside") {
        colorFilter.empty();
    }
    if (this.id == "storage-input") {
        storageFilterAside.empty();
    }
    if (this.id == "color-input") {
        colorFilterAside.empty();
    }

    $.each($("input[name='storage-input']:checked"), function () {
        selectedStoragesFromInput.push($(this).val());
    });
    $.each($("input[name='color-input']:checked"), function () {
        selectedColorsFromInput.push($(this).val());
    });

    console.log(selectedStoragesFromInput);
    const uniqueSelectedStoragesFromInput = [
        ...new Set(selectedStoragesFromInput),
    ];
    const uniqueSelectedColorsFromInput = [...new Set(selectedColorsFromInput)];
    const newFilter = {
        colors: uniqueSelectedColorsFromInput,
        storages: uniqueSelectedStoragesFromInput,
    };
    sessionStorage.setItem("filter", JSON.stringify(newFilter));
}

const clearFilters = () => {
    sessionStorage.removeItem("filter");
    $("#applied-filter").empty();
    $("#clear_filter_btn").addClass("d-none");
    populateFilterCheckBoxes();
    displayData();
};

function handleFilterChange() {
    updateFilterInSessionStorage.call(this);
    populateFilterCheckBoxes();
    displayData();
}

function init() {
    populateFilterCheckBoxes();
    displayData();
    $("#apply-filter-btn").on("click", displayData);
    $("#sort_by").on("change", displayData);
    $("#storage-input").on("change", handleFilterChange);
    $("#color-input").on("change", handleFilterChange);
    $("#storage-input-aside").change(handleFilterChange);
    $("#color-input-aside").on("change", handleFilterChange);
}

$(document).ready(init);
