const express = require('express');
const path = require('path');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle API requests from the client-side for chatbot
app.post('/generate-answer', async (req, res) => {
    const question = req.body.question;

    try {
        const response = await axios({
            url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCWw9rvMg_ju49UCzpxWNXyGf9WWdvVRt0`, // Replace with your actual API key
            method: 'post',
            data: {
                contents: [{ parts: [{ text: question }] }],
            },
        });

        const answer = response.data.candidates[0].content.parts[0].text;
        res.json({ answer });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong!' });
    }
});

// Handle image upload and recognition
app.post('/upload-image', upload.single('image'), async (req, res) => {
    const imagePath = req.file.path;

    try {
        // Load the pre-trained MobileNet model
        const model = await mobilenet.load();

        // Read and preprocess the image
        const imageBuffer = fs.readFileSync(imagePath);
        const tfimage = tf.node.decodeImage(imageBuffer);

        // Make predictions
        const predictions = await model.classify(tfimage);

        // Extract labels from predictions
        const labels = predictions.map(prediction => prediction.className);

        // Generate descriptive answers based on recognized objects
        const descriptionPromises = labels.map(async (label) => {
            const question = `Tell me more about ${label}`;
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyCWw9rvMg_ju49UCzpxWNXyGf9WWdvVRt0`, // Replace with your actual API key
                method: 'post',
                data: {
                    contents: [{ parts: [{ text: question }] }],
                },
            });
            return {
                label,
                description: response.data.candidates[0].content.parts[0].text,
            };
        });

        const descriptions = await Promise.all(descriptionPromises);

        // Clean up uploaded file
        fs.unlinkSync(imagePath);

        res.json({ results: descriptions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Image recognition failed!' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
