import { Customer } from './customer.model';

export interface Record {
  id: number;
  title: string;
  artist: string;
  format: 'Vinyl' | 'CD';
  genre: 'Rock' | 'Pop' | 'Jazz' | 'Classical' | 'Hip-Hop' | 'Electronic' | 'Other';
  releaseYear: number;
  price: number;
  stockQuantity: number;
  customerDetails?: Customer;
}
