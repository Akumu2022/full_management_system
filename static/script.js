// script.js

document.getElementById("addProductForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const productData = {
        name: event.target.name.value,
        descr: event.target.descr.value,
        quantity: event.target.quantity.value,
        sku: event.target.sku.value,
        price: event.target.price.value,
    };

    const response = await fetch("/api/v1/add_product", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    });

    if (response.ok) {
        alert("New product added successfully!");
        event.target.reset();
    } else {
        alert("Error adding product.");
    }
});

document.getElementById("updateProductForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const productId = event.target.product_id.value;
    const productData = {
        name: event.target.name.value,
        descr: event.target.descr.value,
        quantity: event.target.quantity.value,
        sku: event.target.sku.value,
        price: event.target.price.value,
    };

    const response = await fetch(`/api/v1/update_product/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
    });

    if (response.ok) {
        alert("Product updated successfully!");
        event.target.reset();
    } else {
        alert("Error updating product.");
    }
});

document.getElementById("deleteProductForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const productId = event.target.product_id.value;
    console.log("Deleting product with ID:", productId);

    try {
        const response = await fetch(`/api/v1/delete_product/${productId}`, {
            method: "DELETE",
        });

        if (response.ok) {
            alert("Product deleted successfully!");
            event.target.reset();
        } else {
            const errorData = await response.json();
            console.error("Error deleting product:", errorData);
            alert(`Error deleting product: ${errorData.detail}`);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error. Please check the console for details.");
    }
});

document.getElementById("showProductsBtn").addEventListener("click", async function() {
    const response = await fetch("/api/v1/show_all_products");

    if (response.ok) {
        const products = await response.json();
        const productsContainer = document.getElementById("productsContainer");
        productsContainer.innerHTML = "";
        products.forEach(product => {
            const productItem = document.createElement("li");
            productItem.textContent = `ID: ${product.id}, Name: ${product.name}, SKU: ${product.sku}, Price: ${product.price}`;
            productsContainer.appendChild(productItem);
        });
    } else {
        alert("Error fetching products.");
    }
});
