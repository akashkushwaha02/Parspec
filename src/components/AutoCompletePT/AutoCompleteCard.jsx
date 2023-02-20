import React from "react";
import "../../App.css";

export default function AutoCompleteCard({
  item,
  itemsArr,
  index,
  isHighlighted,
}) {
  const { id, name, address, pincode } = item;
  const classNameHover = isHighlighted ? "active" : null;

  const itemsFound = itemsArr ? (
    <li>
      <span style={{ color: "blue" }}>{itemsArr}</span> found in items
    </li>
  ) : null;

  return (
    <React.Fragment key={id}>
      <div tabIndex={index} className={`card ${classNameHover}`}>
        <div>{id}</div>
        <div>{name}</div>
        {itemsFound}
        <div>{address}</div>
        <div>{pincode}</div>
      </div>
    </React.Fragment>
  );
}
