
# AlpenWegs – Explorers Module Documentation

## Overview

The **Explorers** module defines the dynamic, user-driven part of the AlpenWegs platform.
It models *official predefined trails* (Routes & Sections) and *real-world user activity*
(Tracks & Journeys), plus the *planned structure* (Trips) that sits between them.

This document summaries all core models, their roles, and how they interact.

## 1. Core Concepts

### **Section**

Smallest atomic trail component with GPX geometry, start/end PoIs, optional intermediate PoIs,
regions, photos, sport category, and difficulty metadata.

### **Route**

Ordered collection of Sections forming a complete official trail.

### **Trip**

A *planned*, multi‑day itinerary made from Routes.  
A conceptual blueprint (no GPX recording).

### **Track**

A user-recorded GPS activity (hiking, biking, skiing, running, fastpacking, etc.).  
Contains statistics, weather, environment, group dynamics, and safety metadata.

### **Journey**

A real multi-day experience built from Tracks.  
May reference a predefined Trip.

## 2. Relationship Diagram

```
Trip (planned)
 └── TripToRoute ──> Route (official)
                       └── SectionToRoute ──> Section
                                                   ├── SectionToPoi
                                                   ├── SectionToRegion
                                                   └── SectionToPhoto

Journey (executed)
 └── Track (GPS user activity)
        └── optional → Route (reference)
```

## 3. Separation of Concepts

| Concept | Purpose | Contains GPX? | User Generated? |
|--------|---------|---------------|------------------|
| Section | Atomic official segment | Yes | No |
| Route | Ordered official path | Via Sections | No |
| Trip | Planned multi-day path | No | No |
| Track | User GPX activity | Yes | Yes |
| Journey | Multi-day real activity | No | Yes |

## 4. Model Summaries

### **SectionModel**

- Defines a minimal, well‑structured trail segment  
- Has start_poi and end_poi  
- Contains intermediate PoIs (sorted via SectionToPoiModel)  
- Linked to photos and regions  
- Included in Routes  
- GPX geometry stored in BaseGpxModel  

### **RouteModel**

- Composed of ordered Sections  
- Represents official trails, curated or predefined  
- Used in Trips  
- Supports multi-user route comparisons  

### **TripModel**

- High-level planned itinerary  
- Contains ordered Routes (via TripToRouteModel)  
- Provides structure, pacing, difficulty expectation  
- Includes planned accommodation type  
- No GPS recordings  

### **TrackModel**

- Real GPX activity: hiking, biking, trail running, ski touring, etc.  
- Optional association to Route (did the user follow an official path?)  
- Part of a Journey  
- Contains rich environmental metadata:  
  - snow, rain, fog, night  
  - windy conditions  
  - training vs exploration  
  - group vs guided tour  
  - safety flags (injury, rescue, hazard)  

### **JourneyModel**

- Multi-day executed adventure  
- Contains multiple Tracks  
- Optional link to a Trip  
- Derived duration metadata (start_date, end_date, total_days)  
- Real accommodation used  

## 5. Design Strengths

### **Modularity**

Sections → Routes → Trips  
Tracks → Journeys  
Enables reuse and precise modelling.

### **Comparison Engine (planned)**

Tracks can be compared to Routes for:

- similarity index  
- deviation detection  
- performance analytics  

### **Consistency**

All multi-day models share a base:

- BaseMultiDayModel handles start_date, end_date, total_days  
- Trip uses it (planned)  
- Journey uses it (executed)  

## 6. Future Recommendations

### **1. Route-level start/end PoIs**

Optional caching for faster discovery pages.

### **2. Trip Stage Numbering**

Allow explicit day grouping for Routes.

### **3. Enhanced Journey Analytics**

Auto-aggregate:

- total ascent/descent  
- daily breakdown  
- accommodation statistics  

### **4. Automatic Track-to-Section Matching**

Improve similarity calculations.

## 7. Conclusion

The Explorers module establishes a robust foundation for modelling both *planned* and *executed* outdoor activities with deep structure, strong separation of concerns, and reusable building blocks.

The combination of **Sections, Routes, Trips, Tracks, and Journeys** creates a powerful ecosystem for outdoor exploration, analysis, and storytelling.

