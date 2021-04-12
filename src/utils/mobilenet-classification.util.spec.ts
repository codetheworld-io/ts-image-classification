import * as mobilenet from '@tensorflow-models/mobilenet';
import * as tfnode from '@tensorflow/tfjs-node';
import { mocked } from 'ts-jest/utils';
import mobilenetClassificationUtil from './mobilenet-classification.util';

jest.mock('@tensorflow-models/mobilenet');
jest.mock('@tensorflow/tfjs-node');

describe('MobilenetClassification', () => {
  let mobilenetMock: jest.Mocked<typeof mobilenet>;
  let mobilenetModelMock: jest.Mocked<mobilenet.MobileNet>;
  let tfnodeMock: jest.Mocked<typeof tfnode>;

  beforeEach(() => {
    mobilenetModelMock = {
      classify: jest.fn(),
    } as never;

    mobilenetMock = mocked(mobilenet);
    mobilenetMock.load.mockResolvedValue(mobilenetModelMock);

    tfnodeMock = mocked(tfnode) as never;
  });

  describe('loadModel', () => {
    it('should load the model once with correct params', async () => {
      await mobilenetClassificationUtil.loadModel();
      const actual = await mobilenetClassificationUtil.loadModel();

      expect(actual).toBe(mobilenetModelMock);
      expect(actual).toBe(mobilenetClassificationUtil.mobilenetModel);
      expect(mobilenetMock.load).toHaveBeenCalledTimes(1);
      expect(mobilenetMock.load).toHaveBeenCalledWith({
        version: 2,
        alpha: 1.0,
        modelUrl: expect.any(String),
      });
    });
  });

  describe('classify', () => {
    const buffer: Buffer = Buffer.from('');
    const classifyResult = {} as never;
    const tfimage = {} as never;
    const defaultTopK = 3;

    let loadModelSpy: jest.SpyInstance;

    beforeEach(() => {
      mobilenetModelMock.classify.mockResolvedValue(classifyResult);
      (tfnodeMock.node as jest.Mocked<
        typeof tfnode.node
      >).decodeImage.mockReturnValue(tfimage);

      loadModelSpy = jest.spyOn(mobilenetClassificationUtil, 'loadModel');
    });

    it('should call loadModel when the model is not loaded', async () => {
      mobilenetClassificationUtil.mobilenetModel = undefined;

      await mobilenetClassificationUtil.classify(buffer);

      expect(loadModelSpy).toHaveBeenCalled();
    });

    it.each([[undefined], [10]])(
      'should call classify function with tfimage Tensor3D, topk',
      async () => {
        mobilenetClassificationUtil.mobilenetModel = mobilenetModelMock;

        const actual = await mobilenetClassificationUtil.classify(buffer);

        expect(actual).toEqual(classifyResult);
        expect(tfnodeMock.node.decodeImage).toHaveBeenCalledWith(buffer);
        expect(mobilenetModelMock.classify).toHaveBeenCalledWith(
          tfimage,
          defaultTopK,
        );
      },
    );
  });
});
