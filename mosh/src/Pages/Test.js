import React, { useState } from 'react';

function Test(props) {

    const [test, setTest] = useState({paul: {a: 1, b: 2}, john: {a: 1, b: 2}})

    const testFunc = () => setTest(oldTest => oldTest.map(x => { return {...x, "a": 2}}))

    return (
        <div>
            {test.map(x => x.a)}
            <br />
            {test.map(x => x.b)}
            <button onClick={testFunc}> test function </button>
        </div>
    );
}

export default Test;