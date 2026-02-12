# AI Data Usage & Study Roadmap

## 1. Does Groq Read User Data?
**Yes.** The app sends specific user performance data to the Groq API to generate personalized study plans.

### Data Sent to Groq:
- **`user.mcqHistory`**: Your past test scores and topic performance.
- **`user.usageHistory`**: Recently studied topics (to avoid repetition or suggest revision).
- **Class Level & Board**: To tailor content (e.g., CBSE/BSEB).

## 2. Scanning for Weak Topics
**Yes.** The system automatically identifies "Weak Topics" before sending data to Groq.
- **Logic:** Any topic where the user scores **less than 50%** is marked as WEAK.
- **Top 5 Weak Areas:** The system selects up to 5 of these weak topics to prioritize in the study plan.

## 3. "Next Day Plan" (Daily Roadmap)
**Yes, Groq generates a daily plan.**
- **Trigger:** When you open the app, if no plan exists for the current date, the system calls `generateStudyRoadmap`.
- **Output:** A JSON object containing 3-4 specific tasks:
  - **Review Weak Topics:** Tasks to revise topics where you scored low.
  - **New Topic:** Suggests the next logical chapter to study.
  - **MCQ Practice:** Recommends a test to take.
  - **Motivation:** A short motivational message for the day.

### Example Plan Structure:
```json
{
  "tasks": [
    {
      "type": "READ",
      "title": "Chemical Reactions (Weak Area)",
      "reason": "You scored 33% last time."
    },
    {
      "type": "MCQ",
      "title": "Acids, Bases and Salts",
      "reason": "Start new topic."
    }
  ],
  "motivation": "Consistency is key! Let's improve your Chemistry score today."
}
```

## Summary
The "Topic Breakdown" you see in the app (Red/Green bars) is calculated from the same data that Groq uses. Groq "sees" this breakdown (specifically the weak parts) and uses it to tell you what to study next.
