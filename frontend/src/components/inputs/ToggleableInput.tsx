import React,{useState} from 'react'
import { EyeClosed, EyeOpen } from '../../assets/icons'
import style from './ToggleableInput.module.css'

const ToggleableInput = ({handleChange, placeholder, name}) => {
    const [showInput, setShowInput] = useState(false)

  return (
    <div className={style.inputLine}>
    <input type={showInput ? 'text' : 'password'} name={name}  placeholder={placeholder} onChange={handleChange} className={style.inputPass}/>
    <button className={style.eyeButton} onClick={()=>setShowInput(!showInput)}><span id="togglePassword" className={style.eye}>{showInput ? <EyeClosed />  : <EyeOpen />}</span></button>
    </div>
  )
}

export default ToggleableInput