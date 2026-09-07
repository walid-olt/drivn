import mongoose from 'mongoose';
import type { LocationCreateDto } from '@drivn/shared';
import { validateEnv } from '../src/config/env';
import { connectDB } from '../src/lib/mongodb';
import LocationModel from '../src/modules/location/models/location.model';

const locations: LocationCreateDto[] = [
	// ── Airports ──────────────────────────────────────────────
	{ name: 'Mohammed V International Airport', address: 'Route de Nouasseur, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20000', type: 'airport' },
	{ name: 'Casablanca Anfa Airport', address: 'Bd Anfa, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20000', type: 'airport' },
	{ name: 'Marrakech Menara Airport', address: 'Avenue Mohammed V, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'airport' },
	{ name: 'Agadir Al Massira Airport', address: 'Route d\'Inezgane, Agadir', country: 'Morocco', city: 'Agadir', postalCode: '80000', type: 'airport' },
	{ name: 'Tangier Ibn Battouta Airport', address: 'Route de l\'Aéroport, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'airport' },
	{ name: 'Fès-Saïss Airport', address: 'Route de Saïss, Fès', country: 'Morocco', city: 'Fès', postalCode: '30000', type: 'airport' },
	{ name: 'Rabat-Salé Airport', address: 'Avenue de.l\'Ambassadeur, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'airport' },
	{ name: 'Oujda-Angad Airport', address: 'Route de l\'Aéroport, Oujda', country: 'Morocco', city: 'Oujda-Angad', postalCode: '60000', type: 'airport' },
	{ name: 'Nador International Airport', address: 'Route de l\'Aéroport, Nador', country: 'Morocco', city: 'Nador', postalCode: '62000', type: 'airport' },
	{ name: 'Dakhla Airport', address: 'Route de l\'Aéroport, Dakhla', country: 'Morocco', city: 'Ad Dakhla', postalCode: '76000', type: 'airport' },
	{ name: 'Laayoune Hassan Airport', address: 'Bd de.l\'UMMA, Laayoune', country: 'Morocco', city: 'Laâyoune', postalCode: '70000', type: 'airport' },
	{ name: 'Al Hoceima Charif Al Idrissi Airport', address: 'Route de l\'Aéroport, Al Hoceima', country: 'Morocco', city: 'Al Hoceïma', postalCode: '32000', type: 'airport' },
	{ name: 'Tétouan Sania Ramel Airport', address: 'Route de Sania Ramel, Tétouan', country: 'Morocco', city: 'Tétouan', postalCode: '93000', type: 'airport' },
	{ name: 'Errachidia Moulay Ali Cherif Airport', address: 'Route de l\'Aéroport, Errachidia', country: 'Morocco', city: 'Errachidia', postalCode: '53000', type: 'airport' },
	{ name: 'Ouarzazate Airport', address: 'Route de l\'Aéroport, Ouarzazate', country: 'Morocco', city: 'Ouarzazate', postalCode: '45000', type: 'airport' },
	{ name: 'Tan-Tan Airport', address: 'Route de l\'Aéroport, Tan-Tan', country: 'Morocco', city: 'Tan-Tan', postalCode: '81000', type: 'airport' },
	{ name: 'Guelmim Airport', address: 'Route de l\'Aéroport, Guelmim', country: 'Morocco', city: 'Guelmim', postalCode: '48000', type: 'airport' },

	// ── Train Stations (ONCF) ────────────────────────────────
	{ name: 'Casa Voyageurs', address: 'Place de.l\'Office, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20250', type: 'train_station' },
	{ name: 'Casa Port', address: 'Bd de.l\'Océan Atlantique, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20000', type: 'train_station' },
	{ name: 'Casa Voyageurs Abattoirs', address: 'Rue des Abattoirs, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20250', type: 'train_station' },
	{ name: 'Rabat Ville', address: 'Avenue de.l\'Ambassadeur, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'train_station' },
	{ name: 'Rabat Agdal', address: 'Bd Mohammed V, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'train_station' },
	{ name: 'Rabat Hay Hassani', address: 'Hay Hassani, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'train_station' },
	{ name: 'Marrakech', address: 'Avenue Mohammed V, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'train_station' },
	{ name: 'Fès', address: 'Avenue de.l\'Atlas, Fès', country: 'Morocco', city: 'Fès', postalCode: '30000', type: 'train_station' },
	{ name: 'Tangier Ville', address: 'Place du 9 Avril 1947, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'train_station' },
	{ name: 'Tangier Ville CAP', address: 'Bd Mohammed V, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'train_station' },
	{ name: 'Meknès', address: 'Place Lahdim, Meknès', country: 'Morocco', city: 'Meknès', postalCode: '50000', type: 'train_station' },
	{ name: 'Kenitra', address: 'Avenue de.l\'Indépendance, Kenitra', country: 'Morocco', city: 'Kenitra', postalCode: '14000', type: 'train_station' },
	{ name: 'Oujda', address: 'Bd Zerktouni, Oujda', country: 'Morocco', city: 'Oujda-Angad', postalCode: '60000', type: 'train_station' },
	{ name: 'Agadir', address: 'Route de Inezgane, Agadir', country: 'Morocco', city: 'Agadir', postalCode: '80000', type: 'train_station' },
	{ name: 'Nador', address: 'Avenue de.l\'Aéroport, Nador', country: 'Morocco', city: 'Nador', postalCode: '62000', type: 'train_station' },
	{ name: 'Taza', address: 'Route de Fès, Taza', country: 'Morocco', city: 'Taza', postalCode: '35000', type: 'train_station' },
	{ name: 'Sidi Kacem', address: 'Place du 7 Novembre, Sidi Kacem', country: 'Morocco', city: 'Sidi Qacem', postalCode: '16000', type: 'train_station' },
	{ name: 'Mohammedia', address: 'Bd de.l\'Indépendance, Mohammedia', country: 'Morocco', city: 'Mohammedia', postalCode: '28800', type: 'train_station' },
	{ name: 'Sidi Yahia', address: 'Sidi Yahia, Meknès', country: 'Morocco', city: 'Meknès', postalCode: '50000', type: 'train_station' },
	{ name: 'Meknès Amir SidiMohammed', address: 'Amir Sidi Mohammed, Meknès', country: 'Morocco', city: 'Meknès', postalCode: '50000', type: 'train_station' },

	// ── Ports ─────────────────────────────────────────────────
	{ name: 'Tanger Med Port', address: 'Tanger Med, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'port' },
	{ name: 'Port of Tangier City', address: 'Bd Mohammed V, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'port' },
	{ name: 'Port of Casablanca', address: 'Bd de.l\'Océan Atlantique, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20000', type: 'port' },
	{ name: 'Port of Agadir', address: 'Quai de la Côte, Agadir', country: 'Morocco', city: 'Agadir', postalCode: '80000', type: 'port' },
	{ name: 'Port of Nador', address: 'Bd de.l\'Ansari, Nador', country: 'Morocco', city: 'Nador', postalCode: '62000', type: 'port' },
	{ name: 'Port of Al Hoceima', address: 'Quai du Port, Al Hoceima', country: 'Morocco', city: 'Al Hoceïma', postalCode: '32000', type: 'port' },
	{ name: 'Port of Essaouira', address: 'Rue de la Kasbah, Essaouira', country: 'Morocco', city: 'Essaouira', postalCode: '44000', type: 'port' },
	{ name: 'Port of Dakhla', address: 'Bd Mohammed V, Dakhla', country: 'Morocco', city: 'Ad Dakhla', postalCode: '76000', type: 'port' },
	{ name: 'Port of Laayoune', address: 'Bd de.l\'UMMA, Laayoune', country: 'Morocco', city: 'Laâyoune', postalCode: '70000', type: 'port' },

	// ── Offices: Casablanca ───────────────────────────────────
	{ name: 'Casablanca Downtown Office', address: 'Bd Mohammed V 123, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20000', type: 'office' },
	{ name: 'Casablanca Maarif Office', address: 'Bd de la Croix, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20100', type: 'office' },
	{ name: 'Casablanca Gauthier Office', address: 'Rue Gauthier 15, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20250', type: 'office' },
	{ name: 'Casablanca Habous Office', address: 'Quartier des Habous, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20000', type: 'office' },
	{ name: 'Casablanca Aïn Sebaâ Office', address: 'Route de Rabat, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20250', type: 'office' },
	{ name: 'Casablanca Sbata Office', address: 'Bd de.l\'Armée Royale, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20250', type: 'office' },

	// ── Offices: Rabat ────────────────────────────────────────
	{ name: 'Rabat Agdal Office', address: 'Avenue de Fès, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'office' },
	{ name: 'Rabat Hassan Office', address: 'Bd Mohammed V, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'office' },
	{ name: 'Rabat Hay Riad Office', address: 'Hay Riad, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'office' },
	{ name: 'Rabat Centre Ville Office', address: 'Avenue Fal Ould Oumeir, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'office' },

	// ── Offices: Marrakech ────────────────────────────────────
	{ name: 'Marrakech Guéliz Office', address: 'Avenue Mohammed V, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'office' },
	{ name: 'Marrakech Medina Office', address: 'Derb Jdid, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'office' },
	{ name: 'Marrakech Hivernage Office', address: 'Rue de.l\'Hivernage, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'office' },
	{ name: 'Marrakech Palmeraie Office', address: 'Route de Fès, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'office' },

	// ── Offices: Tangier ──────────────────────────────────────
	{ name: 'Tangier Centre Ville Office', address: 'Bd Mohammed V, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'office' },
	{ name: 'Tangier Iberia Office', address: 'Route de Tetouan, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'office' },
	{ name: 'Tangier Marshan Office', address: 'Bd de.l\'Église, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'office' },

	// ── Offices: Fès ──────────────────────────────────────────
	{ name: 'Fès Médina Office', address: 'Derb El Miter, Fès', country: 'Morocco', city: 'Fès', postalCode: '30000', type: 'office' },
	{ name: 'Fès Ville Nouvelle Office', address: 'Avenue de.l\'Atlas, Fès', country: 'Morocco', city: 'Fès', postalCode: '30000', type: 'office' },
	{ name: 'Fès Borj Nord Office', address: 'Bd de Borj Nord, Fès', country: 'Morocco', city: 'Fès', postalCode: '30000', type: 'office' },

	// ── Offices: Agadir ───────────────────────────────────────
	{ name: 'Agadir Centre Office', address: 'Bd Mohammed V, Agadir', country: 'Morocco', city: 'Agadir', postalCode: '80000', type: 'office' },
	{ name: 'Agadir Zone Industrielle Office', address: 'Zone Industrielle, Agadir', country: 'Morocco', city: 'Agadir', postalCode: '80000', type: 'office' },
	{ name: 'Agadir Founty Office', address: 'Bd Founty, Agadir', country: 'Morocco', city: 'Agadir', postalCode: '80000', type: 'office' },

	// ── Offices: Meknès ──────────────────────────────────────
	{ name: 'Meknès Centre Office', address: 'Place Lahdim, Meknès', country: 'Morocco', city: 'Meknès', postalCode: '50000', type: 'office' },
	{ name: 'Meknès Hamria Office', address: 'Bd Moulay Ismail, Meknès', country: 'Morocco', city: 'Meknès', postalCode: '50000', type: 'office' },

	// ── Offices: Kenitra ─────────────────────────────────────
	{ name: 'Kénitra Centre Office', address: 'Avenue de.l\'Indépendance, Kenitra', country: 'Morocco', city: 'Kenitra', postalCode: '14000', type: 'office' },

	// ── Offices: Oujda ───────────────────────────────────────
	{ name: 'Oujda Centre Office', address: 'Bd Zerktouni, Oujda', country: 'Morocco', city: 'Oujda-Angad', postalCode: '60000', type: 'office' },

	// ── Offices: Nador ───────────────────────────────────────
	{ name: 'Nador Centre Office', address: 'Bd de.l\'Ansari, Nador', country: 'Morocco', city: 'Nador', postalCode: '62000', type: 'office' },

	// ── Offices: Tétouan ─────────────────────────────────────
	{ name: 'Tétouan Centre Office', address: 'Bd Mohammed V, Tétouan', country: 'Morocco', city: 'Tétouan', postalCode: '93000', type: 'office' },

	// ── Offices: Essaouira ────────────────────────────────────
	{ name: 'Essaouira Centre Office', address: 'Bd Mohammed V, Essaouira', country: 'Morocco', city: 'Essaouira', postalCode: '44000', type: 'office' },

	// ── Offices: Taza ─────────────────────────────────────────
	{ name: 'Taza Centre Office', address: 'Avenue de Fès, Taza', country: 'Morocco', city: 'Taza', postalCode: '35000', type: 'office' },

	// ── Offices: Mohammedia ──────────────────────────────────
	{ name: 'Mohammedia Centre Office', address: 'Bd de.l\'Indépendance, Mohammedia', country: 'Morocco', city: 'Mohammedia', postalCode: '28800', type: 'office' },

	// ── Offices: El Jadid ────────────────────────────────────
	{ name: 'El Jadid Centre Office', address: 'Bd Mohammed V, El Jadid', country: 'Morocco', city: 'El Jadid', postalCode: '23000', type: 'office' },

	// ── Offices: Béni Mellal ─────────────────────────────────
	{ name: 'Béni Mellal Centre Office', address: 'Avenue Moulay Youssef, Béni Mellal', country: 'Morocco', city: 'Béni Mellal', postalCode: '23000', type: 'office' },

	// ── Offices: Tiznit ──────────────────────────────────────
	{ name: 'Tiznit Centre Office', address: 'Bd Mohammed V, Tiznit', country: 'Morocco', city: 'Tiznit', postalCode: '85000', type: 'office' },

	// ── Offices: Safi ─────────────────────────────────────────
	{ name: 'Safi Centre Office', address: 'Bd de.l\'Ansari, Safi', country: 'Morocco', city: 'Safi', postalCode: '46000', type: 'office' },

	// ── Offices: Kouribga ────────────────────────────────────
	{ name: 'Kouribga Centre Office', address: 'Bd de.l\'Indépendance, Kouribga', country: 'Morocco', city: 'Kouribga', postalCode: '25000', type: 'office' },

	// ── Offices: Settat ──────────────────────────────────────
	{ name: 'Settat Centre Office', address: 'Avenue Mohammed V, Settat', country: 'Morocco', city: 'Settat', postalCode: '26000', type: 'office' },

	// ── Offices: Berkane ─────────────────────────────────────
	{ name: 'Berkane Centre Office', address: 'Bd Mohammed V, Berkane', country: 'Morocco', city: 'Berkane', postalCode: '63000', type: 'office' },

	// ── Offices: Errachidia ──────────────────────────────────
	{ name: 'Errachidia Centre Office', address: 'Avenue Moulay Ali Cherif, Errachidia', country: 'Morocco', city: 'Errachidia', postalCode: '53000', type: 'office' },

	// ── Offices: Guelmim ─────────────────────────────────────
	{ name: 'Guelmim Centre Office', address: 'Bd de.l\'Indépendance, Guelmim', country: 'Morocco', city: 'Guelmim', postalCode: '48000', type: 'office' },

	// ── Offices: Ouarzazate ──────────────────────────────────
	{ name: 'Ouarzazate Centre Office', address: 'Bd Mohammed V, Ouarzazate', country: 'Morocco', city: 'Ouarzazate', postalCode: '45000', type: 'office' },

	// ── Offices: Laâyoune ────────────────────────────────────
	{ name: 'Laâyoune Centre Office', address: 'Bd de.l\'UMMA, Laayoune', country: 'Morocco', city: 'Laâyoune', postalCode: '70000', type: 'office' },

	// ── Offices: Dakhla ──────────────────────────────────────
	{ name: 'Dakhla Centre Office', address: 'Bd Mohammed V, Dakhla', country: 'Morocco', city: 'Ad Dakhla', postalCode: '76000', type: 'office' },

	// ── Offices: Al Hoceïma ──────────────────────────────────
	{ name: 'Al Hoceïma Centre Office', address: 'Bd Mohammed V, Al Hoceima', country: 'Morocco', city: 'Al Hoceïma', postalCode: '32000', type: 'office' },

	// ── Offices: Larache ─────────────────────────────────────
	{ name: 'Larache Centre Office', address: 'Bd Mohammed V, Larache', country: 'Morocco', city: 'Larache', postalCode: '91000', type: 'office' },

	// ── Offices: Asilah ──────────────────────────────────────
	{ name: 'Asilah Centre Office', address: 'Bd Mohammed V, Asilah', country: 'Morocco', city: 'Asilah', postalCode: '93000', type: 'office' },

	// ── Offices: Fnidq ──────────────────────────────────────
	{ name: 'Fnidq Centre Office', address: 'Bd Mohammed V, Fnideq', country: 'Morocco', city: 'Fnidq', postalCode: '93000', type: 'office' },

	// ── Offices: Guercif ─────────────────────────────────────
	{ name: 'Guercif Centre Office', address: 'Bd de.l\'Indépendance, Guercif', country: 'Morocco', city: 'Guercif', postalCode: '32000', type: 'office' },

	// ── Offices: Sefrou ──────────────────────────────────────
	{ name: 'Sefrou Centre Office', address: 'Avenue de Fès, Sefrou', country: 'Morocco', city: 'Sefrou', postalCode: '31000', type: 'office' },

	// ── Offices: Khénifra ────────────────────────────────────
	{ name: 'Khénifra Centre Office', address: 'Bd Moulay Youssef, Khénifra', country: 'Morocco', city: 'Khénifra', postalCode: '54000', type: 'office' },

	// ── Offices: Jerada ──────────────────────────────────────
	{ name: 'Jerada Centre Office', address: 'Avenue de Oujda, Jerada', country: 'Morocco', city: 'Jerada', postalCode: '64000', type: 'office' },

	// ── Offices: Taourirt ────────────────────────────────────
	{ name: 'Taourirt Centre Office', address: 'Bd Mohammed V, Taourirt', country: 'Morocco', city: 'Taourirt', postalCode: '64000', type: 'office' },

	// ── Offices: Taroudannt ──────────────────────────────────
	{ name: 'Taroudannt Centre Office', address: 'Bd Mohammed V, Taroudannt', country: 'Morocco', city: 'Taroudannt', postalCode: '83000', type: 'office' },

	// ── Offices: Temara ──────────────────────────────────────
	{ name: 'Témara Centre Office', address: 'Avenue de Rabat, Témara', country: 'Morocco', city: 'Temara', postalCode: '12000', type: 'office' },

	// ── Offices: Bouskoura ──────────────────────────────────
	{ name: 'Bouskoura Office', address: 'Route de.l\'Atlantic, Bouskoura', country: 'Morocco', city: 'Bouskoura', postalCode: '25000', type: 'office' },

	// ── Offices: Ait Melloul ─────────────────────────────────
	{ name: 'Ait Melloul Centre Office', address: 'Bd Mohammed V, Ait Melloul', country: 'Morocco', city: 'Ait Melloul', postalCode: '86000', type: 'office' },

	// ── Offices: Martil ──────────────────────────────────────
	{ name: 'Martil Centre Office', address: 'Bd Mohammed V, Martil', country: 'Morocco', city: 'Martil', postalCode: '93000', type: 'office' },

	// ── Offices: Inezgane ────────────────────────────────────
	{ name: 'Inezgane Centre Office', address: 'Bd Mohammed V, Inezgane', country: 'Morocco', city: 'Inezgane', postalCode: '86000', type: 'office' },

	// ── Offices: Sidi Slimane ────────────────────────────────
	{ name: 'Sidi Slimane Centre Office', address: 'Avenue de Kenitra, Sidi Slimane', country: 'Morocco', city: 'Sidi Slimane', postalCode: '14000', type: 'office' },

	// ── Offices: Oued Zem ────────────────────────────────────
	{ name: 'Oued Zem Centre Office', address: 'Bd Mohammed V, Oued Zem', country: 'Morocco', city: 'Oued Zem', postalCode: '25000', type: 'office' },

	// ── Offices: Azrou ───────────────────────────────────────
	{ name: 'Azrou Centre Office', address: 'Bd Mohammed V, Azrou', country: 'Morocco', city: 'Azrou', postalCode: '53000', type: 'office' },

	// ── Offices: Tineghir ────────────────────────────────────
	{ name: 'Tineghir Centre Office', address: 'Bd de.l\'Indépendance, Tineghir', country: 'Morocco', city: 'Tineghir', postalCode: '52000', type: 'office' },

	// ── Offices: Zagora ──────────────────────────────────────
	{ name: 'Zagora Centre Office', address: 'Bd Mohammed V, Zagora', country: 'Morocco', city: 'Zagora', postalCode: '52000', type: 'office' },

	// ── Offices: Boujdour ────────────────────────────────────
	{ name: 'Boujdour Centre Office', address: 'Bd Mohammed V, Boujdour', country: 'Morocco', city: 'Boujdour', postalCode: '87000', type: 'office' },

	// ── Offices: Tan-Tan ─────────────────────────────────────
	{ name: 'Tan-Tan Centre Office', address: 'Bd Mohammed V, Tan-Tan', country: 'Morocco', city: 'Tan-Tan', postalCode: '81000', type: 'office' },

	// ── Offices: Semara ──────────────────────────────────────
	{ name: 'Semara Centre Office', address: 'Bd de.l\'Indépendance, Semara', country: 'Morocco', city: 'Semara', postalCode: '72000', type: 'office' },

	// ── Offices: Bouarfa ─────────────────────────────────────
	{ name: 'Bouarfa Centre Office', address: 'Bd Mohammed V, Bouarfa', country: 'Morocco', city: 'Bouarfa', postalCode: '63000', type: 'office' },

	// ── Offices: Figuig ──────────────────────────────────────
	{ name: 'Figuig Centre Office', address: 'Avenue de Oujda, Figuig', country: 'Morocco', city: 'Figuig', postalCode: '63000', type: 'office' },

	// ── Offices: Midelt ──────────────────────────────────────
	{ name: 'Midelt Centre Office', address: 'Bd Mohammed V, Midelt', country: 'Morocco', city: 'Midalt', postalCode: '53000', type: 'office' },

	// ── Offices: Ifrane ──────────────────────────────────────
	{ name: 'Ifrane Centre Office', address: 'Avenue de Fès, Ifrane', country: 'Morocco', city: 'Azrou', postalCode: '53000', type: 'office' },

	// ── Offices: Chefchaouen ─────────────────────────────────
	{ name: 'Chefchaouen Centre Office', address: 'Place Outa Hammam, Chefchaouen', country: 'Morocco', city: 'Tétouan', postalCode: '93000', type: 'office' },

	// ── Hotels: major resort cities ───────────────────────────
	{ name: 'Mazagan Beach Resort', address: 'Boulevard de la Côte, El Jadid', country: 'Morocco', city: 'El Jadid', postalCode: '23000', type: 'hotel' },
	{ name: 'Sofitel Marrakech Lounge & Spa', address: 'Rue Abou Marouane Essaoudi, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'hotel' },
	{ name: 'Four Seasons Resort Marrakech', address: 'Chemin Hors Bin Lambah, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'hotel' },
	{ name: 'Riad Kniza', address: 'Derb l\'Hotel, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'hotel' },
	{ name: 'La Mamounia', address: 'Avenue Bab Jdid, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40040', type: 'hotel' },
	{ name: 'Sofitel Casablanca Tour Blanche', address: 'Bd de.l\'Océan Atlantique, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20000', type: 'hotel' },
	{ name: 'Four Seasons Hotel Casablanca', address: 'Bd de la Croix, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20100', type: 'hotel' },
	{ name: 'Ritz-Carlton Rabat', address: 'Avenue de.l\'Ambassadeur, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'hotel' },
	{ name: 'Sofitel Rabat Jardin des Roses', address: 'Bd de Beyrouth, Rabat', country: 'Morocco', city: 'Rabat', postalCode: '10000', type: 'hotel' },
	{ name: 'Hôtel & Spa La Ftenera', address: 'Route de l\'Ourika, Marrakech', country: 'Morocco', city: 'Marrakech', postalCode: '40000', type: 'hotel' },
	{ name: 'Kenzi Tower Hotel', address: 'Bd de l\'Océan Atlantique, Casablanca', country: 'Morocco', city: 'Casablanca', postalCode: '20000', type: 'hotel' },
	{ name: 'Hyatt Regency Tangier', address: 'Boulevard de l\'Europe, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'hotel' },
	{ name: 'Sofitel Tangier Golf & Spa Resort', address: 'Boulevard de l\'Atlantique, Tangier', country: 'Morocco', city: 'Tangier', postalCode: '90000', type: 'hotel' },
	{ name: 'Riad Fès', address: 'Derb Ben Slimane, Fès', country: 'Morocco', city: 'Fès', postalCode: '30000', type: 'hotel' },
	{ name: 'Palais Amani', address: 'Derb El Miter, Fès', country: 'Morocco', city: 'Fès', postalCode: '30000', type: 'hotel' },
	{ name: 'Riad Andalib', address: 'Avenue de Fès, Fès', country: 'Morocco', city: 'Fès', postalCode: '30000', type: 'hotel' },
	{ name: 'Hôtel & Spa Leogrande', address: 'Bd Mohammed V, Agadir', country: 'Morocco', city: 'Agadir', postalCode: '80000', type: 'hotel' },
	{ name: 'Sofitel Agadir Royal Bay Resort', address: 'Boulevard du 29 Février, Agadir', country: 'Morocco', city: 'Agadir', postalCode: '80000', type: 'hotel' },
	{ name: 'Hotel & Spa Les Waldayes', address: 'Route d\'Aoukrane, Ouarzazate', country: 'Morocco', city: 'Ouarzazate', postalCode: '45000', type: 'hotel' },
	{ name: 'La Sirocco Hotel', address: 'Avenue de Oujda, Errachidia', country: 'Morocco', city: 'Errachidia', postalCode: '53000', type: 'hotel' },
];

async function seed() {
	validateEnv();
	await connectDB();

	console.log(`Seeding ${locations.length} locations...`);

	const ops = locations.map((loc) => ({
		updateOne: {
			filter: { name: loc.name, city: loc.city },
			update: { $set: loc },
			upsert: true,
		},
	}));

	const result = await LocationModel.bulkWrite(ops, { ordered: false });
	console.log(`Upserted: ${result.upsertedCount}, Modified: ${result.modifiedCount}`);
	console.log(`Total locations in DB: ${await LocationModel.countDocuments()}`);

	//@ts-ignore
	process.exit(0);
}

await seed();
