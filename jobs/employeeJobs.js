const logger = require("../utils/logger");

// Simulated welcome email job
// In a real app this would use nodemailer, SendGrid, etc.
async function sendWelcomeEmail(job) {
  const { name, department } = job.data;

  logger.info("Sending welcome email", { name, department });

  // Simulate email sending delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // In production this would be:
  // await emailService.send({
  //   to: "hr@company.com",
  //   subject: `New employee: ${name}`,
  //   body: `${name} has joined the ${department} department`
  // })

  logger.info("Welcome email sent", { name, department });
  return { success: true, recipient: "hr@company.com" };
}

// Simulated audit log job
async function logEmployeeDeleted(job) {
  const { employeeId, name, department } = job.data;

  logger.info("Writing audit log", { employeeId, name, department });

  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production this would write to an audit_logs collection in MongoDB
  // await AuditLog.create({
  //   action: "EMPLOYEE_DELETED",
  //   employeeId,
  //   timestamp: new Date()
  // })

  logger.info("Audit log written", { employeeId });
  return { success: true };
}

module.exports = { sendWelcomeEmail, logEmployeeDeleted };