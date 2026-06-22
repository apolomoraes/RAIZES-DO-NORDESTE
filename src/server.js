const express = require('express');
const swaggerUi = require("swagger-ui-express")
const swaggerSpec = require("./configs/swagger")
const AppError = require('./utils/AppError');
const routes = require('./api/routes/index');

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(routes);

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }

  console.error(error)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))