# Credit Scoring Admin Dashboard

A comprehensive admin dashboard application for financial companies to monitor user credit behavior and determine loan increment eligibility. Built with Next.js 16, React 19, and Azure AI Foundry integration.

## Features

### 📊 Dashboard Overview

- **Real-time Metrics**: View total users, average credit score, approval rates, and risk distribution
- **Credit Score Distribution**: Visual chart showing user distribution across credit score ranges
- **Recent Activity**: Timeline of recent credit events and recommendations
- **Top Risk Users**: Quick view of users requiring attention

### 👥 User Management

- **User List**: Comprehensive table with all users, credit scores, and status badges
- **User Detail View**: Detailed credit profile page with:
  - Credit score trends over time
  - Payment history visualization
  - Risk indicators and debt-to-income ratio gauge
  - Loan recommendations with reasoning
  - AI-powered insights and analysis

### 🤖 AI-Powered Features

- **AI Financial Assistant**: Chat interface for asking questions about credit scores, loans, and financial health
- **User-Specific AI Chat**: Ask questions about specific users' performance and get personalized insights
- **AI Credit Analysis**: Comprehensive analysis of user credit profiles
- **Financial Advice**: Personalized recommendations to improve credit health
- **Risk Explanation**: Plain-language explanations of risk factors
- **Credit Trend Prediction**: Forecast credit score trends over 6-12 months
- **Anomaly Detection**: Identify unusual patterns or potential concerns

### 📈 Visualizations

- **Credit Score Trends**: Area chart showing credit score history with reference lines
- **Payment History**: Bar chart displaying on-time, late, and missed payments
- **Risk Indicators**: Visual cards showing credit score, debt-to-income ratio, credit utilization, and payment history
- **Debt Ratio Gauge**: Circular progress indicator for debt-to-income ratio

### 📋 Loan Recommendations

- **Automated Recommendations**: AI-powered loan increment eligibility assessment
- **Recommendation Engine**: Status (approve/reject/conditional) with confidence scores
- **Risk Factors**: Detailed list of factors affecting recommendations
- **Reasoning**: Clear explanations for each recommendation

### 📄 AI-Powered Reports

- **Credit Score Analysis Report**: Comprehensive analysis of credit score trends and patterns
- **Risk Assessment Report**: Detailed risk analysis, default probability assessment, and mitigation strategies
- **Financial Action Report**: Actionable recommendations for financial decisions
- **Export Functionality**: Download reports for external use

### 🎨 Theming

- **Light/Dark Mode**: Full support for light and dark themes
- **System Theme**: Automatic theme detection based on system preferences
- **Theme Toggle**: Easy switching between themes via sidebar

## Technology Stack

- **Framework**: Next.js 16 (App Router) with React 19
- **UI Library**: shadcn UI (New York style)
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Data Generation**: Azure AI Foundry (OpenAI API)
- **Theme Management**: next-themes
- **TypeScript**: Full type safety
- **Date Handling**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Azure AI Foundry credentials (optional - fallback data generation available)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd creditscoring
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables (optional):
   Create a `.env.local` file in the root directory:

```env
AZURE_ENDPOINT=https://your-azure-endpoint.cognitiveservices.azure.com/openai/deployments/gpt-5-chat/chat/completions?api-version=2025-01-01-preview
AZURE_API_KEY=your-azure-api-key
```

**Note**: If environment variables are not set, the application will use default values and fallback data generation.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
creditscoring/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   ├── page.tsx            # Main dashboard overview
│   │   ├── users/
│   │   │   └── [id]/
│   │   │       └── page.tsx    # User detail page
│   │   ├── recommendations/    # Loan recommendations page
│   │   ├── reports/            # AI-powered reports page
│   │   └── settings/           # Settings page
│   ├── api/
│   │   ├── generate-data/      # Data generation endpoint
│   │   ├── ai/
│   │   │   ├── analyze/        # AI analysis endpoint
│   │   │   └── chat/           # AI chat endpoint
│   │   └── reports/
│   │       └── generate/       # Report generation endpoint
│   └── page.tsx                # Root page (redirects to dashboard)
├── components/
│   ├── ui/                     # shadcn UI components
│   └── dashboard/
│       ├── sidebar.tsx         # Navigation sidebar
│       ├── ai-chat.tsx         # AI chat assistant
│       ├── ai-insights.tsx      # User-specific AI insights
│       ├── portfolio-ai-insights.tsx  # Portfolio-level insights
│       ├── credit-score-chart.tsx     # Credit score visualization
│       ├── payment-history-chart.tsx  # Payment history chart
│       ├── risk-indicators.tsx         # Risk indicator cards
│       ├── debt-ratio-gauge.tsx        # Debt ratio visualization
│       ├── recommendation-card.tsx     # Loan recommendation card
│       ├── report-generator.tsx        # Report generation UI
│       └── ...                  # Other dashboard components
├── lib/
│   ├── azure-client.ts          # Azure AI Foundry client
│   ├── azure-ai-service.ts     # AI service functions
│   ├── report-generator.ts      # Report generation logic
│   ├── recommendations.ts       # Loan recommendation engine
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
└── package.json
```

## Usage

### Dashboard Overview

Navigate to `/dashboard` to see the main overview with key metrics, credit score distribution, recent activity, and top risk users.

### User Management

- View all users at `/dashboard/users`
- Click on any user to see their detailed profile at `/dashboard/users/[id]`
- Each user page includes charts, risk indicators, and AI-powered insights

### AI Assistant

- **Portfolio Level**: Use the AI chat on the main dashboard to ask general questions about the portfolio
- **User Specific**: On a user detail page, use the AI chat to ask questions about that specific user's performance

### Reports

Navigate to `/dashboard/reports` to generate:

- Credit Score Analysis Reports
- Risk Assessment Reports
- Financial Action Reports

Each report can be generated and downloaded as needed.

### Recommendations

View all loan recommendations at `/dashboard/recommendations` with filtering by status (approved, conditional, rejected).

## Development

### Build for Production

```bash
npm run build
```

### Run Linting

```bash
npm run lint
```

### Type Checking

```bash
npx tsc --noEmit
```

## Features in Detail

### Data Generation

The application uses Azure AI Foundry to generate realistic synthetic credit data. If the API is unavailable, it falls back to programmatically generated data.

### AI Integration

All AI features use Azure AI Foundry's OpenAI-compatible API for:

- Credit profile analysis
- Financial advice generation
- Risk factor explanations
- Credit trend predictions
- Anomaly detection
- Conversational chat assistance
- Report generation

### Responsive Design

The dashboard is fully responsive and works on:

- Desktop (full feature set)
- Tablet (optimized layout)
- Mobile (simplified navigation with mobile header)

## Environment Variables

| Variable         | Description                   | Required | Default                  |
| ---------------- | ----------------------------- | -------- | ------------------------ |
| `AZURE_ENDPOINT` | Azure AI Foundry endpoint URL | No       | Default endpoint in code |
| `AZURE_API_KEY`  | Azure AI Foundry API key      | No       | Default key in code      |

**Note**: For production, always use environment variables and never commit API keys to the repository.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is part of an assignment and is for educational/demonstration purposes.

## Support

For issues or questions, please open an issue in the repository.
