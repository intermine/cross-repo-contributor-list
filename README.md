# cross-repo-contributor-list

Small node server to collect contributors from github for an organisation and expose an API which can be consumed by the frontend. Uses server caching to faster serve data.

Refer settings.js for changing parameters such as Organisation, cache eviction time and Github access token.

Steps to start server:
1] Update settings.js
2] npm init
3] npm start