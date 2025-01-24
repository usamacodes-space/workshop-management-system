const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Import Sequelize instance
const { sequelize } = require('./models'); // Import sequelize from models/index.js

// Import routes
const workshopRoutes = require('./routes/workshops_routes');
const userRoutes = require('./routes/users');
const roleRoutes = require('./routes/roles');
const activityRoutes = require('./routes/activities');
const enrollmentRoutes = require('./routes/enrollments');
const notificationRoutes = require('./routes/notifications');
const permissionRoutes = require('./routes/permissions');
const googleCalendarRoutes = require('./routes/googleCalendarRoutes');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app); // Create an HTTP server for socket.io
const io = socketIo(server); // Integrate Socket.io with the server

const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/workshops', workshopRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/activities', activityRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/notifications', notificationRoutes);
app.use('/permissions', permissionRoutes);
app.use('/google-calendar', googleCalendarRoutes);

// Function to check if tables exist
async function checkTablesExist() {
  const queryInterface = sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  return tables;
}

// Sync the database and check tables
checkTablesExist()
  .then((tables) => {
    if (tables.length > 0) {
      console.log('Tables already exist:', tables);
    } else {
      console.log('No tables found. Creating tables...');
      return sequelize.sync({ alter: true }).then(() => {
        console.log('Database & tables created!');
      });
    }
  })
  .catch((err) => {
    console.error('Error checking tables:', err);
  });

// Socket.io: Emit notifications to clients
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for notifications (could be triggered by actions like enrollment)
  socket.on('send_notification', (notificationData) => {
    // Send notification to the appropriate user (e.g., mentor or learner)
    socket.emit('receive_notification', notificationData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
