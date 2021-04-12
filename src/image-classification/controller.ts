import { Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import service from './service';

class Controller {
  async classifyImage(req: Request, res: Response) {
    try {
      const imageObject = req.files?.image as UploadedFile;
      res.json(await service.classifyImageFile(imageObject));
    } catch (error) {
      res.json({ message: error.message });
    }
  }
}

export default new Controller();
