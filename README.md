# AlpenWege

<p align="center">
  <img src="project/img/main_photo.png" alt="AlpenWege main photo" width="500">
</p>

## Installation

AlpenWege can be run locally for development or testing using Docker.  
The setup below uses a development environment with predefined service configurations.

## Docker installation

```bash
docker compose \
  --env-file .env.dev \
  -f docker-compose.yml \
  -f docker-compose.dev.yml \
  up --build
```
  
## Overview

AlpenWege is a comprehensive outdoor adventure application that supports users in planning, experiencing, and documenting various mountain activities in Switzerland, including hiking, biking, trail running, and camping. The application is built around five main components:

- **Profiles** – Manages user accounts, roles, settings, and personal achievements.
- **Assets** – Handles storage and organization of files such as images, GPX tracks, and documents.
- **Compendium** – Keeps a knowledge base with articles and information about Swiss nature, culture, and points of interest.
- **Events** – Allows users to create, join, and manage outdoor events like hikes or group rides.
- **Explorer** – Provides tools to discover, plan, and track routes for various outdoor activities.

### Activity Cycle:

- **Planning** – Users can plan both single-day and multi-day adventures for various outdoor activities. In AlpenWege, a trail represents the intended path between two geographic points (a starting point and an ending point of trip). A route is an actual instance of a trail completed by a user. Multiple trails and routes that share the same origin and endpoint form a path, allowing users to choose alternative options based on difficulty, scenery, or terrain type. This flexible structure allows each user to customize their journey according to their preferences and capabilities.

- **Preparation** – The app provides essential preparation tools, including integration with SBB timetables to recommend optimal transport options to the starting point. Real-time weather data from Swiss Meteo helps users equip themselves appropriately for current and forecasted conditions, improving safety and comfort.

- **Execution** – During the activity, users can rely on the app as a real-time navigation guide, following the planned trail while recording progress. The interface provides geolocation tracking, checkpoints, and status indicators to stay aligned with the planned route.

- **Recording** – Once an activity is completed, users can log it as a personalized entry in their adventure journal. These entries may include GPX tracks, photos, notes, and tags such as “favorite trail,” “best views,” or “most challenging section.” AlpenWege also aggregates statistics like total distance, elevation gain, and time, while placing strong emphasis on the personal narrative of each journey.

- **Memories** – Users can set seasonal goals—such as total distance, elevation gain, or number of completed trails—and visually track their progress over time. Progress bars, milestone markers, and completion indicators keep users motivated and aware of their journey's arc. As each activity is logged, the app updates goal progress in real time, creating a clear path toward personal achievement and long-term motivation.

### Compendium

The AlpenWege Compendium is a rich resource that provides users with valuable insights into the regions they explore. Covering topics such as local trails, regions, cities, historical landmarks, and Switzerland's unique flora and fauna, this database enhances users' understanding and appreciation of Swiss landscapes. By providing comprehensive information on the cultural and natural history of each location, the Compendium turns hiking into an inspirational experience, fostering a deeper connection between hikers and the places they visit.

### Event Planning

AlpenWege includes a social event planning feature that allows users to organize and participate in hiking events with others. Whether planning group walks, meet-ups, or community challenges, users can connect with other enthusiasts who share similar interests. This feature promotes camaraderie and social engagement, allowing users to discover new trails together and create shared memories in the Swiss Alps.

### Summary

The aim of AlpenWege is to support all stages of hiking, providing a clear and practical process from initial planning to post-hike reflection. This structure encourages organized, prepared, and informed hiking in the Swiss countryside.

## Purpose and Vision

The main objective of AlpenWege is to provide a complete solution for hiking in the Swiss Alps, giving users the tools to plan their next outdoor adventure. A key feature of the application is the Hiking Cycle, which guides users through each of the essential phases of the hiking experience: Planning, Preparation, Execution, Records, and Future Goals. This structured approach supports walkers from the initial idea of a walk to post-hike reflection.

The Hiking Cycle is complemented by the Compendium, a comprehensive resource providing valuable information on local trails, Swiss regions, cities, and landmarks. This database not only enhances practical planning but also fosters a deeper connection with the Swiss landscape by sharing the unique history and natural beauty of each area.

To further enrich the hiking experience, AlpenWege also includes an events feature that allows users to create and join social gatherings related to hiking. This feature encourages community building and shared outdoor experiences, allowing users to connect with others who share their passion for exploring the Swiss Alps.

## Application Components and Models

### Profiles

Handles all user-related data, including account details, preferences, activity statistics, and system roles. This component centralizes the personalization layer of the app, ensuring that each user has a tailored experience and trackable progress.

- **Models**:
    - **`UserModel`**: Represents registered users of the application, including authentication credentials, roles (e.g. Guest, User, Author, Admin), and base profile information.
    - **`UserSettingsModel`**: Stores user-specific preferences, such as language, notification options, units (e.g., km/mi), and interface behavior.
    - **`UserStatisticModel`**: Tracks performance-based statistics, such as total distance covered, elevation gain, time spent on activities, and trail completion counts.

### Explorer

The core adventure module responsible for managing routes, sections, tracks, and journeys.  
It provides users with the tools to discover, plan, record, and analyze outdoor activities such as hiking, biking, and climbing.  
Supports both one-day and multi-day adventures, offering full GPX integration, route linking, and geospatial analysis via GeoDjango.

- **Models**:
    - **`SectionModel`**: Represents the smallest GPX-based unit — a section of a trail or route. Includes sport-specific difficulty (e.g., T1–T6 for hiking, K1–K6 for via ferrata) and terrain details.
    - **`RouteModel`**: Combines multiple Sections into a complete path or stage. Routes provide cumulative statistics and define the main navigable routes used within Trips.
    - **`TripModel`**: Defines an official multi-day planned route composed of multiple Routes. Used as the system reference for user experiences and analytics.
    - **`TrackModel`**: Stores a user-recorded activity, including GPX data, performance metrics (speed, heart rate, duration), and environmental context. Each Track can link to Routes, Sections, or Journeys.
    - **`JourneyModel`**: Represents a user’s multi-day experience, aggregating multiple Tracks into one complete adventure. May optionally reference a Trip to indicate the planned route completed by the user.

### Compendium

Serves as the educational and informational hub of the application. It provides users with curated knowledge about the regions they explore, including geography, history, cultural highlights, and important places.

- **Models**:
    - **`PoiModel`**: Stores Point of Interest data, such as mountains, lakes, landmarks, or historical locations, with geospatial fields for map visualization.
    - **`RegionModel`**: Represents geographical or cultural regions (e.g., Berner Oberland, Valais) and links to POIs, articles, or trails within the region.
    - **`CountryModel`**: Manages country-level grouping, starting with Switzerland, and possibly extending to nearby alpine regions.
    - **`CardModel`**: Represents collectible cards tied to achievements, places, or cultural knowledge, encouraging gamification and educational engagement.

### Notification

Handles system-level and user-targeted notifications, such as event invitations, trail condition warnings, or system updates. It also includes a change tracking mechanism for administrative and audit purposes.

- **Models**:
    - **`NotificationModel`**: Represents a notification entry targeted at a user, group, or role; supports channels such as email, in-app alerts, or push messages.
    - **`ChangeLogModel`**: Logs changes to core objects for history tracking, audit purposes, or rollback support. Includes metadata like changed fields, timestamps, and user origin.

### Events

Manages all outdoor gatherings, from informal user meetups to organized group events. Supports both fixed and template-based event creation for reusability and planning.

- **Models**:
    - **`EventModel`**: Represents a specific event instance, including type, participants, location, schedule, and linked trails or content.
    - **`TemplateModel`**: Stores reusable templates for recurring or seasonal events, helping admins or users quickly recreate event types.

### Assets

Provides storage and retrieval functionality for media and files. Supports user-uploaded photos, GPX files, and other content attached to routes, events, or memories.

- **Models**:
    - **`PhotoModel`**: Manages uploaded photos, with metadata like author, location (optional geotag), date, and object linkage (e.g., route, POI, journal).
    - **`FileModel`**: Handles general-purpose file uploads such as GPX files, PDF documents, or admin-generated reports.

### Comments

Enables users to leave comments on content such as trails, events, or articles. This supports interaction, feedback, and discussion around user-generated and system content.

- **Models**:
    - **`CommentModel`**: Represents a user-submitted comment, including optional threading, timestamping, and object relation (generic foreign key).

### Achievement

Tracks and awards users for completing specific actions or milestones, such as completing a certain number of trails, visiting all regions, or earning special collectible cards.

- **Models**:
    - **`AchievementModel`**: Defines an achievement, including criteria for unlocking, category (e.g., effort-based, region-based), and visual representation.

# AlpenWege Django Application Stack

This document outlines the selected technology stack for the AlpenWege project, focused on maintainability, performance, and usability.

## 🔐 Authentication

- **`django-allauth`**: Handles registration, email verification, and social login (Google, Apple).
- **`dj-rest-auth`**: Provides REST API endpoints for login, logout, password reset, and social auth integration.
- **Authentication Methods**:
  - Email/password
  - Google
  - Apple
  - Token-based (JWT or session)

## API Layer

- **`Django REST Framework (DRF)`**: Main framework for building RESTful APIs.
- **`drf-nested-routers`**: Enables nested routes reflecting model relationships (e.g., `/regions/{id}/articles/`).
- **`drf-spectacular`**: Auto-generates OpenAPI 3-compliant schema and Swagger/Redoc documentation.
- **`django-filter`** *(optional)*: Enables filtering in list views via query parameters.

## Admin Interface

- **`Jazzmin`**: Customizable and responsive admin UI for Django Admin.
- Benefits:
  - Enhanced usability for content editors
  - Improved navigation and theme control

## Geolocation

- **`django.contrib.gis`**: Adds spatial fields and GIS functionality via GeoDjango.
- **Database**: PostgreSQL + PostGIS required for geospatial operations.
- **Use Cases**:
  - `PointField` for POIs
  - `PolygonField` for regions
  - Spatial queries (e.g., distance, containment)

## File and Media Management

- **`django-storages`**: Integration with cloud storage providers (e.g., AWS S3, Google Cloud Storage, MinIO).
- **Storage Types**:
  - User-uploaded images and files (e.g., GPX tracks, route images)
  - Static and media files management

## Reporting Tools

- **`WeasyPrint`**: HTML + CSS to PDF renderer.
  - Generate branded reports, summaries, and printable formats.
- **`openpyxl`**: Excel file creation and editing.
  - Use for structured data export (e.g., route metrics, user statistics)

## Inspirations

- [Outdooractive - Ridge Hike in the Swiss Alpstein](https://www.outdooractive.com/en/route/long-distance-hiking/appenzell-alps/ridge-hike-in-the-swiss-alpstein/162270147/)
- [Schweizer Wanderwege - Wanderung der Calancasca](https://www.schweizer-wanderwege.ch/de/wandervorschlaege/2041/Wanderung-der-Calancasca-entlang-im-Parco-Val-Calanca#content_hike)
- [Strava Global Heatmap](https://www.strava.com/maps/global-heatmap?sport=MountainBikeRide&style=standard&terrain=false&labels=true&poi=true&cPhotos=true&gColor=mobileblue&gOpacity=100#10.74/47.1064/8.7042)
- [Hiking Buddies - Routes](https://www.hiking-buddies.com/routes/routes_list/)

## Gallery:

<p align="center">
  <img src="project/img/main_page.png" alt="Main page" width="300">
  <img src="project/img/model_page.png" alt="Model page" width="300">
  <img src="project/img/login_page.png" alt="Login page" width="300">
</p>
