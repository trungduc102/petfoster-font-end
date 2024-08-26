import '@tensorflow/tfjs-backend-cpu';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
const detectObjectsOnImage = async (imageElement: HTMLImageElement) => {
    const model = await cocoSsd.load({});

    const predictions = await model.detect(imageElement, 6);

    return predictions;
};

const readImage = (file: File) => {
    return new Promise((rs, rj) => {
        const fileReader = new FileReader();
        fileReader.onload = () => rs(fileReader.result);
        fileReader.onerror = () => rj(fileReader.error);
        fileReader.readAsDataURL(file);
    });
};

export const detectService = {
    detectObjectsOnImage,
    readImage,
};
