const express = require('express');
const stripe = require('stripe')('sk_live_XXXXXX'); // Mets ta clé secrète Stripe ici
const app = express();
const cors = require('cors');

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
            name: 'Convoyage de véhicule',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://tonsite.com/success.html',
      cancel_url: 'https://tonsite.com/cancel.html',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur Stripe' });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Serveur en écoute sur le port ${PORT}`));
