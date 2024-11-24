import { useState } from 'react'

export const useCreatePasswordProps = () => {
 const [hidePassword, setHidePassword] = useState(true)
 const [hideConfirmPassword, setHideConfirmPassword] = useState(true)
 const toggleHidePassword = () => {
  setHidePassword(!hidePassword)
 }
 const toggleHideConfirmPassword = () => {
  setHideConfirmPassword(!hideConfirmPassword)
 }

 return { toggleHidePassword, toggleHideConfirmPassword, hidePassword, hideConfirmPassword }
}
