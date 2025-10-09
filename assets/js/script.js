const categoryMapping = {
            'HEALTH & BEAUTY': ['beauty', 'fragrances', 'skin-care'],
            'GROCERIES': ['groceries'],
            'HOME DECORATION': ['home-decoration', 'furniture', 'kitchen-accessories'],
            'ELECTRONICS': ['smartphones', 'mobile-accessories', 'laptops', 'tablets'],
            'CLOTHING': ['tops', 'mens-shoes', 'womens-shoes', 'womens-dresses', 'sports-accessories'],
            'ACCESSORIES': ['mens-watches', 'sunglasses', 'womens-bags', 'womens-watches', 'womens-jewellery'],
            'VEHICLES': ['vehicle', 'motorcycle']
        };

        const categoryDisplayNames = {
            'beauty': 'Beauty',
            'fragrances': 'Fragrances',
            'skin-care': 'Skin Care',
            'groceries': 'Groceries',
            'home-decoration': 'Home Decoration',
            'furniture': 'Furniture',
            'kitchen-accessories': 'Kitchen Accessories',
            'smartphones': 'Smartphones',
            'mobile-accessories': 'Mobile Accessories',
            'laptops': 'Laptops',
            'tablets': 'Tablets',
            'tops': 'Tops',
            'mens-shoes': 'Mens Shoes',
            'womens-shoes': 'Womens Shoes',
            'womens-dresses': 'Womens Dresses',
            'sports-accessories': 'Sports Accessories',
            'mens-watches': 'Mens Watches',
            'sunglasses': 'Sunglasses',
            'womens-bags': 'Womens Bags',
            'womens-watches': 'Womens Watches',
            'womens-jewellery': 'Womens Jewellery',
            'vehicle': 'Vehicle',
            'motorcycle': 'Motorcycle'
        };

        let currentMainCategory = null;
        let currentSubCategory = null;
        let allProducts = [];
        let cart = {};

        // Load cart from memory on init
        function initCart() {
            updateCartUI();
        }

        function saveCart() {
            updateCartUI();
        }

        function updateCartUI() {
            const badge = document.getElementById('cartBadge');
            const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
            badge.style.display = totalItems > 0 ? 'block' : 'none';
            renderCart();
        }

        function addToCart(product, quantity = 1) {
            if (cart[product.id]) {
                cart[product.id].quantity += quantity;
            } else {
                cart[product.id] = {
                    ...product,
                    quantity: quantity
                };
            }
            saveCart();
            showNotification('Added to cart!');
        }

        function removeFromCart(productId) {
            delete cart[productId];
            saveCart();
        }

        function updateQuantity(productId, newQuantity) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                cart[productId].quantity = newQuantity;
                saveCart();
            }
        }

        function renderCart() {
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            
            const items = Object.values(cart);
            
            if (items.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
                cartTotal.textContent = '$0.00';
                return;
            }

            let total = 0;
            let html = '';

            items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                html += `
                    <div class="cart-item">
                        <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-image">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">$${item.price}</div>
                            <div class="cart-item-quantity">
                                <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                `;
            });

            cartItems.innerHTML = html;
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }

        function openCart() {
            document.getElementById('cartSidebar').classList.add('active');
        }

        function closeCart() {
            document.getElementById('cartSidebar').classList.remove('active');
        }

        function checkout() {
            if (Object.keys(cart).length === 0) {
                alert('Your cart is empty!');
                return;
            }
            alert('Checkout functionality would be implemented here!');
        }

        document.getElementById('cartBtn').addEventListener('click', openCart);

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: #000;
                color: white;
                padding: 16px 24px;
                border-radius: 4px;
                z-index: 4000;
                animation: slideIn 0.3s;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }

        // Search functionality
        let searchTimeout;
        document.getElementById('searchInput').addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProducts(e.target.value);
            }, 300);
        });

        async function searchProducts(query) {
            if (!query.trim()) {
                return;
            }

            const productsArea = document.getElementById('productsArea');
            productsArea.innerHTML = '<div class="loading">Searching...</div>';

            try {
                const response = await fetch(`https://dummyjson.com/products/search?q=${query}`);
                const data = await response.json();

                if (data.products && data.products.length > 0) {
                    renderSearchResults(data.products, query);
                } else {
                    productsArea.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">🔍</div>
                            <h2>No results found</h2>
                            <p>Try searching with different keywords</p>
                        </div>
                    `;
                }
            } catch (error) {
                productsArea.innerHTML = `
                    <div class="empty-state">
                        <h2>Error searching</h2>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }

        function renderSearchResults(products, query) {
            const productsArea = document.getElementById('productsArea');
            
            let html = `
                <div class="page-header">
                    <h1 class="page-title">Search Results for "${query}"</h1>
                    <div class="products-count">${products.length} products found</div>
                </div>
                <div class="products-grid">
            `;

            products.forEach(product => {
                html += createProductCard(product);
            });

            html += '</div>';
            productsArea.innerHTML = html;
        }

        function createProductCard(product) {
            const rating = product.rating.toFixed(1);
            const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
            
            return `
                <div class="product-card">
                    <div class="product-image-wrapper" onclick="openModal(${product.id})">
                        <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                    </div>
                    <div class="product-info">
                        <div class="product-title" onclick="openModal(${product.id})">${product.title}</div>
                        <div class="product-price">$${product.price}</div>
                        <div class="product-rating">
                            <span class="stars">${stars}</span>
                            <span>${rating}</span>
                        </div>
                        <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartFromCard(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `;
        }

        function addToCartFromCard(productId) {
            const product = allProducts.find(p => p.id === productId);
            if (product) {
                addToCart(product);
            }
        }

        async function openModal(productId) {
            const modal = document.getElementById('productModal');
            const modalBody = document.getElementById('modalBody');
            
            modal.classList.add('active');
            modalBody.innerHTML = '<div class="loading">Loading product...</div>';

            try {
                const response = await fetch(`https://dummyjson.com/products/${productId}`);
                const product = await response.json();

                const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
                
                modalBody.innerHTML = `
                    <img src="${product.thumbnail}" alt="${product.title}" class="modal-image">
                    <div class="modal-details">
                        <h2 class="modal-title">${product.title}</h2>
                        <div class="modal-price">${product.price}</div>
                        <div class="product-rating" style="margin-bottom: 20px;">
                            <span class="stars">${stars}</span>
                            <span>${product.rating.toFixed(1)}</span>
                        </div>
                        <p class="modal-description">${product.description}</p>
                        <div class="modal-meta">
                            <div class="meta-item">
                                <span class="meta-label">Brand</span>
                                <span class="meta-value">${product.brand || 'N/A'}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Category</span>
                                <span class="meta-value">${product.category}</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Stock</span>
                                <span class="meta-value">${product.stock} units</span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Discount</span>
                                <span class="meta-value">${product.discountPercentage}%</span>
                            </div>
                        </div>
                        <div class="quantity-selector">
                            <span style="font-weight: 600;">Quantity:</span>
                            <button class="quantity-btn" onclick="changeModalQuantity(-1)">-</button>
                            <span class="quantity-value" id="modalQuantity">1</span>
                            <button class="quantity-btn" onclick="changeModalQuantity(1)">+</button>
                        </div>
                        <button class="add-to-cart-btn" onclick="addToCartFromModal(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                `;
            } catch (error) {
                modalBody.innerHTML = `
                    <div class="empty-state">
                        <h2>Error loading product</h2>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }

        function closeModal() {
            document.getElementById('productModal').classList.remove('active');
            document.getElementById('modalQuantity').textContent = '1';
        }

        function changeModalQuantity(change) {
            const quantityEl = document.getElementById('modalQuantity');
            let quantity = parseInt(quantityEl.textContent);
            quantity = Math.max(1, quantity + change);
            quantityEl.textContent = quantity;
        }

        async function addToCartFromModal(productId) {
            const quantity = parseInt(document.getElementById('modalQuantity').textContent);
            const response = await fetch(`https://dummyjson.com/products/${productId}`);
            const product = await response.json();
            addToCart(product, quantity);
            closeModal();
        }

        // Close modal when clicking outside
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target.id === 'productModal') {
                closeModal();
            }
        });

        function renderMainCategories() {
            const container = document.getElementById('mainCategories');
            let html = '';

            for (const mainCat of Object.keys(categoryMapping)) {
                html += `
                    <button class="main-category-btn" data-category="${mainCat}">
                        ${mainCat}
                    </button>
                `;
            }

            container.innerHTML = html;

            document.querySelectorAll('.main-category-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const category = e.target.dataset.category;
                    selectMainCategory(category);
                });
            });
        }

        function selectMainCategory(mainCat) {
            currentMainCategory = mainCat;
            currentSubCategory = null;

            document.querySelectorAll('.main-category-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.category === mainCat);
            });

            renderSubcategories(mainCat);
        }

        function renderSubcategories(mainCat) {
            const bar = document.getElementById('subcategoriesBar');
            const grid = document.getElementById('subcategoriesGrid');
            const subCats = categoryMapping[mainCat];

            bar.classList.add('active');

            let html = '';
            subCats.forEach(subCat => {
                html += `
                    <button class="subcategory-btn" data-category="${subCat}">
                        ${categoryDisplayNames[subCat]}
                    </button>
                `;
            });

            grid.innerHTML = html;

            document.querySelectorAll('.subcategory-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const category = e.target.dataset.category;
                    loadProducts(category);
                    
                    document.querySelectorAll('.subcategory-btn').forEach(b => {
                        b.classList.remove('active');
                    });
                    e.target.classList.add('active');
                });
            });
        }

        async function loadProducts(category) {
            currentSubCategory = category;
            const productsArea = document.getElementById('productsArea');
            
            productsArea.innerHTML = '<div class="loading">Loading products...</div>';

            try {
                const response = await fetch(`https://dummyjson.com/products/category/${category}`);
                const data = await response.json();

                if (data.products && data.products.length > 0) {
                    allProducts = data.products;
                    renderProducts(data.products, category);
                } else {
                    productsArea.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-state-icon">📭</div>
                            <h2>No products found</h2>
                            <p>This category doesn't have any products yet</p>
                        </div>
                    `;
                }
            } catch (error) {
                productsArea.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">⚠️</div>
                        <h2>Error loading products</h2>
                        <p>${error.message}</p>
                    </div>
                `;
            }
        }

        function renderProducts(products, category) {
            const productsArea = document.getElementById('productsArea');
            
            let html = `
                <div class="page-header">
                    <h1 class="page-title">${categoryDisplayNames[category]}</h1>
                    <div class="products-count">${products.length} products</div>
                </div>
                <div class="products-grid">
            `;

            products.forEach(product => {
                html += createProductCard(product);
            });

            html += '</div>';
            productsArea.innerHTML = html;
        }

        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Initialize
        renderMainCategories();
        initCart();


          function renderCart() {
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            
            const items = Object.values(cart);
            
            if (items.length === 0) {
                cartItems.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
                cartTotal.textContent = '$0.00';
                return;
            }

            let total = 0;
            let html = '';

            items.forEach(item => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;

                // Escape strings for HTML safety
                const safeTitle = String(item.title).replace(/'/g, "\\'");
                
                html += `
                    <div class="cart-item">
                        <img src="${item.thumbnail}" alt="${item.title}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80'">
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.title}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                <span>${item.quantity}</span>
                                <button class="cart-qty-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                            </div>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                `;
            });

            cartItems.innerHTML = html;
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }