const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';

// Function to fetch product data from API
async function fetchProductData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        return data.categories;
    } catch (error) {
        console.error('Error fetching product data:', error);
        return [];
    }
}

// Function to calculate discount percentage
function calculateDiscountPercentage(price, comparePrice) {
    if (comparePrice && comparePrice > price) {
        const discount = ((comparePrice - price) / comparePrice) * 100;
        return Math.round(discount) + '% off';
    }
    return '';
}

// Function to display products based on selected tab
async function showTab(tabName) {
    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = ''; // Clear previous products

    const categories = await fetchProductData();

    const selectedCategory = categories.find(category => category.category_name.toLowerCase() === tabName.toLowerCase());

    if (!selectedCategory) {
        console.error(`Category '${tabName}' not found.`);
        return;
    }

    selectedCategory.category_products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        const badgeText = product.badge_text;
        if (badgeText) {
            const badge = document.createElement('div');
            badge.classList.add('badge');
            badge.textContent = badgeText;
            card.appendChild(badge);
        }

        const image = document.createElement('img');
        image.src = product.image;
        image.alt = product.title; // Set alt text for accessibility
        card.appendChild(image);

        const title = document.createElement('div');
        title.classList.add('title');
        title.textContent = product.title;
        card.appendChild(title);

        const vendor = document.createElement('div');
        vendor.classList.add('vendor');
        vendor.textContent = `Vendor: ${product.vendor}`;
        card.appendChild(vendor);

        const price = document.createElement('div');
        price.classList.add('price');
        price.textContent = `Price: ${product.price}`;
        card.appendChild(price);

        const comparePrice = document.createElement('div');
        comparePrice.classList.add('compare-price');
        comparePrice.textContent = `Compare at price: ${product.compare_at_price}`;
        card.appendChild(comparePrice);

        const discount = document.createElement('div');
        discount.classList.add('discount');
        discount.textContent = calculateDiscountPercentage(parseInt(product.price), parseInt(product.compare_at_price));
        card.appendChild(discount);

        const addToCartBtn = document.createElement('button');
        addToCartBtn.classList.add('add-to-cart');
        addToCartBtn.textContent = 'Add to Cart';
        card.appendChild(addToCartBtn);

        productContainer.appendChild(card);
    });

    // Update active tab button
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.classList.remove('active');
        if (button.id === `tab-${tabName}`) {
            button.classList.add('active');
        }
    });
}

// Initialize with 'Men' tab
showTab('Men');
