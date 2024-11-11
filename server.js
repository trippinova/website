const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Add this to store views
const viewsFile = 'views.json';

// Initialize views if file doesn't exist
if (!fs.existsSync(viewsFile)) {
    fs.writeFileSync(viewsFile, JSON.stringify({ totalViews: 0, uniqueIPs: [] }));
}

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(__dirname));

// Endpoint to get view count
app.get('/api/views', (req, res) => {
    const data = JSON.parse(fs.readFileSync(viewsFile));
    res.json({ views: data.totalViews });
});

// Endpoint to increment views
app.post('/api/views', (req, res) => {
    const clientIP = req.ip;
    const data = JSON.parse(fs.readFileSync(viewsFile));
    
    if (!data.uniqueIPs.includes(clientIP)) {
        data.totalViews++;
        data.uniqueIPs.push(clientIP);
        fs.writeFileSync(viewsFile, JSON.stringify(data));
    }
    
    res.json({ views: data.totalViews });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 