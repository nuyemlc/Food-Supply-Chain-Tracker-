# Food Supply Chain Tracker

This is a full-stack web application built as a final year project to promote sustainability and transparency within the food supply chain. It allows users to track the origins of food products, compare their carbon emissions, browse by category, and contribute user reviews. The system is designed to raise awareness of where food comes from and its environmental impact.

## Project Overview

The application provides the following core features:

- Secure user registration and login, with session handling and password hashing
- An interactive world map showing the origin of food products using Leaflet.js
- A live comparison tool to view and compare CO₂ emissions between products using Chart.js
- A product listing view divided into four main categories (Meats, Starch, Dairy, Vegetables & Fruits)
- A user reviews section with a form to submit feedback and ideas
- A live search bar that allows users to search for food items and instantly view their full details in a popup modal

## Technologies Used

### Frontend:
- HTML, CSS, Bootstrap
- JavaScript (Vanilla)
- Leaflet.js (for maps)
- Chart.js (for emissions charts)

### Backend:
- Node.js with Express.js
- MySQL (accessed via mysql2 with async/await)
- bcrypt.js (for password hashing)
- express-session (for handling user sessions)

## Database

The backend uses a MySQL database with two primary tables:

- `users`: Stores user information such as name, email, and hashed password
- `foods`: Stores product details such as name, category, origin country, carbon emissions, transport method, and coordinates (used for the map)

## How to Run This Project

To run the project locally:

1. Ensure MySQL is installed and running
2. Import the provided database schema into MySQL
3. Create a `.env` file in the `Backend/` folder with the following:

