export interface ReviewRequest {
  activityId: number;
  rating: number;
  title: string;
  comentary: string;
  ratingGuide: number;
  ratingPuntuality: number;
  ratingPrice: number;
  ratingSecurity: number;
}
 
export interface ReviewResponse {
  id: number;
  username: string;
  userAvatar: string;
  rating: number;
  title: string;
  comentary: string;
  ratingGuide: number;
  ratingPuntuality: number;
  ratingPrice: number;
  ratingSecurity: number;
  creationDate: string;
}
 
export interface ActivityReviewSummary {
  generalAvg: number;
  totalReviews: number;
  guideAvg: number;
  puntualityAvg: number;
  priceAvg: number;
  securityAvg: number;
  distribution: { [key: number]: number }; 
  userYaReseno: boolean;
  reviews: ReviewResponse[];
}
 
export interface ActivityRatingSimple {
  average: number;
  total: number;
}