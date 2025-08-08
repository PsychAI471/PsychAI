# PsychAI - Advanced AI-Powered Mental Wellness Platform

PsychAI is a comprehensive mental health and psychology assistant that provides 24/7 support, personalized care, and evidence-based therapeutic interventions through advanced AI technology.

## 🚀 Features

### 🤖 Advanced AI Therapy
- **Professional Therapeutic AI** with advanced reasoning capabilities
- **Chain of Thought, Tree of Thoughts, and Self-Consistency** reasoning
- **Adaptive conversation flow** that reduces questions as conversations deepen
- **Context-aware responses** that build on previous conversations
- **Professional therapeutic language** without validation pressure
- **Throttling system** to prevent overwhelming users
- **Journaling prompts** for deeper reflection

### 📊 Analytics & Insights Dashboard
- **Real-time mood tracking** with 1-10 scale and notes
- **Mood trend visualization** over time
- **Session analytics** including duration and message count
- **Progress tracking** with key metrics
- **Personalized insights** based on conversation patterns
- **Wellness score calculation** and trend analysis

### 🧠 Advanced AI Features
- **Emotion Detection** from conversation analysis
- **Cognitive Bias Detection** (Catastrophizing, All-or-Nothing Thinking, Mind Reading)
- **Pattern Recognition** for recurring themes and triggers
- **Personalized Insights** with actionable recommendations
- **Sentiment Analysis** and emotional intelligence scoring

### 💬 Enhanced Chat Experience
- **Session duration tracking** with real-time updates
- **Message count monitoring** for engagement insights
- **Professional therapeutic interface** with calming design
- **Responsive design** for all devices
- **Accessibility features** for inclusive use

### 🔐 Security & Privacy
- **End-to-end encryption** for all conversations
- **Supabase authentication** with secure user management
- **Data privacy controls** and user consent
- **HIPAA-compliant** data handling practices

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Groq AI API
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI/ML**: Groq LLM with advanced reasoning techniques
- **Deployment**: Vercel

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/psych-ai.git
   cd psych-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_service_key
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the migration file: `supabase/migrations/20250724121142_init_chat_tables.sql`
   - This creates tables for users, chat sessions, messages, journal entries, mood entries, and session analytics

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

### Core Tables
- **users**: User profiles and authentication data
- **chat_sessions**: Individual therapy sessions
- **chat_messages**: All conversation messages with AI
- **journal_entries**: User reflection and journaling
- **mood_entries**: Daily mood tracking with scores and notes
- **session_analytics**: Session duration and engagement metrics

## 🎯 Key Features Explained

### Advanced AI Reasoning
The AI uses three advanced reasoning techniques:
1. **Chain of Thought**: Step-by-step logical analysis
2. **Tree of Thoughts**: Multiple perspective consideration
3. **Self-Consistency**: Validation against conversation context

### Adaptive Conversation Flow
- **Early conversations** (1-3 messages): Focus on problem identification
- **Mid conversations** (4-8 messages): Balanced insights and support
- **Deep conversations** (9+ messages): Primarily supportive insights

### Analytics Dashboard
- **Mood Tracking**: Daily mood scores with trend visualization
- **Session Analytics**: Duration, message count, and engagement metrics
- **Progress Insights**: Personalized recommendations and growth tracking
- **Pattern Recognition**: Identification of recurring themes and triggers

## 🚀 Deployment

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Set up environment variables** in Vercel dashboard

3. **Configure Supabase** for production

## 🔧 Configuration

### AI Model Configuration
The system uses Groq's Llama3-70b-8192 model with:
- Streaming responses for real-time interaction
- Context window of 8 messages for conversation history
- Adaptive system prompts based on conversation depth

### Analytics Configuration
- Session data is automatically tracked
- Mood entries are stored with timestamps
- Analytics are calculated in real-time

## 📈 Usage Analytics

The platform tracks:
- **Session duration** and frequency
- **Message count** and engagement
- **Mood trends** over time
- **User progress** and patterns
- **Feature usage** and preferences

## 🔒 Privacy & Security

- All data is encrypted in transit and at rest
- User authentication through Supabase Auth
- GDPR and HIPAA compliant data handling
- User control over data retention and deletion

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@psychai.com or create an issue in the GitHub repository.

## 🏥 Medical Disclaimer

PsychAI is designed to provide mental wellness support and is not a replacement for professional medical or psychiatric care. Always consult with qualified healthcare providers for medical advice and treatment.

---

**Built with ❤️ for mental wellness**
