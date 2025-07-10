import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path, Image } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 12,
  },
  boldLabel: {
    fontWeight: 'bold',
  },
  itemHeader: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  itemRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    paddingVertical: 8,
    gap: 10,
  },
  image: {
    width: 60,
    height: 60,
    objectFit: 'fill',
    borderRadius: 4,
  },
  itemInfo: {
    flexGrow: 1,
  },
  itemLine: {
    marginBottom: 2,
  },
  itemRight: {
    textAlign: 'right',
    justifyContent: 'center',
  },
  totalsContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#999',
    paddingTop: 10,
  },
  totalText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

// Nike Swoosh Logo (SVG)
const NikeLogo = () => (
  <Svg viewBox="0 0 24 24" width="60" fill="black">
    <Path
      fill="currentColor"
      fillRule="evenodd"
      d="M21 8.719L7.836 14.303C6.74 14.768 5.818 15 5.075 15c-.836 0-1.445-.295-1.819-.884-.485-.76-.273-1.982.559-3.272.494-.754 1.122-1.446 1.734-2.108-.144.234-1.415 2.349-.025 3.345.275.2.666.298 1.147.298.386 0 .829-.063 1.316-.19L21 8.719z"
      clipRule="evenodd"
    />
  </Svg>
);

const OrderInvoice = ({ order }) => {
  const total = order.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shippingFee = Number(order.shipping_fee);
  const grandTotal = (total + shippingFee).toFixed(2);

  // Estimated Delivery
  const placedDate = new Date(order.created_at);
  let estimatedDelivery = '';

  if (order.delivery_option === 'express') {
    const start = new Date(placedDate);
    start.setDate(start.getDate() + 1);
    const end = new Date(placedDate);
    end.setDate(end.getDate() + 3);
    estimatedDelivery = `${start.toDateString()} - ${end.toDateString()}`;
  } else {
    const start = new Date(placedDate);
    start.setDate(start.getDate() + 5);
    const end = new Date(placedDate);
    end.setDate(end.getDate() + 7);
    estimatedDelivery = `${start.toDateString()} - ${end.toDateString()}`;
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <NikeLogo />
        </View>

        {/* Header */}
        <Text style={styles.header}>Invoice - Order {order.id}</Text>

        {/* Order Info */}
        <View style={styles.section}>
          <Text><Text style={styles.boldLabel}>Placed on:</Text> {new Date(order.created_at).toLocaleString()}</Text>
          <Text><Text style={styles.boldLabel}>Status:</Text> {order.status}</Text>
          <Text><Text style={styles.boldLabel}>Payment Method:</Text> {order.payment_method}</Text>
          <Text><Text style={styles.boldLabel}>Delivery Option:</Text> {order.delivery_option}</Text>
          <Text><Text style={styles.boldLabel}>Estimated Delivery:</Text> {estimatedDelivery}</Text>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.itemHeader}>Order Items</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Image src={item.product.productimage} style={styles.image} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemLine}>{item.product.productname}</Text>
                <Text style={styles.itemLine}>Size: {item.size || 'N/A'} | Color: {item.product.color || 'N/A'}</Text>
                <Text style={styles.itemLine}>Qty: {item.quantity}</Text>
              </View>
              <View style={styles.itemRight}>
                <Text>Price: ${Number(item.price).toFixed(2)}</Text>
                <Text>Subtotal: ${(Number(item.price) * item.quantity).toFixed(2)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsContainer}>
          <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
          <Text style={styles.totalText}>Shipping Fee: ${shippingFee.toFixed(2)}</Text>
          <Text style={styles.totalText}>Grand Total: ${grandTotal}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default OrderInvoice;
