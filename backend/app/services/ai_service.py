import google.generativeai as genai
from app.core.config import settings
from typing import Optional
import json
import re

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

CATEGORIES = [
    "Infrastructure", "Water Supply", "Electricity", "Roads & Transport",
    "Sanitation", "Healthcare", "Education", "Law & Order", "Housing",
    "Environment", "Revenue", "Social Welfare", "Other"
]

DEPARTMENTS = [
    "Public Works", "Water Department", "Electricity Board",
    "Transport", "Municipal Corporation", "Health Department",
    "Education Department", "Police", "Housing Board", "Other"
]

async def classify_complaint(title: str, description: str) -> dict:
    """Use Gemini to classify a complaint into category, priority, department, and generate a summary."""
    if not settings.GEMINI_API_KEY:
        return {
            "category": "Other",
            "priority": "medium",
            "department": "Other",
            "summary": description[:200]
        }

    prompt = f"""Analyze this government grievance and respond with a valid JSON object only.

Title: {title}
Description: {description}

Return JSON with exactly these fields:
{{
  "category": "<one of {CATEGORIES}>",
  "priority": "<low|medium|high|critical>",
  "department": "<one of {DEPARTMENTS}>",
  "summary": "<concise 1-2 sentence summary>"
}}"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Extract JSON from markdown code blocks if present
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except Exception as e:
        print(f"AI classification error: {e}")

    return {
        "category": "Other",
        "priority": "medium",
        "department": "Other",
        "summary": description[:200]
    }

async def generate_summary(text: str) -> str:
    """Generate a concise summary using Gemini."""
    if not settings.GEMINI_API_KEY:
        return text[:200]
    try:
        response = model.generate_content(f"Summarize in 2 sentences:\n\n{text}")
        return response.text.strip()
    except:
        return text[:200]

async def chat_with_ai(message: str, context: str = "") -> str:
    """AI chatbot for grievance assistance."""
    if not settings.GEMINI_API_KEY:
        return "AI service is not configured. Please contact your administrator."
    
    system_prompt = """You are a helpful government grievance assistant for Arvix Labs.
Help citizens understand how to file complaints, track status, and get information about government services.
Be professional, empathetic, and concise."""

    full_prompt = f"{system_prompt}\n\nContext: {context}\n\nUser: {message}\n\nAssistant:"
    try:
        response = model.generate_content(full_prompt)
        return response.text.strip()
    except Exception as e:
        return f"I'm unable to process your request right now. Please try again later."

async def analyze_patterns(complaints_data: list) -> dict:
    """Analyze complaint patterns and generate insights."""
    if not settings.GEMINI_API_KEY or not complaints_data:
        return {"insights": [], "recommendations": []}
    
    data_str = json.dumps(complaints_data[:50], default=str)
    prompt = f"""Analyze these government complaints and provide insights:
{data_str}

Return JSON with:
{{
  "insights": ["insight1", "insight2", ...],
  "top_issues": ["issue1", "issue2", ...],
  "recommendations": ["rec1", "rec2", ...],
  "trend": "improving|worsening|stable"
}}"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        json_match = re.search(r'\{.*\}', text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except Exception as e:
        print(f"Pattern analysis error: {e}")
    
    return {"insights": [], "recommendations": [], "top_issues": [], "trend": "stable"}
