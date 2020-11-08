import React from 'react'
import { PromptButton } from './PromptButton';

interface UserPromptProps {

}

export const UserPrompt: React.FC<UserPromptProps> = ({}) => {
    
    return (
        <div className='UserPrompt'>
            <PromptButton to='https://spotify.com/signup' name='Sign Up' styleName='dark'/>
            <PromptButton to='http://localhost:8888' name='Log In' styleName='light'/>
        </div>
    );
}