import React from 'react'
import { HistoryButton } from './HistoryButton';
import { useHistory } from "react-router-dom";

interface HistoryToggleProps {

}

export const HistoryToggle: React.FC<HistoryToggleProps> = () => {
  let history = useHistory();
  return (
    <div className='HistoryNav'>
      <HistoryButton property='Back' onClick={() => history.goBack()} />
      <HistoryButton property='Forward' onClick={() => history.goForward()}/>
    </div>
  );
}