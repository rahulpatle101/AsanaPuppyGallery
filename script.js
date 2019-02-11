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
    const modalWindowRoot = document.querySelector('modal .modal-window');
    const modalImageDiv = modalWindowRoot.querySelector('modal .image-container');
    const modalOverlay = modalWindowRoot.querySelector('modal .modal-window-overlay')
    const modalImage = modalWindowRoot.querySelector('modal img');
    const closeIcon = modalWindowRoot.querySelector('modal svg');


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

    // Renderpage function 
    renderPage = (items ) => {
        console.log(items)

        let cardMarkup = '';
        items.forEach(function(dog) {
            cardMarkup +=  `<card class="puppy-card fade-in">
                    <img class="pup-image" src='${dog["image"]}' alt="">
                    </div>
                    </card>`
        })
        document.querySelector('.gallery-container').innerHTML = cardMarkup;
    }

    // Populate images on DOM
    populateGallery = () => {
        // fetch data from galleryData.dogs.json using fetch
        fetch('assets/data/dogs.json')
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                // add dog data to galleryDog object and render page
                galleryData.dogs = data.dogs.map(dog => dog)
                galleryData.currentPage = 1;
                renderPage(galleryData.dogs);
            }
        })
        .catch((error) => console.log('Something went went wrong, please try again. Error: ',error));
    }

    // Initialize the page with populate gallery
    populateGallery();

})();