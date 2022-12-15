import React from "react";
import InputMask from "react-input-mask";
import styles from "./InputMask.module.css";

function MaskedInput({ mask, text, type, name, placeholder, handleOnChange, value }) {
    return (
        <div className={styles.input_control}>
            <label htmlFor={name}>{text}:</label>
            <InputMask  mask={mask} type={type} name={name} placeholder={placeholder} onChange={handleOnChange} value={value}/>
        </div>
    )
}

export default MaskedInput;