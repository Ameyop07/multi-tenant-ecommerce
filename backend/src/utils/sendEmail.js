import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Multi-Tenant Store" <no-reply@yourstore.com>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.warn("Skipping email dispatch (SMTP not configured or credentials invalid):", err.message);
  }
};

export const orderConfirmationTemplate = (order) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
    <h2>Thanks for your order!</h2>
    <p>Order ID: <strong>${order._id}</strong></p>
    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr>
          <th style="text-align:left; border-bottom:1px solid #ddd;">Item</th>
          <th style="text-align:right; border-bottom:1px solid #ddd;">Qty</th>
          <th style="text-align:right; border-bottom:1px solid #ddd;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${order.items
          .map(
            (item) => `
          <tr>
            <td style="padding:6px 0;">${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ""}</td>
            <td style="text-align:right;">${item.quantity}</td>
            <td style="text-align:right;">$${item.price.toFixed(2)}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <p style="text-align:right; font-size:18px;"><strong>Total: $${order.total.toFixed(2)}</strong></p>
  </div>
`;

export default sendEmail;
