from flask import Flask, render_template, jsonify, request
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from groq import Groq
import os

app = Flask(__name__, template_folder="templates", static_folder="static")

from dotenv import load_dotenv

load_dotenv()

GMAIL_USER     = os.environ.get("GMAIL_USER", "tarunji1322@gmail.com")
GMAIL_PASSWORD = os.environ.get("GMAIL_PASSWORD", "")
GROQ_API_KEY   = os.environ.get("GROQ_API_KEY", "")

TARUN_BIO = """You are an AI assistant on Tarun Saini's portfolio website. Be friendly and helpful.
Name: Tarun Saini. B.Tech CSE at LPU, CGPA 7.2.
Skills: Python, Flask, React.js, C++, ML, NLP, DSA, Node.js, SQL, Tailwind CSS.
Projects: AI Book Summarizer (Gemini API), CPU Scheduling Algorithm (live: cpu-scheduling-algorithm.onrender.com), Portfolio Website.
Achievements: Top 10% DSA Cipher Schools, Binary Blitz Hackathon Coding Ninjas.
Email: tarunji1322@gmail.com | GitHub: github.com/Tarun1322 | LinkedIn: linkedin.com/in/tarunsaini1322
Keep answers short 2-3 sentences. Only answer about Tarun."""

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/contact', methods=['POST'])
def handle_contact():
    try:
        name    = request.form.get('name', '').strip()
        email   = request.form.get('email', '').strip()
        subject = request.form.get('subject', '').strip()
        message = request.form.get('message', '').strip()
        if not all([name, email, subject, message]):
            return jsonify({"status": "error", "message": "All fields required!"}), 400
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"Portfolio: {subject}"
        msg['From'] = GMAIL_USER
        msg['To'] = GMAIL_USER
        html = f"<h2>From: {name}</h2><p>Email: {email}</p><p>Subject: {subject}</p><p>{message}</p>"
        msg.attach(MIMEText(html, 'html'))
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as s:
            s.login(GMAIL_USER, GMAIL_PASSWORD)
            s.sendmail(GMAIL_USER, GMAIL_USER, msg.as_string())
        return jsonify({"status": "success", "message": "Message sent!"})
    except Exception as e:
        print(f"[Contact Error] {e}")
        return jsonify({"status": "error", "message": "Error sending!"}), 500

@app.route('/api/chat', methods=['POST'])
def ai_chat():
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        if not message:
            return jsonify({"status": "error", "message": "Empty"}), 400
        client = Groq(api_key=GROQ_API_KEY)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": TARUN_BIO},
                {"role": "user", "content": message}
            ],
            max_tokens=200
        )
        reply = response.choices[0].message.content
        return jsonify({"status": "success", "reply": reply})
    except Exception as e:
        print(f"[Chat Error] {e}")
        return jsonify({"status": "error", "reply": "Sorry! Try again."}), 500

@app.route('/api/cover-letter', methods=['POST'])
def generate_cover_letter():
    try:
        data = request.get_json()
        job_title   = data.get('job_title', '').strip()
        company     = data.get('company', '').strip()
        description = data.get('description', '').strip()
        if not all([job_title, company]):
            return jsonify({"status": "error", "message": "Job title and company required!"}), 400
        client = Groq(api_key=GROQ_API_KEY)
        prompt = f"""Write a professional cover letter for Tarun Saini applying for {job_title} at {company}.
About Tarun: B.Tech CSE at LPU (CGPA 7.2). Skills: Python, Flask, React.js, C++, ML, NLP, DSA.
Projects: AI Book Summarizer, CPU Scheduling Simulator (live on Render), Portfolio Website.
Achievements: Top 10% DSA at Cipher Schools, Binary Blitz Hackathon.
Job Description: {description or 'Not provided'}
Write 3-4 paragraphs, under 350 words. Start: Dear Hiring Manager, End: Sincerely, Tarun Saini"""
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600
        )
        letter = response.choices[0].message.content
        return jsonify({"status": "success", "cover_letter": letter})
    except Exception as e:
        print(f"[CL Error] {e}")
        return jsonify({"status": "error", "message": "Failed!"}), 500

if __name__ == '__main__':
    app.run(debug=True)
