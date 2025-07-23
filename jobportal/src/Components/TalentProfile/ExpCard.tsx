import React from 'react'

const ExpCard = (props:any) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between">
        <div className="flex gap-2 items-center ">
            <div className="p-2 bg-blue-100 rounded-md">
            <img className="h-7" src={`/Icons/${props.company}.png`} alt="" />

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
