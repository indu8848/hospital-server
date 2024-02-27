const express = require('express');
const morgan = require('morgan');
const fs = require('fs').promises;

const app = express();
const PORT = 3030;

// Middleware for logging HTTP requests
app.use(morgan('dev'));

// Middleware for JSON parsing
app.use(express.json());

// Load hospitals data from JSON file
let hospitals = [];
const loadHospitals = async () => {
  try {
    const data = await fs.readFile('hospitals.json');
    hospitals = JSON.parse(data);
  } catch (error) {
    console.error('Error loading hospitals data:', error);
  }
};
loadHospitals();

// Save hospitals data to JSON file
const saveHospitals = async () => {
  try {
    await fs.writeFile('hospitals.json', JSON.stringify(hospitals, null, 2));
  } catch (error) {
    console.error('Error saving hospitals data:', error);
  }
};

// GET all hospitals
app.get('/hospitals', (req, res) => {
  res.json(hospitals);
});

// GET a specific hospital
app.get('/hospitals/:name', (req, res) => {
  const hospital = hospitals.find(h => h.name === req.params.name);
  if (!hospital) {
    return res.status(404).json({ error: 'Hospital not found' });
  }
  res.json(hospital);
});

// POST a new hospital
app.post('/hospitals', (req, res) => {
  const newHospital = req.body;
  hospitals.push(newHospital);
  saveHospitals();
  res.status(201).json(newHospital);
});

// PUT update a hospital
app.put('/hospitals/:name', (req, res) => {
  const hospitalIndex = hospitals.findIndex(h => h.name === req.params.name);
  if (hospitalIndex === -1) {
    return res.status(404).json({ error: 'Hospital not found' });
  }
  hospitals[hospitalIndex] = req.body;
  saveHospitals();
  res.json(hospitals[hospitalIndex]);
});

// DELETE a hospital
app.delete('/hospitals/:name', (req, res) => {
  hospitals = hospitals.filter(h => h.name !== req.params.name);
  saveHospitals();
  res.status(204).end();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
