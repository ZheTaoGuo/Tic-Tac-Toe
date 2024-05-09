# Tic Tac Toe Game

## Installation

1. Navigate to frontend directory

```bash
yarn install
yarn start
```

2. Navigate to backend directory

```bash
yarn install
node index.js
```

3. Create two browser windows

## Design Decisions

Contrast
* Contrast between the background, tile color and flags

KeyBoard Accessibility
* Keyboard accessibility with `tab` and `enter` button functionality

Screen Reader Support
* Screen Reader Support via aria live announcements
    * Programmatically expose dynamic content changes on web page
    * Allow players to know existing flags on the board

## API Functionalities

1. Create new game

    Player ABC
    ![New Game Player ABC](/assets/NewGamePlayerABC.png)

    Player DEF
    ![New Game Player DEF](/assets/NewGamePlayerDEF.png)

2. Get initial game details

    ![Get Game Details](/assets/GetInitialGameDetails.png)

3. Make a move

    Player ABC
    ![Make Move](/assets/PlayerABCMove.png)

    Player DEF
    ![Make Move](/assets/PlayerDEFMove.png)

    Updated Game Details
    ![Updated Game Details](/assets/GetUpdatedGameDetails.png)

4. List all games

    ![List All Games](/assets/ListAllGames.png)

## Design Decisions

Used File as data store due to minimal data storage requirements (player name and moves) and offline connection capabilities, can be stored in a file server for ease of integration with existing software systems that the board games cafe has. While I acknowledge this method of file storage may result in race conditions to occur, in order to mitigate such circumstances, a lock mechanism in the form of mutex/semaphore will be implemented on the server.
Implemented web sockets on web server to maintain bidirectional long polling connection and broadcasting to more than one client simultaneously for two player game sessions. [74 words]

## Accessibility Decisions

For accessibility considerations, I considered high contrast for persons with sensory impairements, keyboard controls for tiles on the board and screen reader support to announce which tile they have placed an cross or circle on. [35 words]

## Architecture Diagram

Frontend built with ReactJS, Backend built with Express and web sockets, file as data store
![Architecture Diagram](/assets/Architecture%20Diagram.png)
