(function(){
    // Create global object galleryData (dogs array, currentpage and total pages) and add it to window object
    // simple const global var
    const galleryData = {}
    galleryData.dogs = [];
    galleryData.currenPage;
    galleryData.totalPages;

    // Gallery DOM element
    const gallery = document.querySelector('.gallery-container');

    // Modal DOM element
    const modalWindowRoot = document.querySelector('modal.modal-window');
    const modalImageDiv = modalWindowRoot.querySelector('modal .image-container');
    const modalOverlay = modalWindowRoot.querySelector('modal .modal-window-overlay')
    const modalImage = modalWindowRoot.querySelector('modal img');
    const closeIcon = modalWindowRoot.querySelector('modal svg');

    // Pagination DOM element
    const paginationContainer = document.querySelector('.pagination-container');
    const pageElement = paginationContainer.querySelector('.pagination');
    const anchorDiv = paginationContainer.querySelector('.pagination .pagination-pages');


    // Show puppy image in Modal when clicked on image
    gallery.addEventListener('click', function(e) {
        // only show modal with image if clicked on the puppy image 
        if (e.target.className === 'pup-image') {

            // get computed size of the image to set the modal dimensions
            let compStyles = window.getComputedStyle(e.target);

            // make the modal visible
            modalWindowRoot.style.display="block";

            // set the image content styles, position and scale it 2.5 to keep the aspect ratio
            modalImageDiv.style.width = compStyles.width;
            modalImageDiv.style.height = compStyles.height;
            modalImageDiv.style.transform = "translate(-50%,-50%) scale(3)";

            // update the source of existing modal image
            modalImage.src = e.target.currentSrc;

        }
    })

    // Close the modal when clicked on close icon
    closeIcon.addEventListener('click', function() {
        modalWindowRoot.style.display="none";
    });

    // Close the modal when clicked outside the image
    modalOverlay.addEventListener('click', function() {
        modalWindowRoot.style.display="none";
    });

    // Add pagination functionality Loading Pagination
    pageElement.addEventListener('click', function(e) {
        // stop default anchor click event behavior
        e.preventDefault()

        // If Page Number button clicked
        if (e.target.className === 'pagination-page') {
            // remove active class from other page number
            anchorDiv.childNodes.forEach(e => e.classList.remove('active'));
            
            // convert the value of the data-page-number value to int and pass to renderGallery
            renderGallery(galleryData.dogs, parseInt(e.target.getAttribute('data-page-number')))
        }
        
        // If Prev button clicked
        if (e.target.className === 'pagination-previous') {
            // only render Previous page content if there exist one by checking current page > 1 else do nothing
            if(galleryData.currentPage > 1) {
                renderGallery(galleryData.dogs, galleryData.currentPage - 1)
            } else {
                return
            }
        }

        // If Next button clicked
        if (e.target.className === 'pagination-next') {
            // only render Next page content if there exist one by checking current page < 1 else do nothing
            if(galleryData.currentPage < galleryData.totalPages) {
                renderGallery(galleryData.dogs, galleryData.currentPage + 1)
            } else {
                return
            }
        }

    });


    // Update Page updates the active page classname and curent page in gallery data object
    updatePage = (page) => {
        anchorDiv.childNodes.forEach(e => e.classList.remove('page-active'));
        anchorDiv.childNodes.forEach(el => {
            if (el.innerHTML == page) {
                el.classList.add('page-active')
            }
        });
        galleryData.currentPage = page;
    }

    // Paginator function accepts 3 parameters: items, currentpage and number of items to show perpage.
    // source: https://arjunphp.com/can-paginate-array-objects-javascript/
    Paginator = (items, page, per_page) => {

        const default_page = page || 1;
        const per_page_val = per_page || 10;
        const offset = (default_page - 1) * per_page_val;

        const paginatedItems = items.slice(offset).slice(0, per_page_val);
        const total_pages = Math.ceil(items.length / per_page_val);

        return {
            page: default_page,
            per_page: per_page_val,
            pre_page: page - 1 ? page - 1 : null,
            next_page: (total_pages > page) ? page + 1 : null,
            total: items.length,
            total_pages,
            data: paginatedItems
        };
    }
    
    // RenderGallery function 
    renderGallery = (items, page) => {
        const itemsPerPage = 12
        const dogObj = Paginator(items, page, itemsPerPage);
        galleryData.totalPages = dogObj.total_pages;

        // Create pagination based on total data entries
        let pageNumberMarkup = '';

        // Only show Pagination when total items are more the desired items per page else hide pagination
        if (dogObj.total > itemsPerPage) {
            for (let i = 1; i <= galleryData.totalPages; i++) {
                pageNumberMarkup += `<a href="#" class="pagination-page" data-page-number=${i}>${i}</a>`
            }

            document.querySelector('.pagination-pages').innerHTML = pageNumberMarkup;
        } else {
            paginationContainer.style.display = 'none';
        }

        let cardMarkup = '';
        dogObj.data.forEach(function(dog) {
            cardMarkup +=  `<card class="puppy-card fade-in">
                    <img class="pup-image" src='${dog["image"]}' alt="">
                    </div>
                    </card>`
        })
        document.querySelector('.gallery-container').innerHTML = cardMarkup;
        updatePage(page);
    }

    // Populate images on DOM
    fetchPuppyData = () => {
        // fetch data from galleryData.dogs.json using fetch
        fetch('assets/data/dogs.json')
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                // add dog data to galleryDog object and render page
                galleryData.dogs = data.dogs.map(dog => dog)
                galleryData.currentPage = 1;
                renderGallery(galleryData.dogs, galleryData.currentPage);
            }
        })
        .catch((error) => console.log('Something went went wrong, please try again. Error: ',error));
    }

    // Initialize the page with populate gallery
    fetchPuppyData();

})();