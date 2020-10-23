import React from 'react'
import { PromptButton } from './PromptButton';

interface UserPromptProps {

}

export const UserPrompt: React.FC<UserPromptProps> = ({}) => {
    return (
        <div className='UserPrompt'>
            <PromptButton to='https://spotify.com/signup' name='Sign Up' styleName='dark'/>
            <PromptButton to={`${process.env.REACT_APP_BACK_URI}/login`} name='Log In' styleName='light'/>
        </div>
    );
}