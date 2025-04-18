# 📌 **Swapify: An E-commerce Platform for Buying and Selling Second-hand Products within College Community**

Swapify is a platform designed for college students to buy and sell second-hand products within their college community. Users can post products, browse listings, and manage transactions, making it easier to exchange items without leaving the campus.

---

## 🚀 **Features**

### **Functional Requirements**

- **User Authentication and Authorization:**
  - The system allows students to register and log in securely using JWT-based authentication. 
  - Role-based access ensures different permissions for admins and regular users, ensuring secure handling of user data and activity tracking.

- **Product Listing and Management:**
  - Users can post old/new products for sale by filling in a form with fields like product name, category, description, price, condition, and images.
  - Sellers can edit or delete their listings. Form validation ensures proper data is submitted.
  - Product listings are stored in MongoDB.

- **Product Search and Filtering:**
  - Buyers can search for products using keywords and apply filters such as price range, category, and location.
  - The backend handles dynamic queries to return accurate, real-time search results based on user preferences.

- **Admin Dashboard:**
  - An admin panel is implemented to manage users, monitor activity, handle reported listings, and maintain system hygiene.
  - Admins can view stats related to platform usage and take necessary actions.

---

## 🛠 **Tech Stack**

- **Languages:**
  - JavaScript, HTML, CSS, Tailwind CSS

- **Frontend:**
  - React.js (for reactive user interface development)

- **Backend:**
  - Express.js, Node.js (for REST API development and server-side logic)

- **Database:**
  - MongoDB

- **Image Storage:**
  - Cloudinary

- **IDE & Tools:**
  - IDE: Visual Studio Code
  - Version Control: Git, GitHub
  - Testing & Debugging: Postman, Chrome DevTools
  - Deployment: AWS CLI

---

## 🖥 **How to Run Frontend and Backend**

### **Backend:**
1. Navigate to the backend directory:
   ```bash
   cd Swapify-Ecommerce-Platform-Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the backend server:
   ```bash
   npm run dev
   ```

### **Frontend:**
1. Navigate to the frontend directory:
   ```bash
   cd trinity-pccoe
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend:
   ```bash
   npm run dev
   ```

---

---

## ⚠️ **Warning: Live Deployment Notice**

> This project is **actively deployed** on AWS and is being used in a **real-world scenario** within a college community.  
> Please do **not misuse** the platform or upload any inappropriate content.  
> All activity is logged, and inappropriate behavior may result in account removal or further action.  
> Respect the intent of this project — a safe, secure, and helpful exchange platform for students.
