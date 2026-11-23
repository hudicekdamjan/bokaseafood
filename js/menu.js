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
    id: 'shellfish', title: ['Oysters & Mussels', 'Kamenice i mušlje'],
    items: [
      { name: ['Oysters', 'Kamenice'], size: ['1 pc', '1 kom'], price: 3.5 },
      { name: ['Oysters, half portion', 'Kamenice, pola porcije'], size: ['6 pcs', '6 kom'], price: 21, signature: true, img: 'images/boka-dish-oysters.jpg',
        desc: ['Fresh from our farm', 'Svježe sa naše farme'] },
      { name: ['Oysters, portion', 'Kamenice, porcija'], size: ['12 pcs', '12 kom'], price: 42 },
      { name: ['Mussels, portion', 'Mušlje, porcija'], size: ['1 kg', '1 kg'], price: 14, signature: true, img: 'images/boka-mussels-sq.jpg',
        desc: ['Cooked, in white sauce', 'Kuvane, u bijelom sosu'] }
    ]
  },
  {
    id: 'fish', title: ['Fish & Shrimp', 'Riba i gambori'],
    items: [
      { name: ['Sea bream', 'Orada'], size: ['350–400 g', '350–400 g'], price: 20, signature: true, img: 'images/boka-dish-orada.jpg',
        desc: ['Whole fish, grilled', 'Cijela riba, sa grila'] },
      { name: ['Sea bass', 'Brancin'], size: ['350–400 g', '350–400 g'], price: 20,
        desc: ['Whole fish, grilled', 'Cijela riba, sa grila'] },
      { name: ['Shrimps, portion', 'Gambori, porcija'], size: ['10 pcs', '10 kom'], price: 17, signature: true, img: 'images/boka-prawns.jpg',
        desc: ['Grilled', 'Sa grila'] },
      { name: ['Tuna steak', 'Tuna odrezak'], size: ['300 g', '300 g'], price: 22, signature: true, img: 'images/boka-dish-tuna.jpg', desc: ['Steak, grilled', 'Odrezak, sa grila'] }
    ]
  },
  {
    id: 'sides', title: ['Sides', 'Prilozi'],
    items: [
      { name: ['Grilled zucchini, portion', 'Tikvice sa grila, porcija'], price: 7 },
      { name: ['Salted fish', 'Slana riba'], size: ['5 pcs', '5 kom'], price: 6 },
      { name: ['Bread', 'Hljeb'], size: ['basket', 'korpa'], price: 2 }
    ]
  },
  {
    id: 'wine', title: ['Home-made wine', 'Domaće vino'],
    note: ['All our wines are exclusively home-made, in small batches and never mass-produced. You won’t find them anywhere else: only here, at our table.', 'Sva naša vina su isključivo domaća, pravljena u malim količinama, bez masovne proizvodnje. Nećete ih naći nigdje drugo, samo kod nas, za našim stolom.'],
    items: [
      { name: ['Naša priča (Our Story)', 'Naša priča'], size: ['0.7 l', '0,7 l'], desc: ['Home-made', 'Domaće'], price: 25 },
      { name: ['Rosé', 'Rose'], size: ['0.7 l', '0,7 l'], desc: ['Home-made', 'Domaće'], price: 25 },
      { name: ['Chardonnay · glass', 'Chardonnay · čaša'], desc: ['Home-made', 'Domaće'], price: 4.5 },
      { name: ['Chardonnay · bottle', 'Chardonnay · boca'], size: ['0.5 l', '0,5 l'], desc: ['Home-made', 'Domaće'], price: 10 },
      { name: ['Chardonnay · bottle', 'Chardonnay · boca'], size: ['1 l', '1 l'], desc: ['Home-made', 'Domaće'], price: 18 }
    ]
  },
  {
    id: 'rakija', title: ['Rakija', 'Rakija'],
    items: [
      { name: ['Grape brandy (Loza)', 'Loza'], price: 2.5 },
      { name: ['Plum brandy (Šljiva)', 'Šljiva'], price: 3.5 }
    ]
  },
  {
    id: 'drinks', title: ['Home-made juices & water', 'Domaći sokovi i voda'],
    note: ['Our juices are home-made too, and you can only taste them here, with us.', 'I naši sokovi su isključivo domaći, i možete ih probati samo kod nas.'],
    items: [
      { name: ['Mix juice', 'Mix sok'], desc: ['Home-made · apple, mandarin, beetroot', 'Domaći · jabuka, mandarina, cvekla'], size: ['glass', 'čaša'], price: 4 },
      { name: ['Mix juice', 'Mix sok'], desc: ['Home-made · apple, mandarin, beetroot', 'Domaći · jabuka, mandarina, cvekla'], size: ['1 l', '1 l'], price: 12 },
      { name: ['Apple juice', 'Sok od jabuke'], size: ['glass', 'čaša'], desc: ['Home-made', 'Domaći'], price: 4 },
      { name: ['Apple juice', 'Sok od jabuke'], size: ['1 l', '1 l'], desc: ['Home-made', 'Domaći'], price: 12 },
      { name: ['Water / sparkling water', 'Voda / gazirana voda'], price: 1.5 }
    ]
  }
];
