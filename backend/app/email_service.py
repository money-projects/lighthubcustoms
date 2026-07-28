import boto3
from jinja2 import Template
from app.config import settings

ses = boto3.client("ses", region_name=settings.cognito_region)

RECEIPT_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; color: #111; max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: #111; color: #fff; padding: 24px; text-align: center; border-radius: 8px 8px 0 0; }
  .header h1 { margin: 0; font-size: 22px; letter-spacing: 1px; }
  .header p { margin: 4px 0 0; color: #aaa; font-size: 13px; }
  .body { border: 1px solid #e5e5e5; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; }
  .order-meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; color: #555; }
  table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  th { text-align: left; padding: 8px 0; border-bottom: 2px solid #111; font-size: 13px; }
  td { padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-size: 14px; }
  .totals { margin-top: 16px; }
  .totals tr td:last-child { text-align: right; }
  .totals .grand-total td { font-weight: bold; font-size: 16px; border-top: 2px solid #111; border-bottom: none; }
  .shipping { background: #f9f9f9; padding: 16px; border-radius: 6px; margin-top: 20px; font-size: 13px; }
  .shipping h3 { margin: 0 0 8px; font-size: 14px; }
  .footer { text-align: center; margin-top: 24px; font-size: 12px; color: #999; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 12px; background: #d1fae5; color: #065f46; }
</style>
</head>
<body>
  <div class="header">
    <h1>Radiant Motors</h1>
    <p>Order Receipt</p>
  </div>
  <div class="body">
    <div class="order-meta">
      <div><strong>Order ID:</strong> {{ order.order_id }}</div>
      <div><strong>Date:</strong> {{ order.created_at[:10] }}</div>
      <div><span class="badge">{{ order.payment_status | upper }}</span></div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th style="text-align:right">Price</th>
          <th style="text-align:right">Total</th>
        </tr>
      </thead>
      <tbody>
        {% for item in order.items %}
        <tr>
          <td>{{ item.name }}</td>
          <td>{{ item.quantity }}</td>
          <td style="text-align:right">KES {{ "{:,.0f}".format(item.price) }}</td>
          <td style="text-align:right">KES {{ "{:,.0f}".format(item.price * item.quantity) }}</td>
        </tr>
        {% endfor %}
      </tbody>
    </table>

    <table class="totals">
      <tr><td>Subtotal</td><td>KES {{ "{:,.0f}".format(order.subtotal) }}</td></tr>
      <tr><td>Shipping ({{ order.delivery_method }})</td><td>KES {{ "{:,.0f}".format(order.shipping) }}</td></tr>
      {% if order.discount %}
      <tr><td>Discount</td><td>- KES {{ "{:,.0f}".format(order.discount) }}</td></tr>
      {% endif %}
      <tr class="grand-total"><td>Total</td><td>KES {{ "{:,.0f}".format(order.total) }}</td></tr>
    </table>

    <div class="shipping">
      <h3>Delivery Details</h3>
      <p>{{ order.shipping_info.fullName }}<br>
      {{ order.shipping_info.phone }}<br>
      {{ order.shipping_info.address }}{% if order.shipping_info.apartment %}, {{ order.shipping_info.apartment }}{% endif %}<br>
      {{ order.shipping_info.city }}, {{ order.shipping_info.county }} {{ order.shipping_info.postalCode }}</p>
    </div>

    {% if order.order_notes %}
    <p style="margin-top:16px;font-size:13px;color:#555"><strong>Notes:</strong> {{ order.order_notes }}</p>
    {% endif %}
  </div>
  <div class="footer">
    <p>Thank you for shopping with Radiant Motors 🚗</p>
    <p>Questions? Contact us at support@radiantmotors.co.ke</p>
  </div>
</body>
</html>
"""

def send_receipt(to_email: str, order: dict, subject_prefix: str = "Order Confirmation"):
    try:
        html = Template(RECEIPT_TEMPLATE).render(order=order)
        ses.send_email(
            Source="noreply@radiantmotors.co.ke",
            Destination={"ToAddresses": [to_email]},
            Message={
                "Subject": {"Data": f"{subject_prefix} - {order['order_id']}"},
                "Body": {"Html": {"Data": html}},
            },
        )
        return True
    except Exception as e:
        print(f"Email send failed: {e}")
        return False
