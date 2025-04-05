const express = require('express');
const path = require('path');
const app = express();
const { PORT } = require('./js/settings');
const { BookToWhatsapp } = require('./js/services');


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route for HTML files (optional)
app.get('/', (req, res) => {
    res.render('index', {title: "Home Page"});
});

// Serve ALL static files (including nested images) from all directories
app.use(express.static(path.join(__dirname))); // Serves everything!

app.get('/fast-track-service', (req, res) => {
    const submitted = req.query.submitted === 'true';
    res.render('fast_track_service', {title: "Airport & Concierge Services", submitted});
});

app.post('/fast-track-service', (req, res) => {
    const formData = req.body;

    const message = `
        🚀 *New Booking Request*
        👤 *Name:* ${formData["full-name"]}
        🌍 *Nationality:* ${formData.nationality}
        📱 *Phone (WhatsApp):* ${formData["phone-number"]}
        👫 *Gender:* ${formData.gender}
        📝 *Note:* ${formData["extra-note"] || "N/A"}
        🎯 *Service Type:* ${formData["service-type"] || "Not specified"}`;

    BookToWhatsapp(message); // Send to WhatsApp

    res.redirect('/fast-track-service?submitted=true');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
