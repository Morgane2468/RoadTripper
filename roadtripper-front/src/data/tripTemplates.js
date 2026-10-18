// Tâches suggérées selon le type de voyage (dans le formulaire de création de voyages).
// id_category : 1 = Admin, 2 = Gear , 3 = Bookings 
export const TRIP_TEMPLATES = {
  Mountain: [
    { title: 'Book a refuge or accommodation', id_category: 3 },
    { title: "Check the weather and trail conditions", id_category: 1 },
    { title: 'Hiking boots', id_category: 2 },
    { title: 'Warm clothing and waterproof jacket', id_category: 2 },
    { title: 'Backpack and hiking poles', id_category: 2 },
    { title: 'First aid kit', id_category: 2 },
    { title: 'Download an offline map', id_category: 1 },
  ],
  Countryside: [
    { title: 'Book a lodge or campsite', id_category: 3 },
    { title: 'Tent and sleeping bags', id_category: 2 },
    { title: 'Camp stove and cookware', id_category: 2 },
    { title: 'Headlamp', id_category: 2 },
    { title: 'Cooler', id_category: 2 },
    { title: 'Insect repellent and sunscreen', id_category: 2 },
    { title: 'Check the campsite\'s fire regulations', id_category: 1 },
  ],
  Beach: [
    { title: 'Book a accommodation', id_category: 3 },
    { title: 'Check the weather', id_category: 1 },
    { title: 'Sunscreen', id_category: 2 },
    { title: 'Swimsuits and beach towels', id_category: 2 },
    { title: 'Umbrella', id_category: 2 },
    { title: 'Sunglasses and hat', id_category: 2 },
    { title: 'Waterproof bag', id_category: 2 },
  ],
  City: [
    { title: 'Book a hotel', id_category: 3 },
    { title: 'Buy tickets (museums, shows)', id_category: 3 },
    { title: 'Find public transportation', id_category: 1 },
    { title: 'Comfortable shoes', id_category: 2 },
    { title: 'Charger and external battery', id_category: 2 },
  ],
  Snow: [
    { title: 'Book accommodation', id_category: 3 },
    { title: 'Buy ski pass', id_category: 3 },
    { title: "Check the road conditions", id_category: 1 },
    { title: 'Coat, gloves and hat', id_category: 2 },
    { title: "Winter tires and chains", id_category: 2 },
    { title: 'Ski goggles', id_category: 2 },
  ],
  Other: [
    { title: 'Book a accommodation', id_category: 3 },
    { title: 'Identity documents', id_category: 1 },
  ]
}
