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
        let credit = document.getElementById('credit');
        let link = document.getElementById('link');
        title.innerText = currentPic.title;
        picture.src = currentPic.image_files.large;
        caption.innerText = currentPic.caption;
        link.href = `https://mars.nasa.gov/mars2020/multimedia/raw-images/${currentPic.imageid}`;
        link.innerText = `https://mars.nasa.gov/mars2020/multimedia/raw-images/`;
        credit.innerText = `Credit: ${currentPic.credit}`;

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
        let url = new URL('https://mars.nasa.gov/rss/api/');
        url.search = new URLSearchParams({
            feed: `raw_images`,
            category: `mars2020`,
            feedtype: `json`,
            num: `${resultsCount}`,
            page: `${currentPage}`,
            order: `sol desc`,
            search: `|NAVCAM_LEFT|NAVCAM_RIGHT|FRONT_HAZCAM_LEFT_A|FRONT_HAZCAM_LEFT_B|FRONT_HAZCAM_RIGHT_A|FRONT_HAZCAM_RIGHT_B|REAR_HAZCAM_LEFT|REAR_HAZCAM_RIGHT|MCZ_LEFT|MCZ_RIGHT|SKYCAM|EDL_PUCAM1|EDL_PUCAM2|EDL_DDCAM|EDL_RUCAM|EDL_RDCAM`,
            extended: `sample_type::full`
        }).toString();
        let response = await fetch(url).then(res => res.json())
        totalImageCount = response.total_results;
        const picArr = response.images;
        UpdateImage(picArr);
    } catch (error) {
        console.error(error);
    }
}

GetImages();

