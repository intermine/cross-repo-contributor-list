# cross-repo-contributor-list

Small node server to collect contributors from github for an organization and expose an API which can be consumed by the frontend. Uses server caching to faster serve data.

Refer settings.js for changing parameters such as Organization, cache eviction time and Github access token.

Steps to start server:
1] Update settings.js
2] npm i
3] npm start
