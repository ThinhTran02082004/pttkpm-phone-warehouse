const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');

const env = require('./config/env');
const healthRoutes = require('./modules/health/health.routes');
const authRoutes = require('./modules/auth/auth.routes');
const roleRoutes = require('./modules/roles/roles.routes');
const employeeRoutes = require('./modules/employees/employees.routes');
const accountRoutes = require('./modules/accounts/accounts.routes');
const productAttributeRoutes = require('./modules/product-attributes/product-attributes.routes');
const productRoutes = require('./modules/products/products.routes');
const supplierRoutes = require('./modules/partners/suppliers.routes');
const customerRoutes = require('./modules/partners/customers.routes');
const importRoutes = require('./modules/warehouse/imports.routes');
const exportRoutes = require('./modules/warehouse/exports.routes');
const serviceRoutes = require('./modules/services/services.routes');
const statisticsRoutes = require('./modules/statistics/statistics.routes');
const notFound = require('./middlewares/not-found');
const errorHandler = require('./middlewares/error-handler');

const app = express();
const uploadRoot = path.resolve(process.cwd(), env.uploadDir);

fs.mkdirSync(uploadRoot, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/images', express.static(uploadRoot));

if (env.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/product-attributes', productAttributeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
