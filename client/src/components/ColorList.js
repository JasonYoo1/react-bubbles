import React, { useState } from "react";
import axios from "axios";

import {axiosWithAuth} from '../Auth/axiosWithAuth'


const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors, props }) => {
  //this was huge hint. saw EMPTY array on colors.
  console.log(colors);
  const [editing, setEditing] = useState(false);
  const [colorToEdit, setColorToEdit] = useState(initialColor);

  const editColor = color => {
    setEditing(true);
    setColorToEdit(color);
  };

  const saveEdit = e => {
    e.preventDefault();
    axiosWithAuth()
    .put(`http://localhost:5000/api/colors/${e.id}`, colorToEdit)
    .then(res => {
      console.log(res.data);
      if(colorToEdit.id !== colors.id){
        colors.push(colorToEdit)
        updateColors([...colors])
      } else {
        console.log('something is wrong')
      }
    })
    .catch(err => console.log(err.response));
};
  const deleteColor = color => {
    console.log(color.id);
    axiosWithAuth()
      .delete(`http://localhost:5000/api/colors/${color.id}`)
      .then(res => {
        console.log(res)
        updateColors(colors.filter(colorValue => colorValue.id !== color.id))
  
      })
      .catch(err => console.log(err))
  };


  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      {/* stretch - build another form here to add a color */}
    </div>
  );
};

export default ColorList;
