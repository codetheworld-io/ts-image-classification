# ts-image-classification

Source code for [Image Classification API With NodeJS, TensorflowJS, And MobileNet Model](https://hoangdv.medium.com/image-classification-api-with-nodejs-tensorflowjs-and-mobilenet-model-45e3a79a5876?sk=891aa3c57d89b506750bd6751da69da5)

## How to start?

1. Install dependencies

```
npm ci
```

2. Run unit test

```
npm run test
```

3. Start dev server

```
npx nodemon
```

4. Play

```
curl --location --request POST 'localhost:3000/classify' \
--form 'image=@"/Users/username/Downloads/cat.jpg"'
```
