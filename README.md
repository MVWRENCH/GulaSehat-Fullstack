# Gula Sehat

Gula Sehat is a web application designed to help users track their blood glucose levels and receive food and activity recommendations. It features a Golang backend and utilizes the Gemini AI API to provide personalized recommendations for a healthier lifestyle. Users can also purchase food items directly from the recommendations.

## Features
- **Glucose Tracking**: Easily log and monitor your blood glucose levels.
- **Food Recommendations**: Get tailored suggestions based on your glucose data and dietary preferences.
- **Activity Recommendations**: Receive activity suggestions to help manage your glucose levels.
- **Food Purchase**: Buy recommended food directly through the app with secure online payment.
- **User Authentication**: Secure user accounts to protect personal health data.
- **Responsive Design**: Optimized for mobile and desktop use.

## Technology Stack
- **Backend**: Golang
- **Frontend**: (Add your frontend technology if applicable)
- **API**: Gemini AI API for recommendations
- **Database**: (Add your database, e.g., PostgreSQL, MySQL, etc.)
- **Payment Gateway**: (Add your payment provider, e.g., Stripe, PayPal, etc.)

## Getting Started

### Prerequisites
- Go 1.XX or higher
- (Database software, e.g., MySQL/PostgreSQL)
- Gemini AI API Key
- Payment Gateway API Key (e.g., Stripe, PayPal)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gula-sehat.git
   cd gula-sehat
   ```

2. Install dependencies:
   ```bash
   go mod tidy
   ```

3. Set up environment variables (e.g., API keys, database credentials, payment gateway):
   ```bash
   export GEMINI_API_KEY=your_gemini_api_key
   export DB_HOST=your_db_host
   export DB_USER=your_db_user
   export DB_PASSWORD=your_db_password
   export PAYMENT_API_KEY=your_payment_api_key
   ```

4. Run the application:
   ```bash
   go run main.go
   ```

### Usage
- Visit `http://localhost:yourport` in your web browser.
- Register and log in to begin tracking your glucose levels.
- Access personalized food and activity recommendations based on your inputs.
- Select and purchase recommended food directly through the app using a secure payment process.

## API Endpoints
- **POST** `/api/v1/glucose` - Log glucose data.
- **GET** `/api/v1/recommendations/food` - Get food recommendations.
- **GET** `/api/v1/recommendations/activity` - Get activity recommendations.
- **POST** `/api/v1/purchase/food` - Purchase recommended food.

## Contributing
Contributions are welcome! Please fork this repository, create a new branch, and submit a pull request for review.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Gemini AI for providing the API used for recommendations.
