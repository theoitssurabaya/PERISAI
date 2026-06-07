 # PERISAI (Non-Communicable Disease Risk Prediction)

PERISAI is a Fullstack Web Application system based on Artificial Intelligence (AI) designed to analyze lifestyle and patient medical records to predict the risk of 3 major Non-Communicable Diseases (NCDs): **Diabetes, Hypertension (HighBP), and High Cholesterol (HighChol)**.

This system is driven by a custom Deep Learning model (TensorFlow/Keras) trained using a Functional API architecture, Custom Layers, and a Custom Loss Function (BCE + 10x MAE) to generate highly precise probability levels based on real data (BRFSS Dataset). Equipped with a Generative AI assistant for interactive medical consultation.

---

## 🏗️ Project Architecture & Deployment

This project has a Production-Ready status and is deployed using a modern Microservices architecture distributed decentrally across three different Cloud platforms to ensure scalability and workload isolation.

### 1. Frontend UI (Vercel)
- **Tech Stack**: React, Vite, and TailwindCSS.
- **Role**: Provides the visual interface (Dashboard, AI Prediction Form, Daily Habit Log, Interactive Chatbot).
- **Live URL**: [https://perisai-ptm.vercel.app/](https://perisai-ptm.vercel.app/)

### 2. Backend API (Railway)
- **Tech Stack**: Node.js, Express, and PostgreSQL.
- **Role**: Handles User management (JWT Authentication), Habit Log storage, and acts as an API Gateway bridging the Frontend with the AI Microservice. Autonomously calculates Historical Moving Average (last 7 days average) before sending data to the AI.
- **Live URL**: `https://perisai.up.railway.app`

### 3. AI Microservice (Hugging Face Spaces)
- **Tech Stack**: Python, FastAPI, TensorFlow, Google Gemini API, Docker.
- **Role**: High-performance server dedicated exclusively to running Deep Learning model inference (`perisai_model_production.keras`) and processing Generative AI responses in real-time. Isolated using a Docker Container.
- **Live URL**: [https://huggingface.co/spaces/hilmyinaja/perisai-ai-api](https://huggingface.co/spaces/hilmyinaja/perisai-ai-api)

---

## 📂 Unified Repository Structure (Monorepo)
- `/ai_engineer`: The heart of Data Science. Contains Jupyter Notebooks for model training, Class Imbalance visualization, TensorBoard logs, and FastAPI API source code.
- `/Fullstack/Frontend`: Source code for the web user interface.
- `/Fullstack/Backend`: Source code for Node.js server logic and database management.
- `/data`: Storage for raw and cleaned datasets (BRFSS CDC).

---

## 🚀 How to Run the Project (Local Development)

You need to run all three services simultaneously in different terminals if you want to run this application locally.

### Prerequisites:
- Python 3.10+
- Node.js 18+
- PostgreSQL Server

### Step 0: Clone the Repository
Open a terminal and download the source code from GitHub:
    ```bash
    git clone https://github.com/hilmyinaja/Data-Analysis-Penyakit-Tidak-Menular.git
    cd Data-Analysis-Penyakit-Tidak-Menular
    ```

### Step 1: Database & Backend Setup (Node.js)
1. Open a terminal and navigate to the Backend directory:
    ```bash
    cd Fullstack/Backend
    ```
2. Install the required libraries:
    ```bash
    npm install
    ```
3. Create a `.env` file inside the `Backend` folder containing your PostgreSQL URL, for example:
    ```env
    DATABASE_URL=postgres://postgres:your_password@localhost:5432/perisai_db
    PORT=5000
    JWT_SECRET=super_safe_secret_123
    ML_SERVICE_URL=http://127.0.0.1:8001/api/v1
    AI_SERVICE_URL=http://127.0.0.1:8001/api/v1
    AI_CHAT_URL=http://127.0.0.1:8001
    ```
4. Migrate the tables to the database:
    ```bash
    npm run migrate
    ```
5. Run the Backend server:
    ```bash
    npm run dev
    ```

### Step 2: Set Up Python Environment
1. Open a terminal in the **root folder** of the project.
2. Create and activate a virtual environment:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```
3. Install all dependencies:
    ```bash
    pip install -r requirements.txt
    ```

### Step 3: Run AI Microservice (FastAPI)
1. Open a **new** terminal (make sure venv is active) and navigate to the AI API directory:
    ```bash
    cd ai_engineer/perisai_api
    ```
2. Create an `.env` file in that folder and fill it with your Google API Key:
    ```env
    GEMINI_API_KEY=YOUR_SECRET_KEY
    ```
3. Run the FastAPI server:
    ```bash
    uvicorn perisai_api:app --port 8001 --reload
    ```

### Step 4: Run Frontend (React UI)
1. Open a **new** terminal and navigate to the Frontend directory:
    ```bash
    cd Fullstack/Frontend
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file containing the Node.js Backend address:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
4. Start the web interface:
    ```bash
    npm run dev
    ```
5. Open the local link that appears (usually `http://localhost:5173`) in your browser.

---
*This project is an industry-level demonstration of the intersection of Data Science, Machine Learning Engineering, and Modern Web Software Engineering (Fullstack Development).*
