// Tâches suggérées selon le type de voyage (proposées dans le formulaire "Nouveau voyage").
// id_category : 1 = Admin, 2 = Gear (matériel), 3 = Bookings (réservations)
export const TRIP_TEMPLATES = {
  Montagne: [
    { title: 'Réserver un refuge ou un hébergement', id_category: 3 },
    { title: "Vérifier la météo et l'état des sentiers", id_category: 1 },
    { title: 'Chaussures de randonnée', id_category: 2 },
    { title: 'Vêtements chauds et imperméable', id_category: 2 },
    { title: 'Sac à dos et bâtons de marche', id_category: 2 },
    { title: 'Trousse de premiers secours', id_category: 2 },
    { title: 'Télécharger une carte hors ligne', id_category: 1 },
  ],
  Campagne: [
    { title: 'Réserver un gîte ou un camping', id_category: 3 },
    { title: 'Tente et sacs de couchage', id_category: 2 },
    { title: 'Réchaud et vaisselle', id_category: 2 },
    { title: 'Lampe frontale', id_category: 2 },
    { title: 'Glacière', id_category: 2 },
    { title: 'Anti-moustiques et crème solaire', id_category: 2 },
    { title: 'Vérifier les règles de feu du camping', id_category: 1 },
  ],
  Plage: [
    { title: 'Réserver un hébergement', id_category: 3 },
    { title: 'Vérifier la météo', id_category: 1 },
    { title: 'Crème solaire', id_category: 2 },
    { title: 'Maillots et serviettes de plage', id_category: 2 },
    { title: 'Parasol', id_category: 2 },
    { title: 'Lunettes de soleil et chapeau', id_category: 2 },
    { title: 'Sac étanche', id_category: 2 },
  ],
  Ville: [
    { title: 'Réserver un hôtel', id_category: 3 },
    { title: 'Acheter les billets (musées, spectacles)', id_category: 3 },
    { title: 'Repérer les transports en commun', id_category: 1 },
    { title: 'Chaussures confortables', id_category: 2 },
    { title: 'Chargeur et batterie externe', id_category: 2 },
  ],
  Neige: [
    { title: 'Réserver un hébergement', id_category: 3 },
    { title: 'Acheter le forfait de ski', id_category: 3 },
    { title: "Vérifier l'état des routes", id_category: 1 },
    { title: 'Manteau, gants et tuque', id_category: 2 },
    { title: "Pneus d'hiver et chaînes", id_category: 2 },
    { title: 'Lunettes de ski', id_category: 2 },
  ],
}
