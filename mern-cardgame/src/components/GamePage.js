import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { findSourceMap } from 'module';

let socket;

const GamePage = () => {
    return(
        <h1>Game Page</h1>
    )
}

export default GamePage