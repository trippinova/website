const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware
app.use(express.static(__dirname));
app.use(express.json());

// Views file path
const viewsFilePath = path.join(__dirname, 'views.json');

// Initialize views file if it doesn't exist
if (!fs.existsSync(viewsFilePath)) {
    fs.writeFileSync(viewsFilePath, JSON.stringify({ totalViews: 0, uniqueIPs: [] }));
}

// Get views count
app.get('/api/views', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(viewsFilePath));
        res.json({ views: data.totalViews });
    } catch (error) {
        console.error('Error reading views:', error);
        res.status(500).json({ error: 'Failed to get views' });
    }
});

// Increment views
app.post('/api/views', (req, res) => {
    try {
        const clientIP = req.ip;
        const data = JSON.parse(fs.readFileSync(viewsFilePath));
        
        if (!data.uniqueIPs.includes(clientIP)) {
            data.totalViews++;
            data.uniqueIPs.push(clientIP);
            fs.writeFileSync(viewsFilePath, JSON.stringify(data));
        }
        
        res.json({ views: data.totalViews });
    } catch (error) {
        console.error('Error updating views:', error);
        res.status(500).json({ error: 'Failed to update views' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 