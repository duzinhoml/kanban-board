import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';
import { UserFactory } from './user.js';
import { TicketFactory } from './ticket.js';

const dbUrl = process.env.DB_URL;
if (!dbUrl) {
  throw new Error('DB_URL environment variable is not defined');
}

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: {
    decimalNumbers: true,
    ssl: { // Add SSL/TLS configuration
      require: true, // This will force SSL/TLS to be used
      rejectUnauthorized: false, // For Render's self-signed certificates (may need to adjust based on Render's SSL setup)
    },
  },
});

const User = UserFactory(sequelize);
const Ticket = TicketFactory(sequelize);

User.hasMany(Ticket, { foreignKey: 'assignedUserId' });
Ticket.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignedUser'});

export { sequelize, User, Ticket };
