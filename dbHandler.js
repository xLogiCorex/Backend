const { Sequelize, DataTypes } = require("sequelize");
const dbHandler = new Sequelize('project', 'root', '', { host: '127.1.1.1', dialect: 'mysql' })

// Felhasználó tábla
exports.userTable = dbHandler.define('user', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('sales', 'admin'),
    allowNull: false,
    defaultValue: 'sales'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
})

// Termék tábla
exports.productTable = dbHandler.define('product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  subcategoryId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "db"
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  availableStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  minStockLevel: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
})

// Kategória tábla
exports.categoryTable = dbHandler.define('category', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

// Alkategória tábla
exports.subcategoryTable = dbHandler.define('subcategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

// Partner tábla
exports.partnerTable = dbHandler.define('partner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  taxNumber: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contactPerson: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
})

// Készletmozgás tábla
exports.stockMovementTable = dbHandler.define('stockmovement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('in', 'out', 'transfer'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  },
  movementNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transferReason: {
    type: DataTypes.STRING,
    allowNull: true,
  }
})

// Megrendelés Tábla
exports.orderTable = dbHandler.define('order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  orderNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  partnerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM(
      'new', 'confirmed', 'processing', 'completed', 'cancelled', 'on_hold'
    ),
    allowNull: false,
    defaultValue: 'new'
  },
  invoiceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  }
});

// Megrendelés tétel Tábla
exports.orderItemTable = dbHandler.define('orderitem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unitPrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
})

// Számla tábla
exports.invoiceTable = dbHandler.define('invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  partnerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  issueDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  totalNet: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalVAT: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  totalGross: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

// Napló tábla
exports.logTable = dbHandler.define('log', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  action: {
    type: DataTypes.ENUM('STOCK_IN', 'STOCK_OUT', 'STOCK_TRANSFER', 'LOGIN_SUCCESS', 'LOGIN_FAIL', 'USER_REGISTER', 'PRODUCT_CREATE', 'PRODUCT_UPDATE',
      'PARTNER_CREATE', 'PARTNER_UPDATE', 'ORDER_CREATE', 'ORDER_UPDATE', 'INVOICE_CREATE', 'INVOICE_UPDATE'),
    allowNull: false
  },
  targetType: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  targetId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payload: {
    type: DataTypes.JSON,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
});

exports.sequelize = dbHandler; 