import { Request, Response } from 'express';
import { mocked } from 'ts-jest/utils';
import controller from './controller';
import service from './service';

jest.mock('./service');

describe('Controller', () => {
  const classifyResult = {} as never;
  const image = {} as never;

  let serviceMock: jest.Mocked<typeof service>;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    serviceMock = mocked(service);
    serviceMock.classifyImageFile.mockResolvedValue(classifyResult);

    req = {
      files: {
        image,
      },
    } as never;
    res = {
      json: jest.fn().mockReturnThis(),
    } as never;
  });

  it('should response with result from the service', async () => {
    await controller.classifyImage(req, res);

    expect(res.json).toHaveBeenCalledWith(classifyResult);
    expect(service.classifyImageFile).toHaveBeenCalledWith(image);
  });

  it('should call the service function with undefined when file is undefined', async () => {
    req.files = undefined;

    await controller.classifyImage(req, res);

    expect(service.classifyImageFile).toHaveBeenCalledWith(undefined);
  });

  it('should response with error when the service throw error', async () => {
    const error = new Error('Something went wrong');
    serviceMock.classifyImageFile.mockRejectedValue(error);

    await controller.classifyImage(req, res);

    expect(res.json).toHaveBeenCalledWith({ message: error.message });
    expect(service.classifyImageFile).toHaveBeenCalledWith(image);
  });
});
