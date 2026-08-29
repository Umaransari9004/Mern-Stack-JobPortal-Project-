import React, { useState } from 'react'
import { IconBuilding } from '@tabler/icons-react'

const ExpCard = (props:any) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center ">
            <div className="h-12 w-12 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-lg shrink-0 text-gray-400">
                {imgError ? (
                    <IconBuilding size={24} />
                ) : (
                    <img 
                        className="h-full w-full object-contain p-1.5" 
                        src={`/Icons/${props.company}.png`} 
                        alt={props.company} 
                        onError={() => setImgError(true)}
                    />
                )}
            </div>
            <div className="flex flex-col ">
                <div className="font-semibold">{props.title}</div>
                <div className="text-sm text-gray-700">{props.company} &bull; {props.location}</div>
            </div>
        </div>
        <div className="text-sm text-gray-700">
          {props.startDate}- {props.endDate}
        </div>
    </div>
    <div className="text-gray-700 text-justify">
      {props.description}
    </div>
    </div>
  )
}

export default ExpCard;
