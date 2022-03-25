function updateFileName() {
    var $file = $("#csv_file");
    var fileName = $file.val().split("\\").pop();
    $("#csv_fileName").html(fileName);
}

const readFileCallback = (result) => {
    const data = result.data;
    let isError = false;
    // Validate Data
    data.forEach((item) => {
        const { brand, price, productId, productName, quantity, total } = item;
        // Check if all fields are valid and price , quantity and total are numbers
        if (
            (!brand && brand.length == 0) ||
            (!price && price.length == 0) ||
            (!productId && productId.length == 0) ||
            (!productName && productName.length == 0) ||
            (!quantity && quantity.length == 0) ||
            (!total && total.length == 0) ||
            !Number(price) ||
            !Number(quantity) ||
            !Number(total)
        ) {
            isError = true;
            $.notify("Invalid CSV file. Please check the content", {
                className: "error",
            });
        }
    });

    if (!isError) {
        populateTable(data);
    }
};

const populateTable = (data) => {
    const $table = $("#order_details_table");
    const $tbody = $table.find("tbody");
    $tbody.empty();
    let billTotal = 0;
    data.forEach((item) => {
        const tr = `
        <tr>
        <th scope="row">${item.productName}</th>
        <td>Rs.${item.price}</td>
        <td>${item.quantity}</td>
        <td>Rs. ${item.total}</td>
    </tr>
        `;
        $tbody.append(tr);
        billTotal += item.price * item.quantity;
    });
    $table.find("tfoot").empty();
    const billTotalElement = `
        <tr>
            
            <td></td>
            <td></td>
            <td></td>
            <td>
            <strong>
            Rs. ${billTotal}
            </strong>
            </td>
        </tr>
        `;
    $table.find("tfoot").append(billTotalElement);
    $table.show();
};

const displayTableFromCSV = () => {
    const $file = $("#csv_file");
    const file = $file[0].files[0];
    readFileData(file, readFileCallback);
};

function init() {
    $("#order_details_table").hide();
    $("#csv_file").on("change", () => {
        updateFileName();
        displayTableFromCSV();
    });
}

$(document).ready(init);
