import httpx
import datetime
from app.core.config import settings
from supabase import Client

# ── Base HTML layout for emails (Dark Brutalism Editorial) ──────────────────
def get_base_html(title: str, content: str) -> str:
    year = datetime.datetime.now().year
    return f"""
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>{title}</title>
    </head>
    <body style="background-color: #0A0A0A; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px 10px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td align="center">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 600px; background-color: #1A1A1A; border: 1px solid #FFFFFF; padding: 40px; box-sizing: border-box;">
              <!-- Header -->
              <tr>
                <td align="center" style="border-bottom: 1px solid #333333; padding-bottom: 24px;">
                  <div style="font-size: 24px; font-weight: 900; letter-spacing: 0.15em; text-transform: uppercase; color: #FFFFFF;">
                    CALEN<span style="color: #FF2D2D;">·</span>DESIGN
                  </div>
                  <div style="font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #FF2D2D; margin-top: 12px;">
                    {title}
                  </div>
                </td>
              </tr>
              <!-- Body Content -->
              <tr>
                <td style="padding: 32px 0; font-size: 14px; line-height: 1.8; color: #CCCCCC; text-align: left;">
                  {content}
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td align="center" style="border-top: 1px solid #333333; padding-top: 24px; font-size: 10px; color: #777777; letter-spacing: 0.08em; text-transform: uppercase;">
                  © {year} CALEN DESIGN · DTS·DOG AGENCY
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

# ── Fetch Full Order Details for Templates ──────────────────────────────────
def fetch_order_details_for_email(db: Client, order_id: str) -> dict:
    res = db.table("orders").select("*, order_items(*)").eq("id", order_id).execute()
    if not res.data:
        return None
    order = res.data[0]
    
    detailed_items = []
    for item in order["order_items"]:
        v_res = db.table("variants").select("*, products(name)").eq("id", item["variant_id"]).execute()
        if v_res.data:
            v_data = v_res.data[0]
            detailed_items.append({
                "product_name": v_data["products"]["name"],
                "size": v_data["size"],
                "color": v_data["color"],
                "quantity": item["quantity"],
                "unit_price": item["unit_price"]
            })
    order["detailed_items"] = detailed_items
    return order

# ── Templates HTML Builders ────────────────────────────────────────────────
def get_order_created_template(order: dict) -> str:
    items_html = ""
    for item in order.get("detailed_items", []):
        subtotal = item["quantity"] * item["unit_price"]
        items_html += f"""
        <tr>
          <td style="padding: 8px 0; color: #FFFFFF; font-weight: bold; font-size: 13px; text-transform: uppercase;">
            {item['product_name']} (T: {item['size']} · C: {item['color']}) x{item['quantity']}
          </td>
          <td align="right" style="padding: 8px 0; color: #FFFFFF; font-weight: 900; font-size: 13px;">
            ${subtotal:,.2f}
          </td>
        </tr>
        """
    
    shipping_cost = float(order['shipping_address'].get('shipping_cost', 0))
    total_items = float(order['total'])
    grand_total = total_items + shipping_cost

    content = f"""
    <p style="margin: 0 0 16px 0;">Hola <strong>{order['shipping_address'].get('name', 'Cliente')}</strong>,</p>
    <p style="margin: 0 0 24px 0;">¡Gracias por tu compra en Calen Design! Tu pedido <strong>#{order['id'][:8].upper()}</strong> ha sido registrado con éxito.</p>
    
    <p style="margin: 0 0 8px 0; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.05em; font-size: 12px;">Resumen de tu Pedido:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #333333; border-bottom: 1px solid #333333; padding: 12px 0; margin-bottom: 24px;">
      {items_html}
      <tr>
        <td style="padding: 8px 0; color: #999999; font-size: 13px;">Costo de Envío</td>
        <td align="right" style="padding: 8px 0; color: #FFFFFF; font-size: 13px;">${shipping_cost:,.2f}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0 0 0; color: #FFFFFF; font-weight: 900; font-size: 14px;">TOTAL</td>
        <td align="right" style="padding: 12px 0 0 0; color: #C8FF00; font-weight: 900; font-size: 18px;">
          ${grand_total:,.2f}
        </td>
      </tr>
    </table>

    <div style="background-color: #0A0A0A; border: 1px solid #333333; padding: 16px; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-weight: bold; color: #FFFFFF; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">Dirección de Envío:</p>
      <p style="margin: 0; font-size: 13px; color: #AAAAAA; line-height: 1.5;">
        {order['shipping_address'].get('address', '')}<br/>
        {order['shipping_address'].get('city', '')} (CP: {order['shipping_address'].get('zip_code', '')})<br/>
        Teléfono: {order['shipping_address'].get('phone', '')}
      </p>
    </div>

    <p style="margin: 0; font-size: 13px;">Tu pedido se mantendrá en estado <strong>PENDIENTE DE PAGO</strong> hasta recibir la confirmación de la pasarela de pagos (Mercado Pago).</p>
    """
    return get_base_html("Confirmación de Compra", content)

def get_payment_approved_template(order: dict) -> str:
    content = f"""
    <p style="margin: 0 0 16px 0;">Hola <strong>{order['shipping_address'].get('name', 'Cliente')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #C8FF00; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">¡TU PAGO HA SIDO APROBADO!</p>
    <p style="margin: 0 0 24px 0;">Confirmamos la acreditación del pago para tu pedido <strong>#{order['id'][:8].upper()}</strong>.</p>
    <p style="margin: 0; line-height: 1.8;">Nuestro taller ya comenzó a preparar tus prendas. En cuanto despachemos el paquete, te enviaremos otro correo electrónico con el código de seguimiento para que puedas rastrear su estado.</p>
    """
    return get_base_html("Pago Aprobado", content)

def get_order_shipped_template(order: dict, carrier: str, tracking_number: str) -> str:
    track_url = "https://www.correoargentino.com.ar/formularios/ondnc/index.php" if "correo" in carrier.lower() else "#"
    content = f"""
    <p style="margin: 0 0 16px 0;">Hola <strong>{order['shipping_address'].get('name', 'Cliente')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #C8FF00; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">¡TU PEDIDO HA SIDO DESPACHADO!</p>
    <p style="margin: 0 0 24px 0;">Tu paquete ya está en viaje en manos de <strong>{carrier}</strong>.</p>
    
    <div style="background-color: #0A0A0A; border: 1px solid #333333; padding: 24px; text-align: center; margin-bottom: 24px;">
      <p style="margin: 0 0 8px 0; font-size: 11px; color: #999999; text-transform: uppercase; letter-spacing: 0.1em;">Código de seguimiento:</p>
      <p style="margin: 0 0 20px 0; font-size: 22px; font-weight: 900; color: #FFFFFF; letter-spacing: 0.05em;">{tracking_number}</p>
      {f'<a href="{track_url}" target="_blank" style="display: inline-block; background-color: #FFFFFF; color: #000000; padding: 12px 24px; text-decoration: none; font-weight: 900; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;">SEGUIR ENVÍO →</a>' if track_url != "#" else ""}
    </div>
    <p style="margin: 0; font-size: 13px;">Si ya cargamos tu etiqueta, recordá que los transportistas pueden demorar hasta 24 hs hábiles en impactar los primeros movimientos del paquete.</p>
    """
    return get_base_html("Pedido Despachado", content)

def get_order_delivered_template(order: dict) -> str:
    content = f"""
    <p style="margin: 0 0 16px 0;">Hola <strong>{order['shipping_address'].get('name', 'Cliente')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #C8FF00; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">¡PEDIDO ENTREGADO CON ÉXITO!</p>
    <p style="margin: 0 0 24px 0;">Confirmamos que el pedido <strong>#{order['id'][:8].upper()}</strong> ha sido entregado en tu dirección.</p>
    <p style="margin: 0;">Esperamos que disfrutes tu compra. Si tenés alguna consulta, no dudes en escribirnos por WhatsApp.</p>
    """
    return get_base_html("Pedido Entregado", content)

def get_order_cancelled_template(order: dict) -> str:
    content = f"""
    <p style="margin: 0 0 16px 0;">Hola <strong>{order['shipping_address'].get('name', 'Cliente')}</strong>,</p>
    <p style="margin: 0 0 16px 0; font-size: 16px; color: #FF2D2D; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">TU PEDIDO HA SIDO CANCELADO</p>
    <p style="margin: 0 0 24px 0;">Te informamos que tu pedido <strong>#{order['id'][:8].upper()}</strong> ha sido cancelado en nuestro sistema.</p>
    <p style="margin: 0;">Si realizaste algún pago, nuestro equipo de soporte se pondrá en contacto a la brevedad para realizar el reembolso correspondiente.</p>
    """
    return get_base_html("Pedido Cancelado", content)


# ── Mail Sending Main Engine (Resend API client) ────────────────────────────
async def send_transactional_email(to_email: str, subject: str, html_content: str):
    # Fallback to console simulation if Resend API key is not configured
    if not settings.RESEND_API_KEY or settings.RESEND_API_KEY == "your_resend_api_key":
        print(f"\n=======================================================")
        print(f"[MOCK EMAIL SENDER]")
        print(f"From: {settings.EMAIL_FROM}")
        print(f"To: {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: (HTML content of length {len(html_content)})")
        print(f"=======================================================\n")
        return True

    payload = {
        "from": settings.EMAIL_FROM,
        "to": [to_email],
        "subject": subject,
        "html": html_content
    }

    headers = {
        "Authorization": f"Bearer {settings.RESEND_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.resend.com/emails",
                json=payload,
                headers=headers,
                timeout=10.0
            )
        
        if response.status_code == 200 or response.status_code == 201:
            print(f"[*] Email enviado con éxito a {to_email} (Resend ID: {response.json().get('id')})")
            return True
        else:
            print(f"[!] Fallo al enviar email a {to_email} vía Resend: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"[!] Error de conexión enviando email a {to_email}: {str(e)}")
        return False
