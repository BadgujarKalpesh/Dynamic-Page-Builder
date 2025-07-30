Dynamic Page Builder - MERN Stack Project
This is a full-stack web application built with the MERN (MongoDB, Express.js, React, Node.js) stack. It serves as a powerful Content Management System (CMS) where an administrator can dynamically create and configure entire application pages directly from a user interface, without writing any code.

The system allows an Admin to define data models (pages), their fields, validation rules, and UI properties. These configurations instantly generate fully functional interfaces with forms, data tables, search, and statistics, which are then available to both Admin and User roles.

Screenshots
(You can replace these placeholder links with your actual screenshots)

Dynamic Data Table & Page Controls:
![Main application interface showing the dynamic data table, search, and admin controls.](https://placehold.co/800x450/4f46e5/ffffff?text=Main%20Dashboard%20Screenshot)

Inline Page & Field Editing:
![Admin editing the fields of a dynamic page.](https://placehold.co/800x400/10b981/ffffff?text=Field%20Editor%20Screenshot)

Dynamic "Add New Item" Form:
![Modal form for adding a new item with dynamically generated fields.](https://placehold.co/600x400/ef4444/ffffff?text=Dynamic%20Form%20Screenshot)

Features Explained
This project is a complete implementation of the dynamic page builder concept, with a focus on providing extensive control to the administrator.

1. Role-Based Access Control (RBAC)
The application supports two distinct roles, Admin and User, with different permissions. A simple dropdown in the UI allows for easy switching between roles to test the functionality.

Admin: Has complete control over the application. Can create, edit, and delete pages and their entire structure.

User: Can view the pages created by the Admin and perform standard data operations (Create, Read, Update, Delete) on the records within those pages.

2. Fully Dynamic Page Management (Admin)
Admins have the power to modify every aspect of a page's core properties, even after creation.

Create New Pages: A dedicated dashboard to create a new page by simply providing a name and description.

Edit Page Properties: Admins can edit the Page Name, Description, the user-facing URL Route, and even the underlying Database Table Name directly from the UI. The backend is robust enough to handle renaming the database collection automatically.

Delete Pages: Admins can permanently delete a page and all of its associated data.

3. Dynamic Field & Schema Configuration (Admin)
This is the core of the application. Admins can visually build the data schema for each page.

Add/Remove Fields: Add or remove any number of fields to a page's structure at any time.

Multiple Field Types: The system supports a wide range of data types, including text, textarea, number, date, email, checkbox, and select (Foreign Key).

Relational Data with Foreign Keys (FK): Create powerful relationships between pages. By setting a field's type to select (FK), an Admin can link it to another page's data. This automatically renders a dropdown in the form, populated with live data from the referenced page, ensuring data integrity.

Database Indexing: For performance, Admins can mark a field to be indexed in the database. This significantly speeds up search operations. Once an index is created, the option is disabled to prevent accidental changes.

UI Behavior Toggles: Admins can specify if a field should be required, used for searching, or included in statistical calculations.

4. Advanced Validation & Customization (Admin)
Admins can enforce strict data quality and customize the user experience.

Validation Rules: A simple JSON editor allows Admins to define advanced validation rules like minimum/maximum length for text, min/max values for numbers, and even custom regular expressions.

Custom Messages: Admins can define custom success and failure messages for form submissions.

UI Helpers: Set placeholder text and descriptive tooltips for each field to guide users.

5. Dynamic UI for All Users
The frontend is built to be 100% dynamic, rendering its components based on the Admin's configuration.

Real-time Sidebar: The main navigation sidebar automatically updates for all users whenever a page is created, edited, or deleted.

Dynamic Data Tables: Data is displayed in a clean, paginated table. The columns in the table are generated directly from the page's field configuration.

Dynamic Forms: The "Add New" and "Edit" forms are generated on the fly, rendering the correct input type for each field and enforcing all validation rules defined by the Admin.

Dynamic Statistics: A dashboard view on each page shows key statistics (sum, average, total records) for any fields the Admin has marked for inclusion.

Technology Stack
This project is built using the MERN stack and other modern web technologies.

Backend:

Node.js & Express.js: For building the RESTful API.

MongoDB: NoSQL database for flexible data storage.

Mongoose: For data modeling, schema validation, and interacting with MongoDB.

Frontend:

React.js: For building the client-side user interface.

React Router: For handling navigation and routing.

Axios: For making API requests to the backend.

Lucide React & react-toastify: For icons and notifications.

Standard CSS: The project is styled with a custom, modern CSS stylesheet, ensuring a clean look without the need for complex build configurations.

Setup and Installation
Follow these steps to run the project on your local machine.

Prerequisites
Node.js (v14 or later)

npm (Node Package Manager)

MongoDB (running locally or a connection string from a service like MongoDB Atlas)

1. Backend Setup
# 1. Navigate into the server directory
cd server

# 2. Install dependencies
npm install

# 3. Create a .env file in the /server directory and add your variables:
#    MONGO_URI=your_mongodb_connection_string
#    PORT=5001

# 4. Start the backend server
npm start

The server will be running on http://localhost:5001.

2. Frontend Setup
# 1. Open a new terminal and navigate into the client directory
cd client

# 2. Install dependencies
npm install

# 3. Create a .env file in the /client directory and add the API URL:
#    REACT_APP_API_URL=http://localhost:5001/api

# 4. Start the frontend development server
npm start

The application will automatically open in your browser at http://localhost:3000.
