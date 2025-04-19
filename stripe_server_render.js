
const express = require('express');
const app = express();
const cors = require('cors');
const stripe = require('stripe')('sk_test_51RFLtGQ4TmkmK5u7W5rlil7ynUKNmoYWasOWvUKt3SskJutwScSS9OTJpujZrTMxWRnjAyYRq15vEs2CQXKiWpx0006t2OjGLA');

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Convoyage Formule ECO+'
          },
          unit_amount: Math.round(amount * 100)
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: 'https://www.convoyagecoraylon.fr/success',
      cancel_url: 'https://www.convoyagecoraylon.fr/cancel'
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
