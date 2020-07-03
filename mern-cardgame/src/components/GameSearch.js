import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { findSourceMap } from 'module';

let socket;

const GameSearch = () => {
    return(
        <h1>Game Search Page</h1>
    )
}

export default GameSearch