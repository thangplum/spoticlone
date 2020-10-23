import React from 'react'
import { HistoryButton } from './HistoryButton';

interface HistoryToggleProps {

}

export const HistoryToggle: React.FC<HistoryToggleProps> = ({}) => {
        return (
            <div className='HistoryNav'>
                <HistoryButton property='Back'/>
                <HistoryButton property='Forward'/>
            </div>
        );
}