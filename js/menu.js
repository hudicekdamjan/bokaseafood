/* =====================================================================
   BOKA SEAFOOD — MENU (from the restaurant's printed menu)
   ---------------------------------------------------------------------
   Each category:
     title: [English, Montenegrin]
     note:  optional line shown above the dishes [English, Montenegrin]
   Each item:
     name:  [English, Montenegrin]
     desc:  optional short line [English, Montenegrin]
     size:  optional portion / weight / volume [English, Montenegrin]
     price: number in euros (shown as 20.00 €)
     signature: true → also shown in the round-photo row "The menu"
     img:   photo for signature dishes (file in /images)
   ===================================================================== */
window.MENU = [
  {
    id: 'shellfish', title: ['Oysters & Mussels', 'Kamenice i mušlje', 'Устрицы и мидии'],
    items: [
      { name: ['Oysters', 'Kamenice', 'Устрицы'], size: ['1 pc', '1 kom', '1 шт.'], price: 3.5 },
      { name: ['Oysters, half portion', 'Kamenice, pola porcije', 'Устрицы, полпорции'], size: ['6 pcs', '6 kom', '6 шт.'], price: 21, signature: true, img: 'images/boka-dish-oysters.jpg',
        desc: ['Fresh from our farm', 'Svježe sa naše farme', 'Свежие, с нашей фермы'] },
      { name: ['Oysters, portion', 'Kamenice, porcija', 'Устрицы, порция'], size: ['12 pcs', '12 kom', '12 шт.'], price: 42 },
      { name: ['Mussels, portion', 'Mušlje, porcija', 'Мидии, порция'], size: ['1 kg', '1 kg', '1 кг'], price: 14, signature: true, img: 'images/boka-mussels-sq.jpg',
        desc: ['Cooked, in white sauce', 'Kuvane, u bijelom sosu', 'Отварные, в белом соусе'] }
    ]
  },
  {
    id: 'fish', title: ['Fish & Shrimp', 'Riba i gambori', 'Рыба и креветки'],
    items: [
      { name: ['Sea bream', 'Orada', 'Дорада'], size: ['350–400 g', '350–400 g', '350–400 г'], price: 20, signature: true, img: 'images/boka-dish-orada.jpg',
        desc: ['Whole fish, grilled', 'Cijela riba, sa grila', 'Целая рыба на гриле'] },
      { name: ['Sea bass', 'Brancin', 'Сибас'], size: ['350–400 g', '350–400 g', '350–400 г'], price: 20,
        desc: ['Whole fish, grilled', 'Cijela riba, sa grila', 'Целая рыба на гриле'] },
      { name: ['Shrimps, portion', 'Gambori, porcija', 'Креветки, порция'], size: ['10 pcs', '10 kom', '10 шт.'], price: 17, signature: true, img: 'images/boka-prawns.jpg',
        desc: ['Grilled', 'Sa grila', 'На гриле'] },
      { name: ['Tuna steak', 'Tuna odrezak', 'Стейк из тунца'], size: ['300 g', '300 g', '300 г'], price: 22, signature: true, img: 'images/boka-dish-tuna.jpg', desc: ['Steak, grilled', 'Odrezak, sa grila', 'Стейк на гриле'] }
    ]
  },
  {
    id: 'sides', title: ['Sides', 'Prilozi', 'Гарниры'],
    items: [
      { name: ['Grilled zucchini, portion', 'Tikvice sa grila, porcija', 'Цукини на гриле, порция'], price: 7 },
      { name: ['Salted fish', 'Slana riba', 'Солёная рыба'], size: ['5 pcs', '5 kom', '5 шт.'], price: 6 },
      { name: ['Bread', 'Hljeb', 'Хлеб'], size: ['basket', 'korpa', 'корзинка'], price: 2 }
    ]
  },
  {
    id: 'wine', title: ['Home-made wine', 'Domaće vino', 'Домашнее вино'],
    note: ['All our wines are exclusively home-made, in small batches and never mass-produced. You won’t find them anywhere else: only here, at our table.', 'Sva naša vina su isključivo domaća, pravljena u malim količinama, bez masovne proizvodnje. Nećete ih naći nigdje drugo, samo kod nas, za našim stolom.', 'Все наши вина исключительно домашние, в небольших партиях и без массового производства. Вы не найдёте их больше нигде: только у нас, за нашим столом.'],
    items: [
      { name: ['Naša priča (Our Story)', 'Naša priča', 'Naša priča («Наша история»)'], size: ['0.7 l', '0,7 l', '0,7 л'], desc: ['Home-made', 'Domaće', 'Домашнее'], price: 25 },
      { name: ['Rosé', 'Rose', 'Розе'], size: ['0.7 l', '0,7 l', '0,7 л'], desc: ['Home-made', 'Domaće', 'Домашнее'], price: 25 },
      { name: ['Chardonnay · glass', 'Chardonnay · čaša', 'Шардоне · бокал'], desc: ['Home-made', 'Domaće', 'Домашнее'], price: 4.5 },
      { name: ['Chardonnay · bottle', 'Chardonnay · boca', 'Шардоне · бутылка'], size: ['0.5 l', '0,5 l', '0,5 л'], desc: ['Home-made', 'Domaće', 'Домашнее'], price: 10 },
      { name: ['Chardonnay · bottle', 'Chardonnay · boca', 'Шардоне · бутылка'], size: ['1 l', '1 l', '1 л'], desc: ['Home-made', 'Domaće', 'Домашнее'], price: 18 }
    ]
  },
  {
    id: 'rakija', title: ['Rakija', 'Rakija', 'Ракия'],
    items: [
      { name: ['Grape brandy (Loza)', 'Loza', 'Виноградная ракия (Лоза)'], price: 2.5 },
      { name: ['Plum brandy (Šljiva)', 'Šljiva', 'Сливовая ракия (Шлива)'], price: 3.5 }
    ]
  },
  {
    id: 'drinks', title: ['Home-made juices & water', 'Domaći sokovi i voda', 'Домашние соки и вода'],
    note: ['Our juices are home-made too, and you can only taste them here, with us.', 'I naši sokovi su isključivo domaći, i možete ih probati samo kod nas.', 'Наши соки тоже исключительно домашние, и попробовать их можно только у нас.'],
    items: [
      { name: ['Mix juice', 'Mix sok', 'Микс-сок'], desc: ['Home-made · apple, mandarin, beetroot', 'Domaći · jabuka, mandarina, cvekla', 'Домашний · яблоко, мандарин, свёкла'], size: ['glass', 'čaša', 'стакан'], price: 4 },
      { name: ['Mix juice', 'Mix sok', 'Микс-сок'], desc: ['Home-made · apple, mandarin, beetroot', 'Domaći · jabuka, mandarina, cvekla', 'Домашний · яблоко, мандарин, свёкла'], size: ['1 l', '1 l', '1 л'], price: 12 },
      { name: ['Apple juice', 'Sok od jabuke', 'Яблочный сок'], size: ['glass', 'čaša', 'стакан'], desc: ['Home-made', 'Domaći', 'Домашний'], price: 4 },
      { name: ['Apple juice', 'Sok od jabuke', 'Яблочный сок'], size: ['1 l', '1 l', '1 л'], desc: ['Home-made', 'Domaći', 'Домашний'], price: 12 },
      { name: ['Water / sparkling water', 'Voda / gazirana voda', 'Вода / газированная вода'], price: 1.5 }
    ]
  }
];
