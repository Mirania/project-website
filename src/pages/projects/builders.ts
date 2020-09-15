/** Functions that should be directly called. */

function addLeftCard(images: string | string[], title: string, content: string, isVideo: boolean, border: boolean): void {
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

function addRightCard(images: string | string[], title: string, content: string, isVideo: boolean, border: boolean): void {
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

function animateEntries(): void {
    entries.forEach((entry, index) => {
        setTimeout(() => {
            entry.separator.style.removeProperty("opacity");
            entry.separator.classList.add("fadeIn");
            entry.card.style.removeProperty("opacity");
            entry.card.classList.add("fadeIn");
        }, (index + 1) * 250);
    });
}

function inlineHref(text: string, href: string): string {
    return `<a href=${href}>${text}</a>`;
}

function inlineGoldHref(text: string, href: string): string {
    return `<a class="gold" href=${href}>${text}</a>`;
}

function inlineBr(): string {
    return "<br/>";
}

function inlineSmall(text: string): string {
    return `<span class="small-text">${text}</span>`;
}

function inlineGrey(text: string): string {
    return `<span class="grey">${text}</span>`;
}

/** Helper functions. */

type Gallery = {
    index: number,
    sources: string[],
    image: HTMLImageElement | HTMLVideoElement
}

type Entry = {
    separator: HTMLDivElement,
    card: HTMLDivElement
}

function createCardGallery(images: string | string[], isLeftCard: boolean, isVideo: boolean, border: boolean): HTMLDivElement {
    return typeof images === "string"
        ? createSingleImageGallery(images, isLeftCard, isVideo, border)
        : createMultipleImagesGallery(images, isLeftCard, isVideo, border);
}

function createSingleImageGallery(image: string, isLeftCard: boolean, isVideo: boolean, border: boolean): HTMLDivElement {
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

function createMultipleImagesGallery(images: string[], isLeftCard: boolean, isVideo: boolean, border: boolean): HTMLDivElement {
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

function createCardTextbox(title: string, content: string, isLeftCard: boolean): HTMLDivElement {
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

function moveBack(controller: number): void {
    const gallery = galleries[controller];
    gallery.index = gallery.index === 0 ? gallery.sources.length - 1 : gallery.index - 1;
    animateGallery(gallery);
}

function moveForward(controller: number): void {
    const gallery = galleries[controller];
    gallery.index = (gallery.index + 1) % gallery.sources.length;
    animateGallery(gallery);
}

function animateGallery(gallery: Gallery): void {
    gallery.image.classList.remove("fadeIn");
    void gallery.image.offsetWidth; // reset animations
    gallery.image.classList.add("fadeOut");

    setTimeout(() => { // do this part async
        gallery.image.classList.remove("fadeOut");
        gallery.image.classList.add("fadeIn");
        gallery.image.src = gallery.sources[gallery.index];
    }, 500);
}

function div(className: string): HTMLDivElement {
    const element = document.createElement("div");
    element.className = className;
    return element;
}

function img(src: string, className: string): HTMLImageElement {
    const element = document.createElement("img");
    element.src = src;
    element.className = className;
    return element;
}

function video(src: string, className: string): HTMLVideoElement {
    const element = document.createElement("video");
    element.className = className, element.controls = true, element.muted = true;
    const source = document.createElement("source");
    source.src = src, source.type = "video/mp4";
    element.appendChild(source);
    return element;
}