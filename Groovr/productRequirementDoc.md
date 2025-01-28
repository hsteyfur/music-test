# Groovr - Product Requirement Document

## Table of Contents

1. [Project Overview](#project-overview)
2. [Objectives](#objectives)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Detailed Features](#detailed-features)
   - [Frontend (React)](#frontend-react)
   - [Backend (Flask)](#backend-flask)
   - [Database (PostgreSQL)](#database-postgresql)
6. [External Integrations](#external-integrations)
7. [Security Considerations](#security-considerations)
8. [Deployment Strategy](#deployment-strategy)
9. [User Flow](#user-flow)
10. [Additional Features and Enhancements](#additional-features-and-enhancements)
11. [Conclusion](#conclusion)

---

## Project Overview

**Groovr** is a music recommendation web application that leverages Spotify's extensive music library and integrates with a machine learning (ML) model to provide personalized song recommendations. Users can search for songs, receive genre-based recommendations, swipe through suggested tracks in a Tinder-like interface, and create custom playlists based on their preferences.

---

## Objectives

- **Seamless Integration with Spotify:** Utilize Spotify's Web API for song search, metadata retrieval, and playlist management.
- **Personalized Recommendations:** Implement an ML model to classify song genres and generate tailored recommendations.
- **Interactive User Experience:** Provide an intuitive swipe-based interface for users to like or dislike recommended tracks.
- **Playlist Creation:** Enable users to compile their favorite tracks into named playlists saved directly to their Spotify accounts.
- **Scalable and Maintainable Architecture:** Build the application using a robust tech stack that supports future enhancements and scalability.

---

## Tech Stack

| **Component**      | **Technology/Language**                                       | **Purpose**                                                                        |
| ------------------ | ------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Frontend**       | React.js, TypeScript, HTML, CSS (Material-UI or Tailwind CSS) | Building the user interface and handling client-side logic                         |
| **Backend**        | Python, Flask, Flask-RESTful, Flask-CORS, SQLAlchemy          | Managing server-side logic, API endpoints, and integrations with external services |
| **Database**       | PostgreSQL, SQL                                               | Storing persistent data such as user information, tokens, swipes, and playlists    |
| **External APIs**  | Spotify Web API, ML Genre Classification API                  | Providing music data and genre analysis                                            |
| **Authentication** | OAuth 2.0 (Spotify Authorization Code Flow)                   | Securely handling user authentication and authorization with Spotify               |
| **Deployment**     | Docker (optional), Heroku/AWS/DigitalOcean, Vercel/Netlify    | Hosting frontend and backend applications                                          |

---

## System Architecture

### Component Breakdown

1. **Frontend (React)**

   - **Responsibilities:**
     - User Interface for searching songs, swiping through recommendations, and managing playlists.
     - Handling user authentication flow with Spotify.
     - Communicating with the backend via RESTful APIs.
     - Managing application state and user interactions.

2. **Backend (Flask)**

   - **Responsibilities:**
     - Handling OAuth 2.0 authentication with Spotify.
     - Interacting with Spotify Web API for searching tracks, fetching metadata, and managing playlists.
     - Communicating with the external ML service for genre classification.
     - Managing database operations (CRUD) with PostgreSQL.
     - Exposing RESTful API endpoints for frontend consumption.
     - Handling session management and token refreshing.

3. **Database (PostgreSQL)**

   - **Responsibilities:**
     - Storing user information, including Spotify tokens.
     - Recording user interactions such as swiped tracks (liked/disliked).
     - Managing playlists created by users.
     - Ensuring data persistence and integrity.

4. **External Services**
   - **Spotify Web API**
     - **Purpose:** To search for tracks, retrieve track metadata (e.g., danceability, mode), and manage user playlists.
   - **ML Genre Classification Service**
     - **Purpose:** To analyze a song's preview URL and return the top three prominent genres.
     - **Assumption:** Provided by your partner as an accessible HTTP endpoint.

---

## Detailed Features

### Frontend (React)

#### User Authentication

- **Feature:** Allow users to log in via Spotify.
- **Implementation:**
  - **Login Button:** Redirects to the backend's `/auth/login` endpoint.
  - **Callback Handling:** After Spotify authentication, users are redirected back to the frontend.
  - **State Management:** Use React Context or Redux to manage authentication state.

#### Song Search

- **Feature:** Enable users to search for songs using the Spotify API.
- **Implementation:**
  - **Search Bar Component:** Captures user input for song queries.
  - **API Call:** Frontend sends search queries to the backend (`/api/search`) which communicates with Spotify.
  - **Display Results:** Show search results with song details (name, artist, album art, preview URL).

#### Selecting a Seed Song

- **Feature:** Users select a song to generate recommendations.
- **Implementation:**
  - **Selection Mechanism:** Clicking a song from search results.
  - **API Call:** Frontend sends the selected song's `preview_url` to the backend (`/api/recommendations`).

#### Swiping Interface

- **Feature:** Tinder-like swipe functionality to like or dislike recommended songs.
- **Implementation:**
  - **Swipe Cards:** Use `react-tinder-card` or a similar library to display song cards.
  - **Swipe Actions:** Detect swipe direction and categorize songs as liked (right swipe) or disliked (left swipe).
  - **State Management:** Maintain a list of liked songs in the application's state.

#### Playlist Creation and Management

- **Feature:** Allow users to create and name playlists from liked songs.
- **Implementation:**
  - **Playlist Modal:** A UI component where users can name their playlist and confirm creation.
  - **API Call:** Frontend sends playlist details (`name` and `trackUris`) to the backend (`/api/playlist`).
  - **Confirmation:** Notify users upon successful playlist creation with a link to their Spotify account.

#### User Profile and Playlists (Optional)

- **Feature:** Display user's created playlists and allow management.
- **Implementation:**
  - **Profile Page:** Show user's playlists fetched from the backend.
  - **Playlist Management:** Options to view or delete playlists.

#### State Management

- **Authentication State:** Track whether the user is logged in and store user info.
- **Search State:** Manage current search query and results.
- **Recommendations State:** Handle the list of recommended tracks for swiping.
- **Swiped Tracks State:** Maintain a list of liked tracks for playlist creation.

#### API Interaction

- **Axios Configuration:** Set up a centralized Axios instance with base URL and credentials.
- **Error Handling:** Gracefully handle API errors and display user-friendly messages.
- **Loading States:** Indicate loading processes during API calls.

### Backend (Flask)

#### Authentication Endpoints

- **`/api/auth/login`:**

  - **Purpose:** Initiates Spotify OAuth flow by redirecting users to Spotify's authorization page.
  - **Implementation:** Constructs the authorization URL with required scopes and redirects.

- **`/api/auth/callback`:**

  - **Purpose:** Handles Spotify's callback after user authorization.
  - **Implementation:**
    - Exchanges authorization code for access and refresh tokens.
    - Retrieves user information from Spotify.
    - Stores or updates user data in PostgreSQL.
    - Establishes a session or sends a secure token to the frontend.

- **`/api/auth/refresh`:**
  - **Purpose:** Refreshes expired Spotify access tokens using the refresh token.
  - **Implementation:** Exchanges refresh token for a new access token and updates the database.

#### Search Endpoint

- **`/api/search`:**
  - **Method:** GET
  - **Parameters:** `query` (song name or keywords)
  - **Purpose:** Searches for songs using Spotify's Search API based on user input.
  - **Implementation:**
    - Validates query parameters.
    - Retrieves user's access token from the database.
    - Calls Spotify's Search API and fetches results.
    - Returns formatted search results to the frontend.

#### Recommendations Endpoint

- **`/api/recommendations`:**
  - **Method:** POST
  - **Payload:** `{ previewUrl: string }`
  - **Purpose:** Generates song recommendations based on the selected seed song.
  - **Implementation:**
    - Validates the `previewUrl`.
    - Sends the `previewUrl` to the ML Genre Classification service.
    - Receives top three genres from the ML service.
    - Calls Spotify's Recommendations API using these genres to fetch up to 100 recommended tracks.
    - Returns the recommended tracks to the frontend.

#### Playlist Creation Endpoint

- **`/api/playlist`:**
  - **Method:** POST
  - **Payload:** `{ name: string, trackUris: string[] }`
  - **Purpose:** Creates a new playlist in the user's Spotify account with the selected tracks.
  - **Implementation:**
    - Validates the payload.
    - Retrieves user's access token from the database.
    - Calls Spotify's API to create a new playlist with the provided name.
    - Adds the selected tracks to the newly created playlist.
    - Records the playlist details in PostgreSQL.
    - Returns a success message with playlist details.

#### User Profile and Playlist Management Endpoints (Optional)

- **`/api/profile`:**

  - **Method:** GET
  - **Purpose:** Fetches user profile details and their playlists.
  - **Implementation:** Retrieves data from PostgreSQL and returns to frontend.

- **`/api/playlist/<playlist_id>`:**
  - **Method:** DELETE
  - **Purpose:** Deletes a specific playlist from the user's Spotify account.
  - **Implementation:** Calls Spotify's API to delete the playlist and removes it from PostgreSQL.

#### External Service Integration

- **Spotify Web API:**

  - **Authentication:** Using OAuth 2.0 Authorization Code Flow to obtain access and refresh tokens.
  - **Endpoints Used:**
    - Search Tracks: `/v1/search`
    - Get Current User's Profile: `/v1/me`
    - Get Audio Features: `/v1/audio-features/{id}`
    - Get Recommendations: `/v1/recommendations`
    - Create Playlist: `/v1/users/{user_id}/playlists`
    - Add Tracks to Playlist: `/v1/playlists/{playlist_id}/tracks`

- **ML Genre Classification Service:**
  - **Purpose:** Analyze a song's `preview_url` and return the top three genres.
  - **Integration:**
    - **Request:** Send a POST request with `{ previewUrl: string }`.
    - **Response:** Receive `{ genres: [string, string, string] }`.
    - **Error Handling:** Implement retries and fallback mechanisms in case of service failure or timeouts.

#### Utility Functions

- **Spotify Utility:**

  - Handle Spotify API interactions and token management.
  - Functions include:
    - `get_spotify_access_token(user_id)`
    - `search_spotify_tracks(query, access_token)`
    - `get_track_audio_features(track_id, access_token)`
    - `get_recommendations(genres, access_token, limit=100)`
    - `create_spotify_playlist(name, access_token)`
    - `add_tracks_to_playlist(playlist_id, track_uris, access_token)`

- **ML Model Utility:**
  - Handle communication with the ML model.
  - Functions include:
    - `get_genres_from_ml(preview_url)`

#### Database Operations

- **Create/Update Users:** Upon authentication, create a new user or update existing user's tokens and expiration.
- **Record Swipes:** Log each swipe action with the track ID and whether it was liked.
- **Manage Playlists:** Store details of playlists created by users for tracking and management purposes.

### Database (PostgreSQL)

#### Schema Design

- **Users Table:**

  - `id` (Primary Key)
  - `spotify_id` (Unique, Spotify user ID)
  - `access_token`
  - `refresh_token`
  - `token_expires` (Timestamp)
  - `created_at` (Timestamp)

- **Playlists Table:**

  - `id` (Primary Key)
  - `user_id` (Foreign Key referencing Users)
  - `spotify_playlist_id` (Spotify's playlist ID)
  - `name`
  - `created_at` (Timestamp)

- **Swipes Table:**
  - `id` (Primary Key)
  - `user_id` (Foreign Key referencing Users)
  - `track_id` (Spotify's track ID)
  - `liked` (Boolean)
  - `swiped_at` (Timestamp)

#### Database Operations

- **Create/Update Users:** Manage user records with their Spotify credentials.
- **Record Swipes:** Log user interactions with recommended tracks.
- **Manage Playlists:** Track playlists created by users, linking them to their Spotify accounts.

---

## External Integrations

### Spotify Web API

- **Purpose:** To provide access to Spotify's vast music library, allowing song searches, metadata retrieval, and playlist management.
- **Key Endpoints:**
  - **Search Tracks:** `/v1/search`
  - **Get User Profile:** `/v1/me`
  - **Get Audio Features:** `/v1/audio-features/{id}`
  - **Get Recommendations:** `/v1/recommendations`
  - **Create Playlist:** `/v1/users/{user_id}/playlists`
  - **Add Tracks to Playlist:** `/v1/playlists/{playlist_id}/tracks`
- **Authentication:** Implement OAuth 2.0 Authorization Code Flow to securely access user data and perform actions on their behalf.

### ML Genre Classification Service

- **Purpose:** To analyze a song's `preview_url` and return the top three genres, enhancing recommendation accuracy.
- **Integration Steps:**
  1. **Send Request:** POST request with `{ previewUrl: string }`.
  2. **Receive Response:** `{ genres: [string, string, string] }`.
  3. **Handle Errors:** Implement retries and timeouts to manage potential service disruptions.

---

## Security Considerations

### Secure Handling of Tokens

- **Storage:** Store access and refresh tokens securely in the database, ensuring they are not exposed to the frontend.
- **Transmission:** Use HTTPS to encrypt data in transit between frontend, backend, and external services.
- **Environment Variables:** Manage sensitive credentials (e.g., Spotify Client Secret) via environment variables, never hardcoding them in the codebase.

### Protecting API Endpoints

- **Authentication Middleware:** Ensure that only authenticated users can access protected endpoints.
- **Input Validation:** Sanitize and validate all incoming data to prevent injection attacks.
- **Rate Limiting:** Implement rate limiting to prevent abuse of APIs.

### CORS Configuration

- **Setup:** Configure Flask-CORS to allow requests only from your frontend's domain.
  ```python
  from flask_cors import CORS
  CORS(app, origins=["https://your-frontend-domain.com"], supports_credentials=True)
  ```
