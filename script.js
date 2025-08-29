  document.addEventListener('DOMContentLoaded', function() {
            // Elements
            const gallery = document.querySelector('.gallery');
            const lightbox = document.getElementById('lightbox');
            const lightboxImg = document.getElementById('lightbox-img');
            const imageCaption = document.getElementById('image-caption');
            const closeBtn = document.getElementById('close-btn');
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const addImageBtn = document.getElementById('add-image-btn');
            const addCategoryBtn = document.getElementById('add-category-btn');
            const addImageModal = document.getElementById('add-image-modal');
            const addCategoryModal = document.getElementById('add-category-modal');
            const addImageForm = document.getElementById('add-image-form');
            const addCategoryForm = document.getElementById('add-category-form');
            const imageCategorySelect = document.getElementById('image-category');
            const closeModalButtons = document.querySelectorAll('.close-modal');
            
            // Variables
            let currentImageIndex = 0;
            let images = [];
            let filteredImages = [];
            let categories = ['nature', 'urban', 'abstract'];
            let filterButtons = document.querySelectorAll('.filter-btn');
            
            // Initialize the gallery
            function initGallery() {
                // Load categories from localStorage if available
                const savedCategories = localStorage.getItem('galleryCategories');
                if (savedCategories) {
                    categories = JSON.parse(savedCategories);
                }
                
                // Load custom images from localStorage if available
                const savedImages = localStorage.getItem('galleryImages');
                if (savedImages) {
                    const customImages = JSON.parse(savedImages);
                    customImages.forEach(imageData => {
                        addImageToGallery(imageData, false);
                    });
                }
                
                // Update category select dropdown
                updateCategorySelect();
                
                // Update filter buttons
                updateFilterButtons();
                
                // Get all images
                images = Array.from(gallery.querySelectorAll('.image-card'));
                filteredImages = images;
                
                // Add click event to each image
                images.forEach((image, index) => {
                    image.addEventListener('click', (e) => {
                        if (!e.target.classList.contains('delete-image-btn') && 
                            !e.target.parentElement.classList.contains('delete-image-btn')) {
                            // Find the index in filteredImages
                            const filteredIndex = filteredImages.indexOf(image);
                            if (filteredIndex !== -1) {
                                openLightbox(filteredIndex);
                            }
                        }
                    });
                    
                    // Add delete button functionality
                    const deleteBtn = image.querySelector('.delete-image-btn');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            deleteImage(image);
                        });
                    }
                });
                
                // Add event listeners to filter buttons
                filterButtons.forEach(button => {
                    button.addEventListener('click', () => {
                        // Update active button
                        filterButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        
                        // Filter images
                        const filter = button.getAttribute('data-filter');
                        filterImages(filter);
                    });
                });
            }
            
            // Update category select dropdown
            function updateCategorySelect() {
                // Clear existing options except the first one
                while (imageCategorySelect.options.length > 1) {
                    imageCategorySelect.remove(1);
                }
                
                // Add categories to select
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                    imageCategorySelect.appendChild(option);
                });
            }
            
            // Update filter buttons
            function updateFilterButtons() {
                // Get the current active filter
                const activeFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                
                // Clear existing buttons except "All"
                const filterButtonsContainer = document.querySelector('.filter-buttons');
                const allButton = filterButtonsContainer.querySelector('[data-filter="all"]');
                filterButtonsContainer.innerHTML = '';
                filterButtonsContainer.appendChild(allButton);
                
                // Add category buttons
                categories.forEach(category => {
                    const button = document.createElement('button');
                    button.className = 'filter-btn';
                    if (category === activeFilter) {
                        button.classList.add('active');
                    }
                    button.setAttribute('data-filter', category);
                    button.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                    
                    button.addEventListener('click', () => {
                        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        filterImages(category);
                    });
                    
                    filterButtonsContainer.appendChild(button);
                });
                
                // Update filterButtons variable
                filterButtons = document.querySelectorAll('.filter-btn');
            }
            
            // Filter images based on category
            function filterImages(filter) {
                if (filter === 'all') {
                    filteredImages = images;
                } else {
                    filteredImages = images.filter(image => 
                        image.getAttribute('data-category') === filter
                    );
                }
                
                // Hide all images first
                images.forEach(image => {
                    image.style.display = 'none';
                });
                
                // Show filtered images
                filteredImages.forEach(image => {
                    image.style.display = 'block';
                });
            }
            
            // Open lightbox with selected image
            function openLightbox(index) {
                currentImageIndex = index;
                const image = filteredImages[currentImageIndex];
                const imgSrc = image.querySelector('img').src;
                const caption = image.querySelector('h3').textContent;
                
                lightboxImg.src = imgSrc;
                imageCaption.textContent = caption;
                lightbox.style.display = 'flex';
                
                // Prevent body scrolling when lightbox is open
                document.body.style.overflow = 'hidden';
            }
            
            // Close lightbox
            function closeLightbox() {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
            
            // Navigate to next image
            function nextImage() {
                currentImageIndex = (currentImageIndex + 1) % filteredImages.length;
                const image = filteredImages[currentImageIndex];
                const imgSrc = image.querySelector('img').src;
                const caption = image.querySelector('h3').textContent;
                
                lightboxImg.src = imgSrc;
                imageCaption.textContent = caption;
            }
            
            // Navigate to previous image
            function prevImage() {
                currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length;
                const image = filteredImages[currentImageIndex];
                const imgSrc = image.querySelector('img').src;
                const caption = image.querySelector('h3').textContent;
                
                lightboxImg.src = imgSrc;
                imageCaption.textContent = caption;
            }
            
            // Add image to gallery
            function addImageToGallery(imageData, saveToStorage = true) {
                const imageCard = document.createElement('div');
                imageCard.className = 'image-card';
                imageCard.setAttribute('data-category', imageData.category);
                
                imageCard.innerHTML = `
                    <img src="${imageData.url}" alt="${imageData.title}">
                    <div class="image-info">
                        <div>
                            <h3>${imageData.title}</h3>
                            <p>${imageData.category.charAt(0).toUpperCase() + imageData.category.slice(1)}</p>
                        </div>
                        <button class="delete-image-btn"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                
                // Add click event for lightbox
                imageCard.addEventListener('click', (e) => {
                    if (!e.target.classList.contains('delete-image-btn') && 
                        !e.target.parentElement.classList.contains('delete-image-btn')) {
                        // Find the index in filteredImages
                        const filteredIndex = filteredImages.indexOf(imageCard);
                        if (filteredIndex !== -1) {
                            openLightbox(filteredIndex);
                        }
                    }
                });
                
                // Add delete button functionality
                const deleteBtn = imageCard.querySelector('.delete-image-btn');
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteImage(imageCard);
                });
                
                gallery.appendChild(imageCard);
                images.push(imageCard);
                
                // Apply current filter
                const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                filterImages(filter);
                
                if (saveToStorage) {
                    saveImagesToLocalStorage();
                }
            }
            
            // Delete image from gallery
            function deleteImage(imageElement) {
                if (confirm('Are you sure you want to delete this image?')) {
                    // Remove from DOM
                    imageElement.remove();
                    
                    // Remove from images array
                    const index = images.indexOf(imageElement);
                    if (index > -1) {
                        images.splice(index, 1);
                    }
                    
                    // Update filteredImages
                    const filter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
                    filterImages(filter);
                    
                    // Update localStorage
                    saveImagesToLocalStorage();
                }
            }
            
            // Save images to localStorage
            function saveImagesToLocalStorage() {
                const customImages = [];
                images.forEach(image => {
                    // Only save custom images (not the preloaded ones)
                    if (image.querySelector('h3') && !image.querySelector('h3').textContent.includes('Mountain Landscape') &&
                        !image.querySelector('h3').textContent.includes('City Skyline') &&
                        !image.querySelector('h3').textContent.includes('Abstract Art')) {
                        customImages.push({
                            title: image.querySelector('h3').textContent,
                            url: image.querySelector('img').src,
                            category: image.getAttribute('data-category')
                        });
                    }
                });
                
                localStorage.setItem('galleryImages', JSON.stringify(customImages));
            }
            
            // Save categories to localStorage
            function saveCategoriesToLocalStorage() {
                localStorage.setItem('galleryCategories', JSON.stringify(categories));
            }
            
            // Event listeners for modals
            addImageBtn.addEventListener('click', () => {
                addImageModal.style.display = 'flex';
            });
            
            addCategoryBtn.addEventListener('click', () => {
                addCategoryModal.style.display = 'flex';
            });
            
            closeModalButtons.forEach(button => {
                button.addEventListener('click', () => {
                    addImageModal.style.display = 'none';
                    addCategoryModal.style.display = 'none';
                });
            });
            
            // Close modals when clicking outside
            window.addEventListener('click', (e) => {
                if (e.target === addImageModal) {
                    addImageModal.style.display = 'none';
                }
                if (e.target === addCategoryModal) {
                    addCategoryModal.style.display = 'none';
                }
            });
            
            // Form submissions
            addImageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const title = document.getElementById('image-title').value;
                const url = document.getElementById('image-url').value;
                const category = document.getElementById('image-category').value;
                
                if (title && url && category) {
                    const imageData = { title, url, category };
                    addImageToGallery(imageData);
                    
                    // Reset form and close modal
                    addImageForm.reset();
                    addImageModal.style.display = 'none';
                }
            });
            
            addCategoryForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const categoryName = document.getElementById('category-name').value.toLowerCase();
                
                if (categoryName && !categories.includes(categoryName)) {
                    categories.push(categoryName);
                    saveCategoriesToLocalStorage();
                    updateCategorySelect();
                    updateFilterButtons();
                    
                    // Reset form and close modal
                    addCategoryForm.reset();
                    addCategoryModal.style.display = 'none';
                } else if (categories.includes(categoryName)) {
                    alert('This category already exists!');
                }
            });
            
            // Lightbox event listeners
            closeBtn.addEventListener('click', closeLightbox);
            nextBtn.addEventListener('click', nextImage);
            prevBtn.addEventListener('click', prevImage);
            
            // Close lightbox when clicking outside the image
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (lightbox.style.display === 'flex') {
                    if (e.key === 'Escape') {
                        closeLightbox();
                    } else if (e.key === 'ArrowRight') {
                        nextImage();
                    } else if (e.key === 'ArrowLeft') {
                        prevImage();
                    }
                }
            });
            
            // Initialize the gallery
            initGallery();
        });