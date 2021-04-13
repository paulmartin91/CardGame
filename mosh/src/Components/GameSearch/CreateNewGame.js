import React from 'react';

function CreateNewGame({handleSubmit, setCreateGameData, createGameData, errors, setErrors}) {
    return (
        <div className="p-2 col-sm-4 card m-2" id="createGame">
            <form 
                onSubmit={handleSubmit} 
                name="create-game" 
                autoComplete="off"
            >
                <input 
                    autoComplete="false" 
                    type="text" 
                    style={{borderRadius: 0}} 
                    className="border form-control mt-2" 
                    placeholder="Name your game" 
                    onChange={event => {
                        setCreateGameData({...createGameData, name: event.target.value})
                        setErrors({})
                    }} 
                />
                <input 
                    autoComplete="new-password" 
                    type="password" 
                    style={{borderRadius: 0}} 
                    className="border form-control mt-2" 
                    placeholder="Password 6-12" 
                    pattern=".{6,12}" 
                    onChange={event => setCreateGameData({...createGameData, password: event.target.value})} 
                /> 
                <input 
                    type="number"
                    value={createGameData.maxPlayers}
                    min={2}
                    max={6}
                    style={{borderRadius: 0}} 
                    className="border form-control mt-2" 
                    onChange={event => setCreateGameData({...createGameData, maxPlayers: event.target.value})} 
                /> 
                <small 
                    className="form-text text-muted"
                >
                    *password only required for private games
                </small>
                {errors && errors.name}
                <button 
                    type="submit" 
                    className="btn btn-primary mb-2 mt-2">Create Game
                </button>
            </form>
        </div>
    );
}

export default CreateNewGame;