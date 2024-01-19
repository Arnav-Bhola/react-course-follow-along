import React, { useState } from "react";

const ListGroup = (props) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const list = props.items.map((item, index) => {
    return (
      <li
        className={selectedIndex === index ? "list-group-item active" : "list-group-item"}
        key={item}
        onClick={() => {
          setSelectedIndex(index);
          props.onSelectItem(item);
        }}
      >
        {item}
      </li>
    );
  });

  return (
    <>
      <h1>{props.heading}</h1>
      {props.items.length === 0 ? <p>No Item Found</p> : <ul className='list-group'>{list}</ul>}
    </>
  );
};

export default ListGroup;

