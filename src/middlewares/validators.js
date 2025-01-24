const Joi = require('joi');

// User Validation
exports.validateUserCreation = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role_id: Joi.number().integer().required(),
});

// Workshop Validation
exports.validateWorkshopCreation = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
  location: Joi.string().max(200).required(),
});

// Activity Validation
exports.validateActivityCreation = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500),
  scheduled_time: Joi.date().required(),
});

// Enrollment Validation
exports.validateEnrollment = Joi.object({
  workshopId: Joi.number().integer().required(),
});

// Notification Preferences Validation
exports.validateNotificationPreference = Joi.object({
  opt_in: Joi.boolean().required(),
});

