/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CRMNote {
  id: string;
  createdAt: string;
  content: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface Lead {
  id: string;
  businessName: string;
  category: string;
  city: string;
  phone: string;
  email: string;
  website: string;
  rating: number;
  reviews: number;
  address: string;
  status: 'Prospect' | 'Contacted' | 'Meeting Scheduled' | 'Qualified' | 'Do Not Contact';
  description: string;
  socials: SocialLinks;
  notes: CRMNote[];
  createdAt: string;
}

export interface SearchQuery {
  city: string;
  niche: string;
  count: number;
}

export interface Statistics {
  totalLeads: number;
  emailsFound: number;
  phonesFound: number;
  websitesFound: number;
  averageRating: number;
  citiesCovered: number;
}

export interface CityMetric {
  city: string;
  count: number;
}

export interface CategoryMetric {
  category: string;
  count: number;
}

export interface ContactAvailability {
  type: string;
  count: number;
}

export interface RatingMetric {
  ratingRange: string;
  count: number;
}

export interface AnalyticsData {
  leadsByCity: CityMetric[];
  leadsByCategory: CategoryMetric[];
  contactAvailability: ContactAvailability[];
  ratingDistribution: RatingMetric[];
}
