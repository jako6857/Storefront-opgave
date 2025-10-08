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
                const rating = product.rating.toFixed(1);
                const stars = '★'.repeat(Math.round(product.rating)) + '☆'.repeat(5 - Math.round(product.rating));
                
                html += `
                    <div class="product-card">
                        <div class="product-image-wrapper">
                            <img src="${product.thumbnail}" alt="${product.title}" class="product-image">
                        </div>
                        <div class="product-info">
                            <div class="product-title">${product.title}</div>
                            <div class="product-price">$${product.price}</div>
                            <div class="product-rating">
                                <span class="stars">${stars}</span>
                                <span>${rating}</span>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += '</div>';
            productsArea.innerHTML = html;
        }

        renderMainCategories();