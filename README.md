# Full stack multiplayer card game

## The what...
<p>A simple, yet versitile multiplayer game that gives users a set of deck cards and the functions to do anything they want with them.</p>


## The why...
<p>There are simmilar ones out there, but they aren't very user friendly and I feel like I can add more advanced functionality like custom games, macro functions and scoreboards.</p>


## The how...
<p>Giving users the functionality to perform basic card tasks such as dealing, shuffling and hiding cards; they can play a huge array of card games without having to switch applications.</p>


## Development Log...

### To test...

- What happens when a player leaves at each stage?
- Do more than 2 users cause problems

### To fix...

- ~~"[object, object] has joined" logs client side when a user logs in~~ ✔
- ~~"undefined disconnected" logs server side at random~~ ✔
- ~~All players unreadying stops the timer, but one player unreadying doesn't~~ ✔
- ~~Blind cards not appearing when delt to other players, nothing in log~~ ✔
- Blind cards still show when too many cards have been delt


### To do...

General App
- Can I use express routing?
- ~~Integrate MongoDB for saving user info~~ ✔
- ~~Create new account~~ ✔
- All users loggedin = false when server resets
- Okta Auth?

Login Page
- ~~Vet for invalid login info~~ ✔
- ~~Give some explanation as to how the app works~~ ✔
- ~~Check for duplicate login info~~ ✔
- ~~Create new login and sign in~~ ✔

Pre Lobby Page
- ~~Need a place to create games - Client side~~ ✔
- Client side create games needs max players
- Server needs to process validate request and create room for game
- Client needs to process create game server response
- List of active games to join just a place holder, needs to update
- Game list needs to display locked games
- Game list needs to display player count
- Clicking on games needs to send join request to server with a password if required
- Server needs to process join request check password
- Client needs to process join request response from server

Lobby Page
- ~~Style~~ ✔
- ~~Messages emit to all users, currently just sender~~ ✔
- ~~Ready status emit to all users, currently just user that is ready~~ ✔
- ~~Game start countdown needs to reset scroll to lowest on message board~~ ✔
- ~~Lobby message board timestamps and user input~~ ✔

Game Page
- Style
- ~~Find a set of card image files to use~~ ✔
- ~~Create a table space for active cards~~ ✔
- Players need positions that are visible
- Dealer chip needs to move around players
- ~~Player cards need to be visible, but blind to other players~~ ✔
- Play card function
- Keep message board constant between lobby and game page
- Actions need to be visible for all players

