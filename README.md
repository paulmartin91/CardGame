# Full MERN stack multiplayer card game

## The what...
<p>A simple, yet versitile multiplayer game that gives users a set of deck cards and the functions to do anything they want with them.</p>


## The why...
<p>There are simmilar ones out there, but they aren't very user friendly and I feel like I can add more advanced functionality like custom games, macro functions and scoreboards.</p>


## The how...
<p>Giving users the functionality to perform basic card tasks such as dealing, shuffling and hiding cards; they can play a huge array of card games without having to switch applications.</p>


## Development Log...

### To test...

- 

### To fix...
- Standardise request/resoponse calls to the server


### To do...

General App
- ~~Migrate Login Page to React build~~ ✓
- ~~Migrate GameSearch Pageto React build~~ ✓
- ~~Migrate Lobby Page to React build~~ ✓
- Migrate Game Page to React build
- Add keys to mapped objects
- Background
- Button outlines keep showing up, might be something in the old .css file that fixed this

Login Page
- ~~Successful login crashes server~~ ✓
- Too many states, could I use strings for each instance instead of seperate states? Could jst use standard JS forms.

Game Search Page
- Saving info on server variables and socket object, should only be in one place (saved on 'create game request')
- Why am I emiting 'new user joined' on create new game, surely there's noone to hear it?
- Game already exists needs an error message
- ~~Finish server side join game~~ ✓

Lobby Page
- ~~Ready up not operating~~ ✓
- ~~Chat box not working~~ ✓
- Ready button turns green for some reason when clicked
- ~~Need to handle 'start game'~~ ✓

Game Page
- Player list keys need to map to 'deal to' form
- Need to create a dev environment where I can simulate a 2player game without signing in every time
- Cards object should be a class and creating a game should create a new instance of said class
- Players need to sit around a table, this needs to be represented, preferably dynamically