import express from 'express';
import fileUpload from 'express-fileupload';
import controller from './image-classification/controller';

const app = express();
app.use(fileUpload());

app.post('/classify', controller.classifyImage);

export default app;
