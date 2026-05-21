# Somerva AI

Somerva AI is an intelligent somatic therapy and movement analysis system designed to support individuals experiencing fibromyalgia and chronic pain. It combines real time pose tracking, movement intelligence, and AI guided recommendations to help users understand their body responses during somatic exercises and build safer, more informed nervous system regulation habits.

---

# Project Background

Somerva AI originated from a long term exploration of how emotional wellbeing, stress physiology, and chronic pain intersect within modern urban lifestyles.

The initial concept began in 2021 with a system called UrChi, inspired by the idea of inner energy and holistic self regulation. At that stage, the focus was on building an AI companion capable of suggesting natural interventions such as breathing practices, meditation, and gentle movement to help users regain emotional balance.

In 2022, the first working prototype was developed and formally certified by Intel as part of a technology validation process. The system was also submitted to the MIT Solve Health and Pandemics Challenge, where it was positioned as a digital wellbeing assistant for stress related health decline.

Between 2023 and 2026, the project evolved through structured needfinding, surveys, and behavioral observation studies. A key insight emerged during this period. A significant number of individuals, especially those experiencing fibromyalgia and chronic pain conditions, were engaging in somatic or guided exercise content without any feedback mechanism to understand whether their movements were beneficial or potentially increasing strain.

This revealed a critical gap between instruction and embodied understanding.

Somerva AI was created to bridge this gap by introducing real time movement intelligence that can observe, interpret, and gently guide somatic practice based on measurable body signals.

---

# Problem Statement

Users practicing somatic exercises for chronic pain management often face three major challenges

Lack of feedback on movement quality  
No personalization based on physical condition or fatigue levels  
Over reliance on static video based guidance without adaptation  

This leads to inconsistent outcomes and in some cases unintended strain during recovery focused movement practices.

---

# Solution Overview

Somerva AI introduces a layered intelligence system that combines:

Real time pose estimation using MediaPipe  
Movement classification using lightweight machine learning logic  
AI driven exercise recommendation using Gemini API  
Session based analytics for progress tracking  

The system transforms somatic practice into an adaptive feedback loop rather than a passive instruction model.

---

# System Architecture

## High Level Flow

```

User Input
↓
Somatic Check In (Energy, Pain, Stress, Fatigue)
↓
Gemini Recommendation Engine
↓
Exercise Selection
↓
MediaPipe Pose Tracking
↓
ML Movement Classifier
↓
Real Time Feedback Engine
↓
Session Data Storage
↓
Reports Dashboard

```

---

## Architecture Diagram

```

Frontend (React UI)
│
├── Exercise System
├── Reports Dashboard
├── About System
│
↓
Backend API Layer
│
├── /api/recommend (Gemini AI)
├── Session Logger
├── Analytics Engine
│
↓
Intelligence Layer
│
├── MediaPipe Pose Landmarks
├── Movement Feature Extraction
├── ML Classifier (TensorFlow or heuristic model)
│
↓
Data Layer
├── Local Storage or lightweight DB
├── Session History Store

```

---

# Core Modules

## 1. Exercise Preview System

Each exercise includes a structured preview phase before tracking begins.

It contains:
Calming instructions  
Posture guidance  
Common mistakes  
Therapeutic intent  
Visual or video based demonstration  

This reduces cognitive overload and prepares the user for safe movement execution.

---

## 2. AI Recommendation Engine

The system uses a structured check in flow to capture:

Energy level  
Stress level  
Fatigue level  
Pain locations  
Emotional state  

This data is processed using Gemini AI to return:

Recommended exercise category  
Suggested intensity level  
Safety considerations  
Personalized reasoning  

---

## 3. Movement Intelligence Layer

MediaPipe pose landmarks are used to extract biomechanical features such as:

Shoulder symmetry  
Neck angle  
Motion smoothness  
Velocity stability  
Postural consistency  

These features feed into a lightweight classifier that outputs:

Movement state labels such as smooth, guarded, tense or asymmetrical  
Confidence score  
Real time corrective feedback  

---

## 4. Session Based Analytics Engine

Every completed session generates structured logs including:

Exercise type  
Duration  
Quality score  
Stability score  
User state inputs  
Movement classification history  

These logs power the “Your Reports” dashboard which visualizes:

Weekly consistency  
Progress trends  
Tension patterns  
Exercise adherence  

---

# Data Flow Example

```

User starts session
↓
Check in captured
↓
Gemini suggests exercise
↓
User performs movement
↓
MediaPipe tracks body
↓
ML model evaluates motion
↓
Feedback generated in real time
↓
Session saved for analytics

```

---

# Key Features

Real time somatic movement feedback  
AI based exercise personalization  
Fibromyalgia aware exercise categorization  
Session history based progress tracking  
Calming therapeutic UI design  
Adaptive recommendations based on fatigue and pain levels  

---

# Design Philosophy

The system is built on four core principles

Low cognitive load interaction  
Gentle therapeutic pacing  
Non diagnostic supportive feedback  
Stability over performance intensity  

The goal is to guide awareness rather than enforce correction.

---

# Technology Stack

Frontend  
React  
Framer Motion  
MediaPipe  

Backend  
Node.js  
Express style API routes  

AI Layer  
Gemini API  
Lightweight ML classifier logic  

Data  
Local storage or lightweight session persistence  

---

# Future Enhancements

Improved movement envelope modeling  
Expanded somatic exercise library  
Personalized nervous system adaptation tracking  
Deeper multimodal feedback using audio and vibration cues  
Clinical validation studies in partnership with health institutions  

---

# Disclaimer

Somerva AI is not a medical device and does not replace professional healthcare guidance. It is designed as a supportive somatic awareness tool for educational and wellness purposes.

---

# Project Vision

Somerva AI aims to shift somatic practice from passive instruction to active embodied intelligence, enabling users to better understand their nervous system responses through real time feedback and adaptive guidance.

---
```
