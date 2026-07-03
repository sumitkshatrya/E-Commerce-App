const supportKnowledge = [
  {
    id: 'account-login',
    category: 'account',
    tags: ['login', 'password', 'account', 'signin', 'signup', 'otp'],
    title: {
      en: 'Account access and login help',
      hi: 'अकाउंट एक्सेस और लॉगिन सहायता',
    },
    content: {
      en: `If you cannot log in, first confirm that your email address is correct and that your password uses the latest version you created.

1. Use the Forgot Password flow from the login screen.
2. Check spam or promotions folders for verification emails.
3. Try signing in again after resetting the password.
4. If the account still fails, share the exact error so support can investigate.`,
      hi: `अगर आप लॉगिन नहीं कर पा रहे हैं, तो पहले ईमेल और पासवर्ड सही होने की पुष्टि करें।

1. लॉगिन स्क्रीन से Forgot Password इस्तेमाल करें।
2. Verification email के लिए spam या promotions फ़ोल्डर देखें।
3. पासवर्ड रीसेट के बाद फिर से लॉगिन करें।
4. फिर भी समस्या हो तो exact error साझा करें ताकि support जांच कर सके।`,
    },
    suggestions: {
      en: ['I forgot my password', 'My verification email never arrived', 'Login says invalid credentials'],
      hi: ['मैं पासवर्ड भूल गया हूँ', 'मुझे verification email नहीं मिली', 'लॉगिन पर invalid credentials आ रहा है'],
    },
  },
  {
    id: 'orders-tracking',
    category: 'orders',
    tags: ['order', 'tracking', 'delivery', 'shipment', 'where is my order'],
    title: {
      en: 'Order tracking and delivery help',
      hi: 'ऑर्डर ट्रैकिंग और डिलीवरी सहायता',
    },
    content: {
      en: `Order updates appear in your Orders page after checkout. Typical statuses are Order Placed, Packing, Shipped, Out for delivery, and Delivered.

For tracking help:
1. Open your Orders page.
2. Match the order date and items.
3. If the shipment looks delayed, ask support with your order ID so we can review it securely.`,
      hi: `Checkout के बाद आपके Orders page में order updates दिखती हैं। सामान्य statuses हैं Order Placed, Packing, Shipped, Out for delivery, और Delivered।

Tracking के लिए:
1. Orders page खोलें।
2. Order date और items match करें।
3. Delay लगने पर order ID के साथ support से पूछें।`,
    },
    suggestions: {
      en: ['Where is my order?', 'Show my latest order status', 'My package is delayed'],
      hi: ['मेरा ऑर्डर कहाँ है?', 'मेरे latest order का status बताओ', 'मेरा package delay हो रहा है'],
    },
  },
  {
    id: 'payments-troubleshooting',
    category: 'payments',
    tags: ['payment', 'failed payment', 'upi', 'card', 'wallet', 'razorpay', 'stripe', 'cod'],
    title: {
      en: 'Payment troubleshooting',
      hi: 'पेमेंट ट्रबलशूटिंग',
    },
    content: {
      en: `If a payment fails:

1. Confirm the payment method used.
2. Check whether the amount was debited.
3. Wait a few minutes before retrying, especially for UPI and bank redirects.
4. Use a different payment method if the gateway timed out.
5. If money was debited but the order was not created, create a support ticket with the payment time and method.`,
      hi: `अगर payment fail हो गई है:

1. इस्तेमाल किया गया payment method confirm करें।
2. देखें कि amount debit हुआ या नहीं।
3. UPI या bank redirect के बाद कुछ मिनट इंतज़ार करें।
4. Gateway timeout होने पर दूसरा payment method आज़माएँ।
5. पैसा कट गया लेकिन order नहीं बना तो ticket create करें।`,
    },
    suggestions: {
      en: ['My payment failed', 'Money was deducted but order not placed', 'Razorpay payment pending'],
      hi: ['मेरी payment fail हो गई', 'पैसा कट गया लेकिन order नहीं बना', 'Razorpay payment pending है'],
    },
  },
  {
    id: 'returns-refunds',
    category: 'orders',
    tags: ['return', 'refund', 'cancel', 'exchange'],
    title: {
      en: 'Returns, cancellations, and refunds',
      hi: 'रिटर्न, कैंसिलेशन और रिफंड',
    },
    content: {
      en: `Returns and refunds depend on order status.

1. If the order has not shipped, cancellation is usually easier.
2. If it has already shipped, request a return after delivery.
3. Refund timelines depend on the original payment method.
4. Share your order ID and reason if you want a support ticket created.`,
      hi: `Return और refund order status पर निर्भर करते हैं।

1. Order ship नहीं हुआ है तो cancellation आसान रहता है।
2. Ship हो चुका है तो delivery के बाद return request करें।
3. Refund timing payment method पर depend करती है।
4. Ticket बनवाने के लिए order ID और reason साझा करें।`,
    },
    suggestions: {
      en: ['I want to cancel my order', 'How do refunds work?', 'Can I exchange a size?'],
      hi: ['मुझे order cancel करना है', 'Refund कैसे काम करता है?', 'क्या size exchange हो सकता है?'],
    },
  },
  {
    id: 'cart-checkout',
    category: 'shopping',
    tags: ['cart', 'checkout', 'coupon', 'address', 'delivery'],
    title: {
      en: 'Cart and checkout guidance',
      hi: 'कार्ट और checkout मार्गदर्शन',
    },
    content: {
      en: `For smooth checkout:

1. Select the correct size before adding to cart.
2. Review quantities in the cart page.
3. Fill the delivery form completely.
4. Choose Stripe, Razorpay, or Cash on Delivery where available.
5. If checkout redirects unexpectedly, sign in again and retry.`,
      hi: `Smooth checkout के लिए:

1. Add to cart से पहले सही size चुनें।
2. Cart page में quantity check करें।
3. Delivery form पूरा भरें।
4. उपलब्ध होने पर Stripe, Razorpay, या Cash on Delivery चुनें।
5. Unexpected redirect होने पर फिर से sign in करें।`,
    },
    suggestions: {
      en: ['How do I checkout?', 'Why can’t I add to cart?', 'Do you support Cash on Delivery?'],
      hi: ['Checkout कैसे करूँ?', 'मैं cart में add क्यों नहीं कर पा रहा?', 'क्या COD उपलब्ध है?'],
    },
  },
]

const tokenize = (value = '') =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\u0900-\u097f\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)

export const searchKnowledge = (query = '', locale = 'en') => {
  const queryTokens = tokenize(query)

  const scored = supportKnowledge
    .map((article) => {
      const haystack = tokenize(
        `${article.category} ${article.tags.join(' ')} ${article.title[locale] || article.title.en} ${
          article.content[locale] || article.content.en
        }`
      )

      const score = queryTokens.reduce((total, token) => {
        if (haystack.includes(token)) {
          return total + 2
        }

        return total
      }, 0)

      return { ...article, score }
    })
    .filter((article) => article.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, 3)
}

export default supportKnowledge
