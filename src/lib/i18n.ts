import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Navigation
      "nav.home": "Home",
      "nav.search": "Search",
      "nav.ask": "Ask",
      "nav.activity": "Activity",
      "nav.profile": "Profile",
      "nav.trending": "Trending",
      "nav.unanswered": "Unanswered",

      // Hero
      "hero.title": "Ask anything. Get intelligent answers.",
      "hero.subtitle": "Pulse combines AI with community knowledge to deliver fast, reliable insights.",

      // Ask
      "ask.placeholder": "What do you want to know?",
      "ask.title": "Ask a Question",
      "ask.titleLabel": "Title",
      "ask.titlePlaceholder": "e.g. How does backpropagation work in neural networks?",
      "ask.descLabel": "Description (optional)",
      "ask.descPlaceholder": "Add more context to help AI and the community give better answers...",
      "ask.submit": "Post Question & Get AI Answer",
      "ask.submitting": "Posting...",
      "ask.minChars": "Title must be at least 10 characters.",
      "ask.profanityBlock": "Your question contains inappropriate language. Please rephrase.",
      "ask.profanityWarn": "Your question may contain strong language. It will still be posted.",
      "ask.success": "Question posted!",
      "ask.error": "Failed to post question.",
      "ask.aiPowered": "AI-Powered Answers",

      // Answers
      "answer.ai": "🤖 AI-generated answer",
      "answer.community": "👥 Community answer",
      "answer.yourAnswer": "Your Answer",
      "answer.placeholder": "Share your knowledge...",
      "answer.submit": "Submit Answer",
      "answer.submitting": "Submitting...",
      "answer.minChars": "Answer must be at least 10 characters.",
      "answer.success": "Answer submitted!",
      "answer.error": "Failed to submit answer.",
      "answer.newArrived_one": "🔔 {{count}} new answer arrived!",
      "answer.newArrived_other": "🔔 {{count}} new answers arrived!",

      // AI Status
      "ai.thinking": "Thinking…",
      "ai.analyzing": "Analyzing your question…",
      "ai.generating": "Generating answer…",
      "ai.analyzing_label": "Pulse AI is analyzing your question",
      "ai.failed": "AI took a break. Community answers will appear below.",
      "ai.retry": "Retry",

      // Feed
      "feed.forYou": "For You",
      "feed.trending": "Trending",
      "feed.empty": "No questions yet 👀",
      "feed.emptySubtext": "Be the first to ask!",
      "feed.tryAsking": "Try asking:",
      "feed.loadingMore": "Loading more...",
      "feed.endOfFeed": "You've seen it all 🎉",

      // Search
      "search.placeholder": "Search questions...",
      "search.noResults": "No questions found for",
      "search.askThis": "Ask this question",
      "search.hint": "Search for questions or topics...",

      // Activity
      "activity.title": "Recent Activity",
      "activity.empty": "Your activity will appear here.",
      "activity.emptySubtext": "Ask questions, submit answers, and upvote to see your history.",

      // Offline
      "offline.banner": "You're offline. Some features may be limited.",

      // Voting
      "vote.tooFast": "You're voting too fast. Please wait.",
      "vote.ariaLabel": "Upvote this answer. Current votes: {{count}}",

      // Report
      "report.button": "Report",
      "report.success": "Report submitted. Thank you.",
      "report.error": "Failed to submit report.",

      // Upload
      "upload.addImage": "Add image",
      "upload.maxSize": "Max 1MB per image",
      "upload.uploading": "Uploading...",
      "upload.error": "Failed to upload image.",

      // Time
      "time.justNow": "just now",
      "time.minutesAgo": "{{count}}m ago",
      "time.hoursAgo": "{{count}}h ago",
      "time.daysAgo": "{{count}}d ago",

      // General
      "general.back": "Back",
      "general.notFound": "Question not found.",
      "general.required": "*",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
