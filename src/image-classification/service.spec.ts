import service, { IImageFile } from './service';
import util from '../utils/mobilenet-classification.util';
import { mocked } from 'ts-jest/utils';

jest.mock('../utils/mobilenet-classification.util');

describe('Service', () => {
  const classifyResult = {} as never;

  let image: IImageFile;
  let utilMock: jest.Mocked<typeof util>;

  beforeEach(() => {
    image = { mimetype: '', data: Buffer.from('') };

    utilMock = mocked(util);
    utilMock.classify.mockResolvedValue(classifyResult);
  });

  it('should throw error when file type is not supported', async () => {
    image.mimetype = 'no-supported-mimetype';

    await expect(service.classifyImageFile(image)).rejects.toThrow(
      new Error(
        `Expected image (image/jpeg,image/png,image/gif), but got ${image.mimetype}`,
      ),
    );
    expect(util.classify).not.toHaveBeenCalled();
  });

  it.each(['image/jpeg', 'image/png', 'image/gif'])(
    'should return classification value when mimetype is %o',
    async (mimetype) => {
      image.mimetype = mimetype;

      const actual = await service.classifyImageFile(image);

      expect(actual).toBe(classifyResult);
      expect(utilMock.classify).toHaveBeenCalledWith(image.data, 1);
    },
  );
});
