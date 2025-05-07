export class ImageBlurException extends Error {
    constructor() {
        super();
        this.name = "ImageBlurException";
        this.message = "The photo is too blurry to be processed. please take a clearer photo.";
    }
}