const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const db = require('./configs/database');
const path = require("path");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./configs/swagger');


db.connect();
app.use(cors());
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/public', express.static(path.join(__dirname, 'public')));

// app.use('/uploads', express.static('/uploads/'));
// ROUTE
const route = require('./routes/index.route');
route(app);

app.listen(port, () => {
  console.log(`Server started on port`, port);
  console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
});
