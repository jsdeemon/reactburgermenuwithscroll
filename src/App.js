import logo from './logo.svg';
import './App.css';
import Menu from "./Menu/Menu";
import {useEffect, useState} from "react";
import axios from 'axios';

function App() {

    // фотографии
    const [photos, setPhotos] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [fetching, setFetching] = useState(true)
    const [totalCount, setTotalCount] = useState(0)

    useEffect(() => {
        if (fetching) {
            console.log('fetching')
            axios.get(`https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`)
                .then(response => {
                    setPhotos([...photos, ...response.data])
                    setCurrentPage(prevState => prevState + 1)
                    setTotalCount(response.headers['x-total-count'])
                })
                .finally(() => setFetching(false));
        }
    }, [fetching])

    useEffect(() => {
        document.addEventListener('scroll', scrollHandler)

        return function () {
            document.removeEventListener('scroll', scrollHandler)
        }

    })

    const scrollHandler = (e) => {

        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100 && photos.length < totalCount) {
            setFetching(true)
        //    console.log('scroll')
        }

        // console.log('scrollHeight', e.target.documentElement.scrollHeight)
        // console.log('scrollTop', e.target.documentElement.scrollTop)
        // console.log('inner height', window.innerHeight)
    }

    const [cardList, setCardList] = useState(
        [
            {id: 1, order: 1, text: 'КАРТОЧКА 1'},
            {id: 2, order: 2, text: 'КАРТОЧКА 2'},
            {id: 3, order: 3, text: 'КАРТОЧКА 3'},
            {id: 4, order: 4, text: 'КАРТОЧКА 4'},
        ])

    const [currentCard, setCurrentCard] = useState(null)

    const [menuActive, setMenuActive] = useState(false)
    const items = [
        {value: 'Главная', href: '/main', icon: 'anchor'},
        {value: 'Услуги', href: '/service', icon: 'api'},
        {value: 'Магазин', href: '/shop', icon: 'android'}
        ]


    function dragStartHandler(e, card) {
        console.log('drag', card)
        setCurrentCard(card)
    }

    function dragEndHandler(e) {
        e.target.style.background = 'white'
    }
    
    function dragOverHandler(e) {
        e.preventDefault()
        e.target.style.background = 'lightgray'
    }
    
    function dropHandler(e, card) {
        e.preventDefault()
        console.log('drop', card)
        setCardList(cardList.map(c => {
            if (c.id === card.id) {
                return {...c, order: currentCard.order}
            }
            if (c.id === currentCard.id) {
                return {...c, order: card.order}
            }
            return c
        }))
        e.target.style.background = 'white'
    }

    const sortCards = (a, b) => {
        if (a.order > b.order) {
            return 1
        } else {
            return -1
        }
    }


  return (
    <div className="app">
      <nav>
        <div className="burger-btn" onClick={() => setMenuActive(!menuActive)} >
          <span/>
        </div>
      </nav>
      <main>

          {cardList.sort(sortCards).map(card =>

              <div
                  onDragStart={(e) => dragStartHandler(e, card)}
                  onDragLeave={(e) => dragEndHandler(e)}
                  onDragEnd={(e) => dragEndHandler(e)}
                  onDragOver={(e) => dragOverHandler(e)}
                  onDrop={(e) => dropHandler(e, card)}
                  draggable={true}
                  className={'card'}
              key={card.id}
              >
                  {card.text}
              </div>

          )}

      </main>
      <Menu active={menuActive} setActive={setMenuActive} header={'Бургер меню'} items={items} />

        {photos.map(photo =>
        <div
        key={photo.id}
            className="photo">
<div className="title">{photo.id}. {photo.title}</div>
            <img src={photo.thumbnailUrl} alt=""/>
        </div>
        )}

    </div>


  );
}

export default App;
