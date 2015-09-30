dest-multer
===============================================================================
A node.js multipart form express middleware that allow you to separate uploaded
files or renamed based on each request, filename or the name of form field.

## Requirements
node.js >= 4.0.0

## Usage

```js
var uploader = destMulter({
  root: '/var/www/website/public/',
  destination: (req, file) =>
    `/uploads/img/${req.params.id}/sceneries/${file.fieldname}`,
  fields: [
    { name: 'images' },
    { name: 'thumbnail', maxCount: 1 },
  ],
  filename: (req, file) =>
    Date.now() + file.originalname
});

app.post('/post/:id', uploader, function(req, res, next) {
  res.json(req.filePaths);
  /*
  output: if :id is 12345
  {
    images: 
      ['uploads/img/12345/images/1443634898908demo_1.jpg', 'uploads/img/12345images/1443634898908demo_2.jpg'],
    thumbnail:
      ['uploads/img/12345/thumbnail/1443634898908thumbnail.jpg']
  }
  */
});
```
