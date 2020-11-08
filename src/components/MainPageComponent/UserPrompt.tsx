import React from 'react'
import { PromptButton } from './PromptButton';

interface UserPromptProps {

}

export const UserPrompt: React.FC<UserPromptProps> = ({}) => {
    
    return (
        <div className='UserPrompt'>
            <PromptButton to='https://www.spotify.com/us/signup/?forward_url=https%3A%2F%2Fopen.spotify.com%2F' name='Sign Up' styleName='dark'/>
            <PromptButton to='http://localhost:8888' name='Log In' styleName='light'/>
        </div>
    );
}