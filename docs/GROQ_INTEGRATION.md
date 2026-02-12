# Groq AI Integration Documentation

## Overview

This document details how Groq AI is integrated into the Student App to analyze user performance and generate personalized study plans.

## 1. Data Scanning & Analysis

The application scans user data primarily through the `User` object's history fields:
- `user.mcqHistory`: Stores results of all MCQ tests taken.
- `user.usageHistory`: Tracks content viewed (Videos, PDFs).

### Weak Topic Detection

The system identifies "Weak Topics" using two methods:

1. **Local Analysis (`utils/analysisUtils.ts`):**
   - Function: `generateLocalAnalysis`
   - Logic: Iterates through question results. If the percentage of correct answers for a topic is **< 50%**, it is flagged as a "Weak Topic".
   - Usage: Immediate feedback after a test.

2. **AI Roadmap Analysis (`services/groq.ts`):**
   - Function: `generateStudyRoadmap`
   - Logic: Scans `user.mcqHistory`.
   - Criteria: `(score / total) < 0.5` (Less than 50%).
   - Action: Collects top 5 weak topics to send to the AI model.

## 2. Next Day Plan (Daily Roadmap)

The "Next Day Plan" feature is implemented as the **Daily Study Roadmap**.

### Implementation Details
- **File:** `services/groq.ts`
- **Function:** `generateStudyRoadmap(user, subjects, modelName)`
- **Trigger:** `StudentDashboard.tsx` (on mount, once per day).
- **Condition:** `settings.isAiRoadmapEnabled` must be `true`.

### How it Works
1. **Data Collection:** The function retrieves the user's class, board, and list of weak topics.
2. **Prompt Generation:** A prompt is constructed:
   ```text
   You are an expert AI Study Planner.
   User Context:
   - Class: {class}
   - Weak Topics: {weakTopics}
   - Recently Studied: {recentActivity}

   TASK: Create a personalized "Today's Goal" roadmap...
   ```
3. **AI Generation:** The prompt is sent to Groq API (using `llama-3.1-8b-instant` by default).
4. **Response:** The AI returns a JSON object containing:
   - `tasks`: A list of tasks (READ/MCQ) targeting weak areas.
   - `motivation`: A motivational quote.
5. **Persistence:** The roadmap is saved to `user.dailyRoadmap` and displayed on the Dashboard.

## 3. Configuration

- **Enable/Disable:** Controlled via `SystemSettings.isAiRoadmapEnabled`.
- **Model:** Default is `llama-3.1-8b-instant`, configurable via `settings.aiModel`.

## 4. AI Monitoring & History

The AI "watches" your activity by reading the system logs stored in your profile:
- **What it sees:**
  - `MCQ Results`: Every test you submit, including scores and time taken.
  - `Content Views`: Every video watched or PDF opened (tracked in `user.usageHistory`).
  - `Study Time`: Daily active time on the app.
- **Where is it stored?** All history is saved locally and synced to the cloud database. You can view your full history in the **History Tab**.

## 5. Premium Subscription & AI

The AI respects your subscription status:
- **Premium Access:** If you have an active subscription (Weekly, Monthly, Lifetime), the AI can recommend and generate Premium content (Deep Dive Notes, Advanced MCQs).
- **Expiry:** As soon as your subscription ends (`subscriptionEndDate` passes), the system immediately revokes Premium access.
  - The AI will stop suggesting Premium-only content.
  - You will lose access to previously unlocked Premium features unless renewed.
  - Your history remains safe, but you cannot open Premium items from it until you subscribe again.

## Summary for Users
- **Does it scan data?** Yes, it reads test history and usage logs to personalize your experience.
- **Does it know weak topics?** Yes, it calculates them based on scores < 50%.
- **Can it make a plan?** Yes, it generates a daily "Today's Goal" plan based on your weak areas.
- **Does history monitoring work?** Yes, all major actions (Tests, Views) are recorded and visible in History.
- **Does premium expire immediately?** Yes, the system checks every minute. Once expired, premium access is revoked instantly.
