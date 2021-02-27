let totalImageCount = 0;
let currentImageCount = 0;
let currentImage = 0;
let currentPage = 0;
let resultsCount = 50;

function StartOver() {
    currentImageCount = 0;
    currentImage = 0;
    currentPage = 0
    GetImages();
}

function UpdateImage(pictureArray) {
    try {
        let currentPic = pictureArray[currentImage];
        let title = document.getElementById('title');
        let picture = document.getElementById('pic');
        let caption = document.getElementById('caption');
        title.innerText = currentPic.title;
        picture.src = currentPic.image_files.large;
        caption.innerText = currentPic.caption;

        currentImage++;
        currentImageCount++;
        // console.log(`Total Image Count: ${totalImageCount}, Current Image Count: ${currentImageCount}, Result Count: ${resultsCount}, Current Page: ${currentPage}, Current Image: ${currentImage}`);
        if(currentImageCount === totalImageCount) {
            window.setTimeout(() => StartOver(), 7000);
        } else if(currentImage === resultsCount) {
            currentPage++;
            currentImage = 0;
            window.setTimeout(() => GetImages(), 7000);
        } else {
            window.setTimeout(() => UpdateImage(pictureArray), 7000);
        }
    } catch (error) {
        console.error('Error in UpdateImage: ', error);
    }
}

async function GetImages() {
    try {
        //https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&num=50&page=0&order=sol+desc&&&extended=sample_type::full,
        let url = new URL('https://mars.nasa.gov/rss/api/');
        url.search = new URLSearchParams({
            feed: `raw_images`,
            category: `mars2020`,
            feedtype: `json`,
            num: `${resultsCount}`,
            page: `${currentPage}`,
            order: `sol desc`,
            search: `|MCZ_LEFT|MCZ_RIGHT`,
            extended: `sample_type::full`
        }).toString();
        console.log(url);
        let response = await fetch(url).then(res => res.json())
        console.log(response);
        totalImageCount = response.total_results;
        const picArr = response.images;
        UpdateImage(picArr);
    } catch (error) {
        console.error(error);
    }
}

GetImages();

