const config = {
    // In Docker, the frontend container would call the backend container using the service name
    // If not in Docker or development, use the localhost URL
    API_BASE_URL: process.env.NODE_ENV === 'production' 
        ? '/api' // In Docker, use the nginx proxy to forward to backend
        : 'http://localhost:8001',
};

export default config; 