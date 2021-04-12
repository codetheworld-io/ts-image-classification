import mobilenetClassificationUtil from '../utils/mobilenet-classification.util';

export interface IImageFile {
  data: Buffer;
  mimetype: string;
}

class Service {
  private SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

  async classifyImageFile(image: IImageFile) {
    if (!this.SUPPORTED_IMAGE_TYPES.includes(image.mimetype)) {
      throw new Error(
        `Expected image (${this.SUPPORTED_IMAGE_TYPES}), but got ${image.mimetype}`,
      );
    }
    return mobilenetClassificationUtil.classify(image.data, 1);
  }
}

export default new Service();
