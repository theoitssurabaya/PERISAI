const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5001';
        
        // Forward the request to Python Microservice
        const response = await fetch(`${aiServiceUrl}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(req.body)
        });
        
        if (!response.ok) {
            const errData = await response.json().catch(() => ({}));
            return res.status(response.status).json({
                success: false,
                message: 'Error from AI service',
                error: errData
            });
        }
        
        const data = await response.json();
        return res.json(data);
    } catch (error) {
        console.error('Prediction API Error:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
