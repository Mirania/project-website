/** Functions that should be directly called. */
function addLeftCard(images, title, content, isVideo, border) {
    const separator = div("separator animatable");
    const card = div("card animatable");
    card.appendChild(createCardGallery(images, true, isVideo, border));
    card.appendChild(createCardTextbox(title, content, true));
    separator.style.opacity = "0";
    card.style.opacity = "0";
    body.appendChild(separator);
    body.appendChild(card);
    entries.push({ separator, card });
}
function addRightCard(images, title, content, isVideo, border) {
    const separator = div("separator animatable");
    const card = div("card animatable");
    card.appendChild(createCardTextbox(title, content, false));
    card.appendChild(createCardGallery(images, false, isVideo, border));
    separator.style.opacity = "0";
    card.style.opacity = "0";
    body.appendChild(separator);
    body.appendChild(card);
    entries.push({ separator, card });
}
function animateEntries() {
    entries.forEach((entry, index) => {
        setTimeout(() => {
            entry.separator.style.removeProperty("opacity");
            entry.separator.classList.add("fadeIn");
            entry.card.style.removeProperty("opacity");
            entry.card.classList.add("fadeIn");
        }, (index + 1) * 250);
    });
}
function inlineHref(text, href) {
    return `<a href=${href}>${text}</a>`;
}
function inlineGoldHref(text, href) {
    return `<a class="gold" href=${href}>${text}</a>`;
}
function inlineBr() {
    return "<br/>";
}
function inlineSmall(text) {
    return `<span class="small-text">${text}</span>`;
}
function inlineGrey(text) {
    return `<span class="grey">${text}</span>`;
}
function createCardGallery(images, isLeftCard, isVideo, border) {
    return typeof images === "string"
        ? createSingleImageGallery(images, isLeftCard, isVideo, border)
        : createMultipleImagesGallery(images, isLeftCard, isVideo, border);
}
function createSingleImageGallery(image, isLeftCard, isVideo, border) {
    const container = isLeftCard ? div("flex-container center-pad-left-card") : div("flex-container");
    const gallery = div("card-gallery");
    const galleryBody = div("card-gallery-body");
    const arrowLeftContainer = div("card-arrow arrow");
    const arrowRightContainer = arrowLeftContainer.cloneNode();
    const arrowLeft = div("arrow");
    const arrowRight = arrowLeft.cloneNode();
    const imageContainer = div("card-image");
    const imageDiv = (isVideo ? video : img)(image, border ? "image gradient-border" : "image");
    arrowLeftContainer.appendChild(arrowLeft);
    arrowRightContainer.appendChild(arrowRight);
    imageContainer.appendChild(imageDiv);
    galleryBody.appendChild(arrowLeftContainer);
    galleryBody.appendChild(imageContainer);
    galleryBody.appendChild(arrowRightContainer);
    gallery.appendChild(galleryBody);
    container.appendChild(gallery);
    return container;
}
function createMultipleImagesGallery(images, isLeftCard, isVideo, border) {
    const container = isLeftCard ? div("flex-container center-pad-left-card") : div("flex-container");
    const gallery = div("card-gallery");
    const galleryBody = div("card-gallery-body");
    const arrowLeftContainer = div("card-arrow arrow");
    const arrowRightContainer = arrowLeftContainer.cloneNode();
    const arrowLeft = img("projects/assets/arrow.png", "arrow link-cursor");
    const arrowRight = img("projects/assets/arrow.png", "arrow flipped link-cursor");
    const imageContainer = div("card-image");
    const image = (isVideo ? video : img)(images[0], border ? "image animatable gradient-border" : "image animatable");
    arrowLeftContainer.appendChild(arrowLeft);
    arrowRightContainer.appendChild(arrowRight);
    imageContainer.appendChild(image);
    galleryBody.appendChild(arrowLeftContainer);
    galleryBody.appendChild(imageContainer);
    galleryBody.appendChild(arrowRightContainer);
    gallery.appendChild(galleryBody);
    container.appendChild(gallery);
    const controller = galleries.length;
    galleries.push({ index: 0, sources: images, image });
    arrowLeft.onclick = () => moveBack(controller);
    arrowRight.onclick = () => moveForward(controller);
    return container;
}
function createCardTextbox(title, content, isLeftCard) {
    const container = isLeftCard ? div("container") : div("container center-pad-right-card");
    const textbox = isLeftCard ? div("card-textbox-left-card") : div("card-textbox-right-card");
    const cardTitle = div("card-title white-text-border montserrat");
    const cardDesc = div("text montserrat");
    cardTitle.innerText = title;
    cardDesc.innerHTML = content;
    textbox.appendChild(cardTitle);
    textbox.appendChild(cardDesc);
    container.appendChild(textbox);
    return container;
}
function moveBack(controller) {
    const gallery = galleries[controller];
    gallery.index = gallery.index === 0 ? gallery.sources.length - 1 : gallery.index - 1;
    animateGallery(gallery);
}
function moveForward(controller) {
    const gallery = galleries[controller];
    gallery.index = (gallery.index + 1) % gallery.sources.length;
    animateGallery(gallery);
}
function animateGallery(gallery) {
    gallery.image.classList.remove("fadeIn");
    void gallery.image.offsetWidth; // reset animations
    gallery.image.classList.add("fadeOut");
    setTimeout(() => {
        gallery.image.classList.remove("fadeOut");
        gallery.image.classList.add("fadeIn");
        gallery.image.src = gallery.sources[gallery.index];
    }, 500);
}
function div(className) {
    const element = document.createElement("div");
    element.className = className;
    return element;
}
function img(src, className) {
    const element = document.createElement("img");
    element.src = src;
    element.className = className;
    return element;
}
function video(src, className) {
    const element = document.createElement("video");
    element.className = className, element.controls = true, element.muted = true;
    const source = document.createElement("source");
    source.src = src, source.type = "video/mp4";
    element.appendChild(source);
    return element;
}
