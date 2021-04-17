To do...


General 


Login
- creating a user doesn't auth user requests for gameList

GameSearch
- Validation of create game form is broken

GameLobby
- needs logout ✓
- needs leave game ✓
- refresh playerlist ✓
- logout emits to rest of users that player has left
- delete auth token, then join game redirects to sign in (good), but sign in redirects to joined game (bad)

GamePage



BACKEND

- Can't currently tell who is in each room ✓
- Need to make sure players are only in one game at a time (started, needs testing)

- Need an isInGame function
  - runs as middleware, if in game, redirect user to lobby ✓
  - runs when creating or joining a game


  MONGODB
  - Joining games in progress?