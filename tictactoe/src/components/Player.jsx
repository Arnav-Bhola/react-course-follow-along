import React, { useState } from "react";

export default function Player({ initialName, symbol, isActive, onChangeName }) {
  const [isEditing, setIsEditing] = useState(false);
  const [playerName, setPlayerName] = useState(initialName);

  const handleClick = (e) => {
    e.preventDefault();
    setIsEditing((wasEditing) => !wasEditing);
    if (isEditing) {
      onChangeName(symbol, playerName);
    }
  };

  const handleChange = (event) => {
    setPlayerName(event.target.value);
  };

  return (
    <li className={isActive ? "active" : undefined}>
      <span className='player'>
        {!isEditing ? (
          <span className='player-name'>{playerName}</span>
        ) : (
          <input
            type='text'
            required
            value={playerName}
            onChange={handleChange}
          />
        )}
        <span className='player-symbol'>{symbol}</span>
      </span>
      <button onClick={handleClick}>{isEditing ? "Save" : "Edit"}</button>
    </li>
  );
}
