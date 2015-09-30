dest-multer
===============================================================================
A node.js multipart form express middleware that allow you to separate uploaded
files or renamed based on each request, filename or the name of form field.

## Requirements
node.js >= 4.0.0

## Example Usage

```js
var uploader = destMulter({
  root: '/var/www/website/public/',
  destination: (req, file) =>
    `/uploads/schools/${req.params.id}/sceneries/${file.fieldname}`,
  fields: [
    { name: 'images' },
    { name: 'thumbnail', maxCount: 1 },
  ],
  filename: (req, file) =>
    Date.now() + file.originalname
});

app.post('/post/:id', uploader, function(req, res, next) {
  // req.files => output files with useful information such as file size
  // req.filesPath => output paths relative to root

  res.send(`<img src="${req.filesPath.thumbnail[0]}">'`);
});
```

#### req.filesPath

If `:id` is equal to `56099dc5b838976eb66f0bb9`

`req.filesPath` will be

```js
{ images:
   [ '/uploads/schools/56099dc5b838976eb66f0bb9/sceneries/images/1443641224072img_1.png',
     '/uploads/schools/56099dc5b838976eb66f0bb9/sceneries/images/1443641224073img_2.png' ],
  thumbnail: [ '/uploads/schools/56099dc5b838976eb66f0bb9/sceneries/thumbnail/1443641224073thumb100x100.jpg' ] }
```

`req.files` will be

```js
{ thumbnail:
   [ { fieldname: 'thumbnail',
       originalname: 'thumb100x100.jpg',
       encoding: '7bit',
       mimetype: 'image/jpeg',
       destination: '/Users/Fonger/Dreamology-Backend/public/uploads/schools/56099dc5b838976eb66f0bb9/sceneries/thumbnail',
       filename: '1443641224073thumb100x100.jpg',
       path: '/Users/Fonger/Dreamology-Backend/public/uploads/schools/56099dc5b838976eb66f0bb9/sceneries/thumbnail/1443641224073thumb100x100.jpg',
       size: 251740 } ],
  images:
   [ { fieldname: 'images',
       originalname: 'img_1.png',
       encoding: '7bit',
       mimetype: 'image/png',
       destination: '/Users/Fonger/Dreamology-Backend/public/uploads/schools/56099dc5b838976eb66f0bb9/sceneries/images',
       filename: '1443641224072img_1.png',
       path: '/Users/Fonger/Dreamology-Backend/public/uploads/schools/56099dc5b838976eb66f0bb9/sceneries/images/1443641224072img_1.png',
       size: 3983180 },
     { fieldname: 'images',
       originalname: 'img_2.png',
       encoding: '7bit',
       mimetype: 'image/png',
       destination: '/Users/Fonger/Dreamology-Backend/public/uploads/schools/56099dc5b838976eb66f0bb9/sceneries/images',
       filename: '1443641224073img_2.png',
       path: '/Users/Fonger/Dreamology-Backend/public/uploads/schools/56099dc5b838976eb66f0bb9/sceneries/images/1443641224073img_2.png',
       size: 3442096 } ] }
```
