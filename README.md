# lern-jwt

This is a full stack application consisting of Level for a simple key value db, Express for orchestrating our final production build which serves as the base api, React which is our client and all atop Node.js. It was developed around RBAC which guards the `/api/private` url. The url has been configured to execute `docker` inside `docker` container but it can be configured to run mostly anything.

Local:
`npm run setup && npm run build && npm run server-prod`

Docker:
`npm run compose && npm run up`
