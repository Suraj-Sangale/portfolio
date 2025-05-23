import React from 'react'

const Card = (props) => {
  // test card
  return (
    <div className='timeline__item'>
      <div className='icon'>{props.icon}</div>
      <h3 className='timeline__title-black text-lg'>{props.title}</h3>
      <span className='timeline__data'>{props.year}</span>
      <p className='timeline__text'>{props.desc}</p>
    </div>
  )
}

export default Card
