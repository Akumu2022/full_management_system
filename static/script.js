document.addEventListener("DOMContentLoaded", () => {
    const addProductForm = document.getElementById("add-product-form");
    const getProductForm = document.getElementById("get-product-form");
    const productDetails = document.getElementById("product-details");
    const productListContainer = document.getElementById("product-list");

    // Handle the form submission for adding a new product
    addProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(addProductForm);
        const data = {
            name: formData.get("name"),
            descr: formData.get("descr"),
            quantity: parseInt(formData.get("quantity")),
            sku: formData.get("sku"),
            price: parseFloat(formData.get("price"))
        };

        try {
            const response = await fetch("/api/v1/add_product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            alert(result.Msg || "Product added successfully!");
            addProductForm.reset(); // Clear form after submission
            fetchAndDisplayProducts(); // Refresh product list
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product.");
        }
    });

    // Handle the form submission for getting a product by ID
    getProductForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const productId = document.getElementById("product-id").value;

        try {
            const response = await fetch(`/api/v1/products/${productId}`);

            if (response.status === 404) {
                productDetails.innerHTML = "<p>No product found with this ID.</p>";
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            productDetails.innerHTML = `
                <p><strong>Name:</strong> ${result.name}</p>
                <p><strong>SKU:</strong> ${result.sku}</p>
            `;
        } catch (error) {
            console.error("Error fetching product:", error);
            productDetails.innerHTML = "<p>Failed to retrieve product.</p>";
        }
    });

    // Function to fetch and display all products
    async function fetchAndDisplayProducts() {
        try {
            const response = await fetch("/api/v1/products");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const products = await response.json();
            if (products.length === 0) {
                productListContainer.innerHTML = "<p>No products available.</p>";
                return;
            }

            let productListHtml = "<ul>";
            products.forEach(product => {
                productListHtml += `
                    <li>
                        <strong>Name:</strong> ${product.name} <br>
                        <strong>SKU:</strong> ${product.sku} <br>
                        <strong>Price:</strong> $${product.price.toFixed(2)} <br>
                        <strong>Quantity:</strong> ${product.quantity} <br>
                    </li>
                `;
            });
            productListHtml += "</ul>";

            productListContainer.innerHTML = productListHtml;
        } catch (error) {
            console.error("Error fetching products:", error);
            productListContainer.innerHTML = "<p>Failed to retrieve products.</p>";
        }
    }

    fetchAndDisplayProducts(); // Fetch and display products on page load
});
