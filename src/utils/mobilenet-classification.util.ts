import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tfnode from '@tensorflow/tfjs-node';

class MobilenetClassification {
  mobilenetModel: mobilenet.MobileNet | undefined;

  async loadModel() {
    if (this.mobilenetModel) {
      return this.mobilenetModel;
    }

    this.mobilenetModel = await mobilenet.load({
      version: 2,
      alpha: 1.0,
      modelUrl: `file://${process.env.MODEL_PATH}`,
    });
    return this.mobilenetModel;
  }

  async classify(imageBuffer: Buffer, topk = 3) {
    if (!this.mobilenetModel) {
      await this.loadModel();
    }

    const tfimage = tfnode.node.decodeImage(imageBuffer) as tfnode.Tensor3D;
    return this.mobilenetModel?.classify(tfimage, topk);
  }
}

export default new MobilenetClassification();
