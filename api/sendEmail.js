const nodemailer = require("nodemailer");

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Méthode non autorisée. Utilisez POST." });
    }

    const { fullname, email, phone } = req.body;

    if (!fullname || !email || !phone) {
        return res.status(400).json({ error: "Tous les champs (nom complet, email, téléphone) sont requis." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Configure email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
            subject: "Nouvelle soumission de formulaire",
            text: `Vous avez une nouvelle soumission depuis votre page de destination :\n\nNom complet : ${fullname}\nEmail : ${email}\nTéléphone : ${phone}`,
            html: `
                <h1>Nouvelle soumission de formulaire</h1>
                <p><strong>Nom complet :</strong> ${fullname}</p>
                <p><strong>Email :</strong> ${email}</p>
                <p><strong>Téléphone :</strong> ${phone}</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email envoyé avec succès !" });
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error);
        return res.status(500).json({ error: "Échec de l'envoi de l'email." });
    }
}
