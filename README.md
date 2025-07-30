# Dynamic Page Builder - MERN Stack Project

This is a full-stack web application built with the MERN (MongoDB, Express.js, React, Node.js) stack. It serves as a powerful Content Management System (CMS) where an administrator can dynamically create and configure entire application pages directly from a user interface, without writing any code.

The system allows an Admin to define data models (pages), their fields, validation rules, and UI properties. These configurations instantly generate fully functional interfaces with forms, data tables, search, and statistics, which are then available to both Admin and User roles.

## Screenshot of project

### Admin Page creation 
<img width="1913" height="959" alt="Screenshot 2025-07-30 155713" src="https://github.com/user-attachments/assets/4545ec04-f1ad-4e9f-850f-d4b350ff7568" />

### Admin and User switch button
<img width="334" height="344" alt="Screenshot 2025-07-30 155731" src="https://github.com/user-attachments/assets/0ecb0dd6-91f1-4411-b355-b16db7c0ef47" />

### Admin can create fields 
<img width="1910" height="906" alt="Screenshot 2025-07-30 160510" src="https://github.com/user-attachments/assets/1fb46031-8046-42fe-8a84-919e86392942" />

### User can see all the fields and he can add also
<img width="1893" height="897" alt="Screenshot 2025-07-30 160310" src="https://github.com/user-attachments/assets/dfb21cff-98b2-4d79-bae8-3383d6290a2f" />

### New Item add button
<img width="1919" height="908" alt="Screenshot 2025-07-30 160323" src="https://github.com/user-attachments/assets/c0c1ba33-29bd-4fa1-8865-3a7058ae5371" />




# Features Explained

This project is a complete implementation of the dynamic page builder concept, with a focus on providing extensive control to the administrator.

### 1\. Role-Based Access Control (RBAC)

The application supports two distinct roles, Admin and User, with different permissions. A simple dropdown in the UI allows for easy switching between roles to test the functionality.

  * **Admin**: Has complete control over the application. Can create, edit, and delete pages and their entire structure.
  * **User**: Can view the pages created by the Admin and perform standard data operations (Create, Read, Update, Delete) on the records within those pages.

### 2\. Fully Dynamic Page Management (Admin)

Admins have the power to modify every aspect of a page's core properties, even after creation.

  * **Create New Pages**: A dedicated dashboard to create a new page by simply providing a name and description.
  * **Edit Page Properties**: Admins can edit the Page Name, Description, the user-facing URL Route, and even the underlying Database Table Name directly from the UI. The backend is robust enough to handle renaming the database collection automatically.
  * **Delete Pages**: Admins can permanently delete a page and all of its associated data.

### 3\. Dynamic Field & Schema Configuration (Admin)

This is the core of the application. Admins can visually build the data schema for each page.

  * **Add/Remove Fields**: Add or remove any number of fields to a page's structure at any time.
  * **Multiple Field Types**: The system supports a wide range of data types, including text, textarea, number, date, email, and checkbox.
  * **UI Behavior Toggles**: Admins can specify if a field should be required, used for searching, or included in statistical calculations.

### 4\. Advanced Validation & Customization (Admin)

Admins can enforce strict data quality and customize the user experience.
  * **UI Helpers**: Set placeholder text and descriptive tooltips for each field to guide users.

### 5\. Dynamic UI for All Users

The frontend is built to be 100% dynamic, rendering its components based on the Admin's configuration.

  * **Real-time Sidebar**: The main navigation sidebar automatically updates for all users whenever a page is created, edited, or deleted.
  * **Dynamic Data Tables**: Data is displayed in a clean, paginated table. The columns in the table are generated directly from the page's field configuration.
  * **Dynamic Forms**: The "Add New" and "Edit" forms are generated on the fly, rendering the correct input type for each field and enforcing all validation rules defined by the Admin.
  * **Dynamic Statistics**: A dashboard view on each page shows key statistics (sum, average, total records) for any fields the Admin has marked for inclusion.

# Technology Stack

This project is built using the MERN stack and other modern web technologies.

### Backend:

  * **Node.js & Express.js**: For building the RESTful API.
  * **MongoDB**: NoSQL database for flexible data storage.
  * **Mongoose**: For data modeling, schema validation, and interacting with MongoDB.

### Frontend:

  * **React.js**: For building the client-side user interface.
  * **React Router**: For handling navigation and routing.


### 1\. Backend Setup

```bash
# 1. Navigate into the server directory
cd server

# 2. Install dependencies
npm install

# 3. Create a .env file in the /server directory and add your variables:
#    MONGO_URI=your_mongodb_connection_string
#    PORT=5001

# 4. Start the backend server
npm start
```

The server will be running on http://localhost:5001.

### 2\. Frontend Setup

```bash
# 1. Open a new terminal and navigate into the client directory
cd client

# 2. Install dependencies
npm install

# 3. Create a .env file in the /client directory and add the API URL:
#    REACT_APP_API_URL=http://localhost:5001/api

# 4. Start the frontend development server
npm start
```

The application will automatically open in your browser at http://localhost:3000.
