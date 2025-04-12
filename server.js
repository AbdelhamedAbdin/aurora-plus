const express = require('express');
const path = require('path');
const app = express();
const { PORT, USER_PROFESSIONAL_EMAIL, PASS_PROFESSIONAL_EMAIL } = require('./js/settings');
const { BookToWhatsapp } = require('./js/services');
const fs = require('fs');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');


app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route for HTML files (optional)
app.get('/', (req, res) => {
    res.render('index', {title: "Home Page"});
});

// Serve ALL static files (including nested images) from all directories
app.use(express.static(path.join(__dirname))); // Serves everything!

// fast-track service APIs
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

// Get the List of Nationalities
app.get('/api/nationalities', (req, res) => {
    const filePath = path.join(__dirname, './load_data/nationality.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Could not load nationality list' });
        }
        const nationalities = JSON.parse(data);
        res.json(nationalities);
    });
});

// Accommodation APIs
app.get("/accommodation", (req, res) => {
    const submitted = req.query.submitted === 'true';
    res.render('accommodation', {title: "Accommodation Service Page", submitted});
})

app.post('/accommodation', (req, res) => {
    const formData = req.body;

    // Check if service is Cairo-related (you can adjust this logic based on actual service name/id)
    const isCairo = formData["service-type"]?.toLowerCase().includes("cairo");
    const area = isCairo ? formData.area : null;

    const message = `
    🚀 *Accommodation Booking Request*
    👤 *Name:* ${formData["full-name"]}
    🌍 *Nationality:* ${formData.nationality}
    📱 *Phone (WhatsApp):* ${formData["phone-number"]}
    🧑‍🤝‍🧑 *Gender:* ${formData.gender}
    🛎️ *Check-In:* ${formData["check-in"]}
    🏁 *Check-Out:* ${formData["check-out"]}
    📍 *Hotel Area:* ${area || "N/A"}
    📝 *Note:* ${formData["extra-note"]?.trim() || "N/A"}
    🎯 *Service Type:* ${formData["service-type"] || "Not specified"}
        `.trim();

    BookToWhatsapp(message); // Uncomment this when ready to send
    res.redirect('/accommodation?submitted=true');
});

// About-us
app.get('/about-us', (req, res) => {
    res.render('about-us', {title: "About Aurora Plus"});
});

// contact-us
app.get('/contact-us', (req, res) => {
    const wrong_send = req.query.wrong_send === 'true';
    const submitted = req.query.submitted === 'true';
    res.render('contact-us', {title: "Contact Aurora Plus", wrong_send, submitted});
});

app.post('/contact-us', async (req, res) => {
    const { fullName, email, mobile, message } = req.body;

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.secureserver.net',
        port: 465,
        secure: true,
        auth: {
            user: USER_PROFESSIONAL_EMAIL,
            pass: PASS_PROFESSIONAL_EMAIL  // if using Gmail with 2FA, use app-specific password
        },
    });

    const mailOptions = {
    from: `"${fullName}" <${email}>`,
    to: 'support@aurora-plus.com',
    subject: `New Contact Message from ${fullName}`,
    html: `
        <h3>New Message from Contact Form</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile:</strong> ${mobile}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
    `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.redirect('/contact-us?submitted=true');
    } catch (error) {
        console.error('❌ Email sending failed:', error.response || error.message || error);
        res.redirect('/contact-us?wrong_send=true');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
